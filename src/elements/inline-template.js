

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
