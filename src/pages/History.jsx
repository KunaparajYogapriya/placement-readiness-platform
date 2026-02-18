import { Link } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/card'
import { getHistory } from '../lib/history'

export default function History() {
  const { list, skipped } = getHistory()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Analysis history</h2>
        <p className="text-gray-600">Saved JD analyses. Click to view results.</p>
      </div>
      {skipped > 0 && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="alert">
          {skipped === 1
            ? 'One saved entry couldn\'t be loaded. Create a new analysis.'
            : `${skipped} saved entries couldn't be loaded. Create a new analysis.`}
        </p>
      )}
      {list.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-600">
            No analyses yet. Run an analysis from the Analyze page.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {list.map((entry) => (
            <li key={entry.id}>
              <Link
                to={`/dashboard/results?id=${entry.id}`}
                className="block"
              >
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="py-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {[entry.company, entry.role].filter(Boolean).join(' · ') || 'JD analysis'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleString()
                          : 'Saved'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {Math.min(100, Math.max(0, entry.finalScore ?? entry.readinessScore ?? 0))}%
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
