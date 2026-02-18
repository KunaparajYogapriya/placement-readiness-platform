import { useEffect } from 'react'
import { markStepVisited } from '../lib/prpSubmission'

export default function Assessments() {
  useEffect(() => {
    markStepVisited('assessments')
  }, [])
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessments</h2>
      <p className="text-gray-600">Take mock assessments and track scores.</p>
    </div>
  )
}
