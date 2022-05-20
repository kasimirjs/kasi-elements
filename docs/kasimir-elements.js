/* KasimirJS EMBED - documentation: https://kasimirjs.infracamp.org - Author: Matthias Leuffen <m@tth.es>*/

/* from core/init.js */



if (typeof KaToolsV1 === "undefined") {
    window.KaToolsV1 = class {
    }

    /**
     * The last element started by Autostarter
     * @type {HTMLElement|HTMLScriptElement}
     */
    window.KaSelf = null;
}


/* from elements/inline-template.js */


customElements.define("ka-inline-template", class extends HTMLElement {


    constructor() {
        super();
        this._interval = null;
    }

    /**
     *
     * @returns {Promise<KaToolsV1.Template>}
     * @private
     */
    async _loadTemplate() {
        let template = this;
        if (this.hasAttribute("src")) {
            template = await KaToolsV1.loadHtml(this.getAttribute("src"));
        }
        let renderTpl = KaToolsV1.templatify(template);
        this.innerHTML = "";
        this.appendChild(renderTpl);
        return new KaToolsV1.Template(renderTpl);
    }

    async _loadScope() {
        let scope = {};

        if (this.hasAttribute("init-scope")) {
            // Wrap attribute into async method
            let scopeInit = KaToolsV1.eval(`async() => { return ${this.getAttribute("init-scope")} }`, {$this: this}, this);
            scope = await scopeInit();
        }
        scope.$this = this;
        return scope;
    }


    async connectedCallback() {
        await KaToolsV1.domReady();

        let tpl = await this._loadTemplate();
        let scope = await this._loadScope();

        if (this.hasAttribute("interval")) {
            this._interval = window.setInterval(async () => {
                let scope = await this._loadScope();
                tpl.render(scope);
            }, parseInt(this.getAttribute("interval")));
        }

        tpl.render(scope);

    }

    disconnectedCallback() {
        window.clearInterval(this._interval);
    }

});

/* from elements/include.js */
customElements.define("ka-include", class extends HTMLElement {


    _importScriptRecursive(node, src) {
        let chels = node instanceof HTMLTemplateElement ? node.content.childNodes : node.childNodes;

        for (let s of chels) {
            if (s.tagName !== "SCRIPT") {
                this._importScriptRecursive(s, src);
                continue;
            }
            let n = document.createElement("script");

            for (let attName of s.getAttributeNames())
                n.setAttribute(attName, s.getAttribute(attName));
            n.innerHTML = s.innerHTML;
            try {
                let handler = onerror;
                window.onerror = (msg, url, line) => {
                    console.error(`[ka-include]: Script error in '${src}': ${msg} in line ${line}:\n>>>>>>>>\n`,
                        n.innerHTML.split("\n")[line-1],
                        "\n<<<<<<<<\n",
                        n.innerHTML);
                }
                s.replaceWith(n);
                window.onerror = handler;
            } catch (e) {
                console.error(`[ka-include]: Script error in '${src}': ${e}`, e);
                throw e;
            }
        }
    }

    static get observedAttributes() { return ["src"] }
    async attributeChangedCallback(name, oldValue, newValue) {
        if (name !== "src")
            return;
        if (newValue === "" || newValue === null)
            return;

        let src = this.getAttribute("src");
        let result = await fetch(src);
        this.innerHTML = await result.text();
        this._importScriptRecursive(this, src);
    }

    async connectedCallback() {
        let src = this.getAttribute("src");
        if (src === "" || src === null)
            return;

    }

});

/* from helper/loader.js */


KaToolsV1.Loader = class {

    constructor() {
        this.element = null;
        this.tpl = null;
        this.scope = {
            index: 0,
            queue: []
        };

        window.setInterval(() => {
            if (this.tpl === null)
                return;
            this.scope.index++;
            if (this.scope.index > this.scope.queue.length -1)
                this.scope.index = 0;
            this.tpl.render();
        }, 700);
    }

    _show() {
        if (this.tpl !== null)
            return;
        this.element = KaToolsV1.templatify(KaToolsV1.html(this.constructor.tpl));
        document.body.appendChild(this.element);
        this.tpl = new KaToolsV1.Template(this.element);
        this.tpl.render(this.scope);
    }


    show(elemRef, jobtitle=null) {
        this.scope.queue.push({elemRef, jobtitle});
        this._show();
        this.tpl.render();
    }

    async release(elemRef) {
        this.scope.queue = this.scope.queue.filter((item) => item.elemRef !== elemRef);
        this.tpl.render();
        if (this.scope.queue.length > 0)
            return;

        await KaToolsV1.sleep(500);
        this.tpl.dispose();
        document.body.removeChild(this.element);
        this.tpl  = null;

    }

};

KaToolsV1.Loader.tpl = `
<div role='dialog' class="animated" ka:attr:hidden="queue.length === 0" style="position: fixed; top:0;bottom: 0;right:0;left:0;background-color: rgba(0,0,0,0.3);  z-index: 99999">
    <div class="spinner-border" style="width: 5rem; height: 5rem;position: absolute; top:40%;left:50%;margin-left: -2.5rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div ka:if="queue.length > 0" style="position: absolute; bottom:2px;width: 100%; padding-left:2px; text-align: left;font-size: 8px">
        <div ka:for="let item in queue">
            [[parseInt(item)+1]] / [[queue.length]] [[queue[item].jobtitle]]...
        </div>

    </div>

</div>
`

/* from helper/action-button.js */

KaToolsV1.ActionButton = class {

    constructor(selector, onclick=null, args = {}, loader=KaToolsV1.html`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`) {
        if ( ! (selector instanceof HTMLElement))
            selector = KaToolsV1.querySelector(selector);

        /**
         *
         * @type {HTMLElement}
         */
        this.button = selector;
        this._loader = loader.content;
        this._isLoader = false;
        console.log(this._loader);

        if (onclick !== null) {
            selector.addEventListener("click", async (e) => {
                e.preventDefault();
                onclick(... await KaToolsV1.getArgs(onclick, {...args, $event: e, $this: selector}))

            })
        }
    }

    enable() {
        this.button.removeAttribute("disabled");
        this.loader(false);
    }

    disable (withLoader=true) {
        this.button.setAttribute("disabled", "disabled");
        if (withLoader)
            this.loader();
    }

    loader(active=true) {
        if (active  === true)  {
            this.button.insertBefore(this._loader.cloneNode(true), this.button.firstChild);
            this._isLoader = true;
        } else {
            if (this._isLoader) {
                this._isLoader = false;
                this.button.removeChild(this.button.firstChild)
            }
        }
    }

    ok(msg) {
        this.button.textContent = msg;
    }


};
