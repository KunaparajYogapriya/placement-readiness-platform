/**
 * JD skill keywords by category (case-insensitive matching).
 * Order of keywords can matter for substring matches (e.g. "Next.js" before "Next").
 */
export const SKILL_CATEGORIES = {
  'Core CS': ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
  'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#', 'Go'],
  'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
  'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
  'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
  'Testing': ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest'],
}

const CATEGORY_ORDER = [
  'Core CS',
  'Languages',
  'Web',
  'Data',
  'Cloud/DevOps',
  'Testing',
]

/**
 * Extract skills from JD text (case-insensitive).
 * Returns { byCategory: { 'Core CS': ['DSA', 'OOP'], ... }, allSkills: [...], categoryNames: [...] }
 */
export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { byCategory: {}, allSkills: [], categoryNames: [] }
  }
  const lower = jdText.trim().toLowerCase()
  const byCategory = {}
  const allSkills = new Set()

  for (const cat of CATEGORY_ORDER) {
    const keywords = SKILL_CATEGORIES[cat]
    const found = []
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        found.push(kw)
        allSkills.add(kw)
      }
    }
    if (found.length) byCategory[cat] = found
  }

  return {
    byCategory,
    allSkills: Array.from(allSkills),
    categoryNames: Object.keys(byCategory),
  }
}

export function hasAnySkills(extraction) {
  return extraction.categoryNames.length > 0 || extraction.allSkills.length > 0
}
