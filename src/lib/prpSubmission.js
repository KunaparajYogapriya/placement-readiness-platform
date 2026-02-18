/**
 * Proof + Final Submission for Placement Readiness Platform.
 * Stores artifact links and step-visit flags. Does NOT bypass checklist lock.
 */

const STORAGE_KEY = 'prp_final_submission'
const STEPS_VISITED_KEY = 'prp_steps_visited'

const DEFAULT_LINKS = {
  lovableProject: '',
  githubRepo: '',
  deployedUrl: '',
}

/**
 * Valid URL: http(s) with host.
 * @param {string} url
 * @returns {boolean}
 */
export function validateUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return false
  try {
    const u = new URL(url.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * @returns {{ lovableProject: string, githubRepo: string, deployedUrl: string }}
 */
export function getSubmission() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_LINKS }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_LINKS }
    return {
      lovableProject: typeof parsed.lovableProject === 'string' ? parsed.lovableProject.trim() : '',
      githubRepo: typeof parsed.githubRepo === 'string' ? parsed.githubRepo.trim() : '',
      deployedUrl: typeof parsed.deployedUrl === 'string' ? parsed.deployedUrl.trim() : '',
    }
  } catch {
    return { ...DEFAULT_LINKS }
  }
}

/**
 * @param {{ lovableProject?: string, githubRepo?: string, deployedUrl?: string }} links
 */
export function setSubmission(links) {
  const current = getSubmission()
  const next = {
    lovableProject: typeof links.lovableProject === 'string' ? links.lovableProject.trim() : current.lovableProject,
    githubRepo: typeof links.githubRepo === 'string' ? links.githubRepo.trim() : current.githubRepo,
    deployedUrl: typeof links.deployedUrl === 'string' ? links.deployedUrl.trim() : current.deployedUrl,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

/**
 * @returns {{ dashboard: boolean, practice: boolean, assessments: boolean }}
 */
export function getVisitedSteps() {
  try {
    const raw = localStorage.getItem(STEPS_VISITED_KEY)
    if (!raw) return { dashboard: false, practice: false, assessments: false }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { dashboard: false, practice: false, assessments: false }
    return {
      dashboard: Boolean(parsed.dashboard),
      practice: Boolean(parsed.practice),
      assessments: Boolean(parsed.assessments),
    }
  } catch {
    return { dashboard: false, practice: false, assessments: false }
  }
}

/**
 * Call when user visits a step. step = 'dashboard' | 'practice' | 'assessments'
 * @param {'dashboard' | 'practice' | 'assessments'} step
 */
export function markStepVisited(step) {
  const current = getVisitedSteps()
  if (!['dashboard', 'practice', 'assessments'].includes(step)) return
  current[step] = true
  try {
    localStorage.setItem(STEPS_VISITED_KEY, JSON.stringify(current))
  } catch {
    // ignore
  }
}

/**
 * Returns completion status for all 8 steps.
 * Requires getHistory from history.js and getAllPassed from testChecklist.js to be injected or imported where used.
 * @param {{ historyCount: number, checklistAllPassed: boolean }} deps
 * @returns {{ step1: boolean, step2: boolean, step3: boolean, step4: boolean, step5: boolean, step6: boolean, step7: boolean, step8: boolean }}
 */
export function getStepStatus(deps) {
  const { historyCount = 0, checklistAllPassed = false } = deps || {}
  const visited = getVisitedSteps()
  const submission = getSubmission()
  const hasHistory = historyCount > 0
  const link1 = validateUrl(submission.lovableProject)
  const link2 = validateUrl(submission.githubRepo)
  const link3 = validateUrl(submission.deployedUrl)
  const allLinksProvided = link1 && link2 && link3

  return {
    step1: visited.dashboard,
    step2: hasHistory,
    step3: hasHistory,
    step4: hasHistory,
    step5: visited.practice,
    step6: visited.assessments,
    step7: checklistAllPassed,
    step8: allLinksProvided,
  }
}

/**
 * Shipped ONLY IF: all 8 steps completed AND all 10 checklist items passed AND all 3 proof links provided.
 * @param {{ historyCount: number, checklistAllPassed: boolean }} deps
 */
export function isShipped(deps) {
  const status = getStepStatus(deps)
  return (
    status.step1 &&
    status.step2 &&
    status.step3 &&
    status.step4 &&
    status.step5 &&
    status.step6 &&
    status.step7 &&
    status.step8
  )
}

const STEP_LABELS = [
  'Dashboard',
  'Analyze JD',
  'Results',
  'History',
  'Practice',
  'Assessments',
  'Test checklist (10/10)',
  'Proof (3 links)',
]

export function getStepLabels() {
  return STEP_LABELS
}

/**
 * Build the final submission text for copy.
 * @param {{ lovableProject: string, githubRepo: string, deployedUrl: string }} links
 */
export function buildFinalSubmissionText(links) {
  const lovable = links?.lovableProject?.trim() || ''
  const github = links?.githubRepo?.trim() || ''
  const deployed = links?.deployedUrl?.trim() || ''
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${lovable}
GitHub Repository: ${github}
Live Deployment: ${deployed}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`
}
