const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const nodemailer = require('nodemailer');
const { notifyContact } = require('./contact-notification');

const gmailAppPassword = defineSecret('GMAIL_APP_PASSWORD');

exports.notifyOnContactCreated = onDocumentCreated(
  { document: 'contacts/{contactId}', secrets: [gmailAppPassword] },
  async event => {
    if (!event.data) {
      logger.error('Notification de contact ignorée : document indisponible.');
      return;
    }

    await notifyContact(event.data.data(), mail => {
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'wyveth.pro@gmail.com', pass: gmailAppPassword.value() }
      });
      return transport.sendMail(mail);
    }, logger);
  }
);
