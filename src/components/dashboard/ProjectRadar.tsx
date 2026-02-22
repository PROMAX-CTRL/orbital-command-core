import type { GithubActivity } from '@/types/dashboard';
import { Radar, GitPullRequest, Clock, AlertTriangle, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ProjectRadarProps {
  prs: GithubActivity[];
}

function getDaysOpen(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function PrRow({ pr }: { pr: GithubActivity & { daysOpen: number; isStale: boolean } }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`w-full text-left rounded-md px-3 py-2.5 transition-all duration-200 cursor-pointer ${
        pr.isStale
          ? 'bg-destructive/10 border border-destructive/20 hover:bg-destructive/15'
          : 'bg-secondary/30 border border-transparent hover:bg-secondary/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <GitPullRequest
          className={`h-4 w-4 flex-shrink-0 ${
            pr.isStale ? 'text-tactical-amber' : 'text-muted-foreground'
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground truncate">{pr.title}</span>
            {pr.isStale && (
              <AlertTriangle className="h-3 w-3 text-tactical-amber flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-mono text-muted-foreground">{pr.author}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-mono text-muted-foreground">{pr.repo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {pr.daysOpen > 3 && (
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-tactical-amber/40 text-tactical-amber px-1.5 py-0"
            >
              <Eye className="h-2.5 w-2.5 mr-1" />
              needs review
            </Badge>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span
              className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                pr.daysOpen > 7
                  ? 'bg-destructive/20 text-tactical-red'
                  : pr.daysOpen > 3
                  ? 'bg-accent/20 text-tactical-amber'
                  : 'bg-primary/20 text-tactical-green'
              }`}
            >
              {pr.daysOpen}d
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 pt-2 border-t border-border animate-fade-in-up">
          <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
            <span>Created: {new Date(pr.created_at).toLocaleDateString()}</span>
            <span>Updated: {new Date(pr.updated_at).toLocaleDateString()}</span>
            <span className={pr.isStale ? 'text-tactical-red' : 'text-tactical-green'}>
              {pr.isStale ? '● STALE' : '● ACTIVE'}
            </span>
          </div>
          {pr.url && (
            <a
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-tactical-blue hover:underline mt-1 inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              View on GitHub →
            </a>
          )}
        </div>
      )}
    </button>
  );
}

export function ProjectRadar({ prs }: ProjectRadarProps) {
  const openPrs = prs
    .filter((pr) => pr.type === 'pull_request' && pr.status === 'open')
    .map((pr) => {
      const daysOpen = getDaysOpen(pr.created_at);
      return { ...pr, daysOpen, isStale: daysOpen > 3 };
    })
    .sort((a, b) => b.daysOpen - a.daysOpen);

  const staleCount = openPrs.filter((pr) => pr.isStale).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Radar className="h-4 w-4 text-tactical-blue" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Project Radar
        </h2>
        <div className="ml-auto flex items-center gap-3">
          {staleCount > 0 && (
            <span className="text-xs font-mono font-bold text-tactical-amber">
              {staleCount} stale
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {openPrs.length} open
          </span>
        </div>
      </div>

      {openPrs.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono py-4 text-center">
          No open PRs detected
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {openPrs.map((pr) => (
            <PrRow key={pr.id} pr={pr} />
          ))}
        </div>
      )}
    </div>
  );
}
