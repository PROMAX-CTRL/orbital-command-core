import { useState } from 'react';
import type { Email } from '@/types/dashboard';
import { Mail, AlertCircle, Reply, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClientWatchProps {
  emails: Email[];
}

function timeAgo(dateStr: string) {
  const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return '<1h';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getUrgencyColor(score: number) {
  if (score >= 9) return { dot: 'bg-tactical-red status-pulse', text: 'text-tactical-red', bg: 'bg-destructive/10 border-destructive/20' };
  if (score >= 7) return { dot: 'bg-tactical-amber', text: 'text-tactical-amber', bg: 'bg-accent/10 border-tactical-amber/20' };
  return { dot: 'bg-tactical-blue', text: 'text-tactical-blue', bg: 'bg-secondary/30 border-transparent' };
}

function EmailRow({ email }: { email: Email }) {
  const [expanded, setExpanded] = useState(false);
  const urgency = getUrgencyColor(email.urgency_score ?? 0);
  const isNegative = email.sentiment === 'negative' || (email.sentiment_score != null && email.sentiment_score < 0.4);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`w-full text-left rounded-md border px-3 py-2.5 transition-all duration-200 cursor-pointer hover:brightness-110 ${urgency.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${urgency.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground truncate font-medium">{email.subject}</span>
            {isNegative && (
              <Badge variant="outline" className="text-[10px] font-mono border-destructive/40 text-tactical-red px-1.5 py-0 flex-shrink-0">
                negative
              </Badge>
            )}
            {email.requires_reply && (
              <Badge variant="outline" className="text-[10px] font-mono border-tactical-amber/40 text-tactical-amber px-1.5 py-0 flex-shrink-0">
                <Reply className="h-2.5 w-2.5 mr-1" />
                reply
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-mono text-muted-foreground truncate">
              {email.client_name || email.from_address}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-mono text-muted-foreground">
              {timeAgo(email.received_at || email.created_at)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-mono font-bold ${urgency.text}`}>
            {email.urgency_score ?? '–'}/10
          </span>
          {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-2 pt-2 border-t border-border animate-fade-in-up">
          {email.body && (
            <p className="text-xs text-secondary-foreground leading-relaxed line-clamp-3 mb-2">{email.body}</p>
          )}
          <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
            <span>From: {email.from_address}</span>
            <span>Priority: {email.priority}</span>
            {email.sentiment && <span>Sentiment: {email.sentiment}</span>}
          </div>
        </div>
      )}
    </button>
  );
}

export function ClientWatch({ emails }: ClientWatchProps) {
  const flagged = emails.filter(e => {
    const highUrgency = (e.urgency_score ?? 0) > 7;
    const negative = e.sentiment === 'negative' || (e.sentiment_score != null && e.sentiment_score < 0.4);
    const needsReply = e.requires_reply === true;
    return highUrgency || negative || needsReply;
  });

  const criticalCount = flagged.filter(e => (e.urgency_score ?? 0) >= 9).length;
  const replyCount = flagged.filter(e => e.requires_reply).length;

  const remaining = emails.filter(e => !flagged.includes(e));
  const sorted = [...flagged, ...remaining];

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up h-full flex flex-col" style={{ animationDelay: '0.2s' }}>
      {/* Header with tooltip */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Mail className="h-4 w-4 text-tactical-red" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Client Watch
        </h2>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-5 w-5 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
                <Info className="h-3 w-3 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs p-3">
              <p className="text-xs font-medium mb-2">📨 Client Watch monitors:</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-tactical-red font-bold">🔴</span>
                  <span><span className="font-bold text-foreground">Urgency score:</span> 7-10 = high priority</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">negative</span>
                  <span> tag = client frustration or issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tactical-amber font-bold">reply</span>
                  <span> tag = response needed from your team</span>
                </li>
                <li className="flex items-start gap-2 mt-1 pt-1 border-t border-border">
                  <span className="text-tactical-red font-bold">{criticalCount} critical</span>
                  <span> = urgency score 9+</span>
                </li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="ml-auto flex items-center gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1 text-tactical-red">
              <AlertCircle className="h-3 w-3" />
              <span className="text-xs font-mono font-bold">{criticalCount} critical</span>
            </div>
          )}
          {replyCount > 0 && (
            <span className="text-xs font-mono font-bold text-tactical-amber">
              {replyCount} need reply
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {emails.length} total
          </span>
        </div>
      </div>

      {/* Content - scrollable if needed */}
      <div className="flex-1 min-h-0">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-sm text-muted-foreground font-mono">
            No emails tracked
          </div>
        ) : (
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {sorted.slice(0, 10).map(email => (
              <EmailRow key={email.id} email={email} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
