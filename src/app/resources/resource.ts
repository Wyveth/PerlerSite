export interface Resource {
    layout: Layout;
  }

  export interface Layout {
    header: Header;
  }

export interface Header {
    logo: string;
    title: string;
    menu: Menu;
    router: Router;
}

export interface Menu {
    home: string;
    achievements: string;
    faq: string;
    contact: string;
    signin: string;
    profil: string;
    admin: string;
    products: string;
    tags: string;
    perlertypes: string;
    contacts: string;
    users: string;
    signout: string;
}

export interface Router {
    base: string;
    routes: Routes;
}

export interface Routes {
    home: string;
    welcome: string;
    achievements: string;
    faq: string;
    contact: string;
    signin: string;
    profil: string;
    admin: string;
    products: string;
    tags: string;
    perlertypes: string;
    contacts: string;
    users: string;
}