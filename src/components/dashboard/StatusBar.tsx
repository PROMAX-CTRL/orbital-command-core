import { Shield, Activity, Wifi } from 'lucide-react';

interface StatusBarProps {
  loading: boolean;
  error: string | null;
  riskCount: number;
  teamCount: number;
  lastUpdated: Date | null;
}

export function StatusBar({ loading, error, riskCount, teamCount, lastUpdated }: StatusBarProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-tactical-green" />
          <h1 className="text-lg font-mono font-bold tracking-wider text-foreground uppercase">
            Mission Control
          </h1>
          <div className="h-4 w-px bg-border mx-1" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Engineering Ops
          </span>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-tactical-green" />
            <span className="text-xs font-mono text-muted-foreground">
              {riskCount} risks • {teamCount} team
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className={`h-3 w-3 ${error ? 'text-tactical-red' : loading ? 'text-tactical-amber' : 'text-tactical-green'}`} />
            <span className={`text-xs font-mono ${error ? 'text-tactical-red' : loading ? 'text-tactical-amber' : 'text-tactical-green'}`}>
              {error ? 'ERROR' : loading ? 'SYNC' : 'LIVE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
