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
  CircleDollarSign,
  Compass,
  Download,
  Edit3,
  Hotel,
  PieChart as PieChartIcon,
  Plane,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  Utensils,
  Wallet,
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
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [minAmountFilter, setMinAmountFilter] = useState('')
  const [maxAmountFilter, setMaxAmountFilter] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const [activeCategory, setActiveCategory] = useState(null)
  const [formError, setFormError] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!trip || String(getId(trip)) !== id) {
      dispatch(fetchTrip(id))
    }
  }, [dispatch, id, trip])

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
  const isApproachingBudget = budget > 0 && !isOverBudget && spent >= budget * 0.8
  const percentUsed = budgetPercentage(spent, budget)

  const tripDays = useMemo(() => {
    if (!trip?.startDate || !trip?.endDate) return 1
    const start = new Date(trip.startDate)
    const end = new Date(trip.endDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return Math.max(1, diff)
  }, [trip?.startDate, trip?.endDate])

  const avgCostPerDay = tripDays > 0 ? Math.round(spent / tripDays) : spent
  const dailyBudgetLimit = budget > 0 && tripDays > 0 ? Math.round(budget / tripDays) : 0

  const chartData = useMemo(() => {
    return EXPENSE_CATEGORIES.map(({ value, label, color }) => ({
      name: label,
      value: summary.byCategory[value] || 0,
      key: value,
      color,
    })).filter(item => item.value > 0)
  }, [summary.byCategory])

  const dailyChartData = useMemo(() => {
    const map = {}
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
        return { dateKey: date, dateLabel: formattedDate, amount, isOverDaily: dailyBudgetLimit > 0 && amount > dailyBudgetLimit }
      })
  }, [expenses, trip?.startDate, trip?.endDate, dailyBudgetLimit])

  const overBudgetDays = useMemo(() => {
    if (!dailyBudgetLimit) return []
    return dailyChartData.filter(d => d.amount > dailyBudgetLimit)
  }, [dailyChartData, dailyBudgetLimit])

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
        days.push({ date: new Date(date), dateKey, stops, activities, expenses: dayExpenses, total: dayTotal, isOverDaily: dailyBudgetLimit > 0 && dayTotal > dailyBudgetLimit })
      }
    }
    return days
  }, [trip?.startDate, trip?.endDate, trip?.stops, expenses, dailyBudgetLimit])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (search.trim()) count++
    if (categoryFilter !== 'all') count++
    if (startDateFilter) count++
    if (endDateFilter) count++
    if (minAmountFilter) count++
    if (maxAmountFilter) count++
    return count
  }, [search, categoryFilter, startDateFilter, endDateFilter, minAmountFilter, maxAmountFilter])

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(exp => {
        const q = search.toLowerCase()
        const matchesSearch = !q || exp.description.toLowerCase().includes(q) || (exp.notes && exp.notes.toLowerCase().includes(q)) || exp.category.toLowerCase().includes(q)
        const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter
        const expDate = String(exp.date).slice(0, 10)
        const matchesStartDate = !startDateFilter || expDate >= startDateFilter
        const matchesEndDate = !endDateFilter || expDate <= endDateFilter
        const expAmt = Number(exp.amount)
        const matchesMinAmt = !minAmountFilter || expAmt >= Number(minAmountFilter)
        const matchesMaxAmt = !maxAmountFilter || expAmt <= Number(maxAmountFilter)
        return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate && matchesMinAmt && matchesMaxAmt
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date)
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
        if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount)
        if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount)
        if (sortBy === 'desc-asc') return a.description.localeCompare(b.description)
        if (sortBy === 'category-asc') return a.category.localeCompare(b.category)
        return 0
      })
  }, [expenses, search, categoryFilter, startDateFilter, endDateFilter, minAmountFilter, maxAmountFilter, sortBy])

  const clearAllFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setStartDateFilter('')
    setEndDateFilter('')
    setMinAmountFilter('')
    setMaxAmountFilter('')
    setSortBy('date-desc')
  }

  const refreshSummary = (items) => {
    const total = items.reduce((sum, item) => sum + Number(item.amount), 0)
    const byCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount)
      return acc
    }, {})
    setSummary({ total, byCategory })
  }

  const resetForm = () => {
    setForm({ description: '', amount: '', category: 'activities', date: new Date().toISOString().slice(0, 10), notes: '' })
    setEditingExpense(null)
    setFormError('')
  }

  const openAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (expense) => {
    setEditingExpense(expense)
    setForm({ description: expense.description, amount: String(expense.amount), category: expense.category, date: String(expense.date).slice(0, 10), notes: expense.notes || '' })
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

  const exportToCSV = () => {
    if (expenses.length === 0) return
    const headers = ['ID', 'Description', 'Category', 'Amount', 'Currency', 'Date', 'Notes']
    const rows = expenses.map(e => [getId(e), `"${e.description.replace(/"/g, '""')}"`, e.category, e.amount, trip?.currency || 'INR', String(e.date).slice(0, 10), `"${(e.notes || '').replace(/"/g, '""')}"`])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${trip?.name || 'trip'}_expenses_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#4677d9]">
            <Link to={`/trips/${id}`} className="hover:underline">{trip?.name || 'Trip Details'}</Link>
            <span>/</span>
            <span>Financial Manager</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#2d3e86] mt-1">Trip Budget & Cost Breakdown</h1>
          <p className="text-surface-500 text-sm mt-0.5">Monitor expenditures, visualize category splits, and keep within budget limits.</p>
        </div>
        <div className="flex items-center gap-2">
          {expenses.length > 0 && (
            <Button type="button" variant="outline" size="sm" className="!rounded-xl text-xs font-semibold" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={exportToCSV}>Export CSV</Button>
          )}
          <Button type="button" className="!bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl text-sm font-semibold shadow-md" leftIcon={<Plus className="w-4 h-4" />} onClick={openAddModal}>Add Expense</Button>
        </div>
      </div>

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
          <button type="button" className="ml-auto text-xs font-semibold underline" onClick={() => setError('')}>Dismiss</button>
        </div>
      )}

      {isOverBudget ? (
        <div className="rounded-2xl border-2 border-danger-300 bg-danger-50/90 p-4 md:p-5 flex items-start gap-4 shadow-sm animate-pulse-once">
          <div className="w-10 h-10 rounded-xl bg-danger-100 text-danger-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-danger-900 text-base">Trip Budget Exceeded!</h3>
            <p className="text-sm text-danger-700 mt-1 leading-relaxed">
              You have spent <strong className="font-semibold">{formatCurrency(spent, trip?.currency)}</strong>, which is{' '}
              <strong className="font-semibold">{formatCurrency(Math.abs(remaining), trip?.currency)}</strong> over your allocated budget of{' '}
              <strong className="font-semibold">{formatCurrency(budget, trip?.currency)}</strong> ({percentUsed}% used).
            </p>
          </div>
        </div>
      ) : isApproachingBudget ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs text-amber-900">
            <strong className="font-semibold">Budget Warning:</strong> You have consumed{' '}
            <strong className="font-bold">{percentUsed}%</strong> of your allocated budget. Only{' '}
            <strong className="font-bold">{formatCurrency(remaining, trip?.currency)}</strong> remaining.
          </div>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Total Budget</span><div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"><Wallet className="w-4 h-4" /></div></div>
          <p className="text-2xl md:text-3xl font-display font-bold text-surface-900 mt-2">{formatCurrency(budget, trip?.currency)}</p>
          <p className="text-xs text-surface-500 mt-1">Planned for {tripDays} day{tripDays === 1 ? '' : 's'}</p>
        </div>
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Spent So Far</span><div className="w-9 h-9 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center"><Receipt className="w-4 h-4" /></div></div>
          <p className="text-2xl md:text-3xl font-display font-bold text-surface-900 mt-2">{formatCurrency(spent, trip?.currency)}</p>
          <div className="flex items-center gap-1 text-xs font-semibold mt-1"><span className={isOverBudget ? 'text-danger-600' : 'text-primary-600'}>{percentUsed}% of total budget</span></div>
        </div>
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Remaining</span><div className={`w-9 h-9 rounded-xl flex items-center justify-center ${remaining < 0 ? 'bg-danger-50 text-danger-600' : 'bg-success-50 text-success-600'}`}><CircleDollarSign className="w-4 h-4" /></div></div>
          <p className={`text-2xl md:text-3xl font-display font-bold mt-2 ${remaining < 0 ? 'text-danger-600' : 'text-success-700'}`}>{formatCurrency(remaining, trip?.currency)}</p>
          <p className="text-xs text-surface-500 mt-1">{remaining < 0 ? 'Exceeded limit' : 'Available balance'}</p>
        </div>
        <div className="card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-surface-500">Avg Spend / Day</span><div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Calendar className="w-4 h-4" /></div></div>
          <p className="text-2xl md:text-3xl font-display font-bold text-surface-900 mt-2">{formatCurrency(avgCostPerDay, trip?.currency)}</p>
          <p className="text-xs text-surface-500 mt-1">{dailyBudgetLimit > 0 ? `Target: ${formatCurrency(dailyBudgetLimit, trip?.currency)} / day` : `${tripDays} day trip`}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="card p-5 md:p-6 lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-[#4677d9]" /> Cost by Category</h2>
              <p className="text-xs text-surface-500 mt-0.5">Distribution across major travel expenditures</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-100 text-surface-700">{chartData.length} active</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 items-center flex-1">
            <div className="h-56 relative flex items-center justify-center">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} activeIndex={activeCategory ? chartData.findIndex(i => i.name === activeCategory) : undefined} activeShape={(props) => <Sector {...props} outerRadius={(props.outerRadius || 80) + 8} />} onMouseEnter={(_, index) => setActiveCategory(chartData[index]?.name)} onMouseLeave={() => setActiveCategory(null)}>{chartData.map(item => (<Cell key={item.name} fill={item.color} />))}</Pie>
                    <Tooltip formatter={(val) => formatCurrency(val, trip?.currency)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="text-center text-xs text-surface-400"><Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />No expenses recorded yet</div>}
            </div>
            <div className="space-y-2 text-xs">
              {EXPENSE_CATEGORIES.map(({ value, label, color }) => {
                const amount = summary.byCategory[value] || 0
                const Icon = categoryIcons[value] || ShoppingBag
                const pct = spent > 0 ? Math.round((amount / spent) * 100) : 0
                const isActive = activeCategory === label
                return (
                  <button type="button" key={value} onClick={() => setCategoryFilter(categoryFilter === value ? 'all' : value)} className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left ${isActive || categoryFilter === value ? 'border-primary-300 bg-primary-50/50 shadow-sm' : 'border-surface-100 hover:bg-surface-50'}`}>
                    <div className="flex items-center gap-2 min-w-0"><div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20`, color }}><Icon className="w-3.5 h-3.5" /></div><span className="font-medium text-surface-800 truncate">{label}</span></div>
                    <div className="text-right shrink-0"><span className="font-semibold text-surface-900">{formatCurrency(amount, trip?.currency)}</span><span className="text-[10px] text-surface-400 ml-1">({pct}%)</span></div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
        <section className="card p-5 md:p-6 lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#4677d9]" /> Daily Spending Flow</h2>
              <p className="text-xs text-surface-500 mt-0.5">Expenses incurred per day throughout the journey</p>
            </div>
          </div>
          <div className="h-56 flex-1">
            {dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(val) => [formatCurrency(val, trip?.currency), 'Spent']} labelFormatter={(label) => `Date: ${label}`} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>{dailyChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.isOverDaily ? '#ef4444' : '#4677d9'} />))}</Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-xs text-surface-400">No daily spending recorded</div>}
          </div>
        </section>
      </div>

      <div className="flex border-b border-surface-200 gap-2">
        <button type="button" onClick={() => setActiveTab('overview')} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${activeTab === 'overview' ? 'border-[#4677d9] text-[#2d3e86]' : 'border-transparent text-surface-500'}`}>Day-by-Day</button>
        <button type="button" onClick={() => setActiveTab('history')} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${activeTab === 'history' ? 'border-[#4677d9] text-[#2d3e86]' : 'border-transparent text-surface-500'}`}>Expense History ({expenses.length})</button>
      </div>

      {activeTab === 'overview' && (
        <section className="card overflow-hidden">
          {itineraryDays.length === 0 ? (
            <div className="p-12 text-center text-sm text-surface-400">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 text-surface-300" />
              <p>Set trip start and end dates to enable day-by-day itinerary tracking.</p>
              <Link to={`/trips/${id}/edit`} className="inline-block mt-3 font-semibold text-[#4677d9] hover:underline">Set Trip Dates →</Link>
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {itineraryDays.map((day, index) => (
                <div key={day.dateKey} className="p-4 md:p-6 hover:bg-surface-50/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-[#2d3e86] px-3 py-1 text-xs font-semibold text-white">Day {index + 1}</span>
                      <span className="font-display font-bold text-surface-900 text-sm">{day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <span className="font-bold text-surface-900 text-sm">Total: {formatCurrency(day.total, trip?.currency)}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-surface-200 bg-surface-50/80 p-3.5">
                      <p className="text-[11px] font-semibold uppercase text-surface-500 mb-2">Planned Activities</p>
                      {day.activities.length > 0 ? day.activities.map(act => (
                        <div key={getId(act)} className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-surface-100 text-xs mb-1">
                          <p className="font-medium text-surface-800 truncate">{act.activity?.name || act.customName}</p>
                          <span className="font-semibold">{act.cost ? formatCurrency(act.cost, trip?.currency) : 'Free'}</span>
                        </div>
                      )) : <p className="text-xs text-surface-400">No activities.</p>}
                    </div>
                    <div className="rounded-xl border border-surface-200 bg-surface-50/80 p-3.5">
                      <p className="text-[11px] font-semibold uppercase text-surface-500 mb-2">Expenses</p>
                      {day.expenses.length > 0 ? day.expenses.map(exp => (
                        <div key={getId(exp)} className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg border border-surface-100 text-xs mb-1">
                          <p className="font-medium text-surface-800 truncate">{exp.description}</p>
                          <span className="font-semibold">{formatCurrency(exp.amount, trip?.currency)}</span>
                        </div>
                      )) : <p className="text-xs text-surface-400">No expenses.</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'history' && (
        <section className="card overflow-hidden">
          <div className="p-4 md:p-5 border-b border-surface-100 space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input className="input pl-10" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search description, category, or note..." />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select className="input md:w-40 text-xs font-medium" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  {EXPENSE_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}
                </select>
                <select className="input md:w-44 text-xs font-medium" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="date-desc">Date (Newest first)</option>
                  <option value="date-asc">Date (Oldest first)</option>
                  <option value="amount-desc">Amount (Highest first)</option>
                  <option value="amount-asc">Amount (Lowest first)</option>
                  <option value="desc-asc">Description (A-Z)</option>
                  <option value="category-asc">Category (A-Z)</option>
                </select>
                <button type="button" onClick={() => setShowAdvancedFilters(prev => !prev)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold ${showAdvancedFilters || activeFiltersCount > 0 ? 'border-[#4677d9] bg-primary-50 text-[#2d3e86]' : 'border-surface-200'}`}>
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                </button>
              </div>
            </div>
            {showAdvancedFilters && (
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-surface-50 rounded-xl border border-surface-200 animate-fade-in text-xs">
                <div><label className="text-[10px] font-semibold text-surface-600 mb-1 block">From Date</label><input type="date" className="input text-xs" value={startDateFilter} onChange={e => setStartDateFilter(e.target.value)} /></div>
                <div><label className="text-[10px] font-semibold text-surface-600 mb-1 block">To Date</label><input type="date" className="input text-xs" value={endDateFilter} onChange={e => setEndDateFilter(e.target.value)} /></div>
                <div><label className="text-[10px] font-semibold text-surface-600 mb-1 block">Min Amount</label><input type="number" className="input text-xs" value={minAmountFilter} onChange={e => setMinAmountFilter(e.target.value)} /></div>
                <div><label className="text-[10px] font-semibold text-surface-600 mb-1 block">Max Amount</label><input type="number" className="input text-xs" value={maxAmountFilter} onChange={e => setMaxAmountFilter(e.target.value)} /></div>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-surface-500 pt-1">
              <span>Showing <strong>{filteredExpenses.length}</strong> of <strong>{expenses.length}</strong> expenses</span>
              {activeFiltersCount > 0 && <button type="button" onClick={clearAllFilters} className="flex items-center gap-1 text-[#4677d9] font-semibold hover:underline"><RotateCcw className="w-3 h-3" /> Reset all filters</button>}
            </div>
          </div>
          {loading ? <div className="p-10 text-center text-sm text-surface-400">Loading...</div> : filteredExpenses.length === 0 ? <div className="p-12 text-center">No matches found.</div> : (
            <div className="divide-y divide-surface-100">
              {filteredExpenses.map((exp) => {
                const Icon = categoryIcons[exp.category] || ShoppingBag
                const color = EXPENSE_COLORS[exp.category] || '#64748b'
                return (
                  <div key={getId(exp)} className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-surface-50/70">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs" style={{ backgroundColor: `${color}15`, color }}><Icon className="w-5 h-5" /></div>
                      <div className="min-w-0">
                        <p className="font-semibold text-surface-900 truncate">{exp.description}</p>
                        <p className="text-xs text-surface-500">{new Date(`${exp.date}T00:00:00`).toLocaleDateString()} · {exp.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-surface-900">{formatCurrency(exp.amount, trip?.currency)}</span>
                      <button className="p-1 text-surface-400 hover:text-primary-600" onClick={() => openEditModal(exp)}><Edit3 className="w-4 h-4" /></button>
                      <button className="p-1 text-surface-400 hover:text-danger-600" onClick={() => handleDelete(exp)}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">{editingExpense ? 'Edit Expense' : 'Log New Expense'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                <div>
                  <label className="input-label">Category</label>
                  <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{EXPENSE_CATEGORIES.map(cat => (<option key={cat.value} value={cat.value}>{cat.label}</option>))}</select>
                </div>
              </div>
              <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" loading={saving}>{editingExpense ? 'Update' : 'Save'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
