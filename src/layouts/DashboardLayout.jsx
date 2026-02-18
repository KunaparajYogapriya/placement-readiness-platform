import { useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Code2,
  ClipboardCheck,
  BookOpen,
  User,
  FileSearch,
  History,
  ListChecks,
  FileCheck,
} from 'lucide-react'
import { markStepVisited } from '../lib/prpSubmission'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/analyze', icon: FileSearch, label: 'Analyze' },
  { to: '/dashboard/history', icon: History, label: 'History' },
  { to: '/dashboard/practice', icon: Code2, label: 'Practice' },
  { to: '/dashboard/assessments', icon: ClipboardCheck, label: 'Assessments' },
  { to: '/dashboard/resources', icon: BookOpen, label: 'Resources' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/prp/07-test', icon: ListChecks, label: 'Test checklist' },
  { to: '/prp/proof', icon: FileCheck, label: 'Proof' },
]

export default function DashboardLayout() {
  useEffect(() => {
    markStepVisited('dashboard')
  }, [])
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Placement Prep</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex-shrink-0 px-6 flex items-center justify-between bg-white border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Placement Prep</h1>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
