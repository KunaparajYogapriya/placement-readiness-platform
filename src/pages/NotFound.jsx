import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
