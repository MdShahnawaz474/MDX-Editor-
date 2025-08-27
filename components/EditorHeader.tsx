import React from "react";
import DownloadMenu from "@/components/DownloadMenu";

interface HeaderProps {
  hasUnsavedChanges: boolean;
  lastSaved: string | null;
  saveStatus: { type: "success" | "error" | null; message: string };
  onSave: () => void;
  onSaveAsMDX: () => void;
  onExportHTML: () => void;
}

function EditorHeader({
  hasUnsavedChanges,
  lastSaved,
  saveStatus,
  onSave,
  onSaveAsMDX,
  onExportHTML,
}: HeaderProps) {
  return (
    <div className="w-full bg-gray-900 p-3 text-gray-500 uppercase tracking-wider flex justify-between items-center gap-2 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span>Markdown</span>
        {hasUnsavedChanges && (
          <span className="text-orange-400 text-xs normal-case">
            • Unsaved changes
          </span>
        )}
        {lastSaved && !hasUnsavedChanges && (
          <span className="text-green-400 text-xs normal-case">
            • Last download: {lastSaved}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {saveStatus.message && (
          <span
            className={`text-xs normal-case px-2 py-1 rounded whitespace-nowrap ${
              saveStatus.type === "success"
                ? "bg-green-600 text-green-100"
                : "bg-red-600 text-red-100"
            }`}
            title={saveStatus.message}
          >
            {saveStatus.message}
          </span>
        )}

        {/* Dropdown menu */}
        <DownloadMenu
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={onSave}
          onSaveAsMDX={onSaveAsMDX}
          onExportHTML={onExportHTML}
        />
      </div>
    </div>
  );
}

export default EditorHeader;
