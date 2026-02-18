import { extractSkills, SKILL_CATEGORIES, hasAnySkills } from './skillKeywords'

/**
 * Round-wise checklist (5–8 items per round) based on detected skills.
 */
export function generateChecklist(extraction) {
  const { byCategory, categoryNames } = extraction
  const hasDSA = byCategory['Core CS']?.includes('DSA') ?? categoryNames.includes('Core CS')
  const hasWeb = categoryNames.includes('Web')
  const hasData = categoryNames.includes('Data')
  const hasCloud = categoryNames.includes('Cloud/DevOps')
  const hasTesting = categoryNames.includes('Testing')
  const langList = byCategory['Languages'] || []

  const round1 = [
    'Brush up on quantitative aptitude (time-speed-distance, ratios, percentages).',
    'Revise verbal reasoning and logical reasoning basics.',
    'Practice timed aptitude tests (15–20 min).',
    'Review basic CS fundamentals (binary, complexity).',
    'Prepare a short self-introduction (1–2 min).',
  ]
  if (categoryNames.length > 0) {
    round1.push('Align your resume with the JD keywords.')
    round1.push('List 2–3 projects that match the role.')
  }
  if (langList.length) {
    round1.push(`Focus on ${langList.slice(0, 2).join(' and ')} syntax and common patterns.`)
  }

  const round2 = [
    'Revise arrays, strings, hash maps, and two pointers.',
    'Practice 2–3 problems each on arrays and strings.',
  ]
  if (hasDSA) {
    round2.push('Revise trees and graphs (BFS/DFS).')
    round2.push('Practice one medium tree/graph problem.')
  }
  if (byCategory['Core CS']?.length) {
    round2.push('Revise OOP concepts (if applicable): encapsulation, inheritance, polymorphism.')
    round2.push('Revise DBMS basics: normalization, indexes, transactions.')
    round2.push('Revise OS: processes, threads, scheduling.')
  }
  round2.push('Practice explaining your approach aloud.')

  const round3 = [
    'Prepare 2–3 project deep-dives (stack, your role, challenges).',
    'Align project tech stack with JD (mention same tools).',
  ]
  if (hasWeb) {
    round3.push('Prepare answers on state management and component design (if React in JD).')
    round3.push('Revise REST/API design and status codes.')
  }
  if (hasData) {
    round3.push('Prepare SQL examples (joins, aggregation) and when to use NoSQL vs SQL.')
  }
  if (hasCloud) {
    round3.push('Prepare 1–2 examples of deployment or cloud concepts you know.')
  }
  round3.push('Prepare “Tell me about yourself” and “Why this company?”.')

  const round4 = [
    'Prepare STAR-formatted behavioral examples (2–3).',
    'Prepare questions to ask the interviewer (2–3).',
    'Review company values and recent news.',
    'Practice confidence and clarity in answers.',
    'Prepare for salary/expectations if applicable.',
  ]
  if (hasAnySkills(extraction)) {
    round4.push('Summarize your strongest skill area and one improvement area.')
  }

  return [
    { round: 'Round 1: Aptitude / Basics', items: round1.slice(0, 8) },
    { round: 'Round 2: DSA + Core CS', items: round2.slice(0, 8) },
    { round: 'Round 3: Tech interview (projects + stack)', items: round3.slice(0, 8) },
    { round: 'Round 4: Managerial / HR', items: round4.slice(0, 8) },
  ]
}

/**
 * 7-day plan; adapt based on detected skills.
 */
