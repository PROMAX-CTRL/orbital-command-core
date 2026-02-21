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

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [risksRes, teamRes, ghRes, emailsRes, slackRes] = await Promise.all([
          supabase.from('risk_assessments').select('*').order('created_at', { ascending: false }),
          supabase.from('team_members').select('*'),
          supabase.from('github_activity').select('*').order('updated_at', { ascending: false }),
          supabase.from('emails').select('*').order('received_at', { ascending: false }),
          supabase.from('slack_messages').select('*').order('created_at', { ascending: false }),
        ]);

        if (risksRes.data) setRisks(risksRes.data as RiskAssessment[]);
        if (teamRes.data) setTeam(teamRes.data as TeamMember[]);
        if (ghRes.data) setPrs(ghRes.data as GithubActivity[]);
        if (emailsRes.data) setEmails(emailsRes.data as Email[]);
        if (slackRes.data) setSlackMessages(slackRes.data as SlackMessage[]);

        // Generate AI-suggested actions from the data
        const generatedActions: NextAction[] = [];
        
        if (risksRes.data) {
          (risksRes.data as RiskAssessment[])
            .filter(r => r.severity === 'critical')
            .slice(0, 2)
            .forEach(r => {
              generatedActions.push({
                id: `action-risk-${r.id}`,
                title: `Address: ${r.title}`,
                description: `Critical risk requires immediate attention. ${r.description || ''}`,
                priority: 'critical',
                source: 'risk_assessment',
                created_at: r.created_at,
              });
            });
        }

        if (emailsRes.data) {
          (emailsRes.data as Email[])
            .filter(e => e.priority === 'urgent')
            .slice(0, 2)
            .forEach(e => {
              generatedActions.push({
                id: `action-email-${e.id}`,
                title: `Reply to ${e.client_name || e.from_address}`,
                description: `Urgent email: "${e.subject}"`,
                priority: 'high',
                source: 'email',
                created_at: e.received_at,
              });
            });
        }

        if (ghRes.data) {
          const stalePrs = (ghRes.data as GithubActivity[])
            .filter(g => g.type === 'pull_request' && g.status === 'open')
            .filter(g => {
              const updated = new Date(g.updated_at);
              const daysStale = (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24);
              return daysStale > 3;
            })
            .slice(0, 2);

          stalePrs.forEach(pr => {
            generatedActions.push({
              id: `action-pr-${pr.id}`,
              title: `Review stale PR: ${pr.title}`,
              description: `PR has been open without updates. Consider reviewing or reassigning.`,
              priority: 'medium',
              source: 'github',
              created_at: pr.updated_at,
            });
          });
        }

        setActions(generatedActions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return { risks, team, prs, emails, actions, slackMessages, loading, error };
}
