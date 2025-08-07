import { MenuItem } from "primeng/api";

export class Header {
    logo: string;
    titre: string;
    items: MenuItem[];

    constructor(logo: string, titre: string, items: MenuItem[]) {
        this.logo = logo;
        this.titre = titre;
        this.items = items;
    }
}