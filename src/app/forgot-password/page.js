"use client";

import { useState } from "react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Code, Step 3: New Password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Verification code sent to your email");
        setStep(2);
      } else {
        setError(data.message || "Failed to send verification code");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length < 4) {
      setError("Please enter a valid verification code");
      return;
    }
    
    setError("");
    setMessage("Verification successful");
    setStep(3);
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    // Password validation
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "Password reset successfully");
        setTimeout(() => {
          // Redirect to login page after success
          window.location.href = "/signin";
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Progress indicator calculation
  const progressPercentage = (step - 1) * 50;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-emerald-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 to-blue-700/40 z-10"></div>
        <div className="absolute w-full h-full bg-[url('/signin.png')] bg-cover opacity-30"></div>
      </div>
      
      {/* Animated decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '3s', opacity: 0.6 }}></div>
      <div className="absolute top-3/4 left-1/2 w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDuration: '4s', opacity: 0.4 }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '5s', opacity: 0.5 }}></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-teal-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>

      {/* Card with glassmorphism effect */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)]">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="LEETCONNECT Logo"
            width={200}
            height={65}
            className="drop-shadow-md"
          />
        </div>

        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-teal-600 to-emerald-600 text-transparent bg-clip-text mb-2">
          Reset Your Password
        </h2>
        
        {/* Progress bar */}
        <div className="relative pt-1 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold inline-block text-teal-600">
              Step {step} of 3
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-teal-600">
                {progressPercentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 text-xs flex rounded bg-teal-200">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-500 ease-in-out"
            ></div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${step >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <span className="text-xs font-medium">Email</span>
          </div>
          <div className={`flex-1 h-px ${step >= 2 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${step >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3v2H7a1 1 0 000 2h1v1a1 1 0 01-1 1 1 1 0 100 2h6a1 1 0 100-2H9.83c.11-.313.17-.65.17-1v-1h1a1 1 0 100-2h-1V7a1 1 0 112 0 1 1 0 102 0 3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-medium">Verify</span>
          </div>
          <div className={`flex-1 h-px ${step >= 3 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${step >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-medium">Reset</span>
          </div>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center text-sm text-gray-600 mb-4">
              Enter your email address and we'll send you a verification code to reset your password
            </div>
            <div className="group">
              <label className="block text-teal-700 font-semibold mb-2 transition-colors group-focus-within:text-teal-600">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </div>
        )}

        {/* Step 2: Verification Code */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center text-sm text-gray-600 mb-4">
              Enter the verification code we've sent to your email
            </div>
            <div className="group">
              <label className="block text-teal-700 font-semibold mb-2 transition-colors group-focus-within:text-teal-600">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3v2H7a1 1 0 000 2h1v1a1 1 0 01-1 1 1 1 0 100 2h6a1 1 0 100-2H9.83c.11-.313.17-.65.17-1v-1h1a1 1 0 100-2h-1V7a1 1 0 112 0 1 1 0 102 0 3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
            <button
              onClick={handleVerifyCode}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transform transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Verify Code
            </button>
            <div className="text-center mt-4">
              <button
                onClick={() => setStep(1)}
                className="text-teal-600 text-sm hover:text-teal-800 hover:underline transition-colors"
              >
                ← Back to email
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center text-sm text-gray-600 mb-4">
              Create a new password for your account
            </div>
            <div className="group">
              <label className="block text-teal-700 font-semibold mb-2 transition-colors group-focus-within:text-teal-600">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</div>
            </div>
            <div className="group">
              <label className="block text-teal-700 font-semibold mb-2 transition-colors group-focus-within:text-teal-600">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
            <div className="text-center mt-4">
              <button
                onClick={() => setStep(2)}
                className="text-teal-600 text-sm hover:text-teal-800 hover:underline transition-colors"
              >
                ← Back to verification
              </button>
            </div>
          </div>
        )}

        {/* Error and success messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer with back to login link */}
        <div className="mt-6 text-center">
          <a href="/signin" className="text-teal-600 text-sm hover:text-teal-800 hover:underline transition-colors">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
