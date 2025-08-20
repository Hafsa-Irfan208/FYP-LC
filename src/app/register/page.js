"use client";

import { useState, useEffect } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    CNIC: "",
    age: "",
    gender: "male", 
    role: "student", 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationStage, setIsVerificationStage] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [timer, setTimer] = useState(30); // Timer for resend button
  const [canResend, setCanResend] = useState(false); // Control resend button availability

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "CNIC") {
      setFormData((prev) => ({ ...prev, CNIC: formatCNIC(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Function to format CNIC with dashes
  const formatCNIC = (cnic) => {
    const clean = cnic.replace(/\D+/g, ""); // Remove non-numeric characters
    return clean.replace(/(\d{5})(\d{7})(\d{1})/, "$1-$2-$3").substring(0, 15); // Add dashes
  };

  // Timer management for Resend Code
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setValidationMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setValidationMessage(result.message || "A 4-digit code has been sent to your email.");
      if (response.ok) {
        setIsVerificationStage(true);
        setTimer(60); // Reset timer for resend code
        setCanResend(false);
      }
    } catch (error) {
      setValidationMessage("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setValidationMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: verificationCode }),
      });

      const result = await response.json();
      setValidationMessage(result.message || "Verification successful!");
      if (response.ok) window.location.href = result.redirectUrl;
    } catch (error) {
      setValidationMessage("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setValidationMessage("");
    try {
      const response = await fetch("/api/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();
      setValidationMessage(result.message || "A new code has been sent to your email.");
      setTimer(30); // Restart timer for resend code
      setCanResend(false);
    } catch (error) {
      setValidationMessage("Failed to resend code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn border border-teal-100">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Decorative */}
          <div className="bg-[#38b2ac] p-8 text-white md:w-1/3 flex flex-col justify-center relative overflow-hidden">
            <div className="animate-fadeIn delay-300 relative z-10">
              <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
              <p className="mb-8 opacity-90">Join our community and unlock a world of possibilities.</p>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#38b2ac" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Easy registration process</p>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#38b2ac" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Secure email verification</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#38b2ac" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm">Access to exclusive features</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                <circle cx="90" cy="90" r="80" stroke="white" strokeWidth="20" />
              </svg>
            </div>
            <div className="absolute top-10 -left-10">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                <circle cx="40" cy="40" r="40" fill="white" />
              </svg>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="p-8 md:p-10 md:w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              {isVerificationStage ? "Verify Your Email" : "Create Account"}
            </h2>
            
            {!isVerificationStage ? (
              <form onSubmit={handleRegisterSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* First Name */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* CNIC */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                    <input
                      type="text"
                      name="CNIC"
                      value={formData.CNIC}
                      onChange={handleInputChange}
                      placeholder="XXXXX-XXXXXXX-X"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Age */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="25"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {validationMessage && (
                  <div className="animate-fadeIn text-center mt-4 mb-4">
                    <p className={validationMessage.includes("successfully") 
                      ? "text-green-800 bg-green-50 p-2 rounded-lg border border-green-200" 
                      : "text-red-800 bg-red-50 p-2 rounded-lg border border-red-200"}>
                      {validationMessage}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-6 w-full py-3.5 text-white font-semibold rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                    isSubmitting 
                      ? "bg-gray-400" 
                      : "bg-[#38b2ac] hover:bg-[#319795]"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
                
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Already have an account? <a href="/signin" className="text-[#38b2ac] hover:text-[#2c9490] font-medium">Sign in</a>
                </p>
              </form>
            ) : (
              <div className="animate-fadeIn p-2">
                <form onSubmit={handleVerifySubmit}>
                  <div className="mb-6 text-center">
                    <div className="mb-8">
                      <div className="w-24 h-24 mx-auto bg-teal-50 rounded-full flex items-center justify-center border-4 border-[#38b2ac]/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#38b2ac]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">
                      We've sent a 4-digit verification code to your email address:
                    </p>
                    <p className="font-semibold text-gray-800 mb-6">{formData.email}</p>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Verification Code
                    </label>
                    <div className="flex justify-center">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 4-digit code"
                        required
                        maxLength="4"
                        className="w-full max-w-xs px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38b2ac] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {validationMessage && (
                    <div className="animate-fadeIn text-center mb-6">
                      <p className={validationMessage.includes("successfully") 
                        ? "text-green-800 bg-green-50 p-2 rounded-lg border border-green-200" 
                        : "text-red-800 bg-red-50 p-2 rounded-lg border border-red-200"}>
                        {validationMessage}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 text-white font-semibold rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                      isSubmitting 
                        ? "bg-gray-400" 
                        : "bg-[#38b2ac] hover:bg-[#319795]"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  <div className="text-sm text-gray-600 mt-6 text-center">
                    {canResend ? (
                      <button
                        onClick={handleResendCode}
                        type="button"
                        className="text-[#38b2ac] hover:text-[#2c9490] font-medium"
                      >
                        Resend Verification Code
                      </button>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        You can resend the code in {timer} seconds
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
}
