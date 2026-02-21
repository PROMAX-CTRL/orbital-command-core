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
  email: string;
  slack_display_name: string;
  github_username: string;
  role: string;
  after_hours_message_count: number;
  sentiment_trend: number[] | null;
  is_at_risk: boolean;
  last_active?: string;
  created_at: string;
}

export interface SlackMessage {
  id: string;
  message_id: string | null;
  user_name: string;
  user_id: string;
  channel: string;
  message_text: string;
  sentiment: string;
  sentiment_score: number;
  is_after_hours: boolean;
  has_urgent_keyword: boolean;
  reply_count: number;
  reaction_count: number;
  timestamp: string;
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
