import React from "react";

interface EditorTextareaProps {
  markdown: string;
  onChange: (value: string) => void;
}

function EditorTextarea({ markdown, onChange }: EditorTextareaProps) {
  return (
    <textarea
      className="w-full flex-1 bg-gray-800 outline-none p-6 resize-none text-gray-100 overflow-auto"
      onChange={(e) => onChange(e.target.value)}
      value={markdown}
      placeholder="Start typing your markdown here...&#10;&#10;Tip: Press Ctrl+S to download as .md file"
    />
  );
}

export default EditorTextarea;
