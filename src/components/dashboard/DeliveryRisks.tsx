import { GitPullRequest, AlertTriangle, Clock, GitBranch } from 'lucide-react';

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
  // Ensure prs is an array
  const safePrs = Array.isArray(prs) ? prs : [];
  
  // Filter for open PRs (status = 'open')
  const openPrs = safePrs
    .filter(pr => pr?.status === 'open')
    .sort((a, b) => a.days_open - b.days_open);

  // Calculate metrics
  const stalePrs = openPrs.filter(pr => pr.days_open > 3);
  const mediumStale = openPrs.filter(pr => pr.days_open > 3 && pr.days_open <= 7).length;
  const lowRisk = openPrs.filter(pr => pr.days_open <= 3).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <GitPullRequest className="h-4 w-4 text-tactical-amber" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Delivery Risks
        </h2>
        {stalePrs.length > 0 && (
          <div className="ml-auto flex items-center gap-1 text-tactical-amber">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs font-mono font-bold">{stalePrs.length} stale</span>
          </div>
        )}
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-secondary/30 rounded-md p-2 text-center">
          <div className="text-[10px] font-mono text-muted-foreground uppercase">OPEN</div>
          <div className="text-xl font-bold text-foreground">{openPrs.length}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-2 text-center">
          <div className="text-[10px] font-mono text-muted-foreground uppercase">STALE</div>
          <div className="text-xl font-bold text-tactical-amber">{stalePrs.length}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-2 text-center">
          <div className="text-[10px] font-mono text-muted-foreground uppercase">MEDIUM</div>
          <div className="text-xl font-bold text-tactical-blue">{mediumStale}</div>
        </div>
        <div className="bg-secondary/30 rounded-md p-2 text-center">
          <div className="text-[10px] font-mono text-muted-foreground uppercase">LOW</div>
          <div className="text-xl font-bold text-tactical-green">{lowRisk}</div>
        </div>
      </div>

      {/* PR LIST - auto-height, no fixed max */}
      {openPrs.length === 0 ? (
        <div className="text-sm text-muted-foreground font-mono py-2 text-center">
          No open PRs
        </div>
      ) : (
        <div className="space-y-2">
          {openPrs.slice(0, 5).map(pr => {
            const badge = getStaleBadge(pr.days_open);
            return (
              <div
                key={pr.id}
                className="flex items-center gap-3 rounded-md bg-secondary/30 px-3 py-2 hover:bg-secondary/50 transition-colors"
              >
                <GitBranch className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate font-medium">
                    {pr.pr_title} <span className="text-muted-foreground">#{pr.pr_number}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-muted-foreground">@{pr.author}</span>
                    <span className="text-xs font-mono text-muted-foreground">·</span>
                    <span className="text-xs font-mono text-muted-foreground truncate">{pr.repo_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
                    {pr.days_open}d
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
