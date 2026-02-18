import { useSearchParams, Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getEntryById, getHistory, updateEntry } from '../lib/history'
import { computeFinalScore } from '../lib/schema'

const CATEGORY_LABELS = { coreCS: 'Core CS', languages: 'Languages', web: 'Web', data: 'Data', cloud: 'Cloud/DevOps', testing: 'Testing', other: 'Other' }

function getAllSkillsCanonical(extractedSkills) {
  if (!extractedSkills || typeof extractedSkills !== 'object') return []
  const arr = [
    ...(extractedSkills.coreCS ?? []),
    ...(extractedSkills.languages ?? []),
    ...(extractedSkills.web ?? []),
    ...(extractedSkills.data ?? []),
    ...(extractedSkills.cloud ?? []),
    ...(extractedSkills.testing ?? []),
    ...(extractedSkills.other ?? []),
  ]
  return Array.isArray(arr) ? arr : []
}

function safeHasSkillsCanonical(extractedSkills) {
  return getAllSkillsCanonical(extractedSkills).length > 0
}

function buildPlanText(plan7Days) {
  if (!plan7Days?.length) return ''
  return plan7Days
    .map((p) => `${p.day}: ${p.focus ?? p.title ?? ''}\n${(p.tasks ?? p.items ?? []).map((i) => `  • ${i}`).join('\n')}`)
    .join('\n\n')
}

function buildChecklistText(checklist) {
  if (!checklist?.length) return ''
  return checklist
    .map((r) => `${r.roundTitle ?? r.round ?? ''}\n${(r.items ?? []).map((i) => `  • ${i}`).join('\n')}`)
    .join('\n\n')
}

function buildQuestionsText(questions) {
  if (!questions?.length) return ''
  return (questions.slice(0, 10) || []).map((q, i) => `${i + 1}. ${q}`).join('\n')
}

