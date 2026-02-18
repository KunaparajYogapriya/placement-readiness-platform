import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { runFullAnalysis } from '../lib/analyzeJD'
import { saveEntry } from '../lib/history'
import { normalizeAnalysisEntry } from '../lib/schema'

const JD_MIN_LENGTH = 200

export default function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')

  const jdTooShort = jdText.trim().length > 0 && jdText.trim().length < JD_MIN_LENGTH

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')
    if (!jdText.trim()) {
      setValidationError('Please paste a job description to analyze.')
      return
    }
    setSubmitting(true)
    try {
      const raw = runFullAnalysis(company.trim(), role.trim(), jdText.trim())
      const normalized = normalizeAnalysisEntry(
        raw,
        company.trim() || '',
        role.trim() || '',
        jdText.trim(),
      )
      const entry = saveEntry(normalized)
      if (entry) {
        navigate(`/dashboard/results?id=${entry.id}`, { replace: true })
      } else {
        setSubmitting(false)
      }
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Analyze JD</h2>
        <p className="text-gray-600">
          Paste a job description to extract skills and get a preparation plan.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
            <CardDescription>Optional but improve readiness score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company name
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g. Google, Microsoft"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g. SDE 1, Full Stack Developer"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Job description</CardTitle>
            <CardDescription>Paste the full JD text</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              id="jdText"
              value={jdText}
              onChange={(e) => { setJdText(e.target.value); setValidationError('') }}
              rows={12}
              className="w-full min-h-[200px] max-h-[50vh] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-y overflow-auto"
              placeholder="Paste the complete job description here..."
              aria-describedby={validationError ? 'jd-error' : undefined}
            />
            {validationError && (
              <p id="jd-error" className="mt-2 text-sm text-red-600" role="alert">
                {validationError}
              </p>
            )}
            {jdTooShort && (
              <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5" role="status">
                This JD is too short to analyze deeply. Paste full JD for better output.
              </p>
            )}
          </CardContent>
        </Card>
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Analyzing…' : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  )
}
