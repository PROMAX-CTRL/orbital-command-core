import { GitPullRequest, AlertTriangle, Clock, GitBranch, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GithubActivity {
  id: number;
  repo_name: string;
  pr_title: string;
  pr_number: number;
  author: string;
  status: string;
  days_open: number;
  is_stale: boolean;
  review_count: number;
  additions: number;
  deletions: number;
  timestamp: string;
  created_at: string;
}

interface DeliveryRisksProps {
  prs: GithubActivity[];
}

function getStaleBadge(days: number) {
  if (days > 7) return { 
    text: `${days}d`, 
    className: 'bg-tactical-red/20 text-tactical-red',
    label: 'CRITICAL'
  };
  if (days > 3) return { 
    text: `${days}d`, 
    className: 'bg-tactical-amber/20 text-tactical-amber',
    label: 'STALE'
  };
  return { 
    text: `${days}d`, 
    className: 'bg-tactical-green/20 text-tactical-green',
    label: 'HEALTHY'
  };
}

export function DeliveryRisks({ prs }: DeliveryRisksProps) {
  const safePrs = Array.isArray(prs) ? prs : [];
  
  // Filter for open PRs
  const openPrs = safePrs
    .filter(pr => pr?.status === 'open')
    .sort((a, b) => b.days_open - a.days_open); // Most stale first

  // Calculate metrics with correct logic
  const criticalStale = openPrs.filter(pr => pr.days_open > 7).length;
  const stalePrs = openPrs.filter(pr => pr.days_open > 3).length; // This includes critical + medium
  const mediumStale = openPrs.filter(pr => pr.days_open > 3 && pr.days_open <= 7).length;
  const lowRisk = openPrs.filter(pr => pr.days_open <= 3).length;

  // Total should equal openPrs.length
  const totalPRs = openPrs.length;
  const calculatedTotal = criticalStale + mediumStale + lowRisk;

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <GitPullRequest className="h-5 w-5 text-tactical-amber" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Delivery Risks
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-5 w-5 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
                <Info className="h-3 w-3 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-3">
              <p className="text-xs font-medium mb-2">🚧 Delivery Risk Levels:</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li><span className="text-tactical-red">🔴 CRITICAL</span> = &gt;7 days</li>
                <li><span className="text-tactical-amber">🟡 STALE</span> = 4-7 days</li>
                <li><span className="text-tactical-green">🟢 HEALTHY</span> = ≤3 days</li>
              </ul>
              <p className="text-xs mt-2 pt-2 border-t border-border">
                Total PRs: {totalPRs} (Stale: {stalePrs})
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {stalePrs > 0 && (
          <div className="ml-auto flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-tactical-amber" />
            <span className="text-xs font-mono font-bold text-tactical-amber">{stalePrs} stale</span>
          </div>
        )}
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-4 gap-3 mb-4 flex-shrink-0">
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">OPEN</div>
          <div className="text-2xl font-bold text-foreground">{totalPRs}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">STALE</div>
          <div className="text-2xl font-bold text-tactical-amber">{stalePrs}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">MEDIUM</div>
          <div className="text-2xl font-bold text-tactical-blue">{mediumStale}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">LOW</div>
          <div className="text-2xl font-bold text-tactical-green">{lowRisk}</div>
        </div>
      </div>

      {/* PR LIST */}
      <div className="flex-1 min-h-0">
        {openPrs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground font-mono">
            No open PRs
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {openPrs.map(pr => {
              const badge = getStaleBadge(pr.days_open);
              return (
                <div
                  key={pr.id}
                  className="flex items-start gap-3 rounded-md bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors border border-border/50"
                >
                  <GitBranch className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-foreground truncate">
                        {pr.pr_title} <span className="text-muted-foreground">#{pr.pr_number}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${badge.className}`}>
                          {pr.days_open}d
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                        @{pr.author}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {pr.repo_name}
                      </span>
                      {pr.days_open > 3 && (
                        <span className={`text-xs font-mono font-bold ml-auto ${badge.className}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
