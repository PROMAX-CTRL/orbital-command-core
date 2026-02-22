import type { Email } from '@/types/dashboard';
import { Radar, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const safeEmails = Array.isArray(emails) ? emails : [];
  
  const projectItems = safeEmails.filter(
    (e) => e?.sentiment === 'negative' || e?.requires_reply || e?.sentiment === 'positive'
  );

  const sorted = [...projectItems].sort((a, b) => {
    const aScore = a?.sentiment === 'negative' ? 2 : a?.requires_reply ? 1 : 0;
    const bScore = b?.sentiment === 'negative' ? 2 : b?.requires_reply ? 1 : 0;
    if (bScore !== aScore) return bScore - aScore;
    
    const aTime = new Date(a?.received_at ?? a?.created_at ?? 0).getTime();
    const bTime = new Date(b?.received_at ?? b?.created_at ?? 0).getTime();
    return bTime - aTime;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up h-full flex flex-col" style={{ animationDelay: '0.2s' }}>
      {/* Header with tooltip */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Radar className="h-4 w-4 text-primary" />
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
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">🔴</span>
                  <span><span className="font-bold text-foreground">Negative:</span> Client issues or blockers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">🟡</span>
                  <span><span className="font-bold text-foreground">Reply needed:</span> Action required from your team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">🟢</span>
                  <span><span className="font-bold text-foreground">Positive:</span> Good news or milestones</span>
                </li>
                <li className="flex items-start gap-2 mt-1 pt-1 border-t border-border">
                  <span className="text-muted-foreground">⏱️</span>
                  <span>Time shows how recent the item is</span>
                </li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {sorted.length} flagged
        </span>
      </div>

      {/* Content - scrollable if needed */}
      <div className="flex-1 min-h-0">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-sm text-muted-foreground font-mono">
            No flagged items
          </div>
        ) : (
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {sorted.map((item) => (
              <ProjectItem key={item?.id || Math.random().toString()} email={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
