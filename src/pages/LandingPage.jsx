import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { Code2, Video, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const navigatingRef = useRef(false)

  const handleGetStarted = () => {
    if (navigatingRef.current) return
    navigatingRef.current = true
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Ace Your Placement
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
          Practice, assess, and prepare for your dream job
        </p>
        <button
          type="button"
          onClick={handleGetStarted}
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
        >
          Get Started
        </button>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Problems</h3>
            <p className="text-gray-600 text-sm">
              Solve curated problems and build your coding skills.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mock Interviews</h3>
            <p className="text-gray-600 text-sm">
              Simulate real interviews with timed mock sessions.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor your growth with insights and analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  )
}
