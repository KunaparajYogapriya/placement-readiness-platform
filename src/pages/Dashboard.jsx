import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const READINESS_MAX = 100
const READINESS_RAW = 72 // from API/state; must be clamped 0–100
const READINESS_SCORE = Math.min(READINESS_MAX, Math.max(0, READINESS_RAW))
const CIRCLE_R = 80
const CIRCLE_CX = 90
const CIRCLE_CY = 90
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R
const READINESS_OFFSET = CIRCUMFERENCE * (1 - READINESS_SCORE / READINESS_MAX)

const SKILL_DATA = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
]

const WEEKLY_PROBLEMS = 12
const WEEKLY_GOAL = 20
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAYS_WITH_ACTIVITY = [0, 1, 2, 3, 5] // Mon, Tue, Wed, Thu, Sat

const ASSESSMENTS = [
  { title: 'DSA Mock Test', when: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', when: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', when: 'Friday, 11:00 AM' },
]

// Last practice topic; when completed >= total, show completion state
const LAST_TOPIC = {
  name: 'Dynamic Programming',
  completed: 3,
  total: 10,
}
const ALL_TOPICS_COMPLETE = LAST_TOPIC.completed >= LAST_TOPIC.total

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Your placement prep at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
        {/* 1. Overall Readiness */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 180 180"
                aria-hidden
              >
                <circle
                  cx={CIRCLE_CX}
                  cy={CIRCLE_CY}
                  r={CIRCLE_R}
                  fill="none"
                  stroke="hsl(0 0% 93%)"
                  strokeWidth="12"
                />
                <circle
                  cx={CIRCLE_CX}
                  cy={CIRCLE_CY}
                  r={CIRCLE_R}
                  fill="none"
                  stroke="hsl(245, 58%, 51%)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={READINESS_OFFSET}
                  style={{
                    transition: 'stroke-dashoffset 0.6s ease-out',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {READINESS_SCORE}
                </span>
                <span className="text-lg text-gray-500">/ {READINESS_MAX}</span>
                <span className="text-sm text-gray-500 mt-0.5">
                  Readiness Score
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Skill Breakdown */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Scores by area (out of 100)</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="h-64 w-full min-h-0 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SKILL_DATA}>
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'hsl(0 0% 45%)', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(0 0% 55%)', fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="hsl(245, 58%, 51%)"
                    fill="hsl(245, 58%, 51%)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 3. Continue Practice */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
            <CardDescription>Last topic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ALL_TOPICS_COMPLETE ? (
              <>
                <p className="font-medium text-gray-900">{LAST_TOPIC.name}</p>
                <p className="text-gray-600 text-sm">
                  All topics complete! Consider a quick review or start another track.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-900">{LAST_TOPIC.name}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Progress</span>
                    <span>
                      {LAST_TOPIC.completed} / {LAST_TOPIC.total} completed
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, (LAST_TOPIC.completed / LAST_TOPIC.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
          {!ALL_TOPICS_COMPLETE && (
            <CardFooter>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                Continue
              </button>
            </CardFooter>
          )}
          {ALL_TOPICS_COMPLETE && (
            <CardFooter>
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium text-primary border border-primary hover:bg-primary/10 transition-colors"
              >
                Review
              </button>
            </CardFooter>
          )}
        </Card>

        {/* 4. Weekly Goals */}
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
            <CardDescription>Problems solved this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">
                  Problems Solved: {WEEKLY_PROBLEMS}/{WEEKLY_GOAL} this week
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${(WEEKLY_PROBLEMS / WEEKLY_GOAL) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      DAYS_WITH_ACTIVITY.includes(i)
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {day.slice(0, 1)}
                  </div>
                  <span className="text-xs text-gray-500">{day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 5. Upcoming Assessments - full width */}
        <Card className="md:col-span-2 min-w-0">
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Next scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {ASSESSMENTS.map((item) => (
                <li
                  key={item.title}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                >
                  <span className="font-medium text-gray-900">{item.title}</span>
                  <span className="text-sm text-gray-500">{item.when}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
