import type { TeamMember, SlackMessage } from '@/types/dashboard';

interface TeamPulseProps {
  team: TeamMember[];
  slackMessages: SlackMessage[];
}

function getSentimentColor(score?: number) {
  if (!score || score >= 0.7) return 'bg-tactical-green';
  if (score >= 0.4) return 'bg-tactical-amber';
  return 'bg-tactical-red';
}

function getSentimentLabel(score?: number) {
  if (!score) return 'N/A';
  if (score >= 0.7) return 'Positive';
  if (score >= 0.4) return 'Neutral';
  return 'Concern';
}

export function TeamPulse({ team, slackMessages }: TeamPulseProps) {
  // Count messages per author for activity indicator
  const messageCount: Record<string, number> = {};
  slackMessages.forEach(m => {
    messageCount[m.author] = (messageCount[m.author] || 0) + 1;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-tactical-blue status-pulse" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Team Pulse
        </h2>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {team.length} members
        </span>
      </div>

      {team.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono">No team data available</p>
      ) : (
        <div className="space-y-2">
          {team.map(member => {
            const activity = messageCount[member.name] || 0;
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-md bg-secondary/30 px-3 py-2.5"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-mono font-bold text-foreground">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{member.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{member.role}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-mono text-muted-foreground">
                    {activity} msgs
                  </span>
                  <div className={`h-2 w-2 rounded-full ${getSentimentColor(member.sentiment_score)}`} />
                  <span className={`text-xs font-mono ${
                    !member.sentiment_score ? 'text-muted-foreground' :
                    member.sentiment_score >= 0.7 ? 'text-tactical-green' :
                    member.sentiment_score >= 0.4 ? 'text-tactical-amber' : 'text-tactical-red'
                  }`}>
                    {getSentimentLabel(member.sentiment_score)}
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
