import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  code: string;
  theme: "dark" | "light";
}

function CopyButton({ code, theme }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs"
      style={{
        background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
    >
      {copied ? <Check size={14} color="green" /> : <Copy size={14} />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

export default CopyButton;
