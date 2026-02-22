{/* Header with tooltip */}
<div className="flex items-center gap-2 mb-4">
  <div className="h-2 w-2 rounded-full bg-tactical-red status-pulse" />
  <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
    Risk Heatmap
  </h2>
  
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="h-5 w-5 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Info className="h-3 w-3 text-muted-foreground" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs p-3">
        <p className="text-xs font-medium mb-2">🔥 Risk Types:</p>
        <ul className="text-xs space-y-1.5 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-tactical-red font-bold">🔴 BURNOUT</span>
            <span> = Team members working late, negative sentiment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tactical-amber font-bold">🟡 DELIVERY</span>
            <span> = Stale PRs, missed deadlines</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tactical-blue font-bold">🔵 STAKEHOLDER</span>
            <span> = Client issues, urgent emails</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-tactical-green font-bold">🟢 TECH DEBT</span>
            <span> = Outdated dependencies, maintenance needs</span>
          </li>
        </ul>
        <p className="text-xs mt-2 pt-2 border-t border-border">
          Click any card to see details and suggested actions
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>

  <div className="ml-auto flex items-center gap-3">
    {/* your existing header content */}
  </div>
</div>
