import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, Eye, EyeOff, HelpCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import ForgotPassword from './ForgotPassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validationSchemas';
import { useNavigate } from 'react-router';

function LoginPage({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const schema = useMemo(() => loginSchema, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    setError('');
    setSuccess('');
    setLoading(true); // keep existing UI behavior

    try {
      const result = login(values.email, values.password);
      if (result.success) {
        setSuccess('Signed in successfully');
        onLoginSuccess?.(result.user);
        setTimeout(() => navigate('/dashboard', { replace: true }), 300);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBackToLogin={() => setShowForgotPassword(false)}
        onResetComplete={() => {
          setShowForgotPassword(false);
          setError('');
          setSuccess('Password reset successfully! Please login with your new password.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Digital Twin Platform</h1>
          <p className="text-gray-400">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="admin@digitaltwin.com"
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-300">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-300">{errors.password.message}</p>
            )}
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-300 text-sm"
            >
              {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </motion.button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors mx-auto"
          >
            <HelpCircle size={16} />
            Forgot Password?
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-gray-400">
            <button
              type="button"
              className="block w-full text-left hover:text-white transition-colors"
              onClick={() => {
                setValue('email', 'admin@digitaltwin.com');
                setValue('password', 'password123');
              }}
            >
              Admin: admin@digitaltwin.com / password123
            </button>
            <button
              type="button"
              className="block w-full text-left hover:text-white transition-colors"
              onClick={() => {
                setValue('email', 'operator@digitaltwin.com');
                setValue('password', 'password123');
              }}
            >
              Operator: operator@digitaltwin.com / password123
            </button>
            <button
              type="button"
              className="block w-full text-left hover:text-white transition-colors"
              onClick={() => {
                setValue('email', 'viewer@digitaltwin.com');
                setValue('password', 'password123');
              }}
            >
              Viewer: viewer@digitaltwin.com / password123
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