export function generatePlan(extraction) {
  const { categoryNames, byCategory } = extraction
  const hasReact = byCategory['Web']?.some((s) => /react/i.test(s))
  const hasDSA = categoryNames.includes('Core CS') || extraction.allSkills.some((s) => s === 'DSA')
  const hasData = categoryNames.includes('Data')
  const hasWeb = categoryNames.includes('Web')

  const day1_2 = [
    'Revise core CS: OS (processes, threads), DBMS (ACID, indexes), Networks (TCP, HTTP).',
    'Brush up on OOP and basic data structures (array, linked list, stack, queue).',
  ]
  const day3_4 = [
    'DSA: arrays, strings, hash map, two pointers.',
    'Solve 3–5 problems on the above topics.',
    hasDSA ? 'Add trees/graphs and 1–2 problems.' : null,
  ].filter(Boolean)
  const day5 = [
    'List projects that match the JD stack.',
    'Prepare 2–3 project deep-dives (problem, solution, your role, metrics).',
    'Align resume bullet points with JD keywords.',
  ]
  const day6 = [
    'Practice mock tech questions (out loud).',
    'Prepare “Tell me about yourself” and “Why us?”.',
  ]
  if (hasReact) day6.push('Revise React: lifecycle, hooks, state management.')
  if (hasData) day6.push('Prepare SQL/NoSQL discussion and 1–2 example queries.')
  const day7 = [
    'Revision: weak areas from the week.',
    'Light revision of key concepts; avoid new topics.',
    'Rest and stay calm.',
  ]

  return [
    { day: 'Day 1–2', title: 'Basics + core CS', items: day1_2 },
    { day: 'Day 3–4', title: 'DSA + coding practice', items: day3_4 },
    { day: 'Day 5', title: 'Project + resume alignment', items: day5 },
    { day: 'Day 6', title: 'Mock interview questions', items: day6 },
    { day: 'Day 7', title: 'Revision + weak areas', items: day7 },
  ]
}

/**
 * 10 likely interview questions based on detected skills.
 */
export function generateQuestions(extraction) {
  const { byCategory, allSkills } = extraction
  const questions = []

  if (allSkills.some((s) => /DSA|data structure|algorithm/i.test(s)) || byCategory['Core CS']?.length) {
    questions.push('How would you optimize search in sorted data? Discuss time/space tradeoffs.')
    questions.push('Explain when you would use a hash map vs an array for a problem.')
  }
  if (byCategory['Data']?.some((s) => /sql|mysql|postgres/i.test(s))) {
    questions.push('Explain indexing and when it helps. What are clustered vs non-clustered indexes?')
    questions.push('How would you design a schema for a given use case?')
  }
  if (byCategory['Web']?.some((s) => /react/i.test(s))) {
    questions.push('Explain state management options in React (local state, Context, external store).')
    questions.push('How do you optimize re-renders in a React application?')
  }
  if (byCategory['Web']?.length) {
    questions.push('Explain REST principles and when you would choose REST vs GraphQL.')
  }
  if (byCategory['Core CS']?.length) {
    questions.push('Explain the difference between process and thread. When would you use multithreading?')
    questions.push('Explain ACID in databases and why it matters.')
  }
  if (byCategory['Cloud/DevOps']?.length) {
    questions.push('Explain how you would deploy an application and what you would monitor.')
  }
  if (byCategory['Languages']?.length) {
    questions.push('What are the main strengths of your primary language for this role?')
  }

  const generic = [
    'Tell me about a challenging bug you fixed and how you approached it.',
    'Describe a project where you had to learn something new quickly.',
    'How do you handle disagreements in a team?',
    'Where do you see yourself in 2–3 years?',
    'What is your biggest weakness and how are you working on it?',
  ]
  for (let i = 0; questions.length < 10; i++) {
    questions.push(generic[i % generic.length])
  }
  return questions.slice(0, 10)
}

/**
 * Readiness score 0–100.
 * Start 35, +5 per category (max 30), +10 company, +10 role, +10 if JD length > 800.
 */
export function computeReadinessScore(company, role, jdText, categoryCount) {
  let score = 35
  score += Math.min(6, categoryCount) * 5 // max 30
  if (company?.trim()) score += 10
  if (role?.trim()) score += 10
  if (jdText?.trim().length > 800) score += 10
  return Math.min(100, Math.max(0, score))
}

const ENTERPRISE_NAMES = [
  'amazon', 'microsoft', 'google', 'meta', 'apple', 'infosys', 'tcs', 'wipro', 'hcl',
  'accenture', 'capgemini', 'cognizant', 'ibm', 'oracle', 'sap', 'salesforce', 'adobe',
  'netflix', 'uber', 'flipkart', 'paytm', 'zoho', 'freshworks', 'thoughtworks',
]
const LOWER = (s) => (s || '').trim().toLowerCase()

