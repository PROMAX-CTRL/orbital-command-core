import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RiskAssessment, TeamMember, GithubActivity, Email, NextAction, SlackMessage } from '@/types/dashboard';

export function useDashboardData() {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [prs, setPrs] = useState<GithubActivity[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [actions, setActions] = useState<NextAction[]>([]);
  const [slackMessages, setSlackMessages] = useState<SlackMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data from Supabase
        const [risksRes, teamRes, ghRes, emailsRes, slackRes] = await Promise.all([
          supabase.from('risk_assessments').select('*').order('created_at', { ascending: false }),
          supabase.from('team_members').select('*'),
          supabase.from('github_activity').select('*').order('created_at', { ascending: false }),
          supabase.from('emails').select('*').order('created_at', { ascending: false }),
          supabase.from('slack_messages').select('*').order('created_at', { ascending: false }),
        ]);

        // Log data for debugging (remove later)
        console.log('📊 Dashboard Data:');
        console.log('Risks:', risksRes.data);
        console.log('Team:', teamRes.data);
        console.log('GitHub PRs:', ghRes.data);
        console.log('Emails:', emailsRes.data);
        console.log('Slack:', slackRes.data);

        // Set state with fetched data
        if (risksRes.data) setRisks(risksRes.data as RiskAssessment[]);
        if (teamRes.data) setTeam(teamRes.data as TeamMember[]);
        if (ghRes.data) setPrs(ghRes.data as GithubActivity[]);
        if (emailsRes.data) setEmails(emailsRes.data as Email[]);
        if (slackRes.data) setSlackMessages(slackRes.data as SlackMessage[]);

        // Generate AI-suggested actions from the data
        const generatedActions: NextAction[] = [];
        
        // Add actions from high/critical risks
        if (risksRes.data) {
          (risksRes.data as RiskAssessment[])
            .filter(r => r.is_active && (r.severity === 'critical' || r.severity === 'high'))
            .slice(0, 3)
            .forEach(r => {
              generatedActions.push({
                id: `action-risk-${r.id}`,
                title: r.title,
                description: r.suggested_action || 'Review and take action',
                priority: r.severity === 'critical' ? 'critical' : 'high',
                source: 'risk_assessment',
                created_at: r.created_at,
              });
            });
        }

        // Add actions from urgent emails
        if (emailsRes.data) {
          (emailsRes.data as Email[])
            .filter(e => (e.urgency_score ?? 0) >= 8 || e.requires_reply)
            .slice(0, 2)
            .forEach(e => {
              generatedActions.push({
                id: `action-email-${e.id}`,
                title: `Reply to: ${e.subject}`,
                description: `Urgent email from ${e.client_name || e.from_address}`,
                priority: (e.urgency_score ?? 0) >= 9 ? 'critical' : 'high',
                source: 'email',
                created_at: e.received_at || e.created_at,
              });
            });
        }

        // Add actions from stale PRs
        if (ghRes.data) {
          const stalePrs = (ghRes.data as GithubActivity[])
            .filter(g => g.status === 'open' && g.days_open > 3)
            .slice(0, 2);

          stalePrs.forEach(pr => {
            generatedActions.push({
              id: `action-pr-${pr.id}`,
              title: `Review stale PR: ${pr.pr_title}`,
              description: `PR #${pr.pr_number} has been open for ${pr.days_open} days`,
              priority: pr.days_open > 7 ? 'critical' : 'medium',
              source: 'github',
              created_at: pr.created_at,
            });
          });
        }

        setActions(generatedActions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    }

    fetchAll();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAll, 90000);
    return () => clearInterval(interval);
  }, []);

  return { 
    risks, 
    team, 
    prs, 
    emails, 
    actions, 
    slackMessages, 
    loading, 
    error, 
    lastUpdated 
  };
}
