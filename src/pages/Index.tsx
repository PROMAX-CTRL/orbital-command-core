import { useDashboardData } from '@/hooks/useDashboardData';
import { StatusBar } from '@/components/dashboard/StatusBar';
import { RiskHeatmap } from '@/components/dashboard/RiskHeatmap';
import { TeamPulse } from '@/components/dashboard/TeamPulse';
import { DeliveryRisks } from '@/components/dashboard/DeliveryRisks';
import { ProjectRadar } from '@/components/dashboard/ProjectRadar';
import { ClientWatch } from '@/components/dashboard/ClientWatch';
import { NextActions } from '@/components/dashboard/NextActions';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { risks, team, prs, emails, actions, slackMessages, loading, error } = useDashboardData();

  return (
    <div className="min-h-screen bg-background scanline">
      <StatusBar
        loading={loading}
        error={error}
        riskCount={risks.length}
        teamCount={team.length}
      />

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3 text-tactical-green" />
            <p className="text-sm font-mono uppercase tracking-wider">Syncing data streams...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="text-tactical-red text-sm font-mono mb-2">⚠ CONNECTION ERROR</div>
            <p className="text-xs text-muted-foreground font-mono max-w-md text-center">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Risk Heatmap - Full Width */}
            <RiskHeatmap risks={risks} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TeamPulse team={team} slackMessages={slackMessages} />
              <DeliveryRisks prs={prs} />
            </div>

            {/* Project Radar - Full Width */}
            <ProjectRadar prs={prs} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClientWatch emails={emails} />
              <NextActions actions={actions} />
            </div>
          </div>
        )}
      </main>

      {/* Footer status line */}
      <footer className="border-t border-border py-2 px-6 text-center">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Last sync: {new Date().toLocaleTimeString()} • Auto-refresh: 5min
        </span>
      </footer>
    </div>
  );
};

export default Index;