export default function Results() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [copyFeedback, setCopyFeedback] = useState('')

  const loadEntry = useCallback(() => {
    if (id) {
      const found = getEntryById(id)
      setEntry(found ? { ...found } : null)
    } else {
      const { list } = getHistory()
      setEntry(list.length ? { ...list[0] } : null)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadEntry()
  }, [loadEntry])

  const persistConfidence = useCallback(
    (skillConfidenceMap) => {
      if (!entry?.id) return
      const finalScore = computeFinalScore(entry.baseScore ?? entry.readinessScore ?? 0, entry.extractedSkills, skillConfidenceMap)
      const updatedAt = new Date().toISOString()
      const updated = updateEntry(entry.id, { skillConfidenceMap, finalScore, updatedAt })
      if (updated) setEntry(updated)
    },
    [entry?.id, entry?.baseScore, entry?.readinessScore, entry?.extractedSkills],
  )

  const getConfidence = (skill) => {
    const map = entry?.skillConfidenceMap ?? {}
    return map[skill] === 'know' ? 'know' : 'practice'
  }

  const toggleConfidence = (skill) => {
    if (!entry) return
    const next = getConfidence(skill) === 'know' ? 'practice' : 'know'
    const map = { ...(entry.skillConfidenceMap ?? {}), [skill]: next }
    setEntry((prev) => (prev ? { ...prev, skillConfidenceMap: map } : prev))
    persistConfidence(map)
  }

  const showCopyFeedback = (label) => {
    setCopyFeedback(label)
    setTimeout(() => setCopyFeedback(''), 2000)
  }

  const copyToClipboard = (text, label) => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => showCopyFeedback(label))
  }

  const downloadTxt = () => {
    if (!entry) return
    const { company, role, extractedSkills, checklist, plan7Days, plan, questions } = entry
    const planData = plan7Days ?? plan
    const skillsText = safeHasSkillsCanonical(extractedSkills)
      ? Object.entries(CATEGORY_LABELS)
          .map(([key, label]) => {
            const arr = extractedSkills?.[key]
            return Array.isArray(arr) && arr.length ? `${label}: ${arr.join(', ')}` : ''
          })
          .filter(Boolean)
          .join('\n')
      : 'No skills detected (general fresher stack).'
    const lines = [
      'Placement Readiness — Export',
      company || role ? `\n${[company, role].filter(Boolean).join(' · ')}` : '',
      '\n--- Key skills ---',
      skillsText || 'No skills detected (general fresher stack).',
      '\n--- Round-wise checklist ---',
      buildChecklistText(checklist) || '(none)',
      '\n--- 7-day plan ---',
      buildPlanText(planData) || '(none)',
      '\n--- 10 likely questions ---',
      buildQuestionsText(questions) || '(none)',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `placement-readiness-${entry.id?.slice(0, 8) ?? 'export'}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  if (loading) {
    return <div className="text-gray-600">Loading…</div>
  }
  if (!entry) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">No analysis found. Run an analysis first.</p>
        <Link
          to="/dashboard/analyze"
          className="inline-block px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover"
        >
          Analyze JD
        </Link>
      </div>
    )
  }

  const {
    company,
    role,
    extractedSkills,
    checklist,
    plan7Days,
    plan,
    questions,
    baseScore,
    readinessScore,
    finalScore: storedFinalScore,
    createdAt,
    companyIntel,
    roundMapping,
  } = entry

  const allSkills = getAllSkillsCanonical(extractedSkills)
  const knowCount = allSkills.filter((s) => getConfidence(s) === 'know').length
  const practiceCount = allSkills.filter((s) => getConfidence(s) === 'practice').length
  const finalScore = Math.min(
    100,
    Math.max(0, storedFinalScore ?? (baseScore ?? readinessScore ?? 0) + knowCount * 2 - practiceCount * 2),
  )
  const circumference = 2 * Math.PI * 48
  const offset = circumference * (1 - finalScore / 100)

  const weakSkills = allSkills.filter((s) => getConfidence(s) === 'practice').slice(0, 3)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Analysis results</h2>
          <p className="text-gray-600 text-sm">
            {[company, role].filter(Boolean).join(' · ') || 'Job description analysis'}
            {' · '}
            {createdAt ? new Date(createdAt).toLocaleDateString() : 'Saved'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="48" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="hsl(245, 58%, 51%)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{finalScore}</span>
              <span className="text-xs text-gray-500">Readiness</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Intel — only when company provided */}
      {company && (companyIntel || entry.companyIntel) && (
        <Card>
          <CardHeader>
            <CardTitle>Company intel</CardTitle>
            <CardDescription>Heuristic-based; use as a starting point</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Company</span>
              <p className="font-medium text-gray-900">{(companyIntel || entry.companyIntel).companyName}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Industry</span>
              <p className="text-gray-700 text-sm">{(companyIntel || entry.companyIntel).industry}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Estimated size</span>
              <p className="text-gray-700 text-sm">{(companyIntel || entry.companyIntel).sizeCategory}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">Typical hiring focus</span>
              <p className="text-gray-700 text-sm">{(companyIntel || entry.companyIntel).typicalHiringFocus}</p>
            </div>
            <p className="text-xs text-gray-500 pt-1 border-t border-gray-100">
              Demo Mode: Company intel generated heuristically.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Round mapping — vertical timeline */}
      {(roundMapping?.length || entry.roundMapping?.length) && (
        <Card>
          <CardHeader>
            <CardTitle>Round mapping</CardTitle>
            <CardDescription>Likely interview flow based on company and skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {((roundMapping || entry.roundMapping) || []).map((r, i) => (
                <div key={r.round ?? i} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold">
                      {r.round ?? i + 1}
                    </div>
                    {i < (roundMapping || entry.roundMapping).length - 1 && (
                      <div className="w-0.5 min-h-[32px] bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className={i < (roundMapping || entry.roundMapping).length - 1 ? 'pb-4' : ''}>
                    <p className="font-medium text-gray-900">{r.roundTitle ?? r.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{r.whyItMatters ?? r.whyMatters}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key skills extracted — interactive toggles */}
      <Card>
        <CardHeader>
          <CardTitle>Key skills extracted</CardTitle>
          <CardDescription>Mark each skill. Score updates in real time.</CardDescription>
        </CardHeader>
        <CardContent>
          {safeHasSkillsCanonical(extractedSkills) ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                const skills = Array.isArray(extractedSkills?.[key]) ? extractedSkills[key] : []
                if (!skills.length) return null
                return (
                <div key={key} className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
                  {skills.map((s) => {
                    const conf = getConfidence(s)
                    return (
                      <div
                        key={s}
                        className="inline-flex items-center rounded-md border border-gray-200 overflow-hidden"
                      >
                        <span
                          className={`px-2 py-0.5 text-sm font-medium ${
                            conf === 'know'
                              ? 'bg-primary/15 text-primary'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {s}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleConfidence(s)}
                          className={`px-2 py-0.5 text-xs font-medium border-l border-gray-200 ${
                            conf === 'know'
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                          title={conf === 'know' ? 'Switch to Need practice' : 'Switch to I know this'}
                        >
                          {conf === 'know' ? 'I know' : 'Practice'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )
              })}
            </div>
          ) : (
            <p className="text-gray-600">General fresher stack (no specific keywords detected).</p>
          )}
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Copy or download as plain text</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copyToClipboard(buildPlanText(plan7Days ?? plan), '7-day plan')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Copy 7-day plan
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(buildChecklistText(checklist), 'Checklist')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Copy round checklist
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(buildQuestionsText(questions), '10 questions')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Copy 10 questions
          </button>
          <button
            type="button"
            onClick={downloadTxt}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Download as TXT
          </button>
          {copyFeedback && (
            <span className="text-sm text-gray-500 self-center ml-2">Copied: {copyFeedback}</span>
          )}
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise preparation checklist</CardTitle>
          <CardDescription>Template-based; adapt to your timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(checklist || []).map((r, idx) => (
            <div key={r.roundTitle ?? r.round ?? idx}>
              <h4 className="font-semibold text-gray-900 mb-2">{r.roundTitle ?? r.round}</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                {(r.items || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-day plan</CardTitle>
          <CardDescription>Adapted to detected skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {((plan7Days ?? plan) || []).map((p, idx) => (
            <div key={p.day ?? idx}>
              <h4 className="font-semibold text-gray-900">
                {p.day}: {p.focus ?? p.title}
              </h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm mt-1">
                {((p.tasks ?? p.items) || []).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10 likely questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 likely interview questions</CardTitle>
          <CardDescription>Based on detected skills</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            {(questions || []).slice(0, 10).map((q, i) => (
              <li key={i}>{q ?? ''}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Action next</CardTitle>
          <CardDescription>Focus on weak areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakSkills.length > 0 ? (
            <>
              <p className="text-sm text-gray-700">
                Top skills to practice: {weakSkills.join(', ')}.
              </p>
              <p className="text-sm font-medium text-gray-900">
                Start Day 1 plan now.
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-700">
              All listed skills marked as known. Keep revising and start Day 1 plan when ready.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
