import { z } from 'zod'

// ─── Auth ─────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:      z.string().email('Invalid email address'),
  password:   z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters').max(50),
  email:           z.string().email('Invalid email address'),
  password:        z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  password:        z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})

// ─── Trip ─────────────────────────────────────────────────────
export const createTripSchema = z.object({
  name:        z.string().min(3, 'Trip name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  startDate:   z.string().min(1, 'Start date is required'),
  endDate:     z.string().min(1, 'End date is required'),
  budget:      z.coerce.number().min(0, 'Budget cannot be negative').optional(),
  coverPhoto:  z.string().optional(),
}).refine(d => new Date(d.endDate) >= new Date(d.startDate), {
  message: 'End date cannot be before start date',
  path:    ['endDate'],
})

// ─── Expense ──────────────────────────────────────────────────
export const expenseSchema = z.object({
  description: z.string().min(2, 'Description required').max(200),
  amount:      z.coerce.number().positive('Amount must be positive'),
  category:    z.enum(['transport', 'stay', 'activities', 'meals', 'other']),
  date:        z.string().min(1, 'Date is required'),
  notes:       z.string().max(300).optional(),
})
