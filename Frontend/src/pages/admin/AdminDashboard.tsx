import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { FiUsers, FiDollarSign, FiShoppingCart, FiActivity } from 'react-icons/fi'

// Dummy Data for Charts and Stats
const salesData = [
  { name: 'Jan', sales: 4000, revenue: 2400 },
  { name: 'Feb', sales: 3000, revenue: 1398 },
  { name: 'Mar', sales: 5000, revenue: 9800 },
  { name: 'Apr', sales: 4780, revenue: 3908 },
  { name: 'May', sales: 5890, revenue: 4800 },
  { name: 'Jun', sales: 4390, revenue: 3800 },
]

const trafficData = [
  { name: 'Organic', value: 400, color: '#3b82fd' },
  { name: 'Referral', value: 300, color: '#ec4899' },
  { name: 'Direct', value: 300, color: '#0ea5e9' },
  { name: 'Social', value: 200, color: '#E96424' },
]

const recentUsers = [
  { id: 1, name: 'Ali Ahmed', email: 'ali.a@example.com', role: 'Admin', joined: '2 days ago' },
  {
    id: 2,
    name: 'Fatima Khan',
    email: 'fatima.k@example.com',
    role: 'Editor',
    joined: '5 days ago',
  },
  {
    id: 3,
    name: 'Zainab Ali',
    email: 'zainab.a@example.com',
    role: 'Viewer',
    joined: '1 week ago',
  },
]

const AdminDashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // GSAP Animations with useGSAP hook for better cleanup
  useGSAP(
    () => {
      gsap.fromTo(
        '.stat-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' },
      )
      gsap.fromTo(
        '.chart-container',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.3,
          delay: 0.5,
          ease: 'elastic.out(1, 0.75)',
        },
      )
      gsap.fromTo(
        '.recent-users-table',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: 'power3.out' },
      )
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="p-4 md:p-8 text-[rgb(var(--color-text-primary))]">
      <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-8">
        Welcome back, Admin. Here's what's happening.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiUsers size={28} />}
          title="Total Users"
          value="1,245"
          change="+5.4%"
          changeType="increase"
        />
        <StatCard
          icon={<FiDollarSign size={28} />}
          title="Total Revenue"
          value="$45,897"
          change="+12.1%"
          changeType="increase"
        />
        <StatCard
          icon={<FiShoppingCart size={28} />}
          title="Total Sales"
          value="8,321"
          change="-2.3%"
          changeType="decrease"
        />
        <StatCard
          icon={<FiActivity size={28} />}
          title="Active Users"
          value="89.7%"
          change="+1.5%"
          changeType="increase"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Trend Chart */}
        <div className="chart-container lg:col-span-2 bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-surface-3), 0.5)" />
              <XAxis dataKey="name" stroke="rgb(var(--color-text-secondary))" />
              <YAxis stroke="rgb(var(--color-text-secondary))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(var(--color-surface-2))',
                  borderColor: 'rgb(var(--color-surface-3))',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="rgb(var(--color-primary-blue))"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="rgb(var(--color-primary-cyan))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Source Chart */}
        <div className="chart-container bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Traffic Source</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(var(--color-surface-2))',
                  borderColor: 'rgb(var(--color-surface-3))',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="recent-users-table bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgb(var(--color-surface-3))]">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[rgb(var(--color-surface-2))] hover:bg-[rgb(var(--color-surface-2))] transition-colors"
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-[rgb(var(--color-text-secondary))]">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'Admin'
                          ? 'bg-accent-pink/20 text-accent-pink'
                          : 'bg-primary-cyan/20 text-primary-cyan'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-[rgb(var(--color-text-muted))]">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Reusable StatCard component
interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, changeType }) => {
  const isIncrease = changeType === 'increase'
  return (
    <div className="stat-card bg-[rgb(var(--color-surface-1))] p-6 rounded-2xl flex items-center gap-6 shadow-lg transition-transform hover:scale-105">
      <div className="grid place-items-center bg-[rgb(var(--color-surface-2))] w-16 h-16 rounded-full text-[rgb(var(--color-primary-cyan))]">
        {icon}
      </div>
      <div>
        <p className="text-lg text-[rgb(var(--color-text-secondary))]">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        <p className={`text-sm ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
          {change} vs last month
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard
