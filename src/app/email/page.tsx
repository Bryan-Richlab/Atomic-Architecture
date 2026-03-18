"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Merci d'entrer une adresse email valide.");
      return;
    }

    setIsLoading(true);
    
    sessionStorage.setItem("prospectEmail", email);
    
    setTimeout(() => {
      router.push("/funnel");
    }, 500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary/50 hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>

          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-2 text-center">
            Avant de révéler ton diagnostic...
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            Quel est ton meilleur email ?
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-primary/20 rounded-xl focus:border-accent focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-danger text-sm font-medium">{error}</p>
            )}

            <p className="text-sm text-primary/60 text-center leading-relaxed">
              Je t&apos;envoie ton audit complet après la session
              <br />
              <span className="font-medium text-primary">+ ma stratégie d&apos;automatisation.</span>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 disabled:bg-secondary text-primary font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="animate-pulse">Chargement...</span>
              ) : (
                <>
                  Voir mon diagnostic
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary/50">
            <Lock className="w-4 h-4" />
            <span>Tes données restent confidentielles.</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-primary/50"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Architecte IA &bull; Richlab Creation</span>
        </motion.div>
      </div>
    </main>
  );
}
