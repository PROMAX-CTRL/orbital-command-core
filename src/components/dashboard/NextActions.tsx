import type { NextAction } from '@/types/dashboard';
import { Zap, ArrowRight } from 'lucide-react';

interface NextActionsProps {
  actions: NextAction[];
}

const priorityConfig = {
  critical: { bgClass: 'border-l-tactical-red bg-tactical-red/5', iconClass: 'text-tactical-red' },
  high: { bgClass: 'border-l-tactical-amber bg-tactical-amber/5', iconClass: 'text-tactical-amber' },
  medium: { bgClass: 'border-l-tactical-blue bg-tactical-blue/5', iconClass: 'text-tactical-blue' },
  low: { bgClass: 'border-l-tactical-green bg-tactical-green/5', iconClass: 'text-tactical-green' },
};

const sourceLabels: Record<string, string> = {
  risk_assessment: 'RISK',
  email: 'EMAIL',
  github: 'GITHUB',
  slack: 'SLACK',
};

export function NextActions({ actions }: NextActionsProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-tactical-green" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Next Actions
        </h2>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded">
          AI Suggested
        </span>
      </div>

      {actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Zap className="h-8 w-8 mb-2 opacity-30" />
          <p className="text-sm font-mono">No actions needed — all clear</p>
        </div>
      ) : (
        <div className="space-y-2">
          {actions.map(action => {
            const config = priorityConfig[action.priority];
            return (
              <div
                key={action.id}
                className={`rounded-md border-l-2 ${config.bgClass} px-4 py-3 group cursor-pointer hover:bg-secondary/40 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <ArrowRight className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.iconClass} group-hover:translate-x-0.5 transition-transform`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded flex-shrink-0">
                    {sourceLabels[action.source] || action.source.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
