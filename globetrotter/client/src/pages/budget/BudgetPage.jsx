import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarDays, Edit3, Plus, Receipt, Search, SlidersHorizontal, Trash2, WalletCards, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from 'recharts'
import api from '../../services/api.js'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import { fetchTrip, selectCurrentTrip } from '../../store/slices/tripsSlice.js'
import { expenseSchema } from '../../utils/validationSchemas.js'
import { EXPENSE_CATEGORIES, formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'

const getId = item => item.id ?? item._id

export default function BudgetPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const trip = useSelector(selectCurrentTrip)
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState({ total: 0, byCategory: {} })
  const [form, setForm] = useState({ description: '', amount: '', category: 'activities', date: new Date().toISOString().slice(0, 10), notes: '' })
  const [editingExpense, setEditingExpense] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [groupBy, setGroupBy] = useState('day')
  const [sortBy, setSortBy] = useState('date')
  const [activeCategory, setActiveCategory] = useState(null)
  const [formError, setFormError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!trip || String(getId(trip)) !== id) dispatch(fetchTrip(id))
  }, [dispatch, id, trip])

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get(`/expenses/trip/${id}`)
      .then(({ data }) => {
        if (active) {
          setExpenses(data.expenses)
          setSummary(data.summary)
        }
      })
      .catch((requestError) => active && setError(requestError.response?.data?.message || 'Could not load expenses'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  const budget = trip?.budget || 0
  const spent = summary.total || 0
  const remaining = budget - spent
  const chartData = EXPENSE_CATEGORIES
    .map(({ value, label, color }) => ({ name: label, value: summary.byCategory[value] || 0, color }))
    .filter(item => item.value > 0)

  const selectedCategory = activeCategory ? chartData.find(item => item.name === activeCategory) : null
  const selectedCategoryExpenses = selectedCategory ? expenses.filter(expense => EXPENSE_CATEGORIES.find(category => category.value === expense.category)?.label === selectedCategory.name) : []
  const detailExpenses = selectedCategory ? selectedCategoryExpenses : expenses
  const detailTotal = selectedCategory ? selectedCategory.value : spent

  const refreshSummary = (items) => {
    setSummary({
      total: items.reduce((total, item) => total + Number(item.amount), 0),
      byCategory: items.reduce((categories, item) => ({ ...categories, [item.category]: (categories[item.category] || 0) + Number(item.amount) }), {}),
    })
  }

  const resetForm = () => {
    setForm({ description: '', amount: '', category: 'activities', date: new Date().toISOString().slice(0, 10), notes: '' })
    setEditingExpense(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = expenseSchema.safeParse(form)
    if (!result.success) {
      setFormError(result.error.issues[0].message)
      return
    }
    setFormError('')
    setSaving(true)
    try {
      const { data } = editingExpense
        ? await api.put(`/expenses/${getId(editingExpense)}`, result.data)
        : await api.post('/expenses', { ...result.data, tripId: id })
      const nextExpenses = editingExpense ? expenses.map(item => getId(item) === getId(data.expense) ? data.expense : item) : [data.expense, ...expenses]
      setExpenses(nextExpenses)
      refreshSummary(nextExpenses)
      resetForm()
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Could not save expense')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete "${expense.description}"?`)) return
    try {
      await api.delete(`/expenses/${getId(expense)}`)
      setExpenses(current => current.filter(item => getId(item) !== getId(expense)))
      setSummary(current => ({
        total: current.total - expense.amount,
        byCategory: { ...current.byCategory, [expense.category]: Math.max(0, (current.byCategory[expense.category] || 0) - expense.amount) },
      }))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete expense')
    }
  }

  const startEditing = (expense) => {
    setEditingExpense(expense)
    setForm({ description: expense.description, amount: String(expense.amount), category: expense.category, date: String(expense.date).slice(0, 10), notes: expense.notes || '' })
    setFormError('')
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (categoryFilter === 'all' || expense.category === categoryFilter)
  })

  const itineraryDays = []
  if (trip?.startDate && trip?.endDate) {
    for (let date = new Date(trip.startDate); date <= new Date(trip.endDate); date.setDate(date.getDate() + 1)) {
      const dateKey = date.toISOString().slice(0, 10)
      const stops = (trip.stops || []).filter(stop => dateKey >= String(stop.arrivalDate).slice(0, 10) && dateKey <= String(stop.departureDate).slice(0, 10))
      const activities = stops.flatMap(stop => (stop.activities || []).filter(activity => !activity.scheduledDate || String(activity.scheduledDate).slice(0, 10) === dateKey).map(activity => ({ ...activity, stop })))
      const dayExpenses = expenses.filter(expense => String(expense.date).slice(0, 10) === dateKey)
      itineraryDays.push({ date: new Date(date), stops, activities, expenses: dayExpenses })
    }
  }

  const sortedExpenses = [...filteredExpenses].sort((first, second) => sortBy === 'amount' ? second.amount - first.amount : new Date(second.date) - new Date(first.date))

  const dailyTotals = Object.entries(expenses.reduce((days, expense) => ({ ...days, [expense.date.slice(0, 10)]: (days[expense.date.slice(0, 10)] || 0) + expense.amount }), {})).sort(([a], [b]) => b.localeCompare(a)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-primary-600 font-semibold">{trip?.name || 'Trip budget'}</p>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">Budget tracker</h1>
        <p className="text-surface-500 mt-1">Keep every part of your journey visible.</p>
      </div>

      {error && <div className="alert-error" role="alert">{error}</div>}
      <section className="card overflow-hidden">
        <div className="p-5 md:p-6 border-b border-surface-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div><h2 className="text-xl font-display font-semibold text-surface-900">Itinerary for a selected place</h2><p className="text-sm text-surface-500 mt-1">Plan activities and expenses side by side.</p></div>
            <div className="flex items-center gap-2 text-sm text-surface-500"><SlidersHorizontal className="w-4 h-4" /><span>Organize view</span></div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-5">
            <div className="relative flex-1"><Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className="input pl-9" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search activities or expenses" /></div>
            <label className="relative"><span className="sr-only">Group by</span><select className="input md:w-36 pr-8" value={groupBy} onChange={event => setGroupBy(event.target.value)}><option value="day">Group by day</option><option value="category">Group by type</option></select></label>
            <label className="relative"><span className="sr-only">Filter</span><select className="input md:w-36 pr-8" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}><option value="all">All expenses</option>{EXPENSE_CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
            <label className="relative"><span className="sr-only">Sort by</span><select className="input md:w-36 pr-8" value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="date">Sort by date</option><option value="amount">Sort by amount</option></select></label>
          </div>
        </div>
        {itineraryDays.length === 0 ? <div className="p-8 text-center text-sm text-surface-400">Set trip dates to build your day-by-day budget view.</div> : <div className="divide-y divide-surface-100">{itineraryDays.map((day, index) => {
          const dayExpenses = day.expenses.filter(expense => categoryFilter === 'all' || expense.category === categoryFilter).filter(expense => !search || expense.description.toLowerCase().includes(search.toLowerCase()))
          const dayActivities = day.activities.filter(activity => !search || (activity.activity?.name || activity.customName || '').toLowerCase().includes(search.toLowerCase()))
          return <div key={day.date.toISOString()} className="p-4 md:p-5"><div className="flex items-center gap-3 mb-4"><span className="rounded-lg bg-[#2d3e86] px-3 py-1.5 text-xs font-semibold text-white">Day {index + 1}</span><span className="text-sm font-semibold text-surface-900">{day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>{day.stops[0] && <span className="text-xs text-surface-500">{day.stops[0].city?.name || day.stops[0].customCityName || 'Destination'}</span>}</div><div className="grid lg:grid-cols-2 gap-3"><div className="rounded-xl border border-surface-100 bg-surface-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-surface-400 mb-2">Physical activity</p>{dayActivities.length ? dayActivities.map(activity => <div key={getId(activity)} className="flex items-center justify-between gap-3 py-2 border-b last:border-0 border-surface-200"><span className="text-sm text-surface-700 truncate">{activity.activity?.name || activity.customName || 'Activity'}</span><span className="text-xs text-surface-500 whitespace-nowrap">{activity.startTime || 'Planned'}</span></div>) : <p className="text-sm text-surface-400 py-2">No activities planned.</p>}</div><div className="rounded-xl border border-surface-100 bg-surface-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-surface-400 mb-2">Expense</p>{dayExpenses.length ? dayExpenses.map(expense => <div key={getId(expense)} className="flex items-center justify-between gap-3 py-2 border-b last:border-0 border-surface-200"><span className="text-sm text-surface-700 truncate">{expense.description}</span><span className="text-sm font-semibold text-surface-900 whitespace-nowrap">{formatCurrency(expense.amount, trip?.currency)}</span></div>) : <p className="text-sm text-surface-400 py-2">No expenses recorded.</p>}</div></div></div>
        })}</div>}
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ['Trip budget', formatCurrency(budget, trip?.currency), 'bg-primary-50 text-primary-700'],
          ['Spent so far', formatCurrency(spent, trip?.currency), 'bg-accent-50 text-accent-700'],
          ['Remaining', formatCurrency(remaining, trip?.currency), remaining < 0 ? 'bg-danger-50 text-danger-700' : 'bg-success-50 text-success-700'],
        ].map(([label, value, color]) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><WalletCards className="w-5 h-5" /></div>
            <p className="text-sm text-surface-500 mt-4">{label}</p>
            <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="card p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div><h2 className="section-title">Expense breakdown</h2><p className="text-sm text-surface-500">{budgetPercentage(spent, budget)}% of your planned budget used</p></div>
            <span className="text-sm font-semibold text-surface-700">{formatCurrency(spent, trip?.currency)}</span>
          </div>
          <div className="h-3 bg-surface-100 rounded-full overflow-hidden mb-6"><div className={`h-full rounded-full ${spent > budget ? 'bg-danger-500' : 'bg-primary-500'}`} style={{ width: `${budget ? Math.min(100, (spent / budget) * 100) : 0}%` }} /></div>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="h-56">{chartData.length ? <ResponsiveContainer><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} activeIndex={activeCategory ? chartData.findIndex(item => item.name === activeCategory) : undefined} activeShape={(props) => <Sector {...props} outerRadius={(props.outerRadius || 82) + 8} />} onMouseEnter={(_, index) => setActiveCategory(chartData[index]?.name)} onMouseLeave={() => setActiveCategory(null)}>{chartData.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => formatCurrency(value, trip?.currency)} /></PieChart></ResponsiveContainer> : <div className="h-full flex items-center justify-center text-sm text-surface-400">No expenses recorded yet</div>}</div>
            <div className="rounded-2xl bg-surface-50 border border-surface-100 p-4 min-h-56"><p className="text-xs font-semibold uppercase tracking-wide text-surface-400">Expense details</p>{detailExpenses.length ? <><div className="flex items-end justify-between gap-3 mt-2"><div><p className="text-lg font-semibold text-surface-900">{selectedCategory?.name || 'All expenses'}</p><p className="text-xs text-surface-500">{detailExpenses.length} transaction{detailExpenses.length === 1 ? '' : 's'}</p></div><span className="text-lg font-bold text-surface-900">{formatCurrency(detailTotal, trip?.currency)}</span></div><div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">{detailExpenses.map(expense => <div key={getId(expense)} className="flex items-start justify-between gap-3 text-sm"><div className="min-w-0"><p className="text-surface-700 truncate">{expense.description}</p><p className="text-xs text-surface-400 mt-0.5">{new Date(expense.date).toLocaleDateString()}{expense.notes ? ` · ${expense.notes}` : ''}</p></div><span className="font-medium text-surface-900 whitespace-nowrap">{formatCurrency(expense.amount, trip?.currency)}</span></div>)}</div></> : <p className="text-sm text-surface-400 mt-4">Add an expense to see details.</p>}</div>
          </div>
        </section>

        <section className="card p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-4"><h2 className="section-title">{editingExpense ? 'Edit expense' : 'Add expense'}</h2>{editingExpense && <button type="button" className="text-surface-400 hover:text-surface-700" aria-label="Cancel editing" onClick={resetForm}><X className="w-4 h-4" /></button>}</div>
          {formError && <p className="input-error-msg mb-3" role="alert">{formError}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Description" placeholder="e.g. Train to Paris" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} required />
            <Input label={`Amount${trip?.currency ? ` (${trip.currency})` : ''}`} type="number" min="0.01" step="0.01" placeholder="0" value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })} required />
            <div><label className="input-label">Category</label><select className="input" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{EXPENSE_CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}</select></div>
            <Input label="Date" type="date" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} required />
            <Input label="Notes" placeholder="Optional note" value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} />
            <Button type="submit" className="w-full" loading={saving} leftIcon={editingExpense ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>{editingExpense ? 'Save changes' : 'Add expense'}</Button>
          </form>
        </section>
      </div>

      <section className="card overflow-hidden">
        <div className="p-5 border-b border-surface-100 space-y-4"><div className="flex items-center justify-between gap-4"><div><h2 className="section-title">Expense history</h2><p className="text-sm text-surface-500 mt-1">{filteredExpenses.length} of {expenses.length} expenses</p></div><Receipt className="w-5 h-5 text-primary-500" /></div><div className="flex flex-col sm:flex-row gap-3"><div className="relative flex-1"><Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className="input pl-9" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search expenses" /></div><select className="input sm:w-44" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{EXPENSE_CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}</select></div></div>
        {loading ? <p className="p-6 text-sm text-surface-400">Loading expenses...</p> : sortedExpenses.length === 0 ? <div className="p-10 text-center"><Receipt className="w-8 h-8 mx-auto text-surface-300 mb-3" /><p className="text-sm text-surface-500">{expenses.length ? 'No matching expenses.' : 'Your expense list is empty.'}</p></div> : <div className="divide-y divide-surface-100">{sortedExpenses.map(expense => <div key={getId(expense)} className="p-4 flex items-center justify-between gap-4 hover:bg-surface-50"><div className="min-w-0"><p className="font-medium text-surface-900 truncate">{expense.description}</p><p className="text-xs text-surface-500 mt-1 capitalize">{expense.category} · {new Date(expense.date).toLocaleDateString()}{expense.notes ? ` · ${expense.notes}` : ''}</p></div><div className="flex items-center gap-3"><span className="font-semibold text-surface-900 whitespace-nowrap">{formatCurrency(expense.amount, trip?.currency)}</span><button type="button" title="Edit expense" aria-label={`Edit ${expense.description}`} className="text-surface-400 hover:text-primary-600" onClick={() => startEditing(expense)}><Edit3 className="w-4 h-4" /></button><button type="button" title="Delete expense" aria-label={`Delete ${expense.description}`} className="text-surface-400 hover:text-danger-600" onClick={() => handleDelete(expense)}><Trash2 className="w-4 h-4" /></button></div></div>)}</div>}
      </section>

      {dailyTotals.length > 0 && <section className="card p-5"><div className="flex items-center gap-2 mb-4"><CalendarDays className="w-5 h-5 text-primary-500" /><h2 className="section-title">Daily spend</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{dailyTotals.map(([date, total]) => <div key={date} className="rounded-xl bg-surface-50 p-3"><p className="text-xs text-surface-500">{new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p><p className="font-semibold text-surface-900 mt-1">{formatCurrency(total, trip?.currency)}</p></div>)}</div></section>}
    </div>
  )
}
