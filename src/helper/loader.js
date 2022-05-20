

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
