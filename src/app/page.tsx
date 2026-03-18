"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-4">
            Bryan Richmaker
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            Ton business a une faille.
            <span className="block text-accent">Je l&apos;ai trouvée.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8"
        >
          <p className="text-lg md:text-xl text-primary/80 mb-8 leading-relaxed">
            En <span className="font-semibold text-primary">10 minutes</span>, je t&apos;aide à identifier
            <span className="font-semibold text-primary"> exactement</span> quelle étape de ton business
            te coûte le plus de temps et d&apos;argent.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-primary text-sm">Visualise</h3>
              <p className="text-xs text-primary/60 mt-1">Ton funnel comme une machine</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-primary text-sm">Identifie</h3>
              <p className="text-xs text-primary/60 mt-1">Ton goulet d&apos;étranglement</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-primary text-sm">Gagne</h3>
              <p className="text-xs text-primary/60 mt-1">Du temps dès demain</p>
            </div>
          </div>

          <Link href="/email">
            <button className="group bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-10 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Commencer mon audit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-primary/50"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Architecte IA &bull; Richlab Creation</span>
        </motion.div>
      </div>
    </main>
  );
}
