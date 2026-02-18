import { migrateEntry, validateEntry } from './schema'

const STORAGE_KEY = 'placement-prep-history'

/**
 * Returns { list, skipped }. list is array of valid (migrated) entries.
 * skipped is number of entries that couldn't be loaded (corrupted). If skipped > 0, valid list is written back to localStorage.
 */
export function getHistory() {
  let list = []
  let skipped = 0
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { list: [], skipped: 0 }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { list: [], skipped: 0 }
    const cleaned = []
    for (const item of parsed) {
      try {
        const migrated = migrateEntry(item)
        if (migrated && validateEntry(migrated)) {
          cleaned.push(migrated)
        } else {
          skipped += 1
        }
      } catch {
        skipped += 1
      }
    }
    list = cleaned
    if (skipped > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
      } catch {
        // keep existing storage if write fails
      }
    }
  } catch {
    return { list: [], skipped: 0 }
  }
  return { list, skipped }
}

export function saveEntry(entry) {
  const { list } = getHistory()
  const newEntry = {
    ...entry,
    id: entry.id || (crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`),
    createdAt: entry.createdAt || new Date().toISOString(),
    updatedAt: entry.updatedAt || new Date().toISOString(),
  }
  list.unshift(newEntry)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return newEntry
  } catch {
    return null
  }
}

export function getEntryById(id) {
  const { list } = getHistory()
  const found = list.find((e) => e.id === id) ?? null
  if (!found) return null
  const migrated = migrateEntry(found)
  return migrated && validateEntry(migrated) ? migrated : null
}

/**
 * Update an existing history entry by id. Merges updates into the entry and persists.
 */
export function updateEntry(id, updates) {
  const { list } = getHistory()
  const index = list.findIndex((e) => e.id === id)
  if (index === -1) return null
  const updated = { ...list[index], ...updates }
  list[index] = updated
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return updated
  } catch {
    return null
  }
}
