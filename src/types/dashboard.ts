export interface RiskAssessment {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  created_at: string;
  status: string;
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
