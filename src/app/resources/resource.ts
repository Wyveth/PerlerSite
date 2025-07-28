export interface Resource {
    layout: Layout;
  }

  export interface Layout {
    header: Header;
  }

export interface Header {
    menu: Menu;
}

export interface Menu {
    home: string;
    tags: string;
    perlerTypes: string;
    users: string;
    admin: string;
    logout: string;
    signin: string;
    signup: string;
    changePassword: string;
    profile: string;
  }