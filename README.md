# 🚀 Mission Control Dashboard

An AI-powered dashboard for engineering managers to spot team risks before they become crises.

![Mission Control Dashboard](https://via.placeholder.com/800x400?text=Mission+Control+Dashboard)

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
