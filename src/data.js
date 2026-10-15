// Edit your content here — the page is built from this file.

export const profile = {
  first: 'Ashidha',
  last: 'Muneer',
  email: 'ashidhaa@gmail.com',
  phone: '+971 50 305 9649',
  phoneRaw: '971503059649',
  github: 'https://github.com/ashidhamuneer123',
  linkedin: 'https://www.linkedin.com/in/ashidha-muneer-35618b13a/',
  photo: './ashidha.jpg',
}

export const stats = [
  { n: 2, suffix: '+', label: 'years building for the web' },
  { text: 'B.Tech', label: 'in Information Technology' },
  { n: 60, suffix: '+', label: 'products run through an admin I built' },
  { n: 3, suffix: '', label: 'languages: English, Malayalam, Hindi' },
]

export const projects = [
  {
    id: 'superiorpack',
    title: 'Superior Pack UAE',
    url: 'https://superiorpackuae.com',
    host: 'superiorpackuae.com',
    image: './previews/superiorpack.jpg',
    meta: 'Mar – May 2025 · Freelance',
    role: 'Full-stack developer',
    summary:
      'A Dubai custom-packaging manufacturer supplying hotels, cafés and retailers. I rebuilt their static WordPress site as a dynamic web app the team now runs themselves.',
    points: [
      'Admin dashboard for products, categories, orders and users',
      'Customer login so repeat buyers reorder by submitting an LPO',
      'Enquiry cart and instant-quote flow across 20+ categories',
      'Image storage with Cloudinary and Multer, deployed on AWS EC2',
    ],
    stack: ['Node.js', 'Express', 'EJS', 'MongoDB', 'Cloudinary', 'AWS EC2'],
  },
  {
    id: 'albayadh',
    title: 'Al Bayadh Electrical & Hardware',
    url: 'https://shopalbayadh.com',
    host: 'shopalbayadh.com',
    image: './previews/albayadh.jpg',
    meta: '2025 – 26 · Techbeee Technologies',
    role: 'Project coordinator',
    summary:
      'A full online store for a UAE building-materials supplier, built in Next.js. I ran the project between the client and the development team, from scope to launch.',
    points: [
      'Catalogue across electrical, plumbing, paints, tools and sanitary',
      'Cart, wishlist, wallet, coupons, returns and order history',
      'Bulk-order flow for contractors and trade buyers',
      'Sprint planning, client sign-offs and the launch checklist',
    ],
    stack: ['Next.js', 'React', 'Cloudinary', 'Agile delivery'],
  },
  {
    id: 'techbee',
    title: 'TechBee Company Profile',
    url: 'https://profile.techbeeservices.ae',
    host: 'profile.techbeeservices.ae',
    image: './previews/techbee.jpg',
    meta: '2026 · Techbeee Technologies',
    role: 'Company website',
    summary:
      'A marketing site that positions a Dubai technical-services company as the LED-upgrade installation partner for energy-service companies across the UAE.',
    points: [
      'Hero with on-site video, clear calls to request a site survey',
      'Services, workflow, project track record and client logos',
      'Photo and video gallery with a lightbox',
      'SEO meta and social-share previews for every page',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'SEO', 'Hostinger'],
  },
  {
    id: 'kidsfunzone',
    title: "Kids' Fun Zone",
    url: 'https://kids-fun-app.vercel.app/',
    host: 'kids-fun-app.vercel.app',
    image: './previews/kidsfunzone.jpg',
    meta: 'Internship project · React',
    role: 'React developer',
    summary:
      'A playful learning app for children with games, quizzes and puzzles, built in React during my internship and deployed on Vercel.',
    points: [
      'Memory game with card-flip matching and a timed challenge',
      'Quiz and puzzle sections with instant feedback',
      'Component-based React UI with state-driven game logic',
      'Responsive layout for tablets and phones, deployed on Vercel',
    ],
    stack: ['React', 'JavaScript', 'CSS3', 'Vercel'],
  },
]

