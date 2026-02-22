import { useState } from 'react';
import type { Email } from '@/types/dashboard';
import { Mail, AlertCircle, Reply, ChevronDown, ChevronUp, Info, ExternalLink } from 'lucide-react';
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
  if (hours < 1) return '<1h ago';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getUrgencyColor(score: number) {
  if (score >= 9) return { dot: 'bg-tactical-red status-pulse', text: 'text-tactical-red', bg: 'bg-destructive/10 border-destructive/20' };
  if (score >= 7) return { dot: 'bg-tactical-amber', text: 'text-tactical-amber', bg: 'bg-accent/10 border-tactical-amber/20' };
  return { dot: 'bg-tactical-blue', text: 'text-tactical-blue', bg: 'bg-secondary/30 border-transparent' };
}

function ClientEmailRow({ email }: { email: Email }) {
  const [expanded, setExpanded] = useState(false);
  const urgency = getUrgencyColor(email.urgency_score ?? 0);
  const isNegative = email.sentiment === 'negative' || (email.sentiment_score != null && email.sentiment_score < 0.4);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={`w-full text-left rounded-md border px-4 py-3 transition-all duration-200 cursor-pointer hover:brightness-110 ${urgency.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${urgency.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground truncate font-medium">{email.subject}</span>
            {isNegative && (
              <Badge variant="outline" className="text-xs font-mono border-destructive/40 text-tactical-red px-2 py-0 flex-shrink-0">
                negative
              </Badge>
            )}
            {email.requires_reply && (
              <Badge variant="outline" className="text-xs font-mono border-tactical-amber/40 text-tactical-amber px-2 py-0 flex-shrink-0">
                <Reply className="h-3 w-3 mr-1" />
                reply
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-mono text-muted-foreground truncate">
              {email.client_name || email.from_address || 'Unknown Client'}
            </span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm font-mono text-muted-foreground">
              {timeAgo(email.received_at || email.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-mono font-bold ${urgency.text}`}>
              Urgency: {email.urgency_score ?? '–'}/10
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-border animate-fade-in-up">
          {email.body && (
            <p className="text-sm text-secondary-foreground leading-relaxed mb-3">{email.body}</p>
          )}
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>Priority: {email.priority}</span>
            {email.sentiment && <span>Sentiment: {email.sentiment}</span>}
          </div>
        </div>
      )}
    </button>
  );
}

export function ClientWatch({ emails }: ClientWatchProps) {
  const safeEmails = Array.isArray(emails) ? emails : [];
  
  // Show ALL emails for now to test
  const clientEmails = safeEmails;

  // Flag important ones
  const flagged = clientEmails.filter(e => {
    const highUrgency = (e.urgency_score ?? 0) > 7;
    const negative = e.sentiment === 'negative' || (e.sentiment_score != null && e.sentiment_score < 0.4);
    const needsReply = e.requires_reply === true;
    return highUrgency || negative || needsReply;
  });

  // Sort: flagged first, then by date
  const sorted = [...flagged, ...clientEmails.filter(e => !flagged.includes(e))].sort((a, b) => {
    const aFlagged = flagged.includes(a);
    const bFlagged = flagged.includes(b);
    if (aFlagged && !bFlagged) return -1;
    if (!aFlagged && bFlagged) return 1;
    
    return new Date(b.received_at || b.created_at).getTime() - new Date(a.received_at || a.created_at).getTime();
  });

  const criticalCount = flagged.filter(e => (e.urgency_score ?? 0) >= 9).length;
  const replyCount = flagged.filter(e => e.requires_reply).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Mail className="h-5 w-5 text-tactical-red" />
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
              <p className="text-xs font-medium mb-2">📨 Client Watch shows:</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li>• All client emails</li>
                <li>• 🔴 Critical = urgency 9+</li>
                <li>• 🟡 Reply = needs response</li>
                <li>• 😠 Negative sentiment flagged</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="ml-auto flex items-center gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1 text-tactical-red">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-mono font-bold">{criticalCount} critical</span>
            </div>
          )}
          {replyCount > 0 && (
            <span className="text-sm font-mono font-bold text-tactical-amber">
              {replyCount} need reply
            </span>
          )}
          <span className="text-sm font-mono text-muted-foreground">
            {clientEmails.length} emails
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground font-mono">
            No client emails
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {sorted.map(email => (
              <ClientEmailRow key={email.id} email={email} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
