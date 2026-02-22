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
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">{email.subject || 'No subject'}</span>
          <span className="text-xs font-mono text-muted-foreground ml-2">{time}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {isNegative && (
            <Badge variant="outline" className="text-xs font-mono border-destructive/40 bg-destructive/15 text-destructive px-2 py-0.5">
              <AlertCircle className="h-3 w-3 mr-1" />
              negative
            </Badge>
          )}
          {isPositive && (
            <Badge variant="outline" className="text-xs font-mono border-primary/40 bg-primary/15 text-primary px-2 py-0.5">
              <CheckCircle className="h-3 w-3 mr-1" />
              positive
            </Badge>
          )}
          {needsReply && (
            <Badge variant="outline" className="text-xs font-mono border-yellow-500/40 bg-yellow-500/15 text-yellow-400 px-2 py-0.5">
              reply needed
            </Badge>
          )}
          <span className="text-xs font-mono text-muted-foreground ml-auto">
            {senderName}
          </span>
        </div>
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
      {/* Header */}
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
                <li><span className="text-destructive">🔴 negative</span> = client issues</li>
                <li><span className="text-yellow-400">🟡 reply</span> = action needed</li>
                <li><span className="text-primary">🟢 positive</span> = good news</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {sorted.length} flagged
        </span>
      </div>

      {/* Content - scrollable with proper sizing */}
      <div className="flex-1 min-h-0">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground font-mono">
            No flagged items
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {sorted.slice(0, 10).map((item) => (
              <ProjectItem key={item?.id || Math.random().toString()} email={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
