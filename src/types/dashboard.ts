export interface RiskAssessment {
  id: string;
  risk_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affected_team_members: string[] | null;
  related_data: Record<string, unknown> | null;
  suggested_action: string | null;
  is_active: boolean;
  detected_at: string;
  resolved_at: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  sentiment_score?: number;
  last_active?: string;
}

export interface SlackMessage {
  id: string;
  author: string;
  channel: string;
  content: string;
  sentiment?: string;
  created_at: string;
}

export interface GithubActivity {
  id: string;
  type: string;
  title: string;
  author: string;
  repo: string;
  status: string;
  created_at: string;
  updated_at: string;
  url?: string;
}

export interface Email {
  id: string;
  from_address: string;
  subject: string;
  body?: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  client_name?: string;
  received_at: string;
  is_read: boolean;
}

export interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  created_at: string;
}
