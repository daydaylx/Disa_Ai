import React from "react";

/** ====== Executive Settings Dashboard ====== */
function ExecutiveSettingsPanel() {
  const settingsCategories = [
    {
      title: "System Configuration",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
        </svg>
      ),
      items: [
        { label: "API Configuration", value: "OpenRouter Endpoint", status: "Connected" },
        { label: "Model Selection", value: "GPT-4 Enterprise", status: "Active" },
        { label: "Security Level", value: "Enterprise Grade", status: "Secured" }
      ]
    },
    {
      title: "Business Intelligence",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      ),
      items: [
        { label: "Analytics Engine", value: "Real-time Processing", status: "Active" },
        { label: "Data Sources", value: "3 Connected", status: "Synced" },
        { label: "Report Generation", value: "Automated", status: "Running" }
      ]
    },
    {
      title: "Access Control",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <circle cx="12" cy="16" r="1"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      items: [
        { label: "Authentication", value: "Multi-Factor", status: "Enabled" },
        { label: "Session Management", value: "Advanced", status: "Active" },
        { label: "Audit Logging", value: "Comprehensive", status: "Recording" }
      ]
    }
  ];

  return (
    <div className="flex h-full flex-col bg-slate-950">
      {/* Executive Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-100">Executive Control Panel</h1>
                <p className="text-sm text-slate-400">Enterprise System Configuration</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-300">System Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Executive Settings Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">

          {settingsCategories.map((category, i) => (
            <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/30">
              <div className="border-b border-slate-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                    {category.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-slate-200">{category.title}</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {category.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                      <div>
                        <div className="font-medium text-slate-200">{item.label}</div>
                        <div className="text-sm text-slate-400">{item.value}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "Connected" || item.status === "Active" || item.status === "Enabled"
                            ? "bg-emerald-900 text-emerald-300"
                            : item.status === "Secured" || item.status === "Recording"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-slate-800 text-slate-300"
                        }`}>
                          {item.status}
                        </div>
                        <button className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-300">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Executive Status */}
      <div className="fixed bottom-20 right-4 z-40 pointer-events-none">
        <div className="rounded-lg border border-slate-800 bg-slate-950/95 px-3 py-2 text-xs font-medium text-slate-400 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
            Executive Configuration
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExecutiveSettingsV2() {
  return <ExecutiveSettingsPanel />;
}