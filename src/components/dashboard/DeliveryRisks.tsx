import type { GithubActivity } from '@/types/dashboard';
import { GitPullRequest, AlertTriangle, Clock, GitMerge, GitBranch } from 'lucide-react';

interface DeliveryRisksProps {
  prs: GithubActivity[];
}

function getDaysStale(dateStr: string) {
  if (!dateStr) return 0;
  try {
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

function getStaleBadge(days: number) {
  if (days > 7) return { text: `${days}d`, className: 'bg-tactical-red/20 text-tactical-red' };
  if (days > 3) return { text: `${days}d`, className: 'bg-tactical-amber/20 text-tactical-amber' };
  return { text: `${days}d`, className: 'bg-tactical-green/20 text-tactical-green' };
}

export function DeliveryRisks({ prs }: DeliveryRisksProps) {
  // Ensure prs is an array
  const safePrs = Array.isArray(prs) ? prs : [];
  
  console.log('All PRs:', safePrs); // This will help debug in browser console
  
  // More flexible filtering - check for pull_request in type OR status 'open' with title
  const openPrs = safePrs.filter(pr => {
    // Check if it's likely a PR (has title, is open)
    const isOpen = pr?.status === 'open';
    const hasTitle = pr?.title && pr.title.length > 0;
    const isPR = pr?.type === 'pull_request' || pr?.type === 'pr' || (isOpen && hasTitle);
    
    return isOpen && isPR;
  }).sort((a, b) => {
    const aTime = new Date(a?.created_at || 0).getTime();
    const bTime = new Date(b?.created_at || 0).getTime();
    return aTime - bTime;
  });

  console.log('Filtered open PRs:', openPrs); // Debug log

  const stalePrs = openPrs.filter(pr => getDaysStale(pr?.created_at || '') > 3);
  const criticalStale = openPrs.filter(pr => getDaysStale(pr?.created_at || '') > 7).length;
  const mediumStale = openPrs.filter(pr => {
    const days = getDaysStale(pr?.created_at || '');
    return days > 3 && days <= 7;
  }).length;
  const lowRisk = openPrs.filter(pr => getDaysStale(pr?.created_at || '') <= 3).length;

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
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground font-mono mb-2">No open PRs</p>
          <p className="text-xs text-muted-foreground font-mono opacity-60">
            (Check console for debug info)
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {openPrs.slice(0, 5).map(pr => {
            const days = getDaysStale(pr?.created_at || '');
            const badge = getStaleBadge(days);
            return (
              <div
                key={pr?.id || Math.random().toString()}
                className="flex items-start gap-3 rounded-md bg-secondary/30 px-3 py-2.5 hover:bg-secondary/50 transition-colors"
              >
                {pr?.status === 'merged' ? (
                  <GitMerge className="h-4 w-4 mt-0.5 text-tactical-green flex-shrink-0" />
                ) : (
                  <GitBranch className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate font-medium">{pr?.title || 'Untitled PR'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">@{pr?.author || 'unknown'}</span>
                    <span className="text-xs font-mono text-muted-foreground">•</span>
                    <span className="text-xs font-mono text-muted-foreground truncate">{pr?.repo || 'unknown'}</span>
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
      
      {/* Debug info - remove after fixing */}
      {openPrs.length === 0 && safePrs.length > 0 && (
        <details className="mt-4 text-xs text-muted-foreground">
          <summary>Debug: Show all {safePrs.length} items</summary>
          <pre className="mt-2 p-2 bg-secondary/50 rounded max-h-40 overflow-auto">
            {JSON.stringify(safePrs.slice(0, 3), null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
