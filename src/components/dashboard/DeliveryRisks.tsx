import type { GithubActivity } from '@/types/dashboard';
import { GitPullRequest, AlertTriangle, Clock, GitMerge, GitBranch } from 'lucide-react';

interface DeliveryRisksProps {
  prs: GithubActivity[];
}

function getDaysStale(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function getStaleBadge(days: number) {
  if (days > 7) return { text: `${days}d`, className: 'bg-tactical-red/20 text-tactical-red' };
  if (days > 3) return { text: `${days}d`, className: 'bg-tactical-amber/20 text-tactical-amber' };
  return { text: `${days}d`, className: 'bg-tactical-green/20 text-tactical-green' };
}

export function DeliveryRisks({ prs }: DeliveryRisksProps) {
  const openPrs = prs
    .filter(pr => pr.type === 'pull_request' && pr.status === 'open')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const stalePrs = openPrs.filter(pr => getDaysStale(pr.created_at) > 3);
  const criticalStale = openPrs.filter(pr => getDaysStale(pr.created_at) > 7).length;
  const mediumStale = openPrs.filter(pr => {
    const days = getDaysStale(pr.created_at);
    return days > 3 && days <= 7;
  }).length;
  const lowRisk = openPrs.filter(pr => getDaysStale(pr.created_at) <= 3).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
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

      {/* PR LIST */}
      {openPrs.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono py-2 text-center">No open PRs</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {openPrs.slice(0, 5).map(pr => {
            const days = getDaysStale(pr.created_at);
            const badge = getStaleBadge(days);
            return (
              <div
                key={pr.id}
                className="flex items-start gap-3 rounded-md bg-secondary/30 px-3 py-2.5 hover:bg-secondary/50 transition-colors"
              >
                {pr.status === 'merged' ? (
                  <GitMerge className="h-4 w-4 mt-0.5 text-tactical-green flex-shrink-0" />
                ) : (
                  <GitBranch className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate font-medium">{pr.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">@{pr.author}</span>
                    <span className="text-xs font-mono text-muted-foreground">•</span>
                    <span className="text-xs font-mono text-muted-foreground truncate">{pr.repo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${badge.className}`}>
                    {badge.text}
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
