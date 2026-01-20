"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import AuthForm from "../AuthForm"; // <-- adjust the import path as needed
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/authStore";
import { useEffect, useState } from "react";
import { Facebook, Instagram } from "lucide-react";

export default function Hero() {
  const { login, register, getCurrentUser, current, loading } = useAuthStore(
    (state) => state
  );
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const user = await login(form.get("email"), form.get("password"));
    if (user) router.push("/"); // ✅ safe navigation
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const user = await register(form.get("email"), form.get("password"));
    if (user) router.push("/"); // ✅ safe navigation
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white overflow-hidden">
      {/* Floating Top Bar */}
      <div className="w-full h-full bg-[var(--theme-color)] text-white py-3 px-6 text-center text-sm md:text-base font-medium flex flex-wrap justify-center gap-x-4">
        <span>General Dentistry</span>
        <span>•</span>
        <span>Esthetic Dentistry</span>
        <span>•</span>
        <span>Orthodontics</span>
        <span>•</span>
        <span>Laser Dentistry</span>
        {/* <span>•</span>
        <span>Dental Braces</span> */}
        <span>•</span>
        <span>Prosthodontics</span>
        <span>•</span>
        <span>Oral Surgery</span>
        <span>•</span>
        <span>Endodontics</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-6 md:px-12 py-16 z-10">
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <Image
              src="/matira.png" // <-- replace with your actual image
              alt="Terrones Dental Clinic Logo"
              width={200}
              height={150}
              className="mx-auto md:mx-0 drop-shadow-md"
            />
          </motion.div>

          {/* Clinic Heading */}
          <motion.h1
            className="text-5xl md:text-5xl font-extrabold text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Welcome to <br />
            <span className="text-[var(--theme-color)]">
              MATIRA DENTAL STUDIO
            </span>
          </motion.h1>

          {/* Subtext */}
          {/* <motion.p
            className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            “Where smile speaks louder than words”
          </motion.p> */}

          {/* Clinic Info */}
          <motion.div
            className="mt-10 text-sm text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="font-semibold text-gray-700">
              📍Unit 5 Gandionco, Bldg. Toting Reyes St., Kalibo, Aklan
            </p>
            <p>🕘 Mondays to Saturdays 8:00am to 5:00pm</p>
            <p>✉️ matiradentalstudio@gmail.com</p>

            <div className="flex items-center gap-2">
              <Instagram size={14} className="text-pink-500" />
              <p>@matiradentalstudio</p>
            </div>

            <div className="flex items-center gap-2 justify-start">
              <Facebook
                size={14}
                className="text-blue-600 items-center justify-self-start"
              />
              <p>Matira Dental Studio</p>
            </div>

            <p>📞 (036) 262 3207</p>
            <p>📞 0910 126 4458</p>

            {/* <p>👨‍⚕️ Dr. Daisy Ciprano - Matira</p>
            <p>👨‍⚕️ Dr. Ma. Dexely Matira - Delgado</p> */}
          </motion.div>
        </div>

        {/* Right Section - Auth Form */}
        <div className="px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "login"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-md"
            >
              <AuthForm
                handleSubmit={isSignUp ? handleRegister : handleLogin}
                submitType={isSignUp ? "Sign Up" : "Log In"}
                onToggle={() => setIsSignUp(!isSignUp)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-100/10 via-green-100/10 to-transparent pointer-events-none"></div>
    </section>
  );
}
