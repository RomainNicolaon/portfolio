import type {
  Education,
  Experience,
  FaqItem,
  Profile,
  Project,
  SkillGroup,
} from '~/types/portfolio'

export const profile: Profile = {
  name: 'Romain NICOLAON',
  handle: 'romain',
  host: 'portfolio',
  title: 'Développeur Full-Stack',
  taglines: [
    'Je construis des applications web full stack performantes.',
    'PHP · JavaScript · Linux · Open Source',
    'Passionné par le code propre et les systèmes robustes.',
  ],
  location: 'Bourges, France',
  website: 'https://nicolaon.fr',
  available: true,
  about: [
    "Développeur full-stack avec plusieurs années d'expérience dans la conception d'applications web modernes.",
    "J'aime transformer des problèmes complexes en solutions simples et élégantes, avec une attention particulière portée à la performance, la maintenabilité et l'expérience utilisateur.",
    "En dehors de mes projets, je contribue à des projets d'amis et j'apprends l'univers des systèmes Linux et de l'automatisation.",
  ],
  email: 'nicolaon.romain@gmail.com',
  resume: '/docs/cv-romain.pdf',
  socials: [
    {
      label: 'GitHub',
      url: 'https://github.com/RomainNicolaon',
      command: 'git remote -v',
    },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/romain-nicolaon/',
      command: 'curl linkedin',
    },
  ],
}

export const experiences: Experience[] = [
  {
    role: 'Développeur Web Full Stack',
    company: 'Inleed',
    url: 'https://www.linkedin.com/company/25348969/',
    period: "sept. 2024 — aujourd'hui",
    location: 'Bourges, France · Sur site',
    description: "CDI. Développement d'applications web full stack.",
    highlights: [],
    stack: ['JavaScript', 'CSS', 'HTML'],
  },
  {
    role: 'Développeur Web',
    company: 'Inleed',
    url: 'https://www.linkedin.com/company/25348969/',
    period: 'juin 2023 — oct. 2024',
    location: 'Bourges, France · Sur site',
    description: 'Contrat en alternance. Développement web front-end et back-end.',
    highlights: [],
    stack: ['JavaScript', 'CSS', 'HTML'],
  },
  {
    role: 'Emploi temporaire vacance (ETV)',
    company: 'Crédit Agricole Centre Loire',
    url: 'https://www.linkedin.com/company/5367745/',
    period: 'août 2022',
    location: 'Bourges, France',
    description: 'CDD. Support matériel informatique et activités bancaires.',
    highlights: [],
    stack: [],
  },
  {
    role: 'Emploi temporaire vacance',
    company: 'Crédit Agricole Centre Loire',
    url: 'https://www.linkedin.com/company/5367745/',
    period: 'août 2021',
    location: 'France',
    description: 'CDD.',
    highlights: [],
    stack: [],
  },
]

