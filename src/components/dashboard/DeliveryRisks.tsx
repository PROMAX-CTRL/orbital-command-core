import type { GithubActivity } from '@/types/dashboard';
import { GitPullRequest, AlertTriangle, Clock } from 'lucide-react';

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

      {openPrs.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono">No open PRs</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {openPrs.slice(0, 8).map(pr => {
            const days = getDaysStale(pr.created_at);
            const badge = getStaleBadge(days);
            return (
              <div
                key={pr.id}
                className="flex items-start gap-3 rounded-md bg-secondary/30 px-3 py-2.5"
              >
                <GitPullRequest className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{pr.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">{pr.author}</span>
                    <span className="text-xs font-mono text-muted-foreground">•</span>
                    <span className="text-xs font-mono text-muted-foreground">{pr.repo}</span>
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
