import { useEffect } from 'react'
import { markStepVisited } from '../lib/prpSubmission'

export default function Practice() {
  useEffect(() => {
    markStepVisited('practice')
  }, [])
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice</h2>
      <p className="text-gray-600">Practice problems and coding challenges.</p>
    </div>
  )
}
