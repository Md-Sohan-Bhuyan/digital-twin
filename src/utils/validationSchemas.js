import { z } from 'zod';

export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address');

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

export const forgotPasswordEmailSchema = z.object({
  email: emailSchema,
});

export const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(10, 'Password must be at least 10 characters')
      .max(128, 'Password is too long')
      .regex(/[A-Z]/, 'Add at least 1 uppercase letter')
      .regex(/[a-z]/, 'Add at least 1 lowercase letter')
      .regex(/[0-9]/, 'Add at least 1 number'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

