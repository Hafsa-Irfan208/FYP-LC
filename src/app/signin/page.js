"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false, // Disable automatic redirection
        email,
        password,
      });

      if (result.error) {
        setError(result.error); // Display error returned by next-auth
      } else {
        // Fetch the user's session to get their role
        const session = await fetch("/api/auth/session").then((res) => res.json());

        if (session?.user?.role === "student") {
          router.push("/StudentDashboard");
        } else if (session?.user?.role === "teacher") {
          router.push("/TeacherDashboard");
        } else {
          setError("Invalid role. Please contact support.");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-500 to-emerald-800 relative overflow-hidden">
      {/* Background Illustration with enhanced overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 to-blue-700/40 z-10"></div>
        <Image
          src="/signin.png"
          alt="Background Illustration"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-30"
        />
      </div>

      {/* Animated particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '3s', opacity: 0.6 }}></div>
      <div className="absolute top-3/4 left-1/2 w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDuration: '4s', opacity: 0.4 }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '5s', opacity: 0.5 }}></div>
      
      {/* Sign-In Form with glass morphism effect */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] p-8 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(8,_112,_184,_0.3)]">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="LEETCONNECT Logo"
            width={220}
            height={70}
            className="drop-shadow-md transform transition-transform hover:scale-105 duration-300"
          />
        </div>
        
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-emerald-600 text-transparent bg-clip-text mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Log in to continue your coding journey
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-teal-700 font-semibold mb-2 transition-colors group-focus-within:text-teal-600">
              Email
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="group">
            <label className="block text-teal-700 font-semibold mb-2 transition-colors group-focus-within:text-teal-600">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            <div className="flex justify-end mt-2">
              <a href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-800 hover:underline transition-colors">
                Forgot Password?
              </a>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-lg rounded-lg shadow-md hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-teal-600 font-medium hover:text-teal-800 hover:underline transition-colors">
              Create an account
            </a>
          </p>
        </div>
        
        <div className="mt-6 flex items-center justify-center space-x-4">
          <span className="w-10 h-px bg-gray-300"></span>
          <span className="text-sm text-gray-500">Secure login</span>
          <span className="w-10 h-px bg-gray-300"></span>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-teal-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
    </div>
  );
};

export default LoginPage;
