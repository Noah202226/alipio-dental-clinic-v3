"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import AuthForm from "../AuthForm";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/authStore";
import { useEffect, useState } from "react";
import {
  Facebook,
  Clock,
  MapPin,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";

export default function Hero() {
  const { login, register, getCurrentUser } = useAuthStore((state) => state);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const user = await login(form.get("email"), form.get("password"));
    if (user) router.push("/");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const user = await register(form.get("email"), form.get("password"));
    if (user) router.push("/");
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center bg-zinc-50 overflow-hidden">
      {/* 1. Services Top Bar */}
      <div className="w-full bg-emerald-900 text-emerald-50 py-3 px-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] flex flex-wrap justify-center gap-x-6 gap-y-2 z-20">
        {[
          "General Dentistry",
          "Orthodontics",
          "Implant",
          "Oral Surgery",
          "Endodontics",
        ].map((service) => (
          <span key={service} className="flex items-center gap-2">
            <span className="h-1 w-1 bg-emerald-400 rounded-full" />
            {service}
          </span>
        ))}
      </div>

      {/* 2. Main Content Grid (7/12 ratio for wider details) */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 items-center w-full max-w-7xl px-6 md:px-12 py-12 lg:py-24 z-10 gap-16">
        {/* Left Section: Clinic Branding (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center self-center lg:self-start gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Accepting New Patients
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/alipio-dental-logo.png"
              alt="Alipio Dental Logo"
              width={200}
              height={110}
              className="mx-auto lg:mx-0 mb-6 drop-shadow-sm"
            />
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-[1.05]">
              Elevating Smiles, <br />
              <span className="text-emerald-600 italic underline decoration-emerald-200 decoration-8 underline-offset-4">
                Since 1989.
              </span>
            </h1>
          </motion.div>

          {/* New: Call to Action - Book Now Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <a
              href="https://appointment-alipio-dental-clinic.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-[2rem] text-lg font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:translate-y-[-2px] active:translate-y-0"
            >
              <CalendarCheck
                size={24}
                className="group-hover:rotate-12 transition-transform"
              />
              Book Appointment Now
            </a>
            <p className="text-zinc-500 text-sm font-medium italic sm:max-w-[200px] text-center sm:text-left leading-tight">
              Join over 30 years of happy smiles in Quezon City.
            </p>
          </motion.div>

          {/* Info Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
          >
            <div className="group flex items-start gap-4 p-5 bg-white/60 rounded-[2rem] border border-zinc-200 shadow-sm hover:border-emerald-200 transition-all">
              <div className="bg-zinc-100 p-3 rounded-2xl text-zinc-500">
                <MapPin size={24} />
              </div>
              <div className="text-left">
                <p className="text-[11px] uppercase font-bold text-zinc-400 mb-1 tracking-widest">
                  Visit Us
                </p>
                <p className="text-base font-medium text-zinc-700 leading-tight">
                  San Simon, Commonwealth Ave, <br />
                  Quezon City, PH
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 p-5 bg-white/60 rounded-[2rem] border border-zinc-200 shadow-sm hover:border-emerald-200 transition-all">
              <div className="bg-zinc-100 p-3 rounded-2xl text-zinc-500">
                <Clock size={24} />
              </div>
              <div className="text-left">
                <p className="text-[11px] uppercase font-bold text-zinc-400 mb-1 tracking-widest">
                  Schedule
                </p>
                <p className="text-base font-medium text-zinc-700">Mon — Sat</p>
                <p className="text-xs text-emerald-600 font-bold mt-1 uppercase tracking-tighter">
                  9:00 AM — 6:00 PM
                </p>
              </div>
            </div>

            {/* Dark Primary Contact Card */}
            <div className="sm:col-span-2 bg-zinc-900 rounded-[2.5rem] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex flex-wrap justify-center sm:justify-start gap-8">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 mb-2 tracking-[0.2em]">
                    Contact Lines
                  </span>
                  <span className="text-lg font-mono font-bold leading-none">
                    0916 419 4960
                  </span>
                  <span className="text-lg font-mono font-bold mt-1">
                    0915 535 1953
                  </span>
                </div>
                <div className="hidden md:block w-[1px] bg-white/10 h-16" />
                <a
                  href="https://facebook.com/Alipio.Dental.Org001"
                  target="_blank"
                  className="flex items-center gap-3 bg-emerald-600/10 border border-emerald-600/50 hover:bg-emerald-600 text-emerald-400 hover:text-white px-6 py-4 rounded-2xl font-bold text-sm transition-all"
                >
                  <Facebook size={20} />
                  Find us on FB
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Section: Auth Form (lg:col-span-5) */}
        <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
          <div className="absolute -inset-10 bg-emerald-400/10 blur-[120px] rounded-full" />

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "login"}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white/80 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-emerald-500 rounded-b-full" />
              <AuthForm
                handleSubmit={isSignUp ? handleRegister : handleLogin}
                submitType={isSignUp ? "Sign Up" : "Log In"}
                onToggle={() => setIsSignUp(!isSignUp)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Background Subtle Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z' fill='%23064e3b' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />
    </section>
  );
}
