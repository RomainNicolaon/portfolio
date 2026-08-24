import type {
  Education,
  Experience,
  FaqItem,
  Profile,
  Project,
  SkillGroup,
} from '~/types/portfolio'

import { projects as projectsFr } from '~/data/portfolio'

export const profile: Profile = {
  name: 'Romain NICOLAON',
  handle: 'romain',
  host: 'portfolio',
  title: 'Full-Stack Developer',
  taglines: [
    'I build fast, full-stack web applications.',
    'PHP · JavaScript · Linux · Open Source',
    'Passionate about clean code and robust systems.',
  ],
  location: 'Bourges, France',
  website: 'https://www.nicolaon.fr',
  available: true,
  about: [
    'Romain Nicolaon, full-stack developer with several years of experience designing modern web applications.',
    'I enjoy turning complex problems into simple, elegant solutions, with a strong focus on performance, maintainability and user experience.',
    'Outside of my own projects, I contribute to friends\u2019 projects and keep learning about Linux systems and automation.',
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
  // Additional public profiles for sameAs (not shown in the UI).
  // Add your other VERIFIED profiles here to strengthen the « Romain Nicolaon » entity
  // (e.g. X/Twitter, dev.to, Malt, Stack Overflow, about.me, Mastodon…).
  sameAs: [
    'https://github.com/RomainNicolaon',
    'https://www.linkedin.com/in/romain-nicolaon/',
  ],
}

export const experiences: Experience[] = [
  {
    role: 'Full Stack Web Developer',
    company: 'Inleed',
    url: 'https://www.linkedin.com/company/25348969/',
    period: 'Sep 2024 — present',
    location: 'Bourges, France · On-site',
    description: 'Permanent contract. Full-stack web application development.',
    highlights: [],
    stack: ['JavaScript', 'CSS', 'HTML'],
  },
  {
    role: 'Web Developer',
    company: 'Inleed',
    url: 'https://www.linkedin.com/company/25348969/',
    period: 'Jun 2023 — Oct 2024',
    location: 'Bourges, France · On-site',
    description: 'Apprenticeship contract. Front-end and back-end web development.',
    highlights: [],
    stack: ['JavaScript', 'CSS', 'HTML'],
  },
  {
    role: 'Temporary staff (ETV)',
    company: 'Crédit Agricole Centre Loire',
    url: 'https://www.linkedin.com/company/5367745/',
    period: 'Aug 2022',
    location: 'Bourges, France',
    description: 'Fixed-term contract. IT hardware support and banking activities.',
    highlights: [],
    stack: [],
  },
  {
    role: 'Temporary staff',
    company: 'Crédit Agricole Centre Loire',
    url: 'https://www.linkedin.com/company/5367745/',
    period: 'Aug 2021',
    location: 'France',
    description: 'Fixed-term contract.',
    highlights: [],
    stack: [],
  },
]

const descriptionsEn: Record<string, string> = {
  'cv-creator':
    'PDF résumé generator built with Nuxt: pick from 8 themes, edit live, import a photo, customize (accent color, font, sections) and export to PDF via the browser print dialog.',
  'terminal-portfolio':
    'Personal terminal-styled portfolio, built with Nuxt, TypeScript data and Tailwind CSS.',
  'inleed-cms':
    'Internal CMS for managing the content of Inleed\u2019s client websites, split into 3 parts: an Express back-end API, a dashboard and client sites in React, and a MongoDB database.',
  'LavaL-Bot':
    'Discord bot written in Python: server management, mini-games and task automation.',
  Le_Robot_Co_Pain: 'Discord bot written in TypeScript.',
  dotfiles: 'My Linux configuration: zsh, tmux, neovim and automated install scripts.',
  'trading-bot':
    'Cryptocurrency trading bot connected to the Binance API. An experimental \u201cvibe coded\u201d project to explore the power of AI in 2025 (use at your own risk).',
  'ca-auto-connect-and-get-operations':
    'Automated Node.js tool that logs into a Crédit Agricole bank account and downloads the latest transactions as CSV, using browser automation with Puppeteer.',
  'FavFilm-React':
    'Favorite-movies manager, a CEFIM project to learn React.',
  'event-manager_cefim-project':
    'Event manager — a solo project built at CEFIM. MIT licensed.',
  GroupA_Dubail_Project: 'Group project built at CEFIM.',
  'Star-Wars-3': 'Group project built during the testing week at CEFIM.',
  'tween-d-heure': 'A Twitter clone (\u201cTouiter\u201d) built for the CEFIM final exam.',
  lavalclicker: 'A clicker-style game in JavaScript.',
  MineBurst: 'Project built in TypeScript.',
  'Moonshot-Project': 'The \u201cMoonshot\u201d project built as part of my studies at ALGOSUP.',
  ALGOSUP_2022_Project_3_F: 'Sound-synthesis project in F# built at ALGOSUP.',
}

export const projects: Project[] = projectsFr.map((p) => ({
  ...p,
  description: descriptionsEn[p.name] ?? p.description,
}))

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['PHP', 'JavaScript', 'TypeScript', 'SQL', 'Bash', 'HTML', 'CSS', 'Python', 'C#'],
  },
  {
    category: 'Frameworks & Libraries',
    items: ['Symfony', 'Laravel', 'Vue.js', 'React', 'Tailwind CSS', 'Node.js'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB'],
  },
  {
    category: 'Tools & DevOps',
    items: ['Docker', 'Git', 'GitLab CI', 'Linux', 'Nginx', 'Composer'],
  },
]

export const education: Education[] = [
  {
    degree: 'Web and Mobile Web Developer',
    school: 'CEFIM',
    period: 'Apr 2023 — Sep 2024',
    description: 'Web and Mobile Web training — passed. Back-end and front-end web development.',
  },
  {
    degree: 'Computer Programming / Programmer, General',
    school: 'Algosup',
    period: 'Jan 2021 — Oct 2022',
    description: 'Career change. Back-end web development, machine learning.',
  },
  {
    degree: 'STI2D Baccalaureate, Computer Science',
    school: 'Lycée Pierre Émile Martin',
    period: '2018 — 2020',
    description: 'Diploma obtained. Front-end development, autonomy.',
  },
  {
    degree: 'National Diploma of the Brevet (lower secondary)',
    school: 'Collège Sainte-Marie',
    period: '2017',
    description: 'Passed with merit.',
  },
]

export const faq: FaqItem[] = [
  {
    question: 'Who is Romain Nicolaon?',
    answer:
      'Romain Nicolaon is a full-stack web developer based in Bourges, France. He designs modern, high-performance web applications, mainly in PHP and JavaScript/TypeScript, and currently works at Inleed.',
  },
  {
    question: 'Which technologies does Romain Nicolaon know?',
    answer:
      'He works with PHP, JavaScript, TypeScript, Python and SQL, along with the Symfony, Laravel, Vue.js, React and Node.js frameworks. For tooling he uses Docker, Git, GitLab CI, Linux and Nginx, with PostgreSQL, MySQL, Redis and MongoDB for databases.',
  },
  {
    question: 'Is Romain Nicolaon available for new opportunities?',
    answer:
      'Yes, Romain is open to opportunities. The best way to reach him is by email at nicolaon.romain@gmail.com or through LinkedIn.',
  },
  {
    question: 'Where is Romain Nicolaon based?',
    answer:
      'Romain is based in Bourges, France, where he works on-site as a full-stack web developer.',
  },
  {
    question: 'How can I contact Romain Nicolaon?',
    answer:
      'You can reach him by email at nicolaon.romain@gmail.com, or find him on GitHub (RomainNicolaon) and LinkedIn.',
  },
]