function inferIndustry(jdText) {
  if (!jdText || typeof jdText !== 'string') return 'Technology Services'
  const lower = jdText.trim().toLowerCase()
  if (/\b(finance|banking|investment|fintech)\b/.test(lower)) return 'Financial Services'
  if (/\b(healthcare|health|medical|pharma)\b/.test(lower)) return 'Healthcare'
  if (/\b(retail|ecommerce|e-commerce)\b/.test(lower)) return 'Retail / E-commerce'
  return 'Technology Services'
}

/**
 * Company Intel: name, industry, size category, typical hiring focus.
 * Only call when company is provided.
 */
export function getCompanyIntel(company, jdText) {
  if (!company?.trim()) return null
  const name = company.trim()
  const lowerName = LOWER(name)
  const isEnterprise = ENTERPRISE_NAMES.some((n) => lowerName.includes(n))
  const sizeCategory = isEnterprise ? 'Enterprise (2000+)' : 'Startup (<200)'
  const industry = inferIndustry(jdText)
  const typicalHiringFocus = isEnterprise
    ? 'Structured DSA and core CS fundamentals; emphasis on scalability and process.'
    : 'Practical problem-solving and stack depth; ability to ship quickly.'
  return {
    companyName: name,
    industry,
    sizeCategory,
    typicalHiringFocus,
    isEnterprise,
  }
}

/**
 * Round mapping: dynamic rounds with titles and "why this round matters".
 * Based on company size and detected skills.
 */
export function getRoundMapping(extraction, companyIntel) {
  const size = companyIntel?.isEnterprise ? 'enterprise' : 'startup'
  const { categoryNames, byCategory } = extraction || {}
  const hasDSA = byCategory?.['Core CS']?.includes('DSA') || categoryNames?.includes('Core CS')
  const hasWeb = categoryNames?.includes('Web')
  const hasReactNode = hasWeb && (byCategory?.['Web']?.some((s) => /react|node/i.test(s)) ?? false)

  if (size === 'enterprise' && hasDSA) {
    return [
      { round: 1, title: 'Online Test (DSA + Aptitude)', whyMatters: 'Filters for problem-solving speed and basic aptitude before technical depth.' },
      { round: 2, title: 'Technical (DSA + Core CS)', whyMatters: 'Validates data structures, algorithms, and core CS fundamentals.' },
      { round: 3, title: 'Tech + Projects', whyMatters: 'Assesses real-world application and system design thinking.' },
      { round: 4, title: 'HR', whyMatters: 'Fit, motivation, and long-term alignment with company values.' },
    ]
  }
  if (size === 'startup' && hasReactNode) {
    return [
      { round: 1, title: 'Practical coding', whyMatters: 'Tests ability to write working code in the stack they use daily.' },
      { round: 2, title: 'System discussion', whyMatters: 'Evaluates how you think about design and tradeoffs.' },
      { round: 3, title: 'Culture fit', whyMatters: 'Ensures alignment with small-team dynamics and ownership.' },
    ]
  }
  if (size === 'enterprise') {
    return [
      { round: 1, title: 'Aptitude / Online test', whyMatters: 'Initial screening for quantitative and logical ability.' },
      { round: 2, title: 'Technical (Core + DSA)', whyMatters: 'Deep dive into fundamentals and coding.' },
      { round: 3, title: 'Technical (Projects / Design)', whyMatters: 'Application of skills to real scenarios.' },
      { round: 4, title: 'HR', whyMatters: 'Behavioral fit and career expectations.' },
    ]
  }
  // default startup / generic
  return [
    { round: 1, title: 'Screening / Coding', whyMatters: 'Quick check on coding ability and basics.' },
    { round: 2, title: 'Technical deep-dive', whyMatters: 'Deeper problem-solving and system thinking.' },
    { round: 3, title: 'Team / Culture fit', whyMatters: 'How you work with the team and handle ambiguity.' },
  ]
}

export function runFullAnalysis(company, role, jdText) {
  const extraction = extractSkills(jdText)
  const categoryCount = extraction.categoryNames.length
  const companyIntel = getCompanyIntel(company, jdText)
  const roundMapping = getRoundMapping(extraction, companyIntel)
  return {
    extractedSkills: extraction,
    checklist: generateChecklist(extraction),
    plan: generatePlan(extraction),
    questions: generateQuestions(extraction),
    readinessScore: computeReadinessScore(company, role, jdText, categoryCount),
    companyIntel: companyIntel || undefined,
    roundMapping,
  }
}
