import { useState } from 'react';
import type { RiskAssessment } from '@/types/dashboard';
import { supabase } from '@/integrations/supabase/client';
import { Zap, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface NextActionsProps {
  risks: RiskAssessment[];
  onComplete?: (id: string) => void;
}

const severityConfig = {
  critical: { bgClass: 'border-l-tactical-red bg-destructive/5', iconClass: 'text-tactical-red' },
  high: { bgClass: 'border-l-tactical-amber bg-accent/5', iconClass: 'text-tactical-amber' },
  medium: { bgClass: 'border-l-tactical-blue bg-primary/5', iconClass: 'text-tactical-blue' },
  low: { bgClass: 'border-l-tactical-green bg-primary/5', iconClass: 'text-tactical-green' },
};

const riskTypeLabels: Record<string, string> = {
  burnout: 'BURNOUT',
  delivery: 'DELIVERY',
  stakeholder: 'CLIENT',
  technical_debt: 'TECH DEBT',
};

export function NextActions({ risks, onComplete }: NextActionsProps) {
  const [completing, setCompleting] = useState<string | null>(null);

  const activeRisks = risks.filter(r => r.is_active && r.suggested_action);

  async function handleComplete(risk: RiskAssessment) {
    setCompleting(risk.id);
    try {
      await supabase
        .from('risk_assessments')
        .update({ is_active: false, resolved_at: new Date().toISOString() })
        .eq('id', risk.id);
      onComplete?.(risk.id);
    } finally {
      setCompleting(null);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-tactical-green" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Next Actions
        </h2>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded">
          {activeRisks.length} pending
        </span>
      </div>

      {activeRisks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Zap className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-sm font-mono">No actions needed — all clear</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeRisks.map(risk => {
            const config = severityConfig[risk.severity] || severityConfig.medium;
            const isCompleting = completing === risk.id;
            return (
              <div
                key={risk.id}
                className={`rounded-md border-l-2 ${config.bgClass} px-4 py-3 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <ArrowRight className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.iconClass}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{risk.title}</div>
                    <div className="text-xs text-secondary-foreground mt-1">{risk.suggested_action}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                      {riskTypeLabels[risk.risk_type] || risk.risk_type.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleComplete(risk)}
                      disabled={isCompleting}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-tactical-green bg-primary/10 hover:bg-primary/20 border border-primary/20 px-2 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isCompleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      Done
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
