const GMAIL_ADDRESS = 'wyveth.pro@gmail.com';
const FALLBACK = 'Non renseigné';

function text(value) {
  return typeof value === 'string' && value.trim() ? value : FALLBACK;
}

function buildContactMail(contact = {}) {
  contact = contact && typeof contact === 'object' ? contact : {};
  const name = text(contact.name);
  const email = text(contact.email);
  const subject = text(contact.subject);
  const message = text(contact.message);

  const mail = {
    from: GMAIL_ADDRESS,
    to: GMAIL_ADDRESS,
    subject: `Contact : ${subject.replace(/[\r\n\x00-\x1f\x7f]+/g, ' ')}`,
    text: `Nom : ${name}\nE-mail : ${email}\nSujet : ${subject}\n\nMessage : ${message}`
  };

  if (/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email)) {
    mail.replyTo = email;
  }
  return mail;
}

async function notifyContact(contact, sendMail, logger) {
  try {
    await sendMail(buildContactMail(contact));
  } catch {
    logger.error('Impossible d’envoyer la notification de contact.');
  }
}

module.exports = { buildContactMail, notifyContact };
