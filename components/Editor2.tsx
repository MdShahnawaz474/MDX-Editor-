// "use client";

// import React, { useState, useCallback, useEffect } from "react";

// interface EditorProps {
//   markdown: string;
//   setMarkdown: (markdown: string) => void;
// }

// function Editor2({ markdown, setMarkdown }: EditorProps) {
//   const [saveStatus, setSaveStatus] = useState<{
//     type: 'success' | 'error' | null;
//     message: string;
//   }>({ type: null, message: '' });
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [lastSaved, setLastSaved] = useState<string | null>(null);

//   // Track changes to markdown content
//   const handleMarkdownChange = useCallback((value: string) => {
//     setMarkdown(value);
//     setHasUnsavedChanges(true);
//     if (saveStatus.type) {
//       setSaveStatus({ type: null, message: '' });
//     }
//   }, [setMarkdown, saveStatus.type]);

//   // Browser download function
//   const handleSave = useCallback(() => {
//     if (!markdown.trim()) {
//       setSaveStatus({
//         type: 'error',
//         message: 'Cannot save empty content'
//       });
//       return;
//     }

//     try {
//       // Create a blob with the markdown content
//       const blob = new Blob([markdown], { 
//         type: 'text/markdown;charset=utf-8' 
//       });
      
//       // Create download URL
//       const url = URL.createObjectURL(blob);
      
//       // Create temporary download link
//       const downloadLink = document.createElement('a');
//       downloadLink.href = url;
      
//       // Generate default filename with timestamp
//       const now = new Date();
//       const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
//       downloadLink.download = `markdown-${timestamp}.md`;
      
//       // Add to DOM, click, and remove
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
      
//       // Clean up the URL object
//       URL.revokeObjectURL(url);
      
//       // Update status
//       setSaveStatus({
//         type: 'success',
//         message: 'Download started! Check your Downloads folder.'
//       });
//       setHasUnsavedChanges(false);
//       setLastSaved(new Date().toLocaleTimeString());
      
//       // Clear success message after 3 seconds
//       setTimeout(() => {
//         setSaveStatus({ type: null, message: '' });
//       }, 3000);
      
//     } catch (error) {
//       console.error('Download error:', error);
//       setSaveStatus({
//         type: 'error',
//         message: 'Failed to download file'
//       });
//     }
//   }, [markdown]);

//   // Alternative save as MDX
//   const handleSaveAsMDX = useCallback(() => {
//     if (!markdown.trim()) {
//       setSaveStatus({
//         type: 'error',
//         message: 'Cannot save empty content'
//       });
//       return;
//     }

//     try {
//       const blob = new Blob([markdown], { 
//         type: 'text/plain;charset=utf-8' 
//       });
//       const url = URL.createObjectURL(blob);
//       const downloadLink = document.createElement('a');
//       downloadLink.href = url;
      
//       const now = new Date();
//       const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
//       downloadLink.download = `markdown-${timestamp}.mdx`;
      
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//       URL.revokeObjectURL(url);
      
//       setSaveStatus({
//         type: 'success',
//         message: 'MDX file download started!'
//       });
//       setHasUnsavedChanges(false);
//       setLastSaved(new Date().toLocaleTimeString());
      
//       setTimeout(() => {
//         setSaveStatus({ type: null, message: '' });
//       }, 3000);
      
//     } catch (error) {
//       console.error('Download error:', error);
//       setSaveStatus({
//         type: 'error',
//         message: 'Failed to download MDX file'
//       });
//     }
//   }, [markdown]);

//   // Export as HTML preview
//   const handleExportHTML = useCallback(() => {
//     if (!markdown.trim()) {
//       setSaveStatus({
//         type: 'error',
//         message: 'Cannot export empty content'
//       });
//       return;
//     }

//     try {
//       // Simple markdown to HTML conversion (basic)
//       const htmlContent = `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Markdown Export</title>
//     <style>
//         body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
//         pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
//         code { background: #f4f4f4; padding: 2px 4px; border-radius: 2px; }
//         blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
//     </style>
// </head>
// <body>
//     <pre>${markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
// </body>
// </html>`;

//       const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
//       const url = URL.createObjectURL(blob);
//       const downloadLink = document.createElement('a');
//       downloadLink.href = url;
      
//       const now = new Date();
//       const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
//       downloadLink.download = `markdown-preview-${timestamp}.html`;
      
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//       URL.revokeObjectURL(url);
      
//       setSaveStatus({
//         type: 'success',
//         message: 'HTML preview downloaded!'
//       });
      
//       setTimeout(() => {
//         setSaveStatus({ type: null, message: '' });
//       }, 3000);
      
//     } catch (error) {
//       console.error('Export error:', error);
//       setSaveStatus({
//         type: 'error',
//         message: 'Failed to export HTML'
//       });
//     }
//   }, [markdown]);

//   // Keyboard shortcut for save (Ctrl+S or Cmd+S)
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === 's') {
//         e.preventDefault();
//         handleSave();
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [handleSave]);

