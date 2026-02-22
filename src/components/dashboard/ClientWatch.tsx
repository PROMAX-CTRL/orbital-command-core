import { useState } from 'react';
import type { Email } from '@/types/dashboard';
import { Mail, AlertCircle, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  // Filter: urgency > 7, negative sentiment, or requires reply
  const flagged = emails.filter(e => {
    const highUrgency = (e.urgency_score ?? 0) > 7;
    const negative = e.sentiment === 'negative' || (e.sentiment_score != null && e.sentiment_score < 0.4);
    const needsReply = e.requires_reply === true;
    return highUrgency || negative || needsReply;
  });

  const criticalCount = flagged.filter(e => (e.urgency_score ?? 0) >= 9).length;
  const replyCount = flagged.filter(e => e.requires_reply).length;

  // Show flagged first, then remaining
  const remaining = emails.filter(e => !flagged.includes(e));
  const sorted = [...flagged, ...remaining];

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-4 w-4 text-tactical-red" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Client Watch
        </h2>
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

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono py-4 text-center">No emails tracked</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {sorted.slice(0, 10).map(email => (
            <EmailRow key={email.id} email={email} />
          ))}
        </div>
      )}
    </div>
  );
}
