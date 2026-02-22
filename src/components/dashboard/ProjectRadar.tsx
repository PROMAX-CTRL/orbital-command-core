import { useState } from 'react';
import type { Email } from '@/types/dashboard';
import { Radar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectRadarProps {
  emails: Email[];
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

function ProjectItem({ email }: { email: Email }) {
  const isNegative = email.sentiment === 'negative';
  const isPositive = email.sentiment === 'positive';
  const needsReply = email.requires_reply;
  const time = timeAgo(email.received_at ?? email.created_at);
  
  // Safe way to get sender name
  const senderName = email.client_name || 
    (email.from_address ? email.from_address.split('@')[0] : 'Unknown');

  return (
    <div className="rounded-md border border-border bg-secondary/30 px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-foreground">{email.subject || 'No subject'}</span>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {isNegative && (
            <Badge variant="outline" className="text-[10px] font-mono border-destructive/40 bg-destructive/15 text-destructive px-1.5 py-0">
              <AlertCircle className="h-2.5 w-2.5 mr-1" />
              negative
            </Badge>
          )}
          {isPositive && (
            <Badge variant="outline" className="text-[10px] font-mono border-primary/40 bg-primary/15 text-primary px-1.5 py-0">
              <CheckCircle className="h-2.5 w-2.5 mr-1" />
              positive
            </Badge>
          )}
          {needsReply && (
            <Badge variant="outline" className="text-[10px] font-mono border-yellow-500/40 bg-yellow-500/15 text-yellow-400 px-1.5 py-0">
              reply needed
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-mono text-muted-foreground">
            {senderName}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-mono text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}

export function ProjectRadar({ emails }: ProjectRadarProps) {
  // Ensure emails is an array
  const safeEmails = Array.isArray(emails) ? emails : [];
  
  // Show project-relevant items (negative, need reply, or positive)
  const projectItems = safeEmails.filter(
    (e) => e?.sentiment === 'negative' || e?.requires_reply || e?.sentiment === 'positive'
  );

  // Sort: negative first, then by timestamp desc
  const sorted = [...projectItems].sort((a, b) => {
    const aScore = a?.sentiment === 'negative' ? 2 : a?.requires_reply ? 1 : 0;
    const bScore = b?.sentiment === 'negative' ? 2 : b?.requires_reply ? 1 : 0;
    if (bScore !== aScore) return bScore - aScore;
    
    const aTime = new Date(a?.received_at ?? a?.created_at ?? 0).getTime();
    const bTime = new Date(b?.received_at ?? b?.created_at ?? 0).getTime();
    return bTime - aTime;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Radar className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Project Radar
        </h2>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {sorted.length} flagged
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono py-4 text-center">
          No flagged items
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {sorted.map((item) => (
            <ProjectItem key={item?.id || Math.random().toString()} email={item} />
          ))}
        </div>
      )}
    </div>
  );
}
