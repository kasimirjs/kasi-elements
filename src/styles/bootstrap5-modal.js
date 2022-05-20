
KaToolsV1.Modal.Bootstrap5 = class {

    constructor(
        content = KaToolsV1.html`<div class="modal-header">Default Modal Content</div><div class="modal-body">Content</div><div class="modal-footer"></div>`,
        classes = 'modal-dialog modal-dialog-centered modal-dialog-scrollable'
    ) {
        /**
         *
         * @type {HTMLElement}
         */
        this.modal = document.createElement("modal");
        this.modal.innerHTML = this.constructor._tpl;

        this.content = KaToolsV1.templateify(content);
        this.template = new KaToolsV1.Template(this.content);

        this.modal.querySelector("[area='dialog']").setAttribute("class", classes);
        this.modal.querySelector("[area='content']").appendChild(this.content);
        /**
         *
         * @type {bootstrap.Modal|null}
         */
        this.bsModal = null;
    }

    /**
     * @return {KaToolsV1.Template}
     */
    open($resolve, $reject) {
        this.template.render({$resolve: resolve, $reject: reject});

        this.bsModal = new bootstrap.Modal(this.modal);
        this.bsModal.show();

    }

    dispose() {

    }

}

KaToolsV1.Modal.Bootstrap5._tpl = `
<div class="modal" tabindex="-1">
  <div class="modal-dialog" area="dialog">
    <div class="modal-content" area="content">

    </div>
  </div>
</div>

`;