export const projects: Project[] = [
  {
    name: 'terminal-portfolio',
    description:
      'Portfolio personnel au style terminal, en Nuxt avec données TypeScript et Tailwind CSS.',
    year: '2026',
    status: 'actif',
    tags: ['Nuxt', 'Vue', 'Tailwind'],
    links: { demo: '#', source: 'https://github.com/RomainNicolaon/portfolio' },
  },
  {
    name: 'inleed-cms',
    description:
      "CMS interne pour la gestion de contenu des sites web des clients de l'entreprise Inleed, séparé en 3 parties : back-end api en Express, tableau de bord et sites clients en React, et base de données MongoDB.",
    year: '2023-2026',
    status: 'archivé',
    tags: ['Express', 'React', 'MongoDB'],
    links: { demo: 'http://tableau-de-bord.in-leed.com/', source: 'https://github.com/' },
  },
  {
    name: 'LavaL-Bot',
    description:
      'Bot Discord développé en Python : gestion de serveur, mini-jeux et automatisation de tâches.',
    year: '2024',
    status: 'privé',
    tags: ['Python', 'discord.py'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/LavaL-Bot' },
  },
  {
    name: 'Le_Robot_Co_Pain',
    description: 'Bot Discord développé en TypeScript.',
    year: '2026',
    status: 'privé',
    tags: ['TypeScript', 'Discord.js'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/Le_Robot_Co_Pain' },
  },
  {
    name: 'dotfiles',
    description:
      "Ma configuration Linux : zsh, tmux, neovim et scripts d'installation automatisés.",
    year: '2023',
    status: 'actif',
    tags: ['Shell', 'Linux', 'Automation'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/dotfiles' },
  },
  {
    name: 'trading-bot',
    description:
      'Bot de trading de cryptomonnaies connecté à l\'API Binance. Projet expérimental « vibe coded » pour explorer la puissance de l\'IA en 2025 (à utiliser à vos risques).',
    year: '2025',
    status: 'actif',
    tags: ['TypeScript', 'Crypto', 'Binance'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/trading-bot' },
  },
  {
    name: 'ca-auto-connect-and-get-operations',
    description:
      'Outil Node.js automatisé qui se connecte à un compte bancaire Crédit Agricole et télécharge les dernières opérations au format CSV, via l\'automatisation du navigateur avec Puppeteer.',
    year: '2025',
    status: 'actif',
    tags: ['JavaScript', 'Node.js', 'Puppeteer'],
    links: {
      demo: null,
      source: 'https://github.com/RomainNicolaon/ca-auto-connect-and-get-operations',
    },
  },
  {
    name: 'FavFilm-React',
    description:
      "Application de gestion de films favoris, projet CEFIM pour l'apprentissage de React.",
    year: '2024',
    status: 'archivé',
    tags: ['JavaScript', 'React'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/FavFilm-React' },
  },
  {
    name: 'event-manager_cefim-project',
    description: "Gestionnaire d'événements — projet solo réalisé au CEFIM. Sous licence MIT.",
    year: '2024',
    status: 'archivé',
    tags: ['PHP', 'MySQL'],
    links: {
      demo: null,
      source: 'https://github.com/RomainNicolaon/event-manager_cefim-project',
    },
  },
  {
    name: 'GroupA_Dubail_Project',
    description: 'Projet de groupe réalisé au CEFIM.',
    year: '2021',
    status: 'archivé',
    tags: ['JavaScript'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/GroupA_Dubail_Project' },
  },
  {
    name: 'Star-Wars-3',
    description: 'Projet de groupe réalisé lors de la semaine de testing au CEFIM.',
    year: '2023',
    status: 'archivé',
    tags: ['PHP'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/Star-Wars-3' },
  },
  {
    name: 'tween-d-heure',
    description: 'Clone de Twitter (« Touiter ») réalisé pour l\'ECF au CEFIM.',
    year: '2024',
    status: 'privé',
    tags: ['JavaScript'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/tween-d-heure' },
  },
  {
    name: 'lavalclicker',
    description: 'Jeu de type clicker en JavaScript.',
    year: '2025',
    status: 'privé',
    tags: ['JavaScript'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/lavalclicker' },
  },
  {
    name: 'MineBurst',
    description: 'Projet développé en TypeScript.',
    year: '2024',
    status: 'privé',
    tags: ['TypeScript'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/MineBurst' },
  },
  {
    name: 'Moonshot-Project',
    description: 'Projet « Moonshot » réalisé dans le cadre des études à ALGOSUP.',
    year: '2022',
    status: 'privé',
    tags: ['ALGOSUP'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/Moonshot-Project' },
  },
  {
    name: 'ALGOSUP_2022_Project_3_F',
    description: 'Projet de synthèse sonore en F# réalisé à ALGOSUP.',
    year: '2022',
    status: 'privé',
    tags: ['F#', 'ALGOSUP'],
    links: { demo: null, source: 'https://github.com/RomainNicolaon/ALGOSUP_2022_Project_3_F' },
  },
]

export const skills: SkillGroup[] = [
  {
    category: 'Langages',
    items: ['PHP', 'JavaScript', 'TypeScript', 'SQL', 'Bash', 'HTML', 'CSS', 'Python', 'C#'],
  },
  {
    category: 'Frameworks & Librairies',
    items: ['Symfony', 'Laravel', 'Vue.js', 'React', 'Tailwind CSS', 'Node.js'],
  },
  {
    category: 'Bases de données',
    items: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'],
  },
  {
    category: 'Outils & DevOps',
    items: ['Docker', 'Git', 'GitLab CI', 'Linux', 'Nginx', 'Composer'],
  },
]

export const education: Education[] = [
  {
    degree: 'Développeur Web et Web Mobile',
    school: 'CEFIM',
    period: 'avr. 2023 — sept. 2024',
    description: 'Formation Web et Web Mobile — Réussite. Développement web back-end et front-end.',
  },
  {
    degree: 'Computer Programming / Programmer, General',
    school: 'Algosup',
    period: 'janv. 2021 — oct. 2022',
    description: 'Reconversion. Développement web back-end, apprentissage automatique.',
  },
  {
    degree: 'Bac STI2D, Informatique',
    school: 'Lycée Pierre Émile Martin',
    period: '2018 — 2020',
    description: 'Diplôme obtenu. Développement front-end, autonomie.',
  },
  {
    degree: 'Diplôme national du brevet des collèges',
    school: 'Collège Sainte-Marie',
    period: '2017',
    description: 'Mention assez bien.',
  },
]

export const faq: FaqItem[] = [
  {
    question: 'Qui est Romain Nicolaon ?',
    answer:
      'Romain Nicolaon est un développeur web full-stack basé à Bourges, en France. Il conçoit des applications web modernes et performantes, principalement en PHP et JavaScript/TypeScript, et travaille actuellement chez Inleed.',
  },
  {
    question: 'Quelles technologies maîtrise Romain Nicolaon ?',
    answer:
      'Il travaille avec PHP, JavaScript, TypeScript, Python et SQL, ainsi que les frameworks Symfony, Laravel, Vue.js, React et Node.js. Côté outils, il utilise Docker, Git, GitLab CI, Linux et Nginx, avec PostgreSQL, MySQL, Redis et MongoDB pour les bases de données.',
  },
  {
    question: 'Romain Nicolaon est-il disponible pour de nouvelles opportunités ?',
    answer:
      'Oui, Romain est ouvert aux opportunités. Le meilleur moyen de le contacter est par email à nicolaon.romain@gmail.com ou via LinkedIn.',
  },
  {
    question: 'Où est basé Romain Nicolaon ?',
    answer:
      'Romain est basé à Bourges, en France, et y travaille sur site en tant que développeur web full-stack.',
  },
  {
    question: 'Comment contacter Romain Nicolaon ?',
    answer:
      'Vous pouvez le contacter par email à nicolaon.romain@gmail.com, ou le retrouver sur GitHub (RomainNicolaon) et LinkedIn.',
  },
]
