// ⚠️ Fichier généré — src/data/definitions.ts
// Éditez data/corpus.csv puis relancez: pnpm build:corpus

export type DefinitionItem = { def: string; term: string; synonyms?: string[] };
export const definitions: DefinitionItem[] = [
  {
    "def": "A copy of data stored separately to enable recovery after loss or corruption.",
    "term": "backup"
  },
  {
    "def": "A network security system that monitors and controls traffic based on predefined rules.",
    "term": "firewall"
  },
  {
    "def": "A computer that provides services or resources to other computers over a network.",
    "term": "server"
  },
  {
    "def": "A device that forwards data packets between networks.",
    "term": "router"
  },
  {
    "def": "A device that connects devices within the same network and forwards frames.",
    "term": "switch"
  },
  {
    "def": "A formal set of rules that define how data is transmitted and received.",
    "term": "protocol"
  },
  {
    "def": "The process of encoding information so that only authorized parties can access it.",
    "term": "encryption"
  },
  {
    "def": "The process of verifying the identity of a user or system.",
    "term": "authentication"
  },
  {
    "def": "A unique numerical label assigned to a device connected to a network.",
    "term": "IP address"
  },
  {
    "def": "A human-readable name that maps to an IP address.",
    "term": "domain name"
  },
  {
    "def": "Software that manages hardware resources and provides services for applications.",
    "term": "operating system"
  },
  {
    "def": "A system that organizes, stores, and retrieves structured information.",
    "term": "database"
  },
  {
    "def": "A component that distributes incoming traffic across multiple servers.",
    "term": "load balancer"
  },
  {
    "def": "Design that minimizes downtime through redundancy and failover.",
    "term": "high availability"
  },
  {
    "def": "To increase resources (CPU/RAM/instances) on a system to handle greater load.",
    "term": "scale up"
  },
  {
    "def": "To revert a system or deployment to a previous working state.",
    "term": "roll back"
  },
  {
    "def": "To permanently retire a system or service from production.",
    "term": "decommission"
  },
  {
    "def": "An unplanned interruption or reduction in the quality of an IT service.",
    "term": "incident"
  },
  {
    "def": "Records produced by applications or systems describing events or errors.",
    "term": "logs"
  },
  {
    "def": "The practice of observing systems and metrics to detect issues.",
    "term": "monitoring"
  },
  {
    "def": "An interface that allows software components to communicate using defined requests and responses.",
    "term": "API"
  },
  {
    "def": "A small, independently deployable service that owns a specific business capability.",
    "term": "microservice"
  },
  {
    "def": "A lightweight, isolated runtime environment for applications and their dependencies.",
    "term": "container"
  },
  {
    "def": "An orchestration system for automating deployment, scaling, and management of containers.",
    "term": "Kubernetes"
  },
  {
    "def": "A software emulation of a physical computer that runs an operating system.",
    "term": "virtual machine"
  },
  {
    "def": "On-demand delivery of computing services over the internet with pay-as-you-go pricing.",
    "term": "cloud computing"
  },
  {
    "def": "A physically separate data-center location within a cloud region.",
    "term": "availability zone"
  },
  {
    "def": "A geographic area containing multiple availability zones.",
    "term": "region"
  },
  {
    "def": "A distributed network of servers that delivers content from locations closer to users.",
    "term": "content delivery network"
  },
  {
    "def": "The time it takes for data to travel from source to destination.",
    "term": "latency"
  },
  {
    "def": "The amount of data processed or transferred per unit of time.",
    "term": "throughput"
  },
  {
    "def": "The maximum data transfer capacity of a network link.",
    "term": "bandwidth"
  },
  {
    "def": "A Service Level Agreement that defines promised service performance and penalties.",
    "term": "SLA"
  },
  {
    "def": "A Service Level Objective that expresses the target level of reliability or performance.",
    "term": "SLO"
  },
  {
    "def": "A fast storage layer that holds frequently accessed data to speed up retrieval.",
    "term": "cache"
  },
  {
    "def": "A component that stores messages so they can be processed asynchronously.",
    "term": "message queue"
  },
  {
    "def": "A messaging pattern where publishers send events to topics and subscribers receive them.",
    "term": "publish-subscribe"
  },
  {
    "def": "A technique that restricts the number of requests a client can make in a given time.",
    "term": "rate limiting"
  },
  {
    "def": "The Domain Name System that translates human-readable names into IP addresses.",
    "term": "DNS"
  },
  {
    "def": "The Dynamic Host Configuration Protocol that automatically assigns IP configuration to devices.",
    "term": "DHCP"
  },
  {
    "def": "A Virtual Private Network that creates an encrypted tunnel over an untrusted network.",
    "term": "VPN"
  },
  {
    "def": "Multi-Factor Authentication requiring two or more verification factors to sign in.",
    "term": "MFA"
  },
  {
    "def": "Single Sign-On allowing a user to access multiple applications with one login.",
    "term": "SSO"
  },
  {
    "def": "A security model that assumes no implicit trust and verifies every access request.",
    "term": "zero trust"
  },
  {
    "def": "Identity and Access Management: processes and tools to manage identities and permissions.",
    "term": "IAM"
  },
  {
    "def": "Role-Based Access Control where permissions are granted to roles rather than individuals.",
    "term": "RBAC"
  },
  {
    "def": "The practice of securely storing and rotating credentials, keys, and tokens.",
    "term": "secret management"
  },
  {
    "def": "A release strategy that switches traffic between two identical environments.",
    "term": "blue-green deployment"
  },
  {
    "def": "A strategy that exposes a small subset of users to a new version to reduce risk.",
    "term": "canary release"
  },
  {
    "def": "An automated pipeline for Continuous Integration and Continuous Delivery/Deployment.",
    "term": "CI/CD pipeline"
  }
];
