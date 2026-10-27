# Contact Email Notification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a Gmail notification to `wyveth.pro@gmail.com` for each newly saved contact, without changing the existing form or contact storage.

**Architecture:** A second-generation Firebase Firestore creation trigger reads `contacts/{contactId}` and sends a plain-text message through Gmail SMTP. A separate, dependency-injected notification module constructs and sends the message, making it testable without Firebase or Gmail credentials.

**Tech Stack:** Firebase Cloud Functions v2, Firestore, Node.js 22, Nodemailer, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-27-contact-email-design.md`

## Global Constraints

- Preserve existing Firestore writes, administration and form success behavior.
- Send from and to `wyveth.pro@gmail.com`; keep the Gmail app password in a Firebase secret named `GMAIL_APP_PASSWORD`.
- Send only on contact creation; log delivery failures without logging the password or message contents. No automatic retry is configured.
- Keep notification text plain, include all four contact fields, and set Reply-To only for a safe valid email address.
- Document Firebase Blaze billing, Google 2-step verification, app-password setup, deployment and real delivery verification.

## Review Focus

- Malformed or missing contact fields: tests verify a notification still contains safe fallback text.
- Line breaks or address-list syntax in the visitor email: tests verify no unsafe Reply-To header is created.
- Untrusted subjects with line breaks: tests verify they do not inject mail headers.
- Gmail rejection: tests verify the error is logged without contact contents or credentials and does not alter Firestore.
- Duplicate Firestore delivery: tests verify one invocation sends one message; documentation states that Firebase events can be delivered more than once.

---

### Task 1: Implement the creation-triggered Gmail notification

**Files:**
- Create: `functions/package.json`, `functions/package-lock.json`, `functions/index.js`, `functions/contact-notification.js`, `functions/contact-notification.test.js`
- Modify: `firebase.json`, `.gitignore`, `README.md`

**Interfaces:**
- Consumes: Firestore event `contacts/{contactId}` with document fields `name`, `email`, `subject`, `message`; secret `GMAIL_APP_PASSWORD`.
- Produces: `buildContactMail(contact)` returning Nodemailer mail options; `notifyContact(contact, sendMail, logger)` returning `Promise<void>`; exported Firebase function `notifyOnContactCreated`.

- [x] **Step 1: Write failing tests** in `functions/contact-notification.test.js` using `node:test` and `node:assert/strict`. Assert `buildContactMail` sets from and to to `wyveth.pro@gmail.com`, includes all four supplied fields in plain-text body and uses a valid visitor email for Reply-To. Assert it omits Reply-To for newline injection, comma-separated addresses and missing email; it removes newlines from subject headers; and missing/non-string fields yield safe fallback text. Assert `notifyContact` calls `sendMail` once on success, and logs a generic error without leaking the contact or thrown error on failure.
- [x] **Step 2: Run the tests and verify failure.** Run `node --test functions/contact-notification.test.js`; expect failure because the module does not yet exist.
- [x] **Step 3: Implement** `buildContactMail(contact)` and `notifyContact(contact, sendMail, logger)` in `functions/contact-notification.js`. Use plain text, a fixed recipient and sender, conservative single-address validation, normalized header subject, and generic error logging. Do not retry or update Firestore.
- [x] **Step 4: Add the trigger and dependencies.** In `functions/index.js`, define `GMAIL_APP_PASSWORD` with Firebase secret parameters, use `onDocumentCreated` for `contacts/{contactId}`, construct Nodemailer Gmail transport with the secret, and pass the snapshot data to `notifyContact`. Define a private Node 22 package with `firebase-functions`, `firebase-admin` and `nodemailer`, and generate its lockfile. Add the functions source to `firebase.json` without changing hosting. Ignore `functions/node_modules` and local secret files.
- [x] **Step 5: Document setup and operations** in `README.md`: enable Blaze, use Google 2-step verification and an app password, configure the Firebase secret using the CLI without putting the value in the repository, deploy the function, test by submitting the form, inspect function logs on failure, and note Gmail limits and possible duplicate event delivery. Do not require the visitor to receive an email.
- [x] **Step 6: Verify.** Run `node --test functions/contact-notification.test.js`, `npm --prefix functions install`, and `npm run build`; all must succeed. Inspect the exported trigger and Firebase config. An actual delivery remains unverified until Firebase and Google credentials are configured and the function is deployed.
