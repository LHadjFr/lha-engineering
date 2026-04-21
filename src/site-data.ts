export type LabelAccent = 'amber' | 'blue'
export type LabelIcon = 'shield' | 'compass' | 'cpu'

export interface LabelDetail {
  title: string
  text: string
}

export interface Label {
  id: string
  icon: LabelIcon
  accent: LabelAccent
  title: string
  summary: string
  subtitle: string
  intro: string
  details: LabelDetail[]
}

export const references = ['A380', 'Rafale', 'Egnos', 'CNES', 'ESA']
export const certifications = ['DO-178 / ED-12B', 'EN 50128', 'DAL-A a D', 'SAFe', 'PSM I']

export const labels: Label[] = [
  {
    id: 'compliance',
    icon: 'shield',
    accent: 'amber',
    title: 'LHA Compliance & Process',
    summary:
      'Accompagnement normatif DO-178 / ED-12B et EN 50128, rédaction des plans de certification, audit et mise en conformité DAL-A à D.',
    subtitle: 'Sécuriser votre route vers la certification (DO-178C / EN 50128).',
    intro:
      "Ce label s'appuie sur une expertise acquise sur des systèmes de haute intégrité (A380, Rafale, Egnos). L'objectif est de transformer la contrainte normative en un processus fluide et maîtrisé.",
    details: [
      {
        title: 'Ingénierie Documentaire (Planning)',
        text: 'Rédaction et mise à jour des plans de certification : PSAC (Plan for Software Aspects of Certification), SDP, SVP, SCMP et SQAP.',
      },
      {
        title: 'Accompagnement aux Audits (SOI)',
        text: 'Préparation et support lors des étapes de certification (SOI 1 à SOI 4) face aux autorités (EASA, DGA).',
      },
      {
        title: 'Analyse de Sûreté',
        text: 'Aide à la définition et à la vérification des objectifs selon le niveau de criticité (DAL-A à DAL-D).',
      },
      {
        title: 'Vérification & Validation (V&V)',
        text: 'Stratégie de tests, traçabilité des exigences (amont/aval) et analyse de couverture structurelle (Statement, Decision, MC/DC).',
      },
    ],
  },
  {
    id: 'craftsmanship',
    icon: 'compass',
    accent: 'blue',
    title: 'LHA Software Craftsmanship',
    summary:
      "Coaching et mentorat technique, excellence du code, maintenabilité et intégration pragmatique de l'IA dans le cycle de développement.",
    subtitle: "L'excellence technique et humaine au service de la maintenabilité.",
    intro:
      "Inspiré par la culture de l'artisanat logiciel et enrichi par les outils de demain, ce label vise à élever le niveau technique de vos équipes par le compagnonnage et l'innovation.",
    details: [
      {
        title: 'Mentoring & Coaching',
        text: 'Transfert de compétences on-the-job pour juniors et confirmés sur les bonnes pratiques de codage et de design.',
      },
      {
        title: 'Modernisation du Workflow (IA/LLMs)',
        text: "Intégration pragmatique et sécurisée de l'IA (Copilot, LLMs locaux) dans le cycle de développement pour doper la productivité sans compromettre la sécurité.",
      },
      {
        title: 'Qualité du Code',
        text: 'Mise en place de standards de Clean Code, revues de code systématiques et réduction active de la dette technique.',
      },
      {
        title: 'Agilité Opérationnelle',
        text: 'Application des frameworks SAFe et Scrum (PSM I) pour synchroniser les équipes techniques avec les objectifs business complexes.',
      },
    ],
  },
  {
    id: 'dev-labs',
    icon: 'cpu',
    accent: 'blue',
    title: 'LHA Dev Labs',
    summary:
      'Développement sur-mesure de composants critiques, solutions fullstack et applications mobiles avec une obsession pour la robustesse et la performance.',
    subtitle: "Développement de composants robustes, du capteur à l'interface.",
    intro:
      "Un laboratoire de développement capable d'intervenir sur toute la stack, avec une obsession pour la robustesse et la performance.",
    details: [
      {
        title: 'Logiciels Embarqués & Critiques',
        text: 'Développement bas-niveau et middleware en C, C++ et Ada. Expertise particulière sur les contraintes temps-réel et la gestion mémoire sécurisée.',
      },
      {
        title: 'Solutions Fullstack Modernes',
        text: "Conception d'outils métiers et de tableaux de bord industriels performants avec React, Tailwind CSS et Node.js.",
      },
      {
        title: 'Mobilité Industrielle',
        text: "Développement d'applications mobiles natives sous Android (Kotlin) pour le pilotage ou le monitoring de systèmes complexes.",
      },
      {
        title: 'Prototypage Rapide (PoC)',
        text: 'Capacité à transformer une idée complexe en prototype fonctionnel industriable en cycle court.',
      },
    ],
  },
]
