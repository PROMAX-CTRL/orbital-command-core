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

export function DeliveryRisks({ prs }: DeliveryRisksProps) {
  const safePrs = Array.isArray(prs) ? prs : [];
  
  // Filter for open PRs only
  const openPrs = safePrs
    .filter(pr => pr?.status === 'open')
    .sort((a, b) => b.days_open - a.days_open);

  // Calculate CORRECT metrics based on actual data
  const stalePrs = openPrs.filter(pr => pr.days_open > 7).length;  // >7 days = 0
  const mediumPrs = openPrs.filter(pr => pr.days_open > 3 && pr.days_open <= 7).length; // 4-7 days = 3
  const lowPrs = openPrs.filter(pr => pr.days_open <= 3).length; // ≤3 days = 2
  const totalPRs = openPrs.length; // 5

  // Debug log to verify
  console.log('Delivery Risks - Open PRs:', openPrs.length);
  console.log('STALE (>7d):', stalePrs);
  console.log('MEDIUM (4-7d):', mediumPrs);
  console.log('LOW (≤3d):', lowPrs);

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
                <li><span className="text-tactical-red">🔴 STALE</span> = &gt;7 days ({stalePrs})</li>
                <li><span className="text-tactical-amber">🟡 MEDIUM</span> = 4-7 days ({mediumPrs})</li>
                <li><span className="text-tactical-green">🟢 LOW</span> = ≤3 days ({lowPrs})</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* METRIC CARDS - CORRECT NUMBERS */}
      <div className="grid grid-cols-4 gap-3 mb-4 flex-shrink-0">
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">OPEN</div>
          <div className="text-2xl font-bold text-foreground">{totalPRs}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">STALE</div>
          <div className="text-2xl font-bold text-tactical-red">{stalePrs}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">MEDIUM</div>
          <div className="text-2xl font-bold text-tactical-amber">{mediumPrs}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-3 text-center">
          <div className="text-xs font-mono text-muted-foreground uppercase">LOW</div>
          <div className="text-2xl font-bold text-tactical-green">{lowPrs}</div>
        </div>
      </div>

      {/* PR LIST - Shows all open PRs */}
      <div className="flex-1 min-h-0">
        {openPrs.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground font-mono">
            No open PRs
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {openPrs.map(pr => {
              // Determine color based on days
              const dayColor = pr.days_open > 7 ? 'text-tactical-red' : 
                              pr.days_open > 3 ? 'text-tactical-amber' : 
                              'text-tactical-green';
              
              return (
                <div
                  key={pr.id}
                  className="flex items-center justify-between rounded-md bg-secondary/30 px-4 py-3 hover:bg-secondary/50 transition-colors border border-border/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {pr.pr_title} <span className="text-muted-foreground">#{pr.pr_number}</span>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground mt-1">
                      @{pr.author} · {pr.repo_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className={`text-xs font-mono font-bold ${dayColor}`}>
                      {pr.days_open}d
                    </span>
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
