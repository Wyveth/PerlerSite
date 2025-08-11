export interface Resource {
  layout: Layout;
  welcome: Welcome;
  portfolio: Portfolio;
  faq: FAQ;
  contact: Contact;
  form: Form;
  error: Error;
  severity: Severity;
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

export interface Welcome {
  title: string;
  subtitle: string;
  button: string;
}

export interface Portfolio {
  title: string;
  subtitle: string;
  all: string;
  new: string;
  measure: string;
  details: string;
  redirect_product_view: string;
}

export interface FAQ {
  title: string;
  subtitle: string;
  tabs: FAQTabs[];
}

export interface FAQTabs {
  items: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: FAQAnswer;
}

export interface FAQAnswer {
  paragraphs: string[];
  links: FAQLink[];
}

export interface FAQLink {
  label: string;
  url: string;
  link: string;
  note: string;
}

export interface Contact {
  title: string;
  subtitle: string;
}

export interface Form {}

export interface Error {}

export interface Severity {
  success: string;
  info: string;
  warn: string;
  danger: string;
  secondary: string;
  contrast: string;
}
