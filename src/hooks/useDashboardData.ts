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

 // Inside your useDashboardData.ts file
useEffect(() => {
  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [risksRes, teamRes, ghRes, emailsRes, slackRes] = await Promise.all([
        supabase.from('risk_assessments').select('*').order('created_at', { ascending: false }),
        supabase.from('team_members').select('*'),
        supabase.from('github_activity').select('*').order('created_at', { ascending: false }),
        supabase.from('emails').select('*').order('created_at', { ascending: false }),
        supabase.from('slack_messages').select('*').order('created_at', { ascending: false }),
      ]);

      // 👇 ADD CONSOLE LOGS RIGHT HERE 👇
      console.log('📊 Dashboard Data:');
      console.log('Risks:', risksRes.data);
      console.log('Team:', teamRes.data);
      console.log('GitHub PRs:', ghRes.data);
      console.log('Emails:', emailsRes.data);
      console.log('Slack:', slackRes.data);

      if (risksRes.data) setRisks(risksRes.data as RiskAssessment[]);
      if (teamRes.data) setTeam(teamRes.data as TeamMember[]);
      if (ghRes.data) setPrs(ghRes.data as GithubActivity[]);
      if (emailsRes.data) setEmails(emailsRes.data as Email[]);
      if (slackRes.data) setSlackMessages(slackRes.data as SlackMessage[]);

      // ... rest of your code (generating actions, etc.)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }

  fetchAll();
  const interval = setInterval(fetchAll, 30000);
  return () => clearInterval(interval);
}, []);
