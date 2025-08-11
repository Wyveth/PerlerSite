export interface Resource {
  layout: Layout;
  router: Router;
  welcome: Welcome;
  portfolio: Portfolio;
  faq: FAQ;
  contact: Contact;
  form: Form;
  error: Error;
  severity: Severity;
  signin: Signin;
  signup: Signup;
}

export interface Layout {
  header: Header;
}

export interface Header {
  logo: string;
  title: string;
  menu: Menu;
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
  email: string;
  subject: string;
  message: string;
  password: string;
  confirm_password: string;
  pseudo: string;
  prompt_password: string;
}

export interface Error {
  name_mandatory: string;
  email_mandatory: string;
  email_invalid: string;
  subject_mandatory: string;
  message_mandatory: string;
  password_mandatory: string;
  password_required: string;
  password_minlength: string;
  confirm_password_mandatory: string;
  confirm_password_required: string;
  pseudo_mandatory: string;
  pseudo_invalid: string;
  pseudo_required: string;
  pseudo_already_exists: string;
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
  weak_label: string;
  medium_label: string;
  strong_label: string;
}

export interface Severity {
  success: string;
  info: string;
  warn: string;
  error: string;
  secondary: string;
  contrast: string;
}

export interface Signin {
  title: string;
  remember_me: string;
  forgot_password: string;
  signin_button: string;
  signin_success_summary: string;
  signin_success_detail: string;
  error: string;
  signin_required: string;
  signin_required_admin: string;
  signin_required_user: string;
  email_password_false: string;
  user_desactivated: string;
  user_not_found: string;
}

export interface Signup {
  title: string;
  at_least_one_lowercase: string;
  at_least_one_uppercase: string;
  at_least_one_numeric: string;
  minimum_characters: string;
  signup_button: string;
  signup_success: string;
  signup_error: string;
}
