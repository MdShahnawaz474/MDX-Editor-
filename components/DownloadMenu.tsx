import React from "react";

interface DownloadMenuProps {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onSaveAsMDX: () => void;
  onExportHTML: () => void;
}

function DownloadMenu({
  hasUnsavedChanges,
  onSave,
  onSaveAsMDX,
  onExportHTML,
}: DownloadMenuProps) {
  return (
    <div className="relative group">
      <button
        className={`text-white font-bold h-8 px-3 rounded text-sm transition-colors flex items-center gap-1 ${
          hasUnsavedChanges
            ? "bg-orange-500 hover:bg-orange-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        title="Download file (Ctrl+S)"
      >
        Download{hasUnsavedChanges ? " *" : ""}
        <svg
          className="w-3 h-3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 
            10.586l3.293-3.293a1 1 0 111.414 
            1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 
            1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={onSave}
          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-t-md"
        >
          📄 Download as .md
        </button>
        <button
          onClick={onSaveAsMDX}
          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          📝 Download as .mdx
        </button>
        <button
          onClick={onExportHTML}
          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-b-md"
        >
          🌐 Export as HTML
        </button>
      </div>
    </div>
  );
}

export default DownloadMenu;
