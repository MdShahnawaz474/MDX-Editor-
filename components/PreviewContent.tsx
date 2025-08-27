import CodeBlock from "@/components/CodeBlock";

interface ContentProps {
  html: string;
  theme: "dark" | "light";
  showLineNumbers: boolean;
  enableCopyCode: boolean;
}

function PreviewContent({ html, theme }: ContentProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div
        className={`
          prose prose-lg max-w-none p-8
          ${theme === "dark" 
            ? "prose-invert prose-headings:text-gray-100 prose-p:text-gray-200" 
            : "prose-headings:text-gray-900 prose-p:text-gray-800"
          }
        `}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default PreviewContent;
