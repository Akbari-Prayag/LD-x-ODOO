import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Compass,
  DollarSign,
  Edit3,
  Filter,
  Hotel,
  Layers,
  PieChart as PieChartIcon,
  Plane,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  Utensils,
  Wallet,
  WalletCards,
  X,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import api from '../../services/api.js'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { fetchTrip, selectCurrentTrip } from '../../store/slices/tripsSlice.js'
import { expenseSchema } from '../../utils/validationSchemas.js'
import { EXPENSE_CATEGORIES, EXPENSE_COLORS, formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'

const getId = item => item.id ?? item._id

const categoryIcons = {
  transport: Plane,
  stay: Hotel,
  activities: Compass,
  meals: Utensils,
  other: ShoppingBag,
}

export default function BudgetPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const trip = useSelector(selectCurrentTrip)

  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState({ total: 0, byCategory: {} })
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'activities',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [activeCategory, setActiveCategory] = useState(null)
  const [formError, setFormError] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'itinerary' | 'history'

  // Fetch trip details
  useEffect(() => {
    if (!trip || String(getId(trip)) !== id) {
      dispatch(fetchTrip(id))
    }
  }, [dispatch, id, trip])

  // Fetch trip expenses
  useEffect(() => {
    let active = true
    setLoading(true)
    api.get(`/expenses/trip/${id}`)
      .then(({ data }) => {
        if (active) {
          setExpenses(data.expenses || [])
          setSummary(data.summary || { total: 0, byCategory: {} })
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load expenses')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [id])

  const budget = Number(trip?.budget) || 0
  const spent = summary.total || 0
  const remaining = budget - spent
  const isOverBudget = budget > 0 && spent > budget
  const percentUsed = budgetPercentage(spent, budget)

  // Trip duration calculations
  const tripDays = useMemo(() => {
    if (!trip?.startDate || !trip?.endDate) return 1
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return Math.max(1, diff)
  }, [trip?.startDate, trip?.endDate])

  const avgCostPerDay = tripDays > 0 ? Math.round(spent / tripDays) : spent
  const dailyBudgetLimit = budget > 0 && tripDays > 0 ? Math.round(budget / tripDays) : 0

  // Category Pie Chart data
  const chartData = useMemo(() => {
    return EXPENSE_CATEGORIES.map(({ value, label, color }) => ({
      name: label,
      value: summary.byCategory[value] || 0,
      key: value,
      color,
    })).filter(item => item.value > 0)
  }, [summary.byCategory])

  // Daily Spending data for Bar Chart
  const dailyChartData = useMemo(() => {
    const map = {}
    // If trip has dates, prefill the range
    if (trip?.startDate && trip?.endDate) {
      const cur = new Date(trip.startDate)
      const end = new Date(trip.endDate)
      while (cur <= end) {
        const key = cur.toISOString().slice(0, 10)
        map[key] = 0
        cur.setDate(cur.getDate() + 1)
      }
    }

    expenses.forEach(e => {
      const dateKey = String(e.date).slice(0, 10)
      map[dateKey] = (map[dateKey] || 0) + Number(e.amount)
    })

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => {
        const d = new Date(`${date}T00:00:00`)
        const formattedDate = !isNaN(d.getTime())
          ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : date
        return {
          dateKey: date,
          dateLabel: formattedDate,
          amount,
          isOverDaily: dailyBudgetLimit > 0 && amount > dailyBudgetLimit,
        }
      })
  }, [expenses, trip?.startDate, trip?.endDate, dailyBudgetLimit])

  // Overbudget days
  const overBudgetDays = useMemo(() => {
    if (!dailyBudgetLimit) return []
    return dailyChartData.filter(d => d.amount > dailyBudgetLimit)
  }, [dailyChartData, dailyBudgetLimit])

  // Itinerary days
  const itineraryDays = useMemo(() => {
    const days = []
    if (trip?.startDate && trip?.endDate) {
      const start = new Date(trip.startDate)
      const end = new Date(trip.endDate)
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateKey = date.toISOString().slice(0, 10)
        const stops = (trip.stops || []).filter(stop => {
          const sArr = String(stop.arrivalDate || '').slice(0, 10)
          const sDep = String(stop.departureDate || '').slice(0, 10)
          return dateKey >= sArr && dateKey <= sDep
        })
        const activities = stops.flatMap(stop =>
          (stop.activities || [])
            .filter(act => !act.scheduledDate || String(act.scheduledDate).slice(0, 10) === dateKey)
            .map(act => ({ ...act, stop }))
        )
        const dayExpenses = expenses.filter(exp => String(exp.date).slice(0, 10) === dateKey)
        const dayTotal = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
        days.push({
          date: new Date(date),
          dateKey,
          stops,
          activities,
          expenses: dayExpenses,
          total: dayTotal,
          isOverDaily: dailyBudgetLimit > 0 && dayTotal > dailyBudgetLimit,
        })
      }
    }
    return days
  }, [trip?.startDate, trip?.endDate, trip?.stops, expenses, dailyBudgetLimit])

  // Filtering & Sorting
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        const matchesSearch =
          exp.description.toLowerCase().includes(search.toLowerCase()) ||
          (exp.notes && exp.notes.toLowerCase().includes(search.toLowerCase()))
        const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date)
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
        if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount)
        if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount)
        return 0
      })
  }, [expenses, search, categoryFilter, sortBy])

  const refreshSummary = (items) => {
    const total = items.reduce((sum, item) => sum + Number(item.amount), 0)
    const byCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount)
      return acc
    }, {})
    setSummary({ total, byCategory })
  }

  const resetForm = () => {
    setForm({
      description: '',
      amount: '',
      category: 'activities',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
    })
    setEditingExpense(null)
    setFormError('')
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (expense) => {
    setEditingExpense(expense)
    setForm({
      description: expense.description,
      amount: String(expense.amount),
      category: expense.category,
      date: String(expense.date).slice(0, 10),
      notes: expense.notes || '',
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsed = expenseSchema.safeParse(form)
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || 'Please check form inputs')
      return
    }

    setFormError('')
    setSaving(true)
    try {
      if (editingExpense) {
        const { data } = await api.put(`/expenses/${getId(editingExpense)}`, parsed.data)
        const next = expenses.map(item => getId(item) === getId(data.expense) ? data.expense : item)
        setExpenses(next)
        refreshSummary(next)
        setSuccessMessage('Expense updated successfully!')
      } else {
        const { data } = await api.post('/expenses', { ...parsed.data, tripId: id })
        const next = [data.expense, ...expenses]
        setExpenses(next)
        refreshSummary(next)
        setSuccessMessage('Expense added successfully!')
      }
      setIsModalOpen(false)
      resetForm()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Could not save expense. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete expense "${expense.description}"?`)) return
    try {
      await api.delete(`/expenses/${getId(expense)}`)
      const next = expenses.filter(item => getId(item) !== getId(expense))
      setExpenses(next)
      refreshSummary(next)
      setSuccessMessage('Expense deleted.')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete expense')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#4677d9]">
            <Link to={`/trips/${id}`} className="hover:underline">
              {trip?.name || 'Trip Details'}
            </Link>
            <span>/</span>
            <span>Financial Manager</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#2d3e86] mt-1">
            Trip Budget & Cost Breakdown
          </h1>
          <p className="text-surface-500 text-sm mt-0.5">
            Monitor expenses, keep within limits, and track spending day-by-day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="!bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl text-sm font-semibold shadow-md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openAddModal}
          >
            Add Expense
          </Button>
        </div>
      </div>

      {/* Success / Error alerts */}
      {successMessage && (
        <div className="rounded-xl border border-success-200 bg-success-50 p-3.5 text-sm text-success-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-3.5 text-sm text-danger-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
          <span>{error}</span>
          <button type="button" className="ml-auto text-xs font-semibold underline" onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      )}

      {/* Over-budget Warning Alert */}
      {isOverBudget && (
        <div className="rounded-2xl border-2 border-danger-300 bg-danger-50/90 p-4 md:p-5 flex items-start gap-4 shadow-sm animate-pulse-once">
          <div className="w-10 h-10 rounded-xl bg-danger-100 text-danger-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-danger-900 text-base">
              Trip Budget Exceeded!
            </h3>
            <p className="text-sm text-danger-700 mt-1 leading-relaxed">
              You have spent <strong className="font-semibold">{formatCurrency(spent, trip?.currency)}</strong>, which is{' '}
              <strong className="font-semibold">{formatCurrency(Math.abs(remaining), trip?.currency)}</strong> over your allocated budget of{' '}
              <strong className="font-semibold">{formatCurrency(budget, trip?.currency)}</strong> ({percentUsed}% used).
            </p>
          </div>
        </div>
      )}

      {/* Top 4 Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Budget */}
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Total Budget</span>
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-surface-900 mt-2">
            {formatCurrency(budget, trip?.currency)}
          </p>
          <p className="text-xs text-surface-500 mt-1">
            Planned for {tripDays} day{tripDays === 1 ? '' : 's'}
          </p>
        </div>

        {/* Spent so far */}
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Spent So Far</span>
            <div className="w-9 h-9 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-surface-900 mt-2">
            {formatCurrency(spent, trip?.currency)}
          </p>
          <div className="flex items-center gap-1 text-xs font-semibold mt-1">
            <span className={isOverBudget ? 'text-danger-600' : 'text-primary-600'}>
              {percentUsed}% of total budget
            </span>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Remaining</span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                remaining < 0 ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600'
              }`}
            >
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-2xl md:text-3xl font-display font-bold mt-2 ${
              remaining < 0 ? 'text-danger-600' : 'text-success-700'
            }`}
          >
            {formatCurrency(remaining, trip?.currency)}
          </p>
          <p className="text-xs text-surface-500 mt-1">
            {remaining < 0 ? 'Exceeded limit' : 'Available balance'}
          </p>
        </div>

        {/* Average Cost Per Day */}
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Avg Spend / Day</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-surface-900 mt-2">
            {formatCurrency(avgCostPerDay, trip?.currency)}
          </p>
          <p className="text-xs text-surface-500 mt-1">
            {dailyBudgetLimit > 0 ? `Target: ${formatCurrency(dailyBudgetLimit, trip?.currency)} / day` : `${tripDays} day trip`}
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-surface-600 mb-2">
          <span>Overall Budget Consumption</span>
          <span>{formatCurrency(spent, trip?.currency)} of {formatCurrency(budget, trip?.currency)} ({percentUsed}%)</span>
        </div>
        <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOverBudget ? 'bg-danger-500' : percentUsed > 80 ? 'bg-amber-500' : 'bg-[#4677d9]'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>

      {/* Charts Section: Pie & Bar Charts */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Category Breakdown (Pie / Donut) */}
        <section className="card p-5 md:p-6 lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#4677d9]" /> Cost by Category
              </h2>
              <p className="text-xs text-surface-500 mt-0.5">Distribution across major travel expenditures</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-100 text-surface-700">
              {chartData.length} active
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-center flex-1">
            <div className="h-56 relative flex items-center justify-center">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      activeIndex={activeCategory ? chartData.findIndex(i => i.name === activeCategory) : undefined}
                      activeShape={(props) => <Sector {...props} outerRadius={(props.outerRadius || 80) + 8} />}
                      onMouseEnter={(_, index) => setActiveCategory(chartData[index]?.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      {chartData.map(item => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(val, trip?.currency)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-xs text-surface-400">
                  <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No expenses recorded yet
                </div>
              )}
            </div>

            {/* Category Legend & Pills */}
            <div className="space-y-2 text-xs">
              {EXPENSE_CATEGORIES.map(({ value, label, color }) => {
                const amount = summary.byCategory[value] || 0
                const Icon = categoryIcons[value] || ShoppingBag
                const pct = spent > 0 ? Math.round((amount / spent) * 100) : 0
                const isActive = activeCategory === label

                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setCategoryFilter(categoryFilter === value ? 'all' : value)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                      isActive || categoryFilter === value
                        ? 'border-primary-300 bg-primary-50/50 shadow-sm'
                        : 'border-surface-100 hover:bg-surface-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-surface-800 truncate">{label}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-surface-900">{formatCurrency(amount, trip?.currency)}</span>
                      <span className="text-[10px] text-surface-400 ml-1">({pct}%)</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Daily Spending (Bar Chart) */}
        <section className="card p-5 md:p-6 lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#4677d9]" /> Daily Spending Flow
              </h2>
              <p className="text-xs text-surface-500 mt-0.5">Expenses incurred per day throughout the journey</p>
            </div>
            {dailyBudgetLimit > 0 && (
              <span className="text-[11px] text-surface-500">
                Daily Target: <strong className="text-surface-700">{formatCurrency(dailyBudgetLimit, trip?.currency)}</strong>
              </span>
            )}
          </div>

          <div className="h-56 flex-1">
            {dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}`} />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val, trip?.currency), 'Spent']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {dailyChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isOverDaily ? '#ef4444' : '#4677d9'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-surface-400">
                No daily spending recorded
              </div>
            )}
          </div>

          {overBudgetDays.length > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{overBudgetDays.length} day{overBudgetDays.length === 1 ? '' : 's'}</strong> exceeded the daily target of {formatCurrency(dailyBudgetLimit, trip?.currency)}.
              </span>
            </div>
          )}
        </section>
      </div>

      {/* Tabs for Itinerary vs History */}
      <div className="flex border-b border-surface-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-[#4677d9] text-[#2d3e86]'
              : 'border-transparent text-surface-500 hover:text-surface-900'
          }`}
        >
          Day-by-Day Plan & Spend
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'border-[#4677d9] text-[#2d3e86]'
              : 'border-transparent text-surface-500 hover:text-surface-900'
          }`}
        >
          Expense Transactions ({expenses.length})
        </button>
      </div>

      {/* Tab 1: Day-by-Day Itinerary & Expense View */}
      {activeTab === 'overview' && (
        <section className="card overflow-hidden">
          <div className="p-5 border-b border-surface-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900">
                Itinerary Activities & Expenses
              </h2>
              <p className="text-xs text-surface-500 mt-0.5">
                Compare scheduled sightseeing with registered expenses for every stop.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2d3e86]" /> Activities
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4677d9]" /> Expenses
              </span>
            </div>
          </div>

          {itineraryDays.length === 0 ? (
            <div className="p-12 text-center text-sm text-surface-400">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 text-surface-300" />
              <p>Set trip start and end dates to enable day-by-day itinerary tracking.</p>
              <Link to={`/trips/${id}/edit`} className="inline-block mt-3 font-semibold text-[#4677d9] hover:underline">
                Set Trip Dates →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {itineraryDays.map((day, index) => (
                <div key={day.dateKey} className="p-4 md:p-6 hover:bg-surface-50/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-[#2d3e86] px-3 py-1 text-xs font-semibold text-white">
                        Day {index + 1}
                      </span>
                      <span className="font-display font-bold text-surface-900 text-sm md:text-base">
                        {day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {day.stops[0] && (
                        <span className="rounded-full bg-surface-100 border border-surface-200 px-2.5 py-0.5 text-xs font-medium text-surface-700">
                          {day.stops[0].city?.name || day.stops[0].customCityName || 'Stop'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {day.isOverDaily && (
                        <span className="rounded-full bg-danger-100 text-danger-700 font-semibold px-2 py-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Over Daily Target
                        </span>
                      )}
                      <span className="font-bold text-surface-900 text-sm">
                        Day Total: {formatCurrency(day.total, trip?.currency)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Activities List */}
                    <div className="rounded-xl border border-surface-200 bg-surface-50/80 p-3.5">
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-[#2d3e86]" /> Planned Activities
                        </p>
                        <span className="text-[10px] text-surface-400">{day.activities.length} planned</span>
                      </div>

                      {day.activities.length > 0 ? (
                        <div className="space-y-1.5">
                          {day.activities.map((act) => (
                            <div
                              key={getId(act)}
                              className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-surface-100 text-xs shadow-2xs"
                            >
                              <div className="min-w-0">
                                <p className="font-medium text-surface-800 truncate">
                                  {act.activity?.name || act.customName || 'Activity'}
                                </p>
                                <p className="text-[10px] text-surface-400">
                                  {act.startTime ? `Time: ${act.startTime}` : 'Anytime'} · {act.stop?.city?.name || 'Local'}
                                </p>
                              </div>
                              {act.cost ? (
                                <span className="font-semibold text-surface-700 shrink-0">
                                  {formatCurrency(act.cost, trip?.currency)}
                                </span>
                              ) : (
                                <span className="text-[10px] text-surface-400 shrink-0">Free/Included</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-surface-400 py-3 text-center">No activities scheduled for this day.</p>
                      )}
                    </div>

                    {/* Expenses List */}
                    <div className="rounded-xl border border-surface-200 bg-surface-50/80 p-3.5">
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 flex items-center gap-1.5">
                          <Receipt className="w-3.5 h-3.5 text-[#4677d9]" /> Day's Expenses
                        </p>
                        <span className="text-[10px] text-surface-400">{day.expenses.length} records</span>
                      </div>

                      {day.expenses.length > 0 ? (
                        <div className="space-y-1.5">
                          {day.expenses.map((exp) => {
                            const Icon = categoryIcons[exp.category] || ShoppingBag
                            return (
                              <div
                                key={getId(exp)}
                                className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-surface-100 text-xs shadow-2xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                                    style={{
                                      backgroundColor: `${EXPENSE_COLORS[exp.category] || '#64748b'}15`,
                                      color: EXPENSE_COLORS[exp.category] || '#64748b',
                                    }}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-surface-800 truncate">{exp.description}</p>
                                    <p className="text-[10px] text-surface-400 capitalize">{exp.category}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="font-semibold text-surface-900">
                                    {formatCurrency(exp.amount, trip?.currency)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(exp)}
                                    className="text-surface-400 hover:text-primary-600 p-1"
                                    title="Edit"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-surface-400 py-3 text-center">No expenses logged for this date.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Expense History Table & Filters */}
      {activeTab === 'history' && (
        <section className="card overflow-hidden">
          {/* Search, Filter, Sort Controls */}
          <div className="p-4 md:p-5 border-b border-surface-100 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  className="input pl-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by description or note..."
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="input md:w-44"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>

                <select
                  className="input md:w-44"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="date-desc">Date (Newest first)</option>
                  <option value="date-asc">Date (Oldest first)</option>
                  <option value="amount-desc">Amount (Highest first)</option>
                  <option value="amount-asc">Amount (Lowest first)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-surface-500 pt-1">
              <span>Showing {filteredExpenses.length} of {expenses.length} expenses</span>
              {categoryFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className="text-[#4677d9] font-semibold hover:underline"
                >
                  Clear category filter
                </button>
              )}
            </div>
          </div>

          {/* Table / List */}
          {loading ? (
            <div className="p-10 text-center text-sm text-surface-400">Loading expenses...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="p-12 text-center">
              <Receipt className="w-10 h-10 mx-auto text-surface-300 mb-3" />
              <p className="text-surface-700 font-medium">No expenses match your criteria.</p>
              <p className="text-xs text-surface-400 mt-1">Try resetting filters or log a new expenditure.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 !rounded-xl"
                onClick={openAddModal}
              >
                Add an expense
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {filteredExpenses.map((exp) => {
                const Icon = categoryIcons[exp.category] || ShoppingBag
                const color = EXPENSE_COLORS[exp.category] || '#64748b'

                return (
                  <div
                    key={getId(exp)}
                    className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-surface-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-surface-900 truncate text-sm md:text-base">
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-surface-500">
                          <span className="capitalize font-medium text-surface-700">{exp.category}</span>
                          <span>·</span>
                          <span>{new Date(`${exp.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          {exp.notes && (
                            <>
                              <span>·</span>
                              <span className="text-surface-400 italic truncate max-w-xs">{exp.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-base md:text-lg font-bold text-surface-900">
                        {formatCurrency(exp.amount, trip?.currency)}
                      </span>
                      <div className="flex items-center gap-1 border-l border-surface-200 pl-2">
                        <button
                          type="button"
                          aria-label={`Edit ${exp.description}`}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-[#4677d9] hover:bg-primary-50 transition-colors"
                          onClick={() => openEditModal(exp)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${exp.description}`}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                          onClick={() => handleDelete(exp)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-md overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-surface-100">
              <h3 className="font-display font-bold text-lg text-surface-900">
                {editingExpense ? 'Edit Expense' : 'Log New Expense'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="text-surface-400 hover:text-surface-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="m-5 mb-0 p-3 rounded-xl bg-danger-50 border border-danger-200 text-xs text-danger-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <Input
                label="Description"
                placeholder="e.g. Flight to Rome / Metro ticket"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={`Amount${trip?.currency ? ` (${trip.currency})` : ''}`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                />

                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />

              <div>
                <label className="input-label">Notes (optional)</label>
                <textarea
                  className="input min-h-[70px] resize-none"
                  placeholder="e.g. Receipt #4829, booked on airline portal"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  maxLength={300}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="!bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
                  loading={saving}
                  leftIcon={editingExpense ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                >
                  {editingExpense ? 'Update Expense' : 'Save Expense'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

