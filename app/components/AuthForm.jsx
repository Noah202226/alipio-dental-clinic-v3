"use client";

import { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";

export default function AuthForm({ handleSubmit, submitType, onToggle }) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleSubmit(e);
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSignUp = submitType === "Sign Up" || submitType === "Create Account";

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            {isSignUp ? "Join Our Clinic" : "Welcome Back"}
          </h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium">
            {isSignUp
              ? "Create an account to manage your dental records."
              : "Please enter your details to access your dashboard."}
          </p>
        </div>

        {/* Full Name Field - Only shows on Sign Up */}
        {isSignUp && (
          <div className="space-y-2">
            <label className="text-[11px] uppercase font-bold text-zinc-400 tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                name="name"
                required={isSignUp}
                placeholder="John Doe"
                className="block w-full pl-11 pr-4 py-4 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase font-bold text-zinc-400 tracking-widest ml-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="block w-full pl-11 pr-4 py-4 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase font-bold text-zinc-400 tracking-widest ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="block w-full pl-11 pr-4 py-4 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] group overflow-hidden mt-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span className="relative z-10">{submitType}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        </button>

        {/* Toggle Logic */}
        <div className="pt-4 text-center">
          <p className="text-sm text-zinc-500 font-medium">
            {isSignUp ? "Already have an account?" : "New to Alipio Dental?"}{" "}
            <button
              type="button"
              onClick={onToggle}
              className="text-emerald-600 font-bold hover:underline underline-offset-4"
              disabled={loading}
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
