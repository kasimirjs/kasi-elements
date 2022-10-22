import {customElement, KaHtmlElement} from "@kasimirjs/embed";
import {ka_html} from "@kasimirjs/embed/dist/ce/html";
import {KasiElements} from "../index";

@customElement("kasi-elements-navbar")
export class Navbar extends KaHtmlElement {



    async connected(): Promise<void> {
        this.$tpl.render({});
        KasiElements.navbar = this;
    }

    async disconnected() : Promise<void> {

    }

    html = `
 <nav class="navbar fixed-top navbar-dark bg-dark shadow" role="navigation">
    <div class="container-fluid">
        <div class="navbar-brand" style="width: 200px">
            <a href="javascript:ka_goto('index')" style="">
                <img src="_vendor/a-f.png" height="48" class="float-start me-3">
            </a>
            <div>
                <p class="m-0">a&f Component</p>
                <p class="fs-6 text-white m-0  text-nowrap" style="overflow:hidden;text-overflow: ellipsis">
                    demo
                </p>
            </div>
        </div>
        <div class="btn-group">

            <button type="button" class="fs-3 pe-2 ps-2 btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="javascript:ka_goto('index')">Projekte</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="javascript:ka_goto('translation')"><i class="bi bi-chat-square-dots me-2 "></i>Übersetzungen</a></li>
            </ul>
        </div>
        <div class="btn-group ms-3">

            <button type="button" onclick="KaToolsV1.modal.show('show-translations')" class="fs-3 pe-2 ps-2 btn btn-outline-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-translate"></i>
            </button>

        </div>

        <div class="ms-auto">

            
        </div>
    </div>
</nav>
    
    `;

}
