import type { RiskAssessment } from '@/types/dashboard';

const severityConfig = {
  critical: { label: 'CRITICAL', dotClass: 'bg-tactical-red', glowClass: 'glow-red', textClass: 'text-tactical-red' },
  high: { label: 'HIGH', dotClass: 'bg-tactical-amber', glowClass: 'glow-amber', textClass: 'text-tactical-amber' },
  medium: { label: 'MEDIUM', dotClass: 'bg-tactical-blue', glowClass: '', textClass: 'text-tactical-blue' },
  low: { label: 'LOW', dotClass: 'bg-tactical-green', glowClass: '', textClass: 'text-tactical-green' },
};

interface RiskHeatmapProps {
  risks: RiskAssessment[];
}

export function RiskHeatmap({ risks }: RiskHeatmapProps) {
  const grouped = {
    critical: risks.filter(r => r.severity === 'critical'),
    high: risks.filter(r => r.severity === 'high'),
    medium: risks.filter(r => r.severity === 'medium'),
    low: risks.filter(r => r.severity === 'low'),
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-tactical-red status-pulse" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Risk Heatmap
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(grouped) as [keyof typeof severityConfig, RiskAssessment[]][]).map(
          ([severity, items]) => {
            const config = severityConfig[severity];
            return (
              <div
                key={severity}
                className={`rounded-md border border-border bg-secondary/50 p-4 ${config.glowClass}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-2 w-2 rounded-full ${config.dotClass} ${severity === 'critical' ? 'status-pulse' : ''}`} />
                  <span className={`text-xs font-mono font-bold tracking-widest ${config.textClass}`}>
                    {config.label}
                  </span>
                  <span className={`ml-auto text-lg font-mono font-bold ${config.textClass}`}>
                    {items.length}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {items.length === 0 && (
                    <p className="text-xs text-muted-foreground font-mono">No items</p>
                  )}
                  {items.slice(0, 4).map(item => (
                    <div key={item.id} className="text-xs text-secondary-foreground truncate font-mono">
                      • {item.title}
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div className="text-xs text-muted-foreground font-mono">
                      +{items.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
