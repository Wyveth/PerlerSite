const test = require('node:test');
const assert = require('node:assert/strict');
const { buildContactMail, notifyContact } = require('./contact-notification');

const contact = {
  name: 'Camille Dupont',
  email: 'camille@example.com',
  subject: 'Création personnalisée',
  message: 'Bonjour, je voudrais une pièce.'
};

test('prépare une notification en texte avec toutes les informations du contact', () => {
  const mail = buildContactMail(contact);
  assert.equal(mail.from, 'wyveth.pro@gmail.com');
  assert.equal(mail.to, 'wyveth.pro@gmail.com');
  assert.equal(mail.replyTo, 'camille@example.com');
  for (const value of Object.values(contact)) assert.ok(mail.text.includes(value));
  assert.ok(mail.subject.includes(contact.subject));
  assert.equal(mail.html, undefined);
});

test('ne reprend pas une adresse de réponse dangereuse ou absente', () => {
  for (const email of ['client@example.com\r\nBcc:spam@example.com', 'a@example.com,b@example.com', '', null, 42]) {
    assert.equal(buildContactMail({ ...contact, email }).replyTo, undefined);
  }
});

test('supprime les retours à la ligne du sujet envoyé', () => {
  const mail = buildContactMail({ ...contact, subject: 'Bonjour\r\nBcc: spam@example.com' });
  assert.doesNotMatch(mail.subject, /[\r\n]/);
  assert.ok(mail.text.includes('Bonjour\r\nBcc: spam@example.com'));
});

test('remplace les champs manquants ou non textuels par une valeur lisible', () => {
  const mail = buildContactMail({ name: 42, subject: null, message: {}, email: undefined });
  assert.match(mail.text, /Nom\s*:\s*Non renseigné/);
  assert.match(mail.text, /E-mail\s*:\s*Non renseigné/);
  assert.match(mail.text, /Sujet\s*:\s*Non renseigné/);
  assert.match(mail.text, /Message\s*:\s*Non renseigné/);
  assert.equal(buildContactMail(undefined).replyTo, undefined);
});

test('envoie une seule notification pour un événement', async () => {
  const sent = [];
  const errors = [];
  await notifyContact(contact, async mail => { sent.push(mail); }, { error: (...args) => errors.push(args) });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, 'wyveth.pro@gmail.com');
  assert.equal(sent[0].replyTo, contact.email);
  assert.equal(errors.length, 0);
});

test('consigne une erreur générique sans divulguer le contact ou le secret', async () => {
  const errors = [];
  let attempts = 0;
  await notifyContact(contact, async () => {
    attempts++;
    throw new Error('mot-de-passe-secret');
  }, { error: (...args) => errors.push(args) });
  assert.equal(attempts, 1);
  assert.equal(errors.length, 1);
  const logged = JSON.stringify(errors);
  assert.doesNotMatch(logged, /mot-de-passe-secret|Camille|camille@example.com|Création personnalisée/);
});
