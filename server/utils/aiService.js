// AI service for analyzing resumes and matching with jobs
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const textract = require('textract');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Common tech skills to identify in resumes
const COMMON_SKILLS = [
  // Programming Languages
  'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust',
  'typescript', 'scala', 'perl', 'r', 'dart', 'bash', 'shell', 'sql', 'html', 'css',
  
  // Frameworks & Libraries
  'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'laravel',
  'asp.net', 'rails', 'jquery', 'bootstrap', 'tailwind', 'material-ui', 'next.js', 'nuxt',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
  
  // Databases
  'mysql', 'postgresql', 'mongodb', 'sqlite', 'oracle', 'sql server', 'dynamodb', 'redis',
  'cassandra', 'firebase', 'couchbase', 'neo4j', 'elasticsearch',
  
  // DevOps & Cloud
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'bitbucket',
  'terraform', 'ansible', 'puppet', 'chef', 'prometheus', 'grafana', 'heroku', 'vercel', 'netlify',
  
  // Tools & Platforms
  'git', 'jira', 'confluence', 'slack', 'trello', 'figma', 'sketch', 'adobe', 'photoshop',
  'illustrator', 'xd', 'webpack', 'babel', 'vite', 'linux', 'windows', 'macos',
  
  // Methodologies & Concepts
  'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'test-driven development', 'oop', 'functional programming',
  'microservices', 'restful api', 'graphql', 'serverless', 'soa', 'mvc', 'mvvm'
];

/**
 * Extract text from a resume file
 * @param {string} filePath - Path to the resume file
 * @returns {Promise<string>} Extracted text
 */
const extractResumeText = async (filePath) => {
  try {
    const fileExt = path.extname(filePath).toLowerCase();
    
    if (fileExt === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } else if (['.doc', '.docx'].includes(fileExt)) {
      return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (error, text) => {
          if (error) {
            reject(error);
          } else {
            resolve(text);
          }
        });
      });
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    throw error;
  }
};

/**
 * Extract skills from resume text
 * @param {string} text - Resume text content
 * @returns {string[]} Array of identified skills
 */
const extractSkills = (text) => {
  if (!text) return [];
  
  // Normalize text: lowercase and remove special characters
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Tokenize text into words and phrases
  const tokens = tokenizer.tokenize(normalizedText);
  
  // Extract n-grams (1-3 word phrases)
  const phrases = [];
  for (let i = 0; i < tokens.length; i++) {
    phrases.push(tokens[i]); // Unigram
    if (i < tokens.length - 1) {
      phrases.push(`${tokens[i]} ${tokens[i+1]}`); // Bigram
    }
    if (i < tokens.length - 2) {
      phrases.push(`${tokens[i]} ${tokens[i+1]} ${tokens[i+2]}`); // Trigram
    }
  }
  
  // Match phrases against skill list
  const skills = new Set();
  for (const phrase of phrases) {
    if (COMMON_SKILLS.includes(phrase)) {
      skills.add(phrase);
    }
  }
  
  // Extract skills from sections like "Skills" or "Technical Skills"
  const skillsRegex = /skills:?|technical skills:?|proficiencies:?|technologies:?/i;
  const sections = normalizedText.split('\n\n');
  
  for (const section of sections) {
    if (skillsRegex.test(section)) {
      // This looks like a skills section, extract more aggressively
      const sectionSkills = section
        .replace(skillsRegex, '')
        .split(/[,\n•●\-\+]/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 25); // Basic filtering
      
      for (const skill of sectionSkills) {
        if (COMMON_SKILLS.includes(skill.toLowerCase())) {
          skills.add(skill.toLowerCase());
        }
      }
    }
  }
  
  return Array.from(skills);
};

/**
 * Calculate similarity score between resume skills and job skills
 * @param {string[]} resumeSkills - Skills from resume
 * @param {string[]} jobSkills - Skills required for the job
 * @returns {number} Match score between 0 and 1
 */
const calculateSkillMatch = (resumeSkills, jobSkills) => {
  if (!resumeSkills.length || !jobSkills.length) return 0;
  
  // Count matching skills
  const matchingSkills = resumeSkills.filter(skill => 
    jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
  );
  
  // Calculate match score
  const matchScore = matchingSkills.length / jobSkills.length;
  
  return Math.min(1, matchScore); // Cap at 1 (100% match)
};

/**
 * Rank jobs based on resume skills match
 * @param {Object} resume - Resume data with extracted skills
 * @param {Array} jobs - Array of job objects
 * @returns {Array} Jobs ranked by match score
 */
const rankJobsBySkillMatch = (resumeSkills, jobs) => {
  if (!resumeSkills || !resumeSkills.length || !jobs || !jobs.length) {
    return jobs;
  }
  
  // Calculate match score for each job
  const scoredJobs = jobs.map(job => {
    const jobSkills = job.skills || [];
    const matchScore = calculateSkillMatch(resumeSkills, jobSkills);
    
    return {
      ...job,
      matchScore,
      isRecommended: matchScore >= 0.5 // Mark as recommended if 50%+ match
    };
  });
  
  // Sort by match score (highest first)
  return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = {
  extractResumeText,
  extractSkills,
  calculateSkillMatch,
  rankJobsBySkillMatch
};