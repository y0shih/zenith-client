'use client'

interface JobDetailPanelProps {
  selectedJobId: string | null
}

export function JobDetailPanel({ selectedJobId }: JobDetailPanelProps) {
  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:w-1/2 bg-background border-l border-border overflow-y-auto transition-all duration-300 ${
        !selectedJobId ? 'items-center justify-center' : ''
      }`}
    >
      {selectedJobId ? (
        <div className="w-full h-full p-6 sm:p-8">
          {/* Placeholder for Phase 3: Job Detail Content */}
          <div className="bg-card rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-card-foreground">
              Job Details
            </h2>
            <p className="text-muted-foreground mt-2">
              Job ID: {selectedJobId}
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Full job details, apply button, reactions, and comments will be
              added in Phase 3
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-muted-foreground">
            Select a job to view details
          </p>
        </div>
      )}
    </aside>
  )
}
