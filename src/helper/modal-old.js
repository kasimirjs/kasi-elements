
KaToolsV1.Modal = class {

    constructor(style = new KaToolsV1.Modal.Bootstrap5()) {
        this.style = style;

        this.$resolve = null;
        this.$reject = null;
    }


    /**
     *
     * @param tpl
     * @param scope
     * @returns {Promise<unknown>}
     */
    show(tpl, scope={}) {
        return new Promise((resolve, reject) => {
            this.$resolve = resolve;
            this.$reject = reject;

            let tpl = this.style.open(resolve, reject);
            tpl.render({
                $resolve: resolve,
                $reject: reject
            })
        });
    }

}
