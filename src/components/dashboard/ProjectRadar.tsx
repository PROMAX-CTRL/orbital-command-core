import type { Email, GithubActivity } from '@/types/dashboard';
import { Radar, AlertCircle, CheckCircle, Clock, Info, GitPullRequest, Bug, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectRadarProps {
  emails: Email[];
  github?: GithubActivity[];
}

function timeAgo(dateStr: string) {
  if (!dateStr) return 'unknown';
  try {
    const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return '<1h ago';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return 'unknown';
  }
}

// GitHub PR Item
function GithubPRItem({ pr }: { pr: any }) {
  const time = timeAgo(pr.created_at);
  const isStale = pr.days_open > 3;
  
  return (
    <div className="rounded-md border border-border bg-secondary/30 px-4 py-3 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-4 w-4 text-tactical-blue" />
          <span className="text-sm font-semibold text-foreground">{pr.pr_title}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{time}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Badge variant="outline" className="text-xs font-mono bg-secondary/50">
          #{pr.pr_number}
        </Badge>
        <span className="text-xs font-mono text-muted-foreground">@{pr.author}</span>
        <span className="text-xs font-mono text-muted-foreground">·</span>
        <span className="text-xs font-mono text-muted-foreground">{pr.repo_name}</span>
        {isStale && (
          <Badge variant="outline" className="text-xs font-mono border-tactical-amber/40 bg-tactical-amber/15 text-tactical-amber ml-auto">
            stale
          </Badge>
        )}
        {pr.review_count > 0 && (
          <Badge variant="outline" className="text-xs font-mono border-tactical-green/40 bg-tactical-green/15 text-tactical-green">
            {pr.review_count} review{pr.review_count !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    </div>
  );
}

// Technical Email Item (project-related)
function TechnicalEmailItem({ email }: { email: Email }) {
  const time = timeAgo(email.received_at ?? email.created_at);
  const isNegative = email.sentiment === 'negative';
  const isPositive = email.sentiment === 'positive';
  const needsReply = email.requires_reply;

  return (
    <div className="rounded-md border border-border bg-secondary/30 px-4 py-3 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-tactical-amber" />
          <span className="text-sm font-semibold text-foreground">{email.subject}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{time}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {isNegative && (
          <Badge variant="outline" className="text-xs font-mono border-destructive/40 bg-destructive/15 text-destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            negative
          </Badge>
        )}
        {isPositive && (
          <Badge variant="outline" className="text-xs font-mono border-primary/40 bg-primary/15 text-primary">
            <CheckCircle className="h-3 w-3 mr-1" />
            positive
          </Badge>
        )}
        {needsReply && (
          <Badge variant="outline" className="text-xs font-mono border-yellow-500/40 bg-yellow-500/15 text-yellow-400">
            reply needed
          </Badge>
        )}
        <span className="text-xs font-mono text-muted-foreground ml-auto">
          {email.from_address?.split('@')[0] || 'Unknown'}
        </span>
      </div>
    </div>
  );
}

export function ProjectRadar({ emails, github = [] }: ProjectRadarProps) {
  // Get GitHub PRs (open ones)
  const projectPRs = (Array.isArray(github) ? github : [])
    .filter(pr => pr?.status === 'open')
    .sort((a, b) => b.days_open - a.days_open) // Most stale first
    .slice(0, 8);

  // Get technical/project emails (internal or project-related)
  const technicalEmails = (Array.isArray(emails) ? emails : []).filter(e => {
    const subject = e.subject?.toLowerCase() || '';
    const fromAddr = e.from_address?.toLowerCase() || '';
    
    // Check if it's internal (company domain) OR has project keywords
    const isInternal = fromAddr.includes('@company.com') || 
                      fromAddr.includes('@internal') ||
                      fromAddr.includes('@ourcompany');
    
    const hasProjectKeywords = subject.includes('pr-') ||
                              subject.includes('build') ||
                              subject.includes('deploy') ||
                              subject.includes('release') ||
                              subject.includes('review') ||
                              subject.includes('bug') ||
                              subject.includes('fix') ||
                              subject.includes('feature');
    
    // Show internal emails with project keywords, OR any email with strong project signals
    return (isInternal && hasProjectKeywords) || hasProjectKeywords;
  }).slice(0, 5);

  // Combine and sort by date
  const allItems = [
    ...projectPRs.map(pr => ({ type: 'pr', data: pr, date: pr.created_at })),
    ...technicalEmails.map(email => ({ type: 'email', data: email, date: email.received_at || email.created_at }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up h-full flex flex-col" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Radar className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Project Radar
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-5 w-5 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
                <Info className="h-3 w-3 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-3">
              <p className="text-xs font-medium mb-2">🎯 Project Radar tracks:</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li><GitPullRequest className="h-3 w-3 inline mr-1" /> Open PRs needing review</li>
                <li><Bug className="h-3 w-3 inline mr-1" /> Build/deployment issues</li>
                <li>📧 Technical emails (internal/project)</li>
                <li className="mt-1 pt-1 border-t border-border">No client emails shown here</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {allItems.length} items
        </span>
      </div>

      <div className="flex-1 min-h-0">
        {allItems.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground font-mono">
            No project activity
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {allItems.map((item, index) => {
              if (item.type === 'pr') {
                return <GithubPRItem key={`pr-${item.data.id}`} pr={item.data} />;
              } else {
                return <TechnicalEmailItem key={`email-${item.data.id}`} email={item.data} />;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
