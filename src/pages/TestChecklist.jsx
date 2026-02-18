import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import {
  getChecklist,
  setChecklistItem,
  resetChecklist,
  getAllPassed,
  TEST_ITEMS,
} from '../lib/testChecklist'
import { ClipboardCheck, AlertTriangle } from 'lucide-react'

const TOTAL = TEST_ITEMS.length

export default function TestChecklist() {
  const [state, setState] = useState(getChecklist)

  useEffect(() => {
    setState(getChecklist())
  }, [])

  const passed = Object.values(state).filter(Boolean).length
  const allPassed = passed === TOTAL
  const showWarning = !allPassed

  const handleToggle = (id, checked) => {
    setChecklistItem(id, checked)
    setState(getChecklist())
  }

  const handleReset = () => {
    resetChecklist()
    setState(getChecklist())
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Test Checklist
          </h1>
          <p className="text-gray-600 text-sm">
            Run through these checks before shipping. All must pass to unlock Ship.
          </p>
        </div>

        {/* Summary */}
        <Card className="mb-6 border-primary/20 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Tests Passed: {passed} / {TOTAL}
            </CardTitle>
          </CardHeader>
          {showWarning && (
            <CardContent className="pt-0">
              <p
                className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
                role="alert"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                Fix issues before shipping.
              </p>
            </CardContent>
          )}
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Checks</CardTitle>
            <CardDescription>
              Tick each item after verifying the behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TEST_ITEMS.map(({ id, label, hint }) => (
              <label
                key={id}
                className="flex gap-3 items-start cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={state[id] === true}
                  onChange={(e) => handleToggle(id, e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  aria-describedby={hint ? `hint-${id}` : undefined}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`font-medium ${
                      state[id] ? 'text-gray-700' : 'text-gray-900'
                    }`}
                  >
                    {label}
                  </span>
                  {hint && (
                    <p
                      id={`hint-${id}`}
                      className="text-sm text-gray-500 mt-0.5"
                    >
                      How to test: {hint}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Reset checklist
          </button>
          <Link
            to="/prp/08-ship"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            Go to Ship
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
