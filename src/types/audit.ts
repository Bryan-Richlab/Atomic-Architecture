export interface FunnelStep {
  id: string;
  name: string;
  who: "moi" | "assistant" | "delegue";
  hoursPerWeek: number;
}

export interface MicroStep {
  id: string;
  name: string;
  atoms: string[];
}

export interface AuditData {
  email: string;
  funnelSteps: FunnelStep[];
  microSteps: MicroStep[];
  gouletId: string;
  monthlyCA: number;
  hourlyRate: number;
  createdAt: string;
}

export interface AuditResult {
  goulet: FunnelStep;
  totalHoursCEO: number;
  costPerWeek: number;
  costPerMonth: number;
  microSteps: MicroStep[];
  funnelSteps: FunnelStep[];
}
