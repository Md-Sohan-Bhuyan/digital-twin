import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { format } from 'date-fns';

// In-memory password reset tokens (In production, use backend)
const resetTokens = new Map();

function ForgotPassword({ onBackToLogin, onResetComplete }) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Generate OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const otpCode = generateOTP();
      const token = `token-${Date.now()}`;
      
      // Store token with expiry (10 minutes)
      resetTokens.set(email, {
        otp: otpCode,
        token,
        expiresAt: Date.now() + 10 * 60 * 1000,
      });

      // In production, send email with OTP
      console.log(`OTP for ${email}: ${otpCode}`); // For demo purposes
      
      // Show OTP in alert for demo
      alert(`Demo OTP for ${email}: ${otpCode}\n\nIn production, this would be sent via email.`);
      
      setSuccess('OTP sent to your email address');
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    const tokenData = resetTokens.get(email);
    
    if (!tokenData) {
      setError('Invalid or expired OTP. Please request a new one.');
      setLoading(false);
      return;
    }

    if (Date.now() > tokenData.expiresAt) {
      setError('OTP has expired. Please request a new one.');
      resetTokens.delete(email);
      setLoading(false);
      return;
    }

    if (tokenData.otp !== otp) {
      setError('Invalid OTP. Please try again.');
      setLoading(false);
      return;
    }

    setSuccess('OTP verified successfully');
    setStep(3);
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const tokenData = resetTokens.get(email);
    
    if (!tokenData || Date.now() > tokenData.expiresAt) {
      setError('Session expired. Please start again.');
      setStep(1);
      setLoading(false);
      return;
    }

    // Simulate API call to reset password
    setTimeout(() => {
      // In production, call API to reset password
      // For demo, we'll update the auth store
      try {
        // Update password in localStorage (demo only)
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[email]) {
          users[email].password = newPassword; // In production, hash this
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Clear token
        resetTokens.delete(email);
        
        setSuccess('Password reset successfully!');
        setStep(4);
        setLoading(false);
      } catch (err) {
        setError('Failed to reset password. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Reset Password'}
            {step === 4 && 'Success!'}
          </h1>
          <p className="text-gray-400">
            {step === 1 && 'Enter your email to receive a password reset OTP'}
            {step === 2 && 'Enter the OTP sent to your email'}
            {step === 3 && 'Create a new password'}
            {step === 4 && 'Your password has been reset successfully'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-4 flex items-center gap-2"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm mb-4 flex items-center gap-2"
          >
            <CheckCircle size={18} />
            {success}
          </motion.div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Sending...
                </>
              ) : (
                'Send OTP'
              )}
            </motion.button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center text-2xl tracking-widest px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
              />
              <p className="text-gray-400 text-xs mt-2 text-center">
                OTP sent to: {email}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </motion.button>
            </div>
            <button
              onClick={handleResendOTP}
              className="w-full text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <p className="text-white text-lg">Password reset successfully!</p>
            <p className="text-gray-400 text-sm">
              You can now login with your new password.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResetComplete || onBackToLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Go to Login
            </motion.button>
          </div>
        )}

        {/* Back to Login */}
        {step !== 4 && (
          <button
            onClick={onBackToLogin}
            className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
