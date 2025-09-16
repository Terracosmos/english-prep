// ⚠️ Fichier généré — src/data/expressions.ts
// Éditez data/corpus.csv puis relancez: pnpm build:corpus

export type ExpressionItem = { fr: string; en: string };
export const expressions: ExpressionItem[] = [
  {
    "fr": "mettre en production",
    "en": "deploy to production"
  },
  {
    "fr": "faire un déploiement bleu vert",
    "en": "perform a blue green deployment"
  },
  {
    "fr": "passer en maintenance",
    "en": "enter maintenance mode"
  },
  {
    "fr": "redémarrer un service",
    "en": "restart a service"
  },
  {
    "fr": "arrêter un service",
    "en": "stop a service"
  },
  {
    "fr": "recharger la configuration",
    "en": "reload configuration"
  },
  {
    "fr": "mettre à jour",
    "en": "update"
  },
  {
    "fr": "corriger un bug",
    "en": "fix a bug"
  },
  {
    "fr": "ouvrir un ticket",
    "en": "open a ticket"
  },
  {
    "fr": "clôturer un ticket",
    "en": "close a ticket"
  },
  {
    "fr": "documenter une procédure",
    "en": "document a procedure"
  },
  {
    "fr": "escalader un incident",
    "en": "escalate an incident"
  },
  {
    "fr": "résoudre un incident",
    "en": "resolve an incident"
  },
  {
    "fr": "analyser la cause racine",
    "en": "perform root cause analysis"
  },
  {
    "fr": "rédiger un post mortem",
    "en": "write a postmortem"
  },
  {
    "fr": "effectuer une sauvegarde",
    "en": "perform a backup"
  },
  {
    "fr": "restaurer une sauvegarde",
    "en": "restore a backup"
  },
  {
    "fr": "vérifier l'intégrité des données",
    "en": "verify data integrity"
  },
  {
    "fr": "chiffrer les données",
    "en": "encrypt data"
  },
  {
    "fr": "déchiffrer les données",
    "en": "decrypt data"
  },
  {
    "fr": "accorder un accès",
    "en": "grant access"
  },
  {
    "fr": "révoquer un accès",
    "en": "revoke access"
  },
  {
    "fr": "authentifier un utilisateur",
    "en": "authenticate a user"
  },
  {
    "fr": "autoriser une requête",
    "en": "authorize a request"
  },
  {
    "fr": "surveiller les logs",
    "en": "monitor logs"
  },
  {
    "fr": "analyser des métriques",
    "en": "analyze metrics"
  },
  {
    "fr": "tailer un fichier de log",
    "en": "tail a log file"
  },
  {
    "fr": "déployer via pipeline ci",
    "en": "deploy via ci pipeline"
  },
  {
    "fr": "Déclencher un pipeline",
    "en": "trigger a pipeline"
  },
  {
    "fr": "annuler un pipeline",
    "en": "cancel a pipeline"
  },
  {
    "fr": "exécuter des tests unitaires",
    "en": "run unit tests"
  },
  {
    "fr": "exécuter des tests d'intégration",
    "en": "run integration tests"
  },
  {
    "fr": "effectuer un test de charge",
    "en": "run a load test"
  },
  {
    "fr": "purger le cache",
    "en": "purge the cache"
  },
  {
    "fr": "invalider le cache",
    "en": "invalidate the cache"
  },
  {
    "fr": "vider un bucket",
    "en": "empty a bucket"
  },
  {
    "fr": "stocker des fichiers dans un bucket",
    "en": "store files in a bucket"
  },
  {
    "fr": "créer une instance",
    "en": "create an instance"
  },
  {
    "fr": "supprimer une instance",
    "en": "delete an instance"
  },
  {
    "fr": "augmenter la taille d'une instance",
    "en": "increase instance size"
  },
  {
    "fr": "réduire la taille d'une instance",
    "en": "decrease instance size"
  },
  {
    "fr": "attacher un disque",
    "en": "attach a disk"
  },
  {
    "fr": "détacher un disque",
    "en": "detach a disk"
  },
  {
    "fr": "faire un snapshot",
    "en": "take a snapshot"
  },
  {
    "fr": "créer une alerte",
    "en": "create an alert"
  },
  {
    "fr": "paramétrer une alerte",
    "en": "configure an alert"
  },
  {
    "fr": "basculer sur le serveur de secours",
    "en": "fail over to the standby server"
  },
  {
    "fr": "revenir sur le serveur principal",
    "en": "fail back to the primary server"
  },
  {
    "fr": "déployer une correction à chaud",
    "en": "deploy a hotfix"
  },
  {
    "fr": "mettre hors service une application",
    "en": "decommission an application"
  }
];

export const exprGlossary: Record<string, string> = Object.fromEntries(
  expressions.map((e) => [e.en, e.fr])
);
