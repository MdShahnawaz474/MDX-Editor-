import hljs from "highlight.js";
import CopyButton from "@/components/CopyButton";

interface CodeBlockProps {
  code: string;
  language: string;
  theme: "dark" | "light";
  showLineNumbers: boolean;
  enableCopyCode: boolean;
}

function CodeBlock({
  code,
  language,
  theme,
  showLineNumbers,
  enableCopyCode,
}: CodeBlockProps) {
  const highlighted = hljs.highlight(code, { language }).value;

  return (
    <div className="relative my-4 rounded-lg overflow-hidden border">
      <pre className="m-0 p-4 overflow-x-auto">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      {enableCopyCode && <CopyButton code={code} theme={theme} />}
    </div>
  );
}

export default CodeBlock;
