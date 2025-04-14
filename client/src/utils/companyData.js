// Top 500 companies (abbreviated list for example)
export const top500Companies = [
  "Apple", "Microsoft", "Amazon", "Google", "Facebook", "Tesla", "Walmart", "Exxon Mobil", 
  "Berkshire Hathaway", "UnitedHealth Group", "Johnson & Johnson", "JPMorgan Chase", 
  "Visa", "Procter & Gamble", "Mastercard", "Bank of America", "Home Depot", "Nvidia", 
  "Pfizer", "Verizon", "Adobe", "Coca-Cola", "Disney", "Netflix", "Oracle", "Intel",
  "Salesforce", "Cisco", "IBM", "Accenture", "PepsiCo", "Comcast", "Nike", "McDonald's",
  "General Electric", "Abbott Laboratories", "AT&T", "Merck", "Costco", "Broadcom",
  "Citigroup", "PayPal", "Thermo Fisher Scientific", "Advanced Micro Devices", "Boeing",
  "Texas Instruments", "Qualcomm", "Wells Fargo", "Starbucks", "Goldman Sachs"
  // ... add more companies to reach 500
];

// Common job titles
export const commonJobTitles = [
  "Software Engineer", "Software Developer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "DevOps Engineer", "Data Scientist", "Machine Learning Engineer",
  "Product Manager", "Project Manager", "UX Designer", "UI Designer", "QA Engineer",
  "Data Analyst", "Systems Analyst", "Network Engineer", "Cloud Engineer", "Mobile Developer",
  "Game Developer", "Security Engineer", "Database Administrator", "Business Analyst",
  "Technical Writer", "IT Support Specialist", "CTO", "CIO", "Web Developer", "Scrum Master",
  "Senior Software Engineer", "Junior Software Engineer", "Software Architect", "Site Reliability Engineer",
  "Engineering Manager", "Technical Lead", "Business Intelligence Analyst", "Data Engineer",
  "AR/VR Developer", "Blockchain Developer", "Automation Engineer", "Solutions Architect",
  "Graphics Programmer", "AI Engineer", "Customer Success Manager", "Technical Program Manager"
  // ... add more job titles
];

// Country codes with flags for phone input
export const countryCodes = [
  { country: "United States", code: "+1", flag: "🇺🇸" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "India", code: "+91", flag: "🇮🇳" },
  { country: "Canada", code: "+1", flag: "🇨🇦" },
  { country: "Australia", code: "+61", flag: "🇦🇺" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Japan", code: "+81", flag: "🇯🇵" },
  { country: "China", code: "+86", flag: "🇨🇳" },
  { country: "Brazil", code: "+55", flag: "🇧🇷" },
  { country: "Mexico", code: "+52", flag: "🇲🇽" },
  { country: "South Korea", code: "+82", flag: "🇰🇷" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Russia", code: "+7", flag: "🇷🇺" },
  { country: "Netherlands", code: "+31", flag: "🇳🇱" },
  { country: "Switzerland", code: "+41", flag: "🇨🇭" },
  { country: "Singapore", code: "+65", flag: "🇸🇬" },
  { country: "Sweden", code: "+46", flag: "🇸🇪" },
  { country: "Israel", code: "+972", flag: "🇮🇱" }
  // ... add more countries as needed
];

// States for US addresses
export const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

// List of common countries
export const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "India", 
  "Germany", "France", "China", "Japan", "Russia", "Brazil", "Mexico", 
  "Spain", "Italy", "South Korea", "Netherlands", "Sweden", "Switzerland", 
  "Singapore", "Israel", "New Zealand", "Ireland", "Belgium", "Denmark", 
  "Norway", "Finland", "Austria", "Portugal", "Greece", "Poland", "Czech Republic", 
  "Hungary", "Turkey", "South Africa", "Egypt", "Nigeria", "Kenya", "Saudi Arabia", 
  "United Arab Emirates", "Qatar", "Argentina", "Chile", "Colombia", "Peru", 
  "Vietnam", "Thailand", "Malaysia", "Indonesia", "Philippines"
];

// Cities by country for the cascade selection (top 15 cities for main countries)
export const citiesByCountry = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Seattle", "Boston", "Atlanta", "Miami"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool", "Edinburgh", "Bristol", "Leeds", "Newcastle", "Sheffield", "Belfast", "Cardiff", "Oxford", "Cambridge", "Southampton"],
  "Canada": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Quebec City", "Winnipeg", "Hamilton", "Halifax", "Victoria", "Mississauga", "Kitchener", "London", "St. John's"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart", "Geelong", "Townsville", "Cairns", "Darwin", "Toowoomba"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Saint-Etienne", "Le Havre", "Toulon"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"],
  "China": ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chengdu", "Tianjin", "Wuhan", "Dongguan", "Chongqing", "Nanjing", "Hangzhou", "Foshan", "Shenyang", "Xian", "Suzhou"],
  "Japan": ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Kobe", "Kyoto", "Fukuoka", "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", "Goiânia", "Guarulhos", "Campinas", "São Luís"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón"]
};

