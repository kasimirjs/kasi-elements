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
