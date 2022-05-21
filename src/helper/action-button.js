
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