export const services = [
  {
    icon: 'building',
    title: 'Company websites',
    text: 'Mobile-ready sites that present your services, projects and clients, with SEO and enquiry forms built in.',
  },
  {
    icon: 'user',
    title: 'Personal branding & portfolios',
    text: 'Portfolio sites for professionals, freelancers and creatives: your story, your work and your contact details in one link.',
  },
  {
    icon: 'cart',
    title: 'E-commerce stores',
    text: 'Product catalogues, carts, enquiry or checkout flows, and an admin panel your team can run without a developer.',
  },
  {
    icon: 'grid',
    title: 'Web apps & dashboards',
    text: 'Custom tools such as admin panels, booking systems and internal dashboards, built on React, Node.js and MongoDB.',
  },
]

export const builds = [
  {
    title: 'E-commerce platform',
    tag: 'shop · own build',
    text: 'MERN store with JWT auth, Razorpay checkout, Multer uploads, an admin dashboard and Nodemailer order emails.',
    side: ['Products', 'Orders', 'Coupons', 'Users'],
    kpis: [['1,284', 'Orders'], ['312', 'Customers'], ['18', 'Coupons']],
  },
  {
    title: 'Blog management system',
    tag: 'blog · own build',
    text: 'React and Redux Toolkit front end on an Express API, with rich-text posts, user roles, comments and an author dashboard.',
    side: ['Posts', 'Drafts', 'Comments', 'Authors'],
    kpis: [['48', 'Posts'], ['9.1k', 'Reads'], ['236', 'Comments']],
  },
]

export const timeline = [
  {
    when: 'Jun 2025 — now',
    title: 'Project Coordinator',
    org: 'Techbeee Technologies, Dubai',
    kind: 'Current',
    text: 'I run web projects end to end: gather client requirements, assign and track developer tasks, keep milestones on schedule, and write the documentation and progress reports management relies on.',
  },
  {
    when: 'Mar — May 2025',
    title: 'Full-stack Developer',
    org: 'Superior Pack UAE',
    kind: 'Freelance',
    text: 'Rebuilt the company website from static WordPress into a Node.js, EJS and MongoDB app with a custom admin dashboard, customer reorder login and cloud image storage on AWS.',
  },
  {
    when: 'Jan — Jun 2025',
    title: 'Operations & Administration Manager',
    org: 'JCA Digitech, Dubai',
    kind: 'Full-time',
    text: 'Ran administration, CRM and sales follow-ups for a trading firm; handled payroll, petty cash and records, and built Excel reports for operational decisions.',
  },
  {
    when: 'Degree',
    title: 'B.Tech in Information Technology',
    org: 'AWH Engineering College, Calicut',
    kind: 'Education',
    text: 'Engineering degree covering programming, data structures, databases, computer networks and software engineering: the foundation under everything I build.',
  },
]

export const skills = [
  { name: 'Frontend', code: 'UI', items: ['React.js', 'Next.js', 'Redux Toolkit', 'JavaScript ES6+', 'HTML5', 'CSS3', 'Tailwind', 'Bootstrap 5'] },
  { name: 'Backend', code: 'API', items: ['Node.js', 'Express', 'REST APIs', 'JWT auth', 'MVC', 'Socket.io', 'EJS'] },
  { name: 'Data & cloud', code: 'OPS', items: ['MongoDB', 'MySQL', 'AWS EC2', 'Nginx', 'Vercel', 'Cloudinary', 'Hostinger'] },
  { name: 'Integrations', code: 'LIB', items: ['Razorpay', 'Multer', 'Nodemailer', 'Postman'] },
  { name: 'Delivery', code: 'PM', items: ['Requirements', 'Task tracking', 'Client sign-off', 'Documentation', 'Reporting'] },
  { name: 'Workflow', code: 'DEV', items: ['Git', 'GitHub', 'VS Code', 'Figma', 'Excel'] },
]

export const marquee = ['React', 'Node.js', 'Express', 'MongoDB', 'Next.js', 'Three.js', 'AWS EC2', 'REST APIs', 'Redux', 'Cloudinary', 'JWT', 'Figma']
