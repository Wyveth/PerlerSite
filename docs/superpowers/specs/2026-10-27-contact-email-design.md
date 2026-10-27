# Notification par e-mail des contacts

## Objectif

Lorsqu'une personne envoie le formulaire de contact, conserver son message dans Firestore comme aujourd'hui et envoyer une notification à `wyveth.pro@gmail.com` contenant son nom, son adresse e-mail, le sujet et le message. L'adresse du visiteur sert d'adresse de réponse lorsque c'est possible.

## Approches

- **Gmail et fonction Firebase — retenu :** une fonction déclenchée par la création d'un contact envoie la notification via Gmail. Cette solution réutilise le compte existant, mais demande un mot de passe d'application Google et le forfait Firebase Blaze.
- **Service d'envoi spécialisé et fonction Firebase :** adapté aux envois automatiques, mais nécessite la configuration d'un service supplémentaire. Non retenu.

## Conception

- Une fonction côté serveur écoute les nouvelles créations dans la collection Firestore `contacts`. Les modifications et suppressions ne déclenchent pas de notification.
- La fonction envoie le message depuis le compte Gmail configuré vers `wyveth.pro@gmail.com`. Les identifiants sont stockés comme secrets côté serveur, jamais dans le code client ou le dépôt.
- L'enregistrement du contact reste indépendant de l'envoi de l'e-mail : le formulaire confirme l'enregistrement, pas la réception de la notification. Les erreurs d'envoi sont consignées côté Firebase ; aucun système supplémentaire de relance ou d'administration n'est prévu.
- La documentation explique la configuration du compte Google, des secrets, de la facturation Firebase et le déploiement, ainsi que la vérification d'un envoi réel.

## Limites et validation

Cette modification n'ajoute pas d'e-mail de confirmation au visiteur ni ne change l'interface du formulaire. Des tests vérifient la construction de la notification et le traitement des erreurs ; un essai après configuration et déploiement valide la réception effective. L'envoi dépend de Gmail et peut échouer indépendamment de l'enregistrement du contact.
