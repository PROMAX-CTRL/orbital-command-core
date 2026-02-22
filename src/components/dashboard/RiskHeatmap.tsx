import { useState } from 'react';
import type { RiskAssessment } from '@/types/dashboard';
import { Flame, GitPullRequest, Users, Wrench, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const severityConfig = {
  critical: { label: 'CRITICAL', dotClass: 'bg-tactical-red', glowClass: 'glow-red', textClass: 'text-tactical-red', borderClass: 'border-tactical-red/30' },
  high: { label: 'HIGH', dotClass: 'bg-tactical-amber', glowClass: 'glow-amber', textClass: 'text-tactical-amber', borderClass: 'border-tactical-amber/30' },
  medium: { label: 'MEDIUM', dotClass: 'bg-tactical-blue', glowClass: '', textClass: 'text-tactical-blue', borderClass: 'border-tactical-blue/30' },
  low: { label: 'LOW', dotClass: 'bg-tactical-green', glowClass: '', textClass: 'text-tactical-green', borderClass: 'border-tactical-green/30' },
};

const riskTypeConfig: Record<string, { icon: typeof Flame; label: string }> = {
  burnout: { icon: Flame, label: 'Burnout Risk' },
  delivery: { icon: GitPullRequest, label: 'Delivery Risk' },
  stakeholder: { icon: Users, label: 'Stakeholder Risk' },
  technical_debt: { icon: Wrench, label: 'Tech Debt' },
};

interface RiskHeatmapProps {
  risks: RiskAssessment[];
}

function RiskCard({ risk }: { risk: RiskAssessment }) {
  const [expanded, setExpanded] = useState(false);
  const severity = risk.severity as keyof typeof severityConfig;
  const config = severityConfig[severity] || severityConfig.medium;
  const typeConfig = riskTypeConfig[risk.risk_type] || { icon: AlertTriangle, label: risk.risk_type };
  const Icon = typeConfig.icon;

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`w-full text-left rounded-md border bg-secondary/50 p-4 transition-all duration-200 hover:bg-secondary/80 cursor-pointer ${config.glowClass} ${config.borderClass}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-2 w-2 rounded-full ${config.dotClass} ${severity === 'critical' ? 'status-pulse' : ''}`} />
        <span className={`text-[10px] font-mono font-bold tracking-widest ${config.textClass}`}>
          {config.label}
        </span>
        <div className="ml-auto">
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Risk type + title */}
      <div className="flex items-start gap-2.5 mb-1">
        <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.textClass}`} />
        <div className="min-w-0">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-0.5">
            {typeConfig.label}
          </div>
          <div className="text-sm font-medium text-foreground leading-snug">
            {risk.title}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-3 animate-fade-in-up">
          {risk.description && (
            <p className="text-xs text-secondary-foreground leading-relaxed">
              {risk.description}
            </p>
          )}
          {risk.suggested_action && (
            <div className="rounded bg-muted/50 px-3 py-2">
              <span className="text-[10px] font-mono font-bold text-tactical-green uppercase tracking-wider">
                Suggested Action
              </span>
              <p className="text-xs text-foreground mt-1">
                {risk.suggested_action}
              </p>
            </div>
          )}
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
            <span>Detected: {new Date(risk.detected_at).toLocaleDateString()}</span>
            <span className={`${risk.is_active ? 'text-tactical-amber' : 'text-tactical-green'}`}>
              {risk.is_active ? '● ACTIVE' : '● RESOLVED'}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}

export function RiskHeatmap({ risks }: RiskHeatmapProps) {
  const activeCount = risks.filter(r => r.is_active).length;
  const criticalCount = risks.filter(r => r.severity === 'critical' || r.severity === 'high').length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up">
      {/* Header with tooltip */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-tactical-red status-pulse" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Risk Heatmap
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-5 w-5 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
                <Info className="h-3 w-3 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-3">
              <p className="text-xs font-medium mb-2">🔥 Risk Types:</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-tactical-red font-bold">🔴 BURNOUT</span>
                  <span> = Team members working late, negative sentiment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tactical-amber font-bold">🟡 DELIVERY</span>
                  <span> = Stale PRs, missed deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tactical-blue font-bold">🔵 STAKEHOLDER</span>
                  <span> = Client issues, urgent emails</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tactical-green font-bold">🟢 TECH DEBT</span>
                  <span> = Outdated dependencies, maintenance needs</span>
                </li>
              </ul>
              <p className="text-xs mt-2 pt-2 border-t border-border">
                Click any card to see details and suggested actions
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="ml-auto flex items-center gap-3">
          {criticalCount > 0 && (
            <span className="text-xs font-mono font-bold text-tactical-amber">
              {criticalCount} high priority
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {activeCount} active
          </span>
        </div>
      </div>

      {risks.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono py-4 text-center">No risks detected</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {risks.map(risk => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      )}
    </div>
  );
}
