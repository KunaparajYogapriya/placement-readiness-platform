import { Link } from 'react-router-dom'
import { getAllPassed } from '../lib/testChecklist'
import { Lock, CheckCircle, Ship } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function ShipPage() {
  const unlocked = getAllPassed()

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-lg mx-auto w-full px-6 py-16 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ship locked
          </h1>
          <p className="text-gray-600 mb-6">
            Complete all 10 tests on the Test Checklist before shipping.
          </p>
          <Link
            to="/prp/07-test"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            Open Test Checklist
          </Link>
          <Link
            to="/dashboard"
            className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-lg mx-auto w-full px-6 py-16 flex-1">
        <Card className="border-primary/20 bg-white">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Ship className="w-6 h-6" />
            </div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Ready to ship
            </CardTitle>
            <CardDescription>
              All tests passed. You can ship the Placement Readiness Platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              The test checklist is complete and the app is verified. Proceed with your release process.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Back to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
