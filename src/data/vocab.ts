// ⚠️ Fichier généré — src/data/vocab.ts
// Éditez data/corpus.csv puis relancez: pnpm build:corpus

export type VocabItem = { fr: string; en: string[] };
export const vocab: VocabItem[] = [
  {
    "fr": "Réseau",
    "en": [
      "Network"
    ]
  },
  {
    "fr": "Système informatique",
    "en": [
      "Computer system"
    ]
  },
  {
    "fr": "Exploitation des réseaux",
    "en": [
      "Network operation"
    ]
  },
  {
    "fr": "Réseaux et télécoms",
    "en": [
      "Networks and telecoms"
    ]
  },
  {
    "fr": "Infrastructure de systèmes",
    "en": [
      "System infrastructure"
    ]
  },
  {
    "fr": "Parc informatique",
    "en": [
      "IT stock"
    ]
  },
  {
    "fr": "Service",
    "en": [
      "Help desk"
    ]
  },
  {
    "fr": "Application client-serveur",
    "en": [
      "Client-server application"
    ]
  },
  {
    "fr": "Installer / Désinstaller",
    "en": [
      "To install",
      "To uninstall"
    ]
  },
  {
    "fr": "Redémarrer",
    "en": [
      "To reboot"
    ]
  },
  {
    "fr": "Surveillance",
    "en": [
      "Monitoring",
      "Supervision"
    ]
  },
  {
    "fr": "Panneau de configuration",
    "en": [
      "Control panel"
    ]
  },
  {
    "fr": "Paramètres",
    "en": [
      "Settings"
    ]
  },
  {
    "fr": "Logiciel",
    "en": [
      "Software"
    ]
  },
  {
    "fr": "Matériel informatique",
    "en": [
      "Hardware"
    ]
  },
  {
    "fr": "Imprimante",
    "en": [
      "Printer"
    ]
  },
  {
    "fr": "Utilisateur",
    "en": [
      "User"
    ]
  },
  {
    "fr": "Serveur",
    "en": [
      "Server",
      "Host"
    ]
  },
  {
    "fr": "Sauvegarde",
    "en": [
      "Backup"
    ]
  },
  {
    "fr": "Base de données",
    "en": [
      "Database"
    ]
  },
  {
    "fr": "Flux de données",
    "en": [
      "Data flow"
    ]
  },
  {
    "fr": "Stockage de données",
    "en": [
      "Data storage"
    ]
  },
  {
    "fr": "Sécurité des données",
    "en": [
      "Data safety"
    ]
  },
  {
    "fr": "Saisie des données",
    "en": [
      "Data recording"
    ]
  },
  {
    "fr": "Restauration des données",
    "en": [
      "Data recovery",
      "restoration"
    ]
  },
  {
    "fr": "Nettoyage des données",
    "en": [
      "Data cleansing"
    ]
  },
  {
    "fr": "Exploration de données",
    "en": [
      "Data mining"
    ]
  },
  {
    "fr": "Centre de données",
    "en": [
      "Data center"
    ]
  },
  {
    "fr": "Virtualisation des serveurs",
    "en": [
      "Server virtualization"
    ]
  },
  {
    "fr": "Machine virtuelle",
    "en": [
      "Virtual machine"
    ]
  },
  {
    "fr": "Apprentissage automatique",
    "en": [
      "Machine learning"
    ]
  },
  {
    "fr": "Equipement téléphonique",
    "en": [
      "Phone equipment"
    ]
  },
  {
    "fr": "Invite de commande",
    "en": [
      "Command prompt"
    ]
  },
  {
    "fr": "Poste de travail",
    "en": [
      "Workstation"
    ]
  },
  {
    "fr": "Carte mémoire",
    "en": [
      "Memory card"
    ]
  },
  {
    "fr": "Carte mère",
    "en": [
      "Motherboard"
    ]
  },
  {
    "fr": "Carte son",
    "en": [
      "Sound card"
    ]
  },
  {
    "fr": "Processeur central",
    "en": [
      "Central processing unit"
    ]
  },
  {
    "fr": "Processeur graphique",
    "en": [
      "Graphics processing unit"
    ]
  },
  {
    "fr": "Microprocesseur",
    "en": [
      "Microprocessor",
      "Microchip"
    ]
  },
  {
    "fr": "Système d’exploitation",
    "en": [
      "Operating system"
    ]
  },
  {
    "fr": "Routeur",
    "en": [
      "Router"
    ]
  },
  {
    "fr": "Gestionnaire de périphérique",
    "en": [
      "Device manager"
    ]
  },
  {
    "fr": "Mémoire vive",
    "en": [
      "Random access memory (RAM)"
    ]
  },
  {
    "fr": "Répertoire racine",
    "en": [
      "Root directory"
    ]
  },
  {
    "fr": "Exécuter un programme",
    "en": [
      "To run a program"
    ]
  },
  {
    "fr": "Protocole",
    "en": [
      "Protocol"
    ]
  },
  {
    "fr": "Pare-feu",
    "en": [
      "Firewall"
    ]
  },
  {
    "fr": "Nom d’utilisateur",
    "en": [
      "Username"
    ]
  },
  {
    "fr": "Mot de passe",
    "en": [
      "Password"
    ]
  }
];

export const glossary: Record<string, string> = Object.fromEntries(
  vocab.flatMap((it) => it.en.map((e) => [e, it.fr]))
);
