/**
 * Canonical analysis entry schema and normalization.
 * Every saved entry has these fields (even if empty).
 */

const DEFAULT_OTHER_SKILLS = ['Communication', 'Problem solving', 'Basic coding', 'Projects']

const EMPTY_EXTRACTED_SKILLS = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: [],
}

function toStandardExtractedSkills(extraction) {
  const by = extraction?.byCategory ?? {}
  const coreCS = by['Core CS'] ?? []
  const languages = by['Languages'] ?? []
  const web = by['Web'] ?? []
  const data = by['Data'] ?? []
  const cloud = by['Cloud/DevOps'] ?? []
  const testing = by['Testing'] ?? []
  const hasAny = [coreCS, languages, web, data, cloud, testing].some((arr) => arr?.length > 0)
  return {
    coreCS: Array.isArray(coreCS) ? coreCS : [],
    languages: Array.isArray(languages) ? languages : [],
    web: Array.isArray(web) ? web : [],
    data: Array.isArray(data) ? data : [],
    cloud: Array.isArray(cloud) ? cloud : [],
    testing: Array.isArray(testing) ? testing : [],
    other: hasAny ? [] : [...DEFAULT_OTHER_SKILLS],
  }
}

function toStandardRoundMapping(roundMapping) {
  if (!Array.isArray(roundMapping)) return []
  return roundMapping.map((r, i) => ({
    round: r.round ?? i + 1,
    roundTitle: r.roundTitle ?? r.title ?? `Round ${r.round ?? i + 1}`,
    focusAreas: Array.isArray(r.focusAreas) ? r.focusAreas : [r.title ?? r.roundTitle ?? ''],
    whyItMatters: r.whyItMatters ?? r.whyMatters ?? '',
  }))
}

function toStandardChecklist(checklist) {
  if (!Array.isArray(checklist)) return []
  return checklist.map((c) => ({
    roundTitle: c.roundTitle ?? c.round ?? '',
    items: Array.isArray(c.items) ? c.items : [],
  }))
}

function toStandardPlan7Days(plan) {
  if (!Array.isArray(plan)) return []
  return plan.map((p) => ({
    day: p.day ?? '',
    focus: p.focus ?? p.title ?? '',
    tasks: Array.isArray(p.tasks) ? p.tasks : Array.isArray(p.items) ? p.items : [],
  }))
}

/**
 * Build canonical entry from runFullAnalysis output (and optional existing skillConfidenceMap).
 */
export function normalizeAnalysisEntry(raw, company, role, jdText, existingSkillConfidenceMap = {}) {
  const now = new Date().toISOString()
  const extractedSkills = toStandardExtractedSkills(raw.extractedSkills ?? {})
  const baseScore = typeof raw.readinessScore === 'number' ? raw.readinessScore : 0
  const skillConfidenceMap = existingSkillConfidenceMap && typeof existingSkillConfidenceMap === 'object'
    ? existingSkillConfidenceMap
    : {}
  const allSkillKeys = [
    ...extractedSkills.coreCS,
    ...extractedSkills.languages,
    ...extractedSkills.web,
    ...extractedSkills.data,
    ...extractedSkills.cloud,
    ...extractedSkills.testing,
    ...extractedSkills.other,
  ]
  let finalScore = baseScore
  allSkillKeys.forEach((s) => {
    if (skillConfidenceMap[s] === 'know') finalScore += 2
    else finalScore -= 2
  })
  finalScore = Math.min(100, Math.max(0, finalScore))

  return {
    id: raw.id || undefined,
    createdAt: raw.createdAt || now,
    company: company != null ? String(company).trim() : '',
    role: role != null ? String(role).trim() : '',
    jdText: typeof jdText === 'string' ? jdText : '',
    extractedSkills,
    roundMapping: toStandardRoundMapping(raw.roundMapping),
    checklist: toStandardChecklist(raw.checklist),
    plan7Days: toStandardPlan7Days(raw.plan ?? raw.plan7Days),
    questions: Array.isArray(raw.questions) ? raw.questions : [],
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt: now,
    companyIntel: raw.companyIntel ?? undefined,
  }
}

