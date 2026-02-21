import { useMemo } from 'react';
import type { TeamMember, SlackMessage } from '@/types/dashboard';
import { AlertTriangle, Moon, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface TeamPulseProps {
  team: TeamMember[];
  slackMessages: SlackMessage[];
}

function SentimentSparkline({ scores }: { scores: number[] }) {
  if (scores.length < 2) return <span className="text-xs font-mono text-muted-foreground">—</span>;

  const width = 80;
  const height = 24;
  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = scores.map((s, i) => {
    const x = padding + (i / (scores.length - 1)) * innerW;
    const y = padding + (1 - s) * innerH;
    return `${x},${y}`;
  });

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const strokeColor = avg >= 0.7
    ? 'hsl(var(--tactical-green))'
    : avg >= 0.4
    ? 'hsl(var(--tactical-amber))'
    : 'hsl(var(--tactical-red))';

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(' ')}
      />
      {/* Latest point dot */}
      {scores.length > 0 && (
        <circle
          cx={padding + ((scores.length - 1) / (scores.length - 1)) * innerW}
          cy={padding + (1 - scores[scores.length - 1]) * innerH}
          r="2"
          fill={strokeColor}
        />
      )}
    </svg>
  );
}

function SentimentTrend({ scores }: { scores: number[] }) {
  if (scores.length < 2) return <Minus className="h-3 w-3 text-muted-foreground" />;
  const recent = scores.slice(-3);
  const older = scores.slice(0, -3).length > 0 ? scores.slice(0, -3) : scores.slice(0, 1);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  const diff = recentAvg - olderAvg;

  if (diff > 0.1) return <TrendingUp className="h-3 w-3 text-tactical-green" />;
  if (diff < -0.1) return <TrendingDown className="h-3 w-3 text-tactical-red" />;
  return <Minus className="h-3 w-3 text-tactical-amber" />;
}

export function TeamPulse({ team, slackMessages }: TeamPulseProps) {
  // Build sentiment scores per user from slack messages (ordered by timestamp)
  const userSentimentScores = useMemo(() => {
    const map: Record<string, number[]> = {};
    // Sort by timestamp ascending for sparkline
    const sorted = [...slackMessages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    sorted.forEach(m => {
      if (!map[m.user_name]) map[m.user_name] = [];
      map[m.user_name].push(m.sentiment_score);
    });
    return map;
  }, [slackMessages]);

  // Count messages per user
  const messageCount = useMemo(() => {
    const map: Record<string, number> = {};
    slackMessages.forEach(m => {
      map[m.user_name] = (map[m.user_name] || 0) + 1;
    });
    return map;
  }, [slackMessages]);

  const atRiskCount = team.filter(m => m.is_at_risk).length;

  // Sort: at-risk first, then by after_hours_message_count desc
  const sorted = [...team].sort((a, b) => {
    if (a.is_at_risk !== b.is_at_risk) return a.is_at_risk ? -1 : 1;
    return b.after_hours_message_count - a.after_hours_message_count;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-tactical-blue status-pulse" />
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Team Pulse
        </h2>
        <div className="ml-auto flex items-center gap-3">
          {atRiskCount > 0 && (
            <div className="flex items-center gap-1 text-tactical-red">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs font-mono font-bold">{atRiskCount} at risk</span>
            </div>
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {team.length} members
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-3 py-1.5 mb-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        <div className="w-8" />
        <div className="flex-1">Member</div>
        <div className="w-20 text-center">Sentiment</div>
        <div className="w-16 text-center">After hrs</div>
        <div className="w-14 text-center">Msgs</div>
        <div className="w-14 text-center">Trend</div>
      </div>

      {team.length === 0 ? (
        <p className="text-sm text-muted-foreground font-mono">No team data available</p>
      ) : (
        <div className="space-y-1">
          {sorted.map(member => {
            const scores = userSentimentScores[member.name] || [];
            const msgs = messageCount[member.name] || 0;
            const avgSentiment = scores.length > 0
              ? scores.reduce((a, b) => a + b, 0) / scores.length
              : null;

            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
                  member.is_at_risk
                    ? 'bg-tactical-red/8 border border-tactical-red/20 glow-red'
                    : 'bg-secondary/30'
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    member.is_at_risk
                      ? 'bg-tactical-red/20 text-tactical-red'
                      : 'bg-muted text-foreground'
                  }`}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>

                {/* Name + role */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground truncate">{member.name}</span>
                    {member.is_at_risk && (
                      <AlertTriangle className="h-3 w-3 text-tactical-red flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{member.role}</div>
                </div>

                {/* Sparkline */}
                <div className="w-20 flex justify-center">
                  <SentimentSparkline scores={scores} />
                </div>

                {/* After hours */}
                <div className="w-16 flex items-center justify-center gap-1">
                  {member.after_hours_message_count > 0 && (
                    <Moon className={`h-3 w-3 ${
                      member.after_hours_message_count >= 5 ? 'text-tactical-red' :
                      member.after_hours_message_count >= 3 ? 'text-tactical-amber' :
                      'text-muted-foreground'
                    }`} />
                  )}
                  <span className={`text-xs font-mono font-bold ${
                    member.after_hours_message_count >= 5 ? 'text-tactical-red' :
                    member.after_hours_message_count >= 3 ? 'text-tactical-amber' :
                    'text-muted-foreground'
                  }`}>
                    {member.after_hours_message_count}
                  </span>
                </div>

                {/* Message count */}
                <div className="w-14 text-center">
                  <span className="text-xs font-mono text-muted-foreground">{msgs}</span>
                </div>

                {/* Trend direction */}
                <div className="w-14 flex justify-center">
                  <SentimentTrend scores={scores} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
