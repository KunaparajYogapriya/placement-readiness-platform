/**
 * Built-in Test Checklist for Placement Readiness Platform.
 * Stored in localStorage; persists across sessions.
 */

const STORAGE_KEY = 'prp-test-checklist'

export const TEST_ITEMS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'On Analyze page, click Analyze with empty JD; you must see an error and no analysis runs.',
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Paste fewer than 200 characters in the JD field; the amber warning should appear (analysis still runs).',
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Analyze a JD with known tech (e.g. React, DSA); Results should show skills under correct categories (Web, Core CS, etc.).',
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Run analyses with different company/skills; Round mapping section should reflect enterprise vs startup and skill focus.',
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Same JD and inputs should produce the same baseScore; toggles change finalScore by +2/-2 per skill.',
  },
  {
    id: 'skill-toggles-live',
    label: 'Skill toggles update score live',
    hint: 'On Results, toggle a skill between Know/Practice; the readiness circle and percentage should update immediately.',
  },
  {
    id: 'persist-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle some skills, refresh the page, reopen the same result; finalScore and toggles should be unchanged.',
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Run an analysis, go to History; entry appears. Click it to open Results; data should match.',
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Use Copy plan, Copy checklist, Copy questions, or Download .txt; pasted/downloaded content should match the displayed data.',
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open DevTools Console; visit Dashboard, Analyze, run analysis, Results, History; there should be no red errors.',
  },
]

const defaultState = () =>
  Object.fromEntries(TEST_ITEMS.map(({ id }) => [id, false]))

/**
 * @returns {{ [id: string]: boolean }}
 */
export function getChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return defaultState()
    const state = { ...defaultState(), ...parsed }
    // only keep keys that are valid test ids
    const valid = TEST_ITEMS.map((t) => t.id)
    return Object.fromEntries(
      valid.map((id) => [id, Boolean(state[id])])
    )
  } catch {
    return defaultState()
  }
}

/**
 * @param {string} id - test item id
 * @param {boolean} checked
 */
export function setChecklistItem(id, checked) {
  const state = getChecklist()
  if (!TEST_ITEMS.some((t) => t.id === id)) return
  state[id] = checked
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function resetChecklist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState()))
  } catch {
    // ignore
  }
}

export function getAllPassed() {
  const state = getChecklist()
  return TEST_ITEMS.every(({ id }) => state[id] === true)
}
