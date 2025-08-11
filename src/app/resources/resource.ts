export interface Resource {
  layout: Layout;
  welcome: Welcome;
  portfolio: Portfolio;
  faq: FAQ;
  contact: Contact;
  form: Form;
  error: Error;
  severity: Severity;
  signin: Signin;
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
  name_placeholder: string;
  email_placeholder: string;
  subject_placeholder: string;
  message_placeholder: string;
  loading: string;
  send_message: string;
  send_message_success: string;
}

export interface Form {
  name: string;
  name_mandatory: string;
  email: string;
  email_mandatory: string;
  email_invalid: string;
  subject: string;
  subject_mandatory: string;
  message: string;
  message_mandatory: string;
  password: string;
  password_mandatory: string;
  password_required: string;
  password_confirm: string;
  password_confirm_mandatory: string;
}

export interface Error {
  default: string;
  unauthorized: string;
  forbidden: string;
  not_found: string;
  server_error: string;
  bad_request: string;
  network_error: string;
  validation_error: string;
  form_error: string;
  login_error: string;
  signup_error: string;
  email_already_exists: string;
  password_mismatch: string;
  password_too_short: string;
  password_too_weak: string;
}

export interface Severity {
  success: string;
  info: string;
  warn: string;
  danger: string;
  secondary: string;
  contrast: string;
}

export interface Signin {
  title: string;
  email: string;
  password: string;
  remember_me: string;
  forgot_password: string;
  signin_button: string;
  signin_error: string;
}