//   // Warn about unsaved changes
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (hasUnsavedChanges && markdown.trim()) {
//         e.preventDefault();
//         e.returnValue = '';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [hasUnsavedChanges, markdown]);

//   return (
//     <div className="border-r-2 border-gray-700 flex flex-col h-full ">
//       <div className="w-full bg-gray-900 p-3 text-gray-500 uppercase tracking-wider flex justify-between items-center gap-2 flex-shrink-0">
//         <div className="flex items-center gap-2">
//           <span>Markdown</span>
//           {hasUnsavedChanges && (
//             <span className="text-orange-400 text-xs normal-case">
//               • Unsaved changes
//             </span>
//           )}
//           {lastSaved && !hasUnsavedChanges && (
//             <span className="text-green-400 text-xs normal-case">
//               • Last download: {lastSaved}
//             </span>
//           )}
//         </div>
        
//         <div className="flex items-center gap-2">
//           {saveStatus.message && (
//             <span 
//               className={`text-xs normal-case px-2 py-1 rounded whitespace-nowrap ${
//                 saveStatus.type === 'success' 
//                   ? 'bg-green-600 text-green-100' 
//                   : 'bg-red-600 text-red-100'
//               }`}
//               title={saveStatus.message}
//             >
//               {saveStatus.message}
//             </span>
//           )}
          
//           {/* Dropdown for save options */}
//           <div className="relative group">
//             <button
//               className={`text-white font-bold h-8 px-3 rounded text-sm transition-colors flex items-center gap-1 ${
//                 hasUnsavedChanges
//                   ? 'bg-orange-500 hover:bg-orange-600'
//                   : 'bg-blue-500 hover:bg-blue-600'
//               }`}
//               title="Download file (Ctrl+S)"
//             >
//               Download{hasUnsavedChanges ? ' *' : ''}
//               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
            
//             {/* Dropdown menu */}
//            <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

//               <button
//                 onClick={handleSave}
//                 className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-t-md"
//               >
//                 📄 Download as .md
//               </button>
//               <button
//                 onClick={handleSaveAsMDX}
//                 className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
//               >
//                 📝 Download as .mdx
//               </button>
//               <button
//                 onClick={handleExportHTML}
//                 className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-b-md"
//               >
//                 🌐 Export as HTML
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//      <textarea
//   className="w-full flex-1 bg-gray-800 outline-none p-6 resize-none text-gray-100 overflow-auto"
//   onChange={(e) => handleMarkdownChange(e.target.value)}
//   value={markdown}
//   placeholder="Start typing your markdown here...&#10;&#10;Tip: Press Ctrl+S to download as .md file"
// />

//     </div>
//   );
// }

// export default Editor2;

"use client";

import React, { useState, useCallback, useEffect } from "react";
import EditorHeader from "@/components/EditorHeader";
import EditorTextarea from "@/components/EditorTextArea";

interface EditorProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

function Editor2({ markdown, setMarkdown }: EditorProps) {
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Handle changes
  const handleMarkdownChange = useCallback(
    (value: string) => {
      setMarkdown(value);
      setHasUnsavedChanges(true);
      if (saveStatus.type) {
        setSaveStatus({ type: null, message: "" });
      }
    },
    [setMarkdown, saveStatus.type]
  );

  // File save logic
  const handleSave = useCallback(() => {
    if (!markdown.trim()) {
      setSaveStatus({ type: "error", message: "Cannot save empty content" });
      return;
    }
    try {
      const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
      downloadLink.download = `markdown-${timestamp}.md`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSaveStatus({
        type: "success",
        message: "Download started! Check your Downloads folder.",
      });
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to download file" });
    }
  }, [markdown]);

  // MDX Save
  const handleSaveAsMDX = useCallback(() => {
    if (!markdown.trim()) {
      setSaveStatus({ type: "error", message: "Cannot save empty content" });
      return;
    }
    try {
      const blob = new Blob([markdown], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
      downloadLink.download = `markdown-${timestamp}.mdx`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSaveStatus({ type: "success", message: "MDX file download started!" });
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to download MDX file" });
    }
  }, [markdown]);

  // Export HTML
  const handleExportHTML = useCallback(() => {
    if (!markdown.trim()) {
      setSaveStatus({ type: "error", message: "Cannot export empty content" });
      return;
    }
    try {
      const htmlContent = `
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8"></head>
      <body><pre>${markdown
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre></body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
      downloadLink.download = `markdown-preview-${timestamp}.html`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      setSaveStatus({ type: "success", message: "HTML preview downloaded!" });
      setTimeout(() => setSaveStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      setSaveStatus({ type: "error", message: "Failed to export HTML" });
    }
  }, [markdown]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Warn before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && markdown.trim()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, markdown]);

  return (
    <div className="border-r-2 border-gray-700 flex flex-col h-full">
      <EditorHeader
        hasUnsavedChanges={hasUnsavedChanges}
        lastSaved={lastSaved}
        saveStatus={saveStatus}
        onSave={handleSave}
        onSaveAsMDX={handleSaveAsMDX}
        onExportHTML={handleExportHTML}
      />
      <EditorTextarea
        markdown={markdown}
        onChange={handleMarkdownChange}
      />
    </div>
  );
}

export default Editor2;
