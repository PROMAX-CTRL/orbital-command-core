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
  if (days > 7) return { text: `${days}d`, className: 'bg-tactical-red/20 text-tactical-red' };
  if (days > 3) return { text: `${days}d`, className: 'bg-tactical-amber/20 text-tactical-amber' };
  return { text: `${days}d`, className: 'bg-tactical-green/20 text-tactical-green' };
}

export function DeliveryRisks({ prs }: DeliveryRisksProps) {
  const safePrs = Array.isArray(prs) ? prs : [];
  
  const openPrs = safePrs
    .filter(pr => pr?.status === 'open')
    .sort((a, b) => a.days_open - b.days_open);

  const stalePrs = openPrs.filter(pr => pr.days_open > 3);
  const mediumStale = openPrs.filter(pr => pr.days_open > 3 && pr.days_open <= 7).length;
  const lowRisk = openPrs.filter(pr => pr.days_open <= 3).length;

  return (
    <div className="rounded-lg border border-border bg-card p-4 animate-fade-in-up h-full flex flex-col" style={{ animationDelay: '0.15s' }}>
      {/* Header with tooltip - more compact */}
      <div className="flex items-center gap-1.5 mb-3 flex-shrink-0">
        <GitPullRequest className="h-3.5 w-3.5 text-tactical-amber" />
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
          Delivery Risks
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-4 w-4 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
                <Info className="h-2.5 w-2.5 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-2">
              <p className="text-[10px] font-medium mb-1">🚧 Delivery Risk Levels:</p>
              <ul className="text-[10px] space-y-1 text-muted-foreground">
                <li className="flex items-start gap-1">
                  <span className="text-tactical-red font-bold">🔴</span>
                  <span><span className="font-bold text-foreground">STALE</span> &gt;7d</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-tactical-amber font-bold">🟡</span>
                  <span><span className="font-bold text-foreground">MEDIUM</span> 4-7d</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-tactical-green font-bold">🟢</span>
                  <span><span className="font-bold text-foreground">LOW</span> ≤3d</span>
                </li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {stalePrs.length > 0 && (
          <div className="ml-auto flex items-center gap-1">
            <AlertTriangle className="h-2.5 w-2.5 text-tactical-amber" />
            <span className="text-[10px] font-mono font-bold text-tactical-amber">{stalePrs.length}</span>
          </div>
        )}
      </div>

      {/* METRIC CARDS - more compact */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 flex-shrink-0">
        <div className="bg-secondary/30 rounded px-2 py-1.5 text-center">
          <div className="text-[8px] font-mono text-muted-foreground uppercase">OPEN</div>
          <div className="text-base font-bold text-foreground">{openPrs.length}</div>
        </div>
        <div className="bg-secondary/30 rounded px-2 py-1.5 text-center">
          <div className="text-[8px] font-mono text-muted-foreground uppercase">STALE</div>
          <div className="text-base font-bold text-tactical-amber">{stalePrs.length}</div>
        </div>
        <div className="bg-secondary/30 rounded px-2 py-1.5 text-center">
          <div className="text-[8px] font-mono text-muted-foreground uppercase">MEDIUM</div>
          <div className="text-base font-bold text-tactical-blue">{mediumStale}</div>
        </div>
        <div className="bg-secondary/30 rounded px-2 py-1.5 text-center">
          <div className="text-[8px] font-mono text-muted-foreground uppercase">LOW</div>
          <div className="text-base font-bold text-tactical-green">{lowRisk}</div>
        </div>
      </div>

      {/* PR LIST - compact with no extra space */}
      <div className="flex-1 min-h-0">
        {openPrs.length === 0 ? (
          <div className="flex items-center justify-center h-10 text-xs text-muted-foreground font-mono">
            No open PRs
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
            {openPrs.slice(0, 5).map(pr => {
              const badge = getStaleBadge(pr.days_open);
              return (
                <div
                  key={pr.id}
                  className="flex items-center gap-2 rounded-md bg-secondary/30 px-2 py-1.5 hover:bg-secondary/50 transition-colors"
                >
                  <GitBranch className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground truncate font-medium">
                      {pr.pr_title} <span className="text-muted-foreground text-[9px]">#{pr.pr_number}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[9px] font-mono text-muted-foreground">@{pr.author}</span>
                      <span className="text-[9px] text-muted-foreground">·</span>
                      <span className="text-[9px] font-mono text-muted-foreground truncate">{pr.repo_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className={`text-[9px] font-mono font-bold px-1 py-0.5 rounded ${badge.className}`}>
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
