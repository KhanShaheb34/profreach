"use client";

import { ExportControls } from "./export-controls";

export function ExportContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Export & Import</h1>
        <p className="text-muted-foreground">
          Back up your data or restore from a previous backup
        </p>
      </div>

      <ExportControls />
    </div>
  );
}
