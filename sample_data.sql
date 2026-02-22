-- Sample data for Mission Control Dashboard

-- team_members
INSERT INTO team_members (name, role, after_hours_message_count, is_at_risk, email, slack_display_name, github_username) VALUES
('Jamie Smith', 'Lead Engineer', 8, true, 'jamie@company.com', 'Jamie S', 'jamiesmith'),
('Casey Kim', 'Database Engineer', 5, true, 'casey@company.com', 'Casey K', 'caseykim'),
('Jordan Lee', 'Product Manager', 3, false, 'jordan@company.com', 'Jordan L', 'jordanlee'),
('Alex Chen', 'Senior Developer', 2, false, 'alex@company.com', 'Alex C', 'alexchen'),
('Taylor Wong', 'Frontend Dev', 1, false, 'taylor@company.com', 'Taylor W', 'taylorwong'),
('Riley Patil', 'DevOps', 0, false, 'riley@company.com', 'Riley P', 'rileypatil');

-- github_activity
INSERT INTO github_activity (repo_name, pr_title, pr_number, author, status, days_open, is_stale, review_count, created_at) VALUES
('frontend-app', 'Add dark mode support', 234, 'Taylor Wong', 'open', 5, true, 1, NOW() - INTERVAL '5 days'),
('api-service', 'Fix auth timeout', 456, 'Jamie Smith', 'open', 7, true, 0, NOW() - INTERVAL '7 days'),
('core-lib', 'Update dependencies', 789, 'Alex Chen', 'merged', 2, false, 3, NOW() - INTERVAL '2 days');

-- emails
INSERT INTO emails (from_address, subject, client_name, urgency_score, sentiment, requires_reply, received_at) VALUES
('client@acme.com', 'Urgent: Production issue', 'Acme Corp', 9, 'negative', true, NOW() - INTERVAL '2 hours'),
('stakeholder@internal.com', 'Project status update', NULL, 4, 'positive', false, NOW() - INTERVAL '6 hours'),
('vendor@cloud.com', 'Service disruption notice', 'Cloud Services', 8, 'negative', false, NOW() - INTERVAL '1 day');

-- risk_assessments
INSERT INTO risk_assessments (risk_type, severity, title, description, affected_team_members, suggested_action, is_active, detected_at) VALUES
('burnout', 'high', 'Team member working late', 'Jamie has sent 8 messages after hours this week', ARRAY['Jamie Smith'], 'Schedule 1:1 check-in', true, NOW()),
('delivery', 'medium', 'Stale PRs detected', '2 PRs open for 5+ days', ARRAY['Taylor Wong', 'Alex Chen'], 'Review and prioritize', true, NOW());
