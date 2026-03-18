"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Trash2, AlertTriangle, Check, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FunnelStep, MicroStep } from "@/types/audit";

type Step = "macro" | "micro" | "atomic" | "result";

const WHO_OPTIONS = [
  { value: "moi", label: "Moi" },
  { value: "assistant", label: "Assistant" },
  { value: "delegue", label: "Délégué" },
];

const STEPS: { id: Step; label: string }[] = [
  { id: "macro", label: "Funnel" },
  { id: "micro", label: "Micro" },
  { id: "atomic", label: "Atomique" },
];

export default function FunnelPage() {
  const [currentStep, setCurrentStep] = useState<Step>("macro");
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>([
    { id: "1", name: "", who: "moi", hoursPerWeek: 0 },
    { id: "2", name: "", who: "moi", hoursPerWeek: 0 },
    { id: "3", name: "", who: "moi", hoursPerWeek: 0 },
  ]);
  const [monthlyCA, setMonthlyCA] = useState<number>(15000);
  const [microSteps, setMicroSteps] = useState<MicroStep[]>([]);
  const [activeGouletId, setActiveGouletId] = useState<string>("");
  const [showGouletInfo, setShowGouletInfo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const email = sessionStorage.getItem("prospectEmail");
    if (!email) {
      router.push("/email");
    }
  }, [router]);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const addFunnelStep = () => {
    setFunnelSteps([
      ...funnelSteps,
      {
        id: Date.now().toString(),
        name: "",
        who: "moi",
        hoursPerWeek: 0,
      },
    ]);
  };

  const removeFunnelStep = (id: string) => {
    if (funnelSteps.length > 1) {
      setFunnelSteps(funnelSteps.filter((s) => s.id !== id));
    }
  };

  const updateFunnelStep = (id: string, field: keyof FunnelStep, value: any) => {
    setFunnelSteps(
      funnelSteps.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const calculateHourlyRate = () => {
    const totalHours = funnelSteps.reduce((sum, s) => sum + s.hoursPerWeek, 0);
    if (totalHours === 0 || monthlyCA === 0) return 0;
    return monthlyCA / (totalHours * 4);
  };

  const findGoulet = () => {
    const ceoSteps = funnelSteps.filter((s) => s.who === "moi");
    if (ceoSteps.length === 0) return null;
    return ceoSteps.reduce((max, s) =>
      s.hoursPerWeek > max.hoursPerWeek ? s : max
    );
  };

  const handleNextFromMacro = () => {
    const goulet = findGoulet();
    if (goulet) {
      setActiveGouletId(goulet.id);
      setMicroSteps([
        { id: "1", name: "", atoms: [""] },
      ]);
    }
    setCurrentStep("micro");
  };

  const handleNextFromMicro = () => {
    setCurrentStep("atomic");
  };

  const handleFinish = () => {
    const auditData = {
      email: sessionStorage.getItem("prospectEmail"),
      funnelSteps,
      microSteps,
      gouletId: activeGouletId,
      monthlyCA,
      hourlyRate: calculateHourlyRate(),
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem("auditData", JSON.stringify(auditData));
    router.push("/results");
  };

  const addMicroStep = () => {
    setMicroSteps([
      ...microSteps,
      { id: Date.now().toString(), name: "", atoms: [""] },
    ]);
  };

  const removeMicroStep = (id: string) => {
    if (microSteps.length > 1) {
      setMicroSteps(microSteps.filter((s) => s.id !== id));
    }
  };

  const updateMicroStep = (id: string, field: keyof MicroStep, value: any) => {
    setMicroSteps(
      microSteps.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addAtom = (microStepId: string) => {
    setMicroSteps(
      microSteps.map((s) =>
        s.id === microStepId
          ? { ...s, atoms: [...s.atoms, ""] }
          : s
      )
    );
  };

  const removeAtom = (microStepId: string, atomIndex: number) => {
    setMicroSteps(
      microSteps.map((s) =>
        s.id === microStepId
          ? { ...s, atoms: s.atoms.filter((_, i) => i !== atomIndex) }
          : s
      )
    );
  };

  const updateAtom = (microStepId: string, atomIndex: number, value: string) => {
    setMicroSteps(
      microSteps.map((s) =>
        s.id === microStepId
          ? { ...s, atoms: s.atoms.map((a, i) => (i === atomIndex ? value : a)) }
          : s
      )
    );
  };

  const parseFunnelInput = (input: string): FunnelStep[] => {
    const parts = input.split("→").map((s) => s.trim()).filter(Boolean);
    return parts.map((name, i) => ({
      id: (i + 1).toString(),
      name,
      who: "moi" as const,
      hoursPerWeek: 0,
    }));
  };

  const funnelInput = funnelSteps.map((s) => s.name).join(" → ");

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={currentStep === "macro" ? "/email" : "/funnel"}
          className="inline-flex items-center gap-2 text-sm text-primary/50 hover:text-primary mb-6 transition-colors"
          onClick={(e) => {
            if (currentStep !== "macro") {
              e.preventDefault();
              setCurrentStep(STEPS[stepIndex - 1].id as Step);
            }
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  index <= stepIndex
                    ? "bg-accent text-primary"
                    : "bg-primary/10 text-primary/40"
                }`}
              >
                {index < stepIndex ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`text-sm font-medium hidden md:inline ${
                  index <= stepIndex ? "text-primary" : "text-primary/40"
                }`}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-8 md:w-16 h-0.5 ${
                    index < stepIndex ? "bg-accent" : "bg-primary/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentStep === "macro" && (
            <motion.div
              key="macro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Question 1/3
              </h1>
              <p className="text-primary/60 mb-8">
                Décris ta ligne de business en 5-7 étapes clés
                <br />
                <span className="text-sm">(séparées par des flèches →)</span>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-primary mb-2">
                  Ton funnel (exemple : Ads → Page → Calendrier → Appel → Offre)
                </label>
                <textarea
                  value={funnelInput}
                  onChange={(e) => {
                    const parsed = parseFunnelInput(e.target.value);
                    if (parsed.length > 0) {
                      setFunnelSteps(parsed);
                    }
                  }}
                  placeholder="Ads → Page → Calendrier → Appel → Offre → Signature → Témoignage"
                  className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:border-accent focus:outline-none text-lg resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-4 mb-8">
                {funnelSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-background rounded-xl p-4"
                  >
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) => updateFunnelStep(step.id, "name", e.target.value)}
                      placeholder={`Étape ${index + 1}`}
                      className="flex-1 px-3 py-2 bg-white border border-primary/10 rounded-lg focus:border-accent focus:outline-none"
                    />
                    <select
                      value={step.who}
                      onChange={(e) => updateFunnelStep(step.id, "who", e.target.value)}
                      className="px-3 py-2 bg-white border border-primary/10 rounded-lg focus:border-accent focus:outline-none text-sm"
                    >
                      {WHO_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={step.hoursPerWeek || ""}
                        onChange={(e) =>
                          updateFunnelStep(step.id, "hoursPerWeek", parseInt(e.target.value) || 0)
                        }
                        placeholder="0"
                        className="w-16 px-2 py-2 bg-white border border-primary/10 rounded-lg focus:border-accent focus:outline-none text-center text-sm"
                        min="0"
                      />
                      <span className="text-xs text-primary/50">h/sem</span>
                    </div>
                    {funnelSteps.length > 1 && (
                      <button
                        onClick={() => removeFunnelStep(step.id)}
                        className="p-2 text-danger/60 hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <button
                onClick={addFunnelStep}
                className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-8"
              >
                <Plus className="w-4 h-4" />
                Ajouter une étape
              </button>

              <div className="border-t border-primary/10 pt-6 mb-8">
                <label className="block text-sm font-medium text-primary mb-2">
                  Ton CA mensuel moyen (optionnel)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={monthlyCA || ""}
                    onChange={(e) => setMonthlyCA(parseInt(e.target.value) || 0)}
                    placeholder="15000"
                    className="w-40 px-4 py-3 border-2 border-primary/20 rounded-xl focus:border-accent focus:outline-none text-lg"
                  />
                  <span className="text-primary/60">€/mois</span>
                </div>
                {monthlyCA > 0 && funnelSteps.some((s) => s.hoursPerWeek > 0) && (
                  <p className="mt-3 text-sm text-primary/60">
                    Taux horaire CEO : <span className="font-bold text-accent">{calculateHourlyRate().toFixed(0)}€/h</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleNextFromMacro}
                disabled={!funnelSteps.some((s) => s.name && s.hoursPerWeek > 0)}
                className="w-full bg-accent hover:bg-accent/90 disabled:bg-secondary disabled:cursor-not-allowed text-primary font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {currentStep === "micro" && (
            <motion.div
              key="micro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {(() => {
                const goulet = findGoulet();
                const totalHoursCEO = funnelSteps
                  .filter((s) => s.who === "moi")
                  .reduce((sum, s) => sum + s.hoursPerWeek, 0);
                const hourlyRate = calculateHourlyRate();
                const costPerWeek = totalHoursCEO * hourlyRate;

                return (
                  <>
                    <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 mb-8">
                      <button
                        onClick={() => setShowGouletInfo(!showGouletInfo)}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-6 h-6 text-danger" />
                          <div>
                            <p className="font-bold text-danger">Ton goulet identifié</p>
                            <p className="text-sm text-primary/60">
                              {goulet?.name || "À déterminer"}
                            </p>
                          </div>
                        </div>
                        {showGouletInfo ? (
                          <ChevronUp className="w-5 h-5 text-primary/40" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary/40" />
                        )}
                      </button>
                      {showGouletInfo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-danger/20 text-sm text-primary/80"
                        >
                          <p>
                            Tu y passes <span className="font-bold">{goulet?.hoursPerWeek}h/semaine</span> à{" "}
                            <span className="font-bold">{hourlyRate.toFixed(0)}€/h</span>
                          </p>
                          <p>
                            = <span className="font-bold text-danger">{costPerWeek.toFixed(0)}€/semaine</span>{" "}
                            = <span className="font-bold text-danger">{(costPerWeek * 4).toFixed(0)}€/mois</span> de ta présence
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                      Question 2/3
                    </h1>
                    <p className="text-primary/60 mb-8">
                      Décompose l&apos;étape &quot;{goulet?.name}&quot; en sous-actions
                    </p>

                    <div className="space-y-4 mb-8">
                      {microSteps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 bg-background rounded-xl p-4"
                        >
                          <span className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold text-secondary">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => updateMicroStep(step.id, "name", e.target.value)}
                            placeholder={`Sous-action ${index + 1}`}
                            className="flex-1 px-3 py-2 bg-white border border-primary/10 rounded-lg focus:border-accent focus:outline-none"
                          />
                          {microSteps.length > 1 && (
                            <button
                              onClick={() => removeMicroStep(step.id)}
                              className="p-2 text-danger/60 hover:text-danger transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={addMicroStep}
                      className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-8"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une sous-action
                    </button>

                    <button
                      onClick={handleNextFromMicro}
                      disabled={!microSteps.some((s) => s.name)}
                      className="w-full bg-accent hover:bg-accent/90 disabled:bg-secondary disabled:cursor-not-allowed text-primary font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                      Suivant
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                );
              })()}
            </motion.div>
          )}

          {currentStep === "atomic" && (
            <motion.div
              key="atomic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Question 3/3
              </h1>
              <p className="text-primary/60 mb-2">
                Réduis chaque sous-action à des étapes impossibles à subdiviser
              </p>
              <p className="text-sm text-accent font-medium mb-8">
                Une étape atomique = une action binaire (0 ou 1, pas d&apos;interprétation)
              </p>

              <div className="space-y-8 mb-8">
                {microSteps.filter((s) => s.name).map((step, stepIndex) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stepIndex * 0.1 }}
                    className="bg-background rounded-xl p-6"
                  >
                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center text-xs text-secondary">
                        {stepIndex + 1}
                      </span>
                      {step.name}
                    </h3>
                    <div className="space-y-2">
                      {step.atoms.map((atom, atomIndex) => (
                        <div key={atomIndex} className="flex items-center gap-2">
                          <span className="text-xs text-secondary font-mono w-6">
                            #{atomIndex + 1}
                          </span>
                          <input
                            type="text"
                            value={atom}
                            onChange={(e) => updateAtom(step.id, atomIndex, e.target.value)}
                            placeholder={`Action atomique ${atomIndex + 1}`}
                            className="flex-1 px-3 py-2 bg-white border border-primary/10 rounded-lg focus:border-accent focus:outline-none text-sm"
                          />
                          {step.atoms.length > 1 && (
                            <button
                              onClick={() => removeAtom(step.id, atomIndex)}
                              className="p-1 text-danger/60 hover:text-danger transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addAtom(step.id)}
                        className="flex items-center gap-2 text-xs text-primary/50 hover:text-primary transition-colors mt-2"
                      >
                        <Plus className="w-3 h-3" />
                        Ajouter une action
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleFinish}
                disabled={!microSteps.some((s) => s.name && s.atoms.some((a) => a))}
                className="w-full bg-accent hover:bg-accent/90 disabled:bg-secondary disabled:cursor-not-allowed text-primary font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-3"
              >
                Voir mon architecture
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