// Skills by job title mapping
export const skillsByJobTitle = {
  "Software Engineer": [
    "JavaScript", "React", "Node.js", "Python", "Java", "C++", "C#", 
    "AWS", "Docker", "Kubernetes", "Git", "SQL", "NoSQL", "REST API", 
    "GraphQL", "TypeScript", "Agile", "CI/CD", "Test-Driven Development"
  ],
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Vue.js", "Angular", "TypeScript",
    "Responsive Design", "SASS/SCSS", "Bootstrap", "Tailwind CSS", "Webpack",
    "Jest", "UI/UX", "Web Performance", "Browser APIs", "GraphQL"
  ],
  "Backend Developer": [
    "Node.js", "Python", "Java", "C#", "PHP", "Ruby", "Go",
    "Express.js", "Django", "Spring Boot", "ASP.NET", "Laravel",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "API Design",
    "Microservices", "Docker", "Kubernetes", "Authentication/Authorization"
  ],
  "Data Scientist": [
    "Python", "R", "SQL", "Machine Learning", "Deep Learning", "TensorFlow",
    "PyTorch", "Pandas", "NumPy", "SciPy", "Scikit-learn", "Data Visualization",
    "Tableau", "Power BI", "Statistics", "A/B Testing", "Big Data", "NLP",
    "Computer Vision", "Data Mining", "ETL", "Feature Engineering"
  ],
  "Product Manager": [
    "Product Strategy", "Market Research", "User Research", "Roadmapping",
    "Agile", "Scrum", "User Stories", "KPIs", "Analytics", "A/B Testing",
    "Wireframing", "Prototyping", "Stakeholder Management", "Communication",
    "Presentation Skills", "Prioritization", "Competitive Analysis", "JIRA"
  ],
  "UX Designer": [
    "User Research", "Wireframing", "Prototyping", "User Testing",
    "UI Design", "Figma", "Sketch", "Adobe XD", "Information Architecture",
    "Usability Testing", "Interaction Design", "Accessibility", "Design Systems",
    "User Flows", "Personas", "Journey Mapping", "Visual Design"
  ],
  "DevOps Engineer": [
    "Linux", "Bash", "Python", "Docker", "Kubernetes", "Terraform",
    "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "GitHub Actions",
    "Infrastructure as Code", "Monitoring", "Prometheus", "Grafana",
    "Log Management", "Security", "Networking", "Troubleshooting"
  ],
  "Data Analyst": [
    "SQL", "Python", "R", "Excel", "Data Visualization", "Tableau",
    "Power BI", "Google Analytics", "Statistics", "A/B Testing",
    "Data Cleaning", "ETL", "Reporting", "Dashboard Design",
    "Data Modeling", "Business Intelligence"
  ],
  // Add more job titles and skills as needed
};

// Add a default set of common skills for job titles not in the mapping
export const commonSkills = [
  "Communication", "Problem Solving", "Teamwork", "Time Management",
  "Leadership", "Critical Thinking", "Project Management", "Adaptability",
  "Microsoft Office", "Analytical Skills", "Customer Service", "Organization"
];