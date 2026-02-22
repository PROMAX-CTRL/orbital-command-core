import type { Email } from '@/types/dashboard';
import { Radar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectRadarProps {
  emails: Email[];
}

function timeAgo(dateStr: string) {
  const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return '<1h ago';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getTagBadges(email: Email) {
  const tags: { label: string; className: string }[] = [];
  if (email.sentiment === 'negative') {
    tags.push({ label: 'negative', className: 'border-destructive/40 bg-destructive/15 text-destructive' });
  }
  if (email.sentiment === 'positive') {
    tags.push({ label: 'positive', className: 'border-primary/40 bg-primary/15 text-primary' });
  }
  if (email.requires_reply) {
    tags.push({ label: 'reply', className: 'border-yellow-500/40 bg-yellow-500/15 text-yellow-400' });
  }
  return tags;
}

function EmailCard({ email }: { email: Email }) {
  const tags = getTagBadges(email);
  const time = timeAgo(email.received_at ?? email.created_at);

  return (
    <div className="rounded-md border border-border bg-secondary/30 px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-foreground">{email.subject}</span>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {tags.map((tag) => (
            <Badge
              key={tag.label}
              variant="outline"
              className={`text-[10px] font-mono px-1.5 py-0 ${tag.className}`}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
      </div>
      <span className="text-xs font-mono text-muted-foreground flex-shrink-0">{time}</span>
    </div>
  );
}

export function ProjectRadar({ emails }: ProjectRadarProps) {
  // Show emails that are negative, require reply, or positive (noteworthy)
  const flagged = emails.filter(
    (e) => e.sentiment === 'negative' || e.requires_reply || e.sentiment === 'positive'
  );

  // Sort: negative first, then by timestamp desc
  const sorted = [...flagged].sort((a, b) => {
    const aScore = a.sentiment === 'negative' ? 2 : a.requires_reply ? 1 : 0;
    const bScore = b.sentiment === 'negative' ? 2 : b.requires_reply ? 1 : 0;
    if (bScore !== aScore) return bScore - aScore;
    return new Date(b.received_at ?? b.created_at).getTime() - new Date(a.received_at ?? a.created_at).getTime();
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
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {sorted.map((email) => (
            <EmailCard key={email.id} email={email} />
          ))}
        </div>
      )}
    </div>
  );
}
