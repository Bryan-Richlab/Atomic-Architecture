"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Calendar, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuditData, AuditResult } from "@/types/audit";

export default function ResultsPage() {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const data = sessionStorage.getItem("auditData");
    const email = sessionStorage.getItem("prospectEmail");
    
    if (!data || !email) {
      router.push("/email");
      return;
    }

    const parsed: AuditData = JSON.parse(data);
    parsed.email = email;
    setAuditData(parsed);
    
    setTimeout(() => setIsVisible(true), 100);
  }, [router]);

  if (!auditData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Chargement...</div>
      </div>
    );
  }

  const goulet = auditData.funnelSteps.find((s) => s.id === auditData.gouletId);
  const totalHoursCEO = auditData.funnelSteps
    .filter((s) => s.who === "moi")
    .reduce((sum, s) => sum + s.hoursPerWeek, 0);
  const hourlyRate = auditData.monthlyCA / (totalHoursCEO * 4) || 0;
  const costPerMonth = totalHoursCEO * hourlyRate * 4;
  const gouletMicro = auditData.microSteps.filter((m) => m.name);

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-sm font-semibold tracking-wider text-secondary uppercase mb-2">
            Bryan Richmaker
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            🏗️ Ton Architecture Binary
          </h1>
          <p className="text-lg text-primary/60">
            Tu viens de voir ton business comme une machine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 mb-8 overflow-x-auto"
        >
          <div className="min-w-[800px]">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {auditData.funnelSteps.map((step, index) => {
                const isGoulet = step.id === auditData.gouletId;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative"
                  >
                    <div
                      className={`
                        node-circle w-32 h-32 rounded-full flex flex-col items-center justify-center text-center
                        ${isGoulet ? "node-goulet" : ""}
                      `}
                    >
                      <span className="text-[10px] text-secondary uppercase mb-1">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-primary px-2">
                        {step.name || `Étape ${index + 1}`}
                      </span>
                      {step.hoursPerWeek > 0 && (
                        <span className="text-[10px] text-primary/50 mt-1">
                          {step.hoursPerWeek}h/sem
                        </span>
                      )}
                      {isGoulet && (
                        <span className="absolute -top-2 -right-2 bg-danger text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                          GOULET
                        </span>
                      )}
                    </div>
                    {index < auditData.funnelSteps.length - 1 && (
                      <div className="absolute top-16 -right-8 w-8">
                        <svg width="32" height="16" viewBox="0 0 32 16">
                          <path
                            d="M0 8 L24 8 M20 4 L24 8 L20 12"
                            stroke="var(--secondary)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {goulet && gouletMicro.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ delay: 0.6 }}
                className="border-t-2 border-dashed border-secondary/30 pt-8 mt-4"
              >
                <div className="text-center mb-6">
                  <span className="inline-block bg-danger/10 text-danger text-sm font-bold px-4 py-2 rounded-full">
                    🔴 Décomposition du goulet : {goulet.name}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  {gouletMicro.map((micro, microIndex) => {
                    const validAtoms = micro.atoms.filter((a) => a.trim());
                    if (validAtoms.length === 0) return null;

                    return (
                      <motion.div
                        key={micro.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                        transition={{ delay: 0.8 + microIndex * 0.2 }}
                        className="bg-background rounded-xl p-4 min-w-[200px]"
                      >
                        <h4 className="text-sm font-bold text-primary mb-3 text-center">
                          {micro.name}
                        </h4>
                        <div className="space-y-2">
                          {validAtoms.map((atom, atomIndex) => (
                            <div key={atomIndex} className="flex items-center gap-2">
                              <div className="atom-chain flex-1">
                                <span className="atom-link text-[10px]">
                                  {atomIndex + 1}. {atom}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary rounded-2xl shadow-2xl p-8 text-white mb-8"
        >
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-white/80 mb-4">
              La question n&apos;est plus <strong>SI</strong> tu dois automatiser,
              <br />
              mais <strong>QUELLE</strong> machine construire en premier.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span>Audit complété en 10 minutes</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Je suis Bryan Richmaker, Architecte IA.
            </h2>
            <p className="text-primary/70 mb-6">
              Je construis cette machine pour toi en 7 jours pour{" "}
              <span className="font-bold text-accent text-xl">990€</span>.
            </p>
            <p className="text-sm text-primary/60 mb-8">
              On corrige <strong>TON</strong> goulet d&apos;étranglement en 1ère session.
              <br />
              Pas de générique, que du sur-mesure.
            </p>

            <div className="bg-accent/10 rounded-xl p-6 mb-8">
              <p className="text-sm text-primary/80 mb-4">
                Tu as identifié : {goulet?.name || "ton goulet"}
              </p>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <span className="text-primary/60">Heures/semaine :</span>
                  <span className="font-bold text-primary ml-2">
                    {goulet?.hoursPerWeek || 0}h
                  </span>
                </div>
                <div>
                  <span className="text-primary/60">Coût/mois :</span>
                  <span className="font-bold text-danger ml-2">
                    {(goulet?.hoursPerWeek || 0) * hourlyRate * 4}€
                  </span>
                </div>
              </div>
            </div>

            <a
              href="https://app.iclosed.io/e/richlab-creation/richessecall-youtube"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-primary font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5" />
              Réserver mon consulting
            </a>

            <p className="text-xs text-primary/50 mt-4">
              Consultation de 30 minutes • Stratégie personnalisée
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-primary/50"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>Architecte IA &bull; Richlab Creation</span>
        </motion.div>
      </div>
    </main>
  );
}
