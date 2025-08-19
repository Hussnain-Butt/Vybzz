import React, { useState, useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  FiUsers,
  FiEye,
  FiZap,
  FiBarChart2,
  FiGlobe,
  FiSmartphone,
  FiExternalLink,
} from 'react-icons/fi'

// --- DUMMY DATA ---

// Main User Activity Data
const generateActivityData = (days: number) => {
  const data = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: Math.floor(Math.random() * (5000 - 1000 + 1) + 1000),
      signups: Math.floor(Math.random() * (100 - 10 + 1) + 10),
    })
  }
  return data
}

// Geographic Data
const geoData = [
  { country: 'Pakistan', users: 1250 },
  { country: 'USA', users: 840 },
  { country: 'India', users: 620 },
  { country: 'UAE', users: 450 },
  { country: 'UK', users: 310 },
  { country: 'Canada', users: 150 },
]

// Device Usage Data
const deviceData = [
  { name: 'Desktop', value: 68, color: 'rgb(var(--color-primary-blue))' },
  { name: 'Mobile', value: 25, color: 'rgb(var(--color-primary-cyan))' },
  { name: 'Tablet', value: 7, color: 'rgb(var(--color-accent-pink))' },
]

// Top Referrers
const topReferrers = [
  { source: 'google.com', count: 1890, change: 12 },
  { source: 'facebook.com', count: 1230, change: -5 },
  { source: 'github.com', count: 740, change: 8 },
  { source: 'twitter.com', count: 410, change: 15 },
]

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState(30)
  const containerRef = useRef<HTMLDivElement>(null)

  // Animate elements on load
  useGSAP(
    () => {
      gsap.fromTo(
        '.kpi-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.chart-card',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, delay: 0.3, ease: 'back.out(1.4)' },
      )
    },
    { scope: containerRef },
  )

  const activityData = useMemo(() => generateActivityData(timeRange), [timeRange])

  const kpis = [
    { title: 'Total Visits', value: '345K', icon: <FiEye />, change: '+12.5%' },
    { title: 'New Signups', value: '3,210', icon: <FiUsers />, change: '+8.2%' },
    { title: 'Bounce Rate', value: '42.3%', icon: <FiZap />, change: '-2.1%' },
    { title: 'Avg. Session', value: '3m 45s', icon: <FiBarChart2 />, change: '+5.0%' },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[rgb(var(--color-surface-2))] p-3 rounded-lg shadow-lg border border-[rgb(var(--color-surface-3))]">
          <p className="font-bold text-white">{label}</p>
          <p className="text-[rgb(var(--color-primary-cyan))]">{`Visits: ${payload[0].value}`}</p>
          <p className="text-[rgb(var(--color-accent-pink))]">{`Signups: ${payload[1].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div ref={containerRef} className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Analytics</h1>
        <p className="text-lg text-[rgb(var(--color-text-secondary))] mt-1">
          View platform analytics and reports.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="kpi-card bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg flex items-start justify-between"
          >
            <div>
              <p className="text-md text-[rgb(var(--color-text-secondary))]">{kpi.title}</p>
              <p className="text-3xl font-bold text-white my-1">{kpi.value}</p>
              <p
                className={`text-sm ${
                  kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {kpi.change}
              </p>
            </div>
            <div className="text-[rgb(var(--color-primary-cyan))] bg-[rgb(var(--color-surface-2))] p-3 rounded-lg">
              {React.cloneElement(kpi.icon, { size: 24 })}
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart: User Activity */}
      <div className="chart-card bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">User Activity</h2>
          <div className="flex gap-2 bg-[rgb(var(--color-surface-2))] p-1 rounded-lg">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
                  timeRange === days
                    ? 'bg-[rgb(var(--color-primary-blue))] text-white'
                    : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-surface-3))]'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--color-primary-cyan))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgb(var(--color-primary-cyan))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--color-accent-pink))" stopOpacity={0.7} />
                <stop offset="95%" stopColor="rgb(var(--color-accent-pink))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(var(--color-surface-3), 0.3)" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="rgb(var(--color-text-muted))" />
            <YAxis stroke="rgb(var(--color-text-muted))" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="rgb(var(--color-primary-cyan))"
              fillOpacity={1}
              fill="url(#colorVisits)"
            />
            <Area
              type="monotone"
              dataKey="signups"
              stroke="rgb(var(--color-accent-pink))"
              fillOpacity={1}
              fill="url(#colorSignups)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Geographic Distribution */}
        <div className="chart-card bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg lg:col-span-2">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiGlobe /> Geographic Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geoData} layout="vertical">
              <CartesianGrid stroke="rgba(var(--color-surface-3), 0.3)" strokeDasharray="3 3" />
              <XAxis type="number" stroke="rgb(var(--color-text-muted))" />
              <YAxis
                type="category"
                dataKey="country"
                width={80}
                stroke="rgb(var(--color-text-secondary))"
              />
              <Tooltip
                cursor={{ fill: 'rgba(var(--color-surface-2), 0.6)' }}
                contentStyle={{
                  backgroundColor: 'rgb(var(--color-surface-1))',
                  border: '1px solid rgb(var(--color-surface-3))',
                }}
              />
              <Bar dataKey="users" fill="rgb(var(--color-primary-blue))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Usage */}
        <div className="chart-card bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiSmartphone /> Device Usage
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(var(--color-surface-1))',
                  border: '1px solid rgb(var(--color-surface-3))',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Referrers List */}
      <div className="chart-card mt-8 bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <FiExternalLink /> Top Referrers
        </h2>
        <ul className="space-y-4">
          {topReferrers.map((ref, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-[rgb(var(--color-surface-2))] p-4 rounded-lg"
            >
              <span className="font-semibold text-white">{ref.source}</span>
              <div className="flex items-center gap-4">
                <span className="text-[rgb(var(--color-text-secondary))]">
                  {ref.count.toLocaleString()} visits
                </span>
                <span
                  className={`font-bold ${ref.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {ref.change >= 0 ? '+' : ''}
                  {ref.change}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminAnalytics
