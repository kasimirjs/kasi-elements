
import {ka_create_element, ka_dom_ready} from "@kasimirjs/embed";
import {Navbar} from "./navbar";


/**
 * Create a Webpage from nothing
 */
export class Flexpage {


    constructor() {
    }

    async start() {
        await ka_dom_ready();
        document.head.append(ka_create_element("link", {rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"}))
        document.body.insertBefore(new Navbar(), document.body.firstElementChild);
        document.body.style.marginTop = "80px";
    }

}
