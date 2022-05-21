
KaToolsV1.style.Bootstrap5Modal = class {

    constructor(
        classes = 'modal-dialog modal-dialog-centered modal-dialog-scrollable'
    ) {
        /**
         *
         * @type {HTMLElement}
         */
        let elem = document.createElement("div");
        elem.innerHTML = this.constructor._tpl;
        this.modal = elem.firstElementChild;

        this.modal.querySelector("[area='dialog']").setAttribute("class", classes);

        this._curModal = null;
        /**
         *
         * @type {bootstrap.Modal|null}
         */
        this.bsModal = null;
    }

    setClass(classes = "modal-dialog modal-dialog-centered modal-dialog-scrollable") {
        this.modal.querySelector("[area='dialog']").setAttribute("class", classes);
    }

    /**
     * @return {HTMLTemplateElement}
     */
    open(template) {
        this._curModal = this.modal.cloneNode(true);
        this._curModal.querySelector("[area='content']").appendChild(template);
        document.body.appendChild(this._curModal);
        this.bsModal = new bootstrap.Modal(this._curModal);
        this.bsModal.show();
    }

    async dispose() {
        this.bsModal.hide();
        await KaToolsV1.sleep(500);
        document.body.removeChild(this._curModal);
    }

}

KaToolsV1.style.Bootstrap5Modal._tpl = `
<div class="modal fade" tabindex="-1">
  <div class="modal-dialog" area="dialog">
    <div class="modal-content" area="content">
    </div>
  </div>
</div>

`;
