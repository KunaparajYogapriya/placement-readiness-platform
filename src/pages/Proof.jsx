import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getHistory } from '../lib/history'
import { getAllPassed } from '../lib/testChecklist'
import {
  getSubmission,
  setSubmission,
  getStepStatus,
  isShipped,
  validateUrl,
  buildFinalSubmissionText,
  getStepLabels,
} from '../lib/prpSubmission'
import { CheckCircle, Circle, Copy } from 'lucide-react'

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8']

export default function Proof() {
  const [links, setLinks] = useState(getSubmission())
  const [errors, setErrors] = useState({ lovableProject: '', githubRepo: '', deployedUrl: '' })
  const [copyFeedback, setCopyFeedback] = useState('')

  const { list } = getHistory()
  const historyCount = list.length
  const checklistAllPassed = getAllPassed()
  const stepStatus = getStepStatus({ historyCount, checklistAllPassed })
  const shipped = isShipped({ historyCount, checklistAllPassed })
  const labels = getStepLabels()

  useEffect(() => {
    setLinks(getSubmission())
  }, [])

  const handleLinkChange = (field, value) => {
    setLinks((prev) => {
      const next = { ...prev, [field]: value }
      setSubmission(next)
      return next
    })
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: validateUrl(value) ? '' : 'Enter a valid URL (e.g. https://...)' }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleBlur = (field) => {
    const value = links[field]
    if (value.trim() && !validateUrl(value)) {
      setErrors((prev) => ({ ...prev, [field]: 'Enter a valid URL (e.g. https://...)' }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    setSubmission(links)
  }

  const handleCopyFinalSubmission = () => {
    const text = buildFinalSubmissionText(links)
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback('Copied!')
      setTimeout(() => setCopyFeedback(''), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Proof & Submission</h1>
            <p className="text-gray-600 text-sm">Final artifacts and completion status.</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              shipped ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {shipped ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Shipped
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                In Progress
              </>
            )}
          </span>
        </div>

        {shipped && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="py-6">
              <p className="text-gray-800 font-medium leading-relaxed">
                You built a real product.
                <br />
                Not a tutorial. Not a clone.
                <br />
                A structured tool that solves a real problem.
              </p>
              <p className="text-primary font-semibold mt-2">This is your proof of work.</p>
            </CardContent>
          </Card>
        )}

        {/* A) Step Completion Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step Completion Overview</CardTitle>
            <CardDescription>All 8 steps must be completed for Shipped status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {STEP_KEYS.map((key, i) => (
              <div key={key} className="flex items-center gap-3">
                {stepStatus[key] ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={stepStatus[key] ? 'text-gray-700' : 'text-gray-500'}>
                  {labels[i]} — {stepStatus[key] ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* B) Artifact Inputs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Artifact Inputs (Required for Ship Status)</CardTitle>
            <CardDescription>Provide valid URLs for all three links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="lovable" className="block text-sm font-medium text-gray-700 mb-1">
                Lovable Project Link
              </label>
              <input
                id="lovable"
                type="url"
                value={links.lovableProject}
                onChange={(e) => handleLinkChange('lovableProject', e.target.value)}
                onBlur={() => handleBlur('lovableProject')}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {errors.lovableProject && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.lovableProject}</p>
              )}
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Repository Link
              </label>
              <input
                id="github"
                type="url"
                value={links.githubRepo}
                onChange={(e) => handleLinkChange('githubRepo', e.target.value)}
                onBlur={() => handleBlur('githubRepo')}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {errors.githubRepo && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.githubRepo}</p>
              )}
            </div>
            <div>
              <label htmlFor="deployed" className="block text-sm font-medium text-gray-700 mb-1">
                Deployed URL
              </label>
              <input
                id="deployed"
                type="url"
                value={links.deployedUrl}
                onChange={(e) => handleLinkChange('deployedUrl', e.target.value)}
                onBlur={() => handleBlur('deployedUrl')}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {errors.deployedUrl && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.deployedUrl}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Copy Final Submission */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Final Submission Export</CardTitle>
            <CardDescription>Copy the formatted submission text to paste elsewhere.</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={handleCopyFinalSubmission}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copyFeedback || 'Copy Final Submission'}
            </button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/prp/08-ship"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ship
          </Link>
          <Link
            to="/prp/07-test"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Test checklist
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