/**
 * Migrate old entry shape to canonical. Safe to call on already-canonical entries.
 */
export function migrateEntry(entry) {
  if (!entry || typeof entry !== 'object') return null
  const by = entry.extractedSkills?.byCategory
  const hasOldShape = by && typeof by === 'object'
  const extractedSkills = hasOldShape
    ? toStandardExtractedSkills(entry.extractedSkills)
    : (entry.extractedSkills && typeof entry.extractedSkills === 'object'
        ? {
            coreCS: entry.extractedSkills.coreCS ?? [],
            languages: entry.extractedSkills.languages ?? [],
            web: entry.extractedSkills.web ?? [],
            data: entry.extractedSkills.data ?? [],
            cloud: entry.extractedSkills.cloud ?? [],
            testing: entry.extractedSkills.testing ?? [],
            other: entry.extractedSkills.other ?? [],
          }
        : { ...EMPTY_EXTRACTED_SKILLS })

  const checklist = toStandardChecklist(entry.checklist)
  const plan7Days = toStandardPlan7Days(entry.plan7Days ?? entry.plan)
  const roundMapping = toStandardRoundMapping(entry.roundMapping)
  const baseScore = typeof entry.baseScore === 'number' ? entry.baseScore : (entry.readinessScore ?? 0)
  const skillConfidenceMap = entry.skillConfidenceMap && typeof entry.skillConfidenceMap === 'object'
    ? entry.skillConfidenceMap
    : {}
  const allSkillKeys = [
    ...(extractedSkills.coreCS || []),
    ...(extractedSkills.languages || []),
    ...(extractedSkills.web || []),
    ...(extractedSkills.data || []),
    ...(extractedSkills.cloud || []),
    ...(extractedSkills.testing || []),
    ...(extractedSkills.other || []),
  ]
  let finalScore = baseScore
  allSkillKeys.forEach((s) => {
    if (skillConfidenceMap[s] === 'know') finalScore += 2
    else finalScore -= 2
  })
  finalScore = Math.min(100, Math.max(0, finalScore))

  return {
    id: entry.id,
    createdAt: entry.createdAt || new Date().toISOString(),
    company: entry.company != null ? String(entry.company).trim() : '',
    role: entry.role != null ? String(entry.role).trim() : '',
    jdText: typeof entry.jdText === 'string' ? entry.jdText : '',
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions: Array.isArray(entry.questions) ? entry.questions : [],
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt: entry.updatedAt || entry.createdAt || new Date().toISOString(),
    companyIntel: entry.companyIntel,
  }
}

/**
 * Validate entry has required fields. Returns true if valid.
 */
export function validateEntry(entry) {
  if (!entry || typeof entry !== 'object') return false
  if (!entry.id || typeof entry.jdText !== 'string') return false
  const es = entry.extractedSkills
  if (!es || typeof es !== 'object') return false
  const keys = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other']
  for (const k of keys) {
    if (!Array.isArray(es[k])) return false
  }
  if (typeof entry.baseScore !== 'number') return false
  if (typeof entry.finalScore !== 'number') return false
  return true
}

/**
 * Compute finalScore from baseScore and skillConfidenceMap for a canonical extractedSkills.
 */
export function computeFinalScore(baseScore, extractedSkills, skillConfidenceMap) {
  const all = [
    ...(extractedSkills?.coreCS ?? []),
    ...(extractedSkills?.languages ?? []),
    ...(extractedSkills?.web ?? []),
    ...(extractedSkills?.data ?? []),
    ...(extractedSkills?.cloud ?? []),
    ...(extractedSkills?.testing ?? []),
    ...(extractedSkills?.other ?? []),
  ]
  let score = typeof baseScore === 'number' ? baseScore : 0
  all.forEach((s) => {
    if (skillConfidenceMap[s] === 'know') score += 2
    else score -= 2
  })
  return Math.min(100, Math.max(0, score))
}
