import type { Email } from '@/types/dashboard';
import { Mail, AlertCircle } from 'lucide-react';

interface ClientWatchProps {
  emails: Email[];
}

const priorityConfig = {
  urgent: { dotClass: 'bg-tactical-red status-pulse', textClass: 'text-tactical-red', label: 'URGENT' },
  high: { dotClass: 'bg-tactical-amber', textClass: 'text-tactical-amber', label: 'HIGH' },
  normal: { dotClass: 'bg-tactical-blue', textClass: 'text-tactical-blue', label: 'NORMAL' },
  low: { dotClass: 'bg-tactical-green', textClass: 'text-tactical-green', label: 'LOW' },
};

function timeAgo(dateStr: string) {
  const hours = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return '<1h';
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function ClientWatch({ emails }: ClientWatchProps) {
  const urgentCount = emails.filter(e => e.priority === 'urgent' || e.priority === 'high').length;
  const unreadCount = emails.filter(e => !e.is_read).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-4 w-4 text-tactical-red" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Client Watch
        </h2>
        <div className="ml-auto flex items-center gap-3">
          {urgentCount > 0 && (
            <div className="flex items-center gap-1 text-tactical-red">
              <AlertCircle className="h-3 w-3" />
              <span className="text-xs font-mono font-bold">{urgentCount} priority</span>
            </div>
          )}
          <span className="text-xs font-mono text-muted-foreground">{unreadCount} unread</span>
        </div>
      </div>

      {emails.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono">No emails tracked</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {emails.slice(0, 8).map(email => {
            const config = priorityConfig[email.priority];
            return (
              <div
                key={email.id}
                className={`flex items-start gap-3 rounded-md px-3 py-2.5 ${
                  !email.is_read ? 'bg-secondary/50' : 'bg-secondary/20'
                }`}
              >
                <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${config.dotClass}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${!email.is_read ? 'font-medium text-foreground' : 'text-secondary-foreground'}`}>
                    {email.subject}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground truncate">
                      {email.client_name || email.from_address}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-mono font-bold ${config.textClass}`}>
                    {config.label}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {timeAgo(email.received_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
