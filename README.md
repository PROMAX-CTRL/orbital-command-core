# 🚀 Mission Control Dashboard

An AI-powered dashboard for engineering managers to spot team risks before they become crises.

[Mission Control Dashboard](https://orbital-command-core.lovable.app/)

## ✨ Features

### 🔥 Risk Heatmap
- **Burnout Risk**: Detect team members working late with negative sentiment
- **Delivery Risk**: Identify stale PRs blocking progress
- **Stakeholder Risk**: Flag urgent client communications
- **Tech Debt**: Track dependency updates and maintenance needs

### 👥 Team Pulse
- **Sentiment Analysis**: Average message mood from Slack (0-10 scale)
- **After-Hours Tracking**: Messages sent after 7pm (burnout indicator)
- **Message Volume**: Total messages in last 7 days
- **Trend Indicators**: How sentiment is changing (↑ improving, → stable, ↓ declining)
- **At-Risk Alerts**: ⚠️ Team members showing signs of burnout

### 📊 Project Radar
- **Open Pull Requests**: Track PRs needing review
- **Technical Emails**: Project-related communications
- **Stale Indicators**: PRs open >3 days flagged

### 📧 Client Watch
- **Client Emails**: External communications only
- **Urgency Scoring**: 1-10 priority scale
- **Sentiment Detection**: 😠 Negative sentiment flagged
- **Reply Tracking**: 🟡 Messages needing response

### 🚧 Delivery Risks
- **Open PR Count**: Total pull requests in flight
- **Stale PRs**: Open >3 days (🟡) and >7 days (🔴)
- **PR Details**: Author, repository, days open

### ⏭️ Next Actions
- **AI-Generated Tasks**: From risks, emails, and stale PRs
- **Priority Levels**: Critical, High, Medium, Low
- **One-Click Resolution**: Mark actions complete

## 🧠 Ethical AI Layer

Unlike productivity tools that optimize purely for output, Mission Control prioritizes **human wellbeing**:

- **Burnout Detection**: After-hours messaging + negative sentiment
- **Team Health Monitoring**: Communication pattern analysis
- **Suggested Check-ins**: Not just task assignments
- **Privacy-First Design**: All data stays within your infrastructure

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **Data Fetching**: Supabase Realtime
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom tactical theme

## 📁 Project Structure
src/
├── components/
│ └── dashboard/
│ ├── RiskHeatmap.tsx # Risk cards with expandable details
│ ├── TeamPulse.tsx # Team sentiment and activity
│ ├── ProjectRadar.tsx # GitHub PRs + technical emails
│ ├── ClientWatch.tsx # Client email monitoring
│ ├── DeliveryRisks.tsx # PR metrics and list
│ ├── NextActions.tsx # AI-generated tasks
│ └── StatusBar.tsx # Live status indicator
├── hooks/
│ └── useDashboardData.ts # Supabase data fetching
├── integrations/
│ └── supabase/
│ └── client.ts # Supabase client setup
├── types/
│ └── dashboard.ts # TypeScript interfaces
└── pages/
└── Index.tsx # Main dashboard layout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for data)

### Installation

1. **Clone the repository**
git clone https://github.com/PROMAX-CTRL/orbital-command-core.git
cd orbital-command-core


2. **Install dependencies**
npm install

or
yarn install


3. **Set up environment variables**
Create a `.env` file:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


4. **Run the development server**
npm run dev

or
yarn dev


5. **Open your browser**
Navigate to `http://localhost:5173`

## 📊 Data Setup

### Supabase Tables
- `risk_assessments` - Active risks and their details
- `team_members` - Team member information and at-risk status
- `slack_messages` - Sentiment analysis and after-hours tracking
- `github_activity` - Pull request status and staleness
- `emails` - Client communications and urgency scoring

## 🗄️ Database Schema

To run this project, you'll need to create the following tables in your Supabase instance with the exact field names:

### Table: `risk_assessments`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| risk_type | text | burnout, delivery, stakeholder, technical_debt |
| severity | text | critical, high, medium, low |
| title | text | Risk title |
| description | text | Detailed description |
| affected_team_members | text[] | Array of member names |
| suggested_action | text | Action to take |
| is_active | boolean | Whether risk is active |
| detected_at | timestamp | When detected |
| created_at | timestamp | Creation time |

### Table: `team_members`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Member name |
| role | text | Job title |
| after_hours_message_count | integer | Messages after 7pm |
| is_at_risk | boolean | Burnout risk flag |
| email | text | Email address |
| slack_display_name | text | Slack username |
| github_username | text | GitHub handle |

### Table: `github_activity`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| repo_name | text | Repository name |
| pr_title | text | Pull request title |
| pr_number | integer | PR number |
| author | text | PR author |
| status | text | open, merged, closed, draft |
| days_open | integer | Days since creation |
| is_stale | boolean | Open >3 days |
| review_count | integer | Number of reviews |
| created_at | timestamp | Creation time |

### Table: `emails`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| from_address | text | Sender email |
| subject | text | Email subject |
| client_name | text | Client name (if external) |
| urgency_score | integer | 1-10 priority |
| sentiment | text | positive, neutral, negative |
| requires_reply | boolean | Whether reply needed |
| received_at | timestamp | When received |
| created_at | timestamp | Creation time |

### Table: `slack_messages`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_name | text | Message author |
| sentiment_score | float | 0-1 sentiment score |
| is_after_hours | boolean | Sent after 7pm |
| timestamp | timestamp | Message time |
| created_at | timestamp | Creation time |

## 💾 Sample Data

You can also import this sample data to test the dashboard:
[Link to sample_data.sql](https://github.com/PROMAX-CTRL/orbital-command-core/blob/main/sample_data.sql)

## 🎥 Demo Video

📹 **Watch the demo here:** [Google Drive Link](https://drive.google.com/file/d/1hZMMcvCiETcOuDvMot7qBp0-YXr-i8Gx/view?usp=drive_link)

*Note: Video is hosted on Google Drive due to time constraints*

## 🙏 Acknowledgements

- Built for CXI + AI Mission Control Hackathon 2026
- Inspired by real engineering management challenges

## 👥 Team

- *Mayank Arora* - First Year Computer Science Student

*I was one of the last three students who stayed through the entire hackathon explanation day—your passion for innovation kept me here, and I hope this project reflects that same dedication!*

