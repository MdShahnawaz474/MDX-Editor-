
import { marked } from "marked";
import { useEffect, useState, useCallback, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import DOMPurify from "dompurify";
import { Copy, Check } from "lucide-react";
import { createRoot } from "react-dom/client";

interface PreviewProps {
  markdown: string;
  theme?: "dark" | "light";
  showLineNumbers?: boolean;
  enableCopyCode?: boolean;
}

function Preview({
  markdown,
  theme = "dark",
  showLineNumbers = true,
  enableCopyCode = true,
}: PreviewProps) {
  const [parsed, setParsed] = useState<string>("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Theme classes
  const themeClasses =
    theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900";

  const headerTheme =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-gray-100"
      : "bg-gray-100 border-gray-200 text-gray-900";

  // Configure marked
  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });
  }, []);

  // Highlight with hljs
  const highlightCode = useCallback((code: string, lang: string): string => {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  }, []);

  // Copy to clipboard handler
  const copyToClipboard = useCallback(
    async (code: string, codeId: string) => {
      try {
        await navigator.clipboard.writeText(code);
        setCopiedCodeId(codeId);
        setTimeout(() => setCopiedCodeId(null), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    },
    []
  );

  // Post-process HTML: add copy buttons and line numbers inside <pre><code>
  const postProcessHTML = useCallback(
    (html: string): string => {
      const codeBlocks: Record<string, { code: string; lang: string }> = {};
      let idx = 0;

      // Fixed regex - correctly match <pre><code class="language-...">...</code></pre>
      const processed = html.replace(
        /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
        (match, lang: string, code: string) => {
          const id = `code-${idx++}`;
          const highlighted = highlightCode(code, lang);

          // Plain code text for copy (HTML tags replaced)
          const plain = code
            .replace(/<[^>]+>/g, "")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .trim();

          codeBlocks[id] = { code: plain, lang };

          // Add line numbers if requested and language is not plaintext
          let content = highlighted;
          if (showLineNumbers && lang !== "plaintext") {
            const lines = highlighted.split("\n");
            content = lines
              .map(
                (line, i) =>
                  `<div class="code-line" style="display: flex; min-height: 1.5rem; align-items: center;">
                    <span class="line-number" style="
                      display: inline-block;
                      width: 3rem;
                      text-align: right;
                      padding-right: 1rem;
                      color: ${
                        theme === "dark" ? "#6b7280" : "#9ca3af"
                      };
                      font-size: 0.875rem;
                      line-height: 1.5rem;
                      user-select: none;
                      flex-shrink: 0;
                    ">${i + 1}</span>
                    <span class="line-content" style="
                      line-height: 1.5rem;
                      white-space: pre;
                      flex: 1;
                    ">${line}</span>
                  </div>`
              )
              .join("");
          }

          const bgColor = theme === "dark" ? "#0d1117" : "#f6f8fa";
          const borderColor = theme === "dark" ? "#30363d" : "#d1d5db";

          return `
            <div class="code-block-wrapper" style="
              position: relative; 
              margin: 1.5rem 0;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid ${borderColor};
              background: ${bgColor};
            ">
              <pre class="code-block" style="
                margin: 0;
                padding: 1.25rem;
                background: ${bgColor};
                overflow-x: auto;
                position: relative;
                font-size: 0.875rem;
                line-height: 1.5;
                min-height: 3rem;
              ">
                <code class="hljs language-${lang}" style="
                  background: transparent;
                  padding: 0;
                  border-radius: 0;
                  font-family: 'SFMono-Regular', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                  font-size: inherit;
                  line-height: inherit;
                ">${content}</code>
                ${
                  enableCopyCode
                    ? `<button 
                        class="copy-btn" 
                        data-code-id="${id}"
                        style="
                          position: absolute;
                          top: 12px;
                          right: 12px;
                          background: ${
                            theme === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)"
                          };
                          border: 1px solid ${
                            theme === "dark"
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(0, 0, 0, 0.2)"
                          };
                          border-radius: 6px;
                          color: ${theme === "dark" ? "#fff" : "#374151"};
                          padding: 6px 10px;
                          font-size: 12px;
                          cursor: pointer;
                          display: flex;
                          align-items: center;
                          gap: 6px;
                          transition: all 0.2s ease;
                          z-index: 10;
                          min-height: 28px;
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        "
                        onmouseover="this.style.background='${
                          theme === "dark"
                            ? "rgba(255, 255, 255, 0.15)"
                            : "rgba(0, 0, 0, 0.15)"
                        }'"
                        onmouseout="this.style.background='${
                          theme === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.1)"
                        }'"
                      >
                        <span class="copy-icon" data-code-id="${id}"></span>
                        <span class="copy-text" data-code-id="${id}">Copy</span>
                      </button>`
                    : ""
                }
              </pre>
            </div>
          `;
        }
      );

      (window as any).codeBlocks = codeBlocks;
      return processed;
    },
    [highlightCode, showLineNumbers, enableCopyCode, theme]
  );

  // Parse markdown to sanitized HTML
  useEffect(() => {
    if (!markdown.trim()) {
      setParsed("");
      return;
    }
    setIsLoading(true);
    const parseAndSet = async () => {
      try {
        const htmlOrPromise = marked.parse(markdown);
        const html = typeof htmlOrPromise === "string" ? htmlOrPromise : await htmlOrPromise;
        const processed = postProcessHTML(html);
        const safe = DOMPurify.sanitize(processed, {
          ADD_TAGS: ["button", "span", "div"],
          ADD_ATTR: ["data-code-id", "class", "style", "onmouseover", "onmouseout"],
        });
        setParsed(safe);
      } finally {
        setIsLoading(false);
      }
    };
    parseAndSet();
  }, [markdown, postProcessHTML]);

  // Handle copy button clicks with event delegation
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest(".copy-btn") as HTMLButtonElement;
      if (!btn?.dataset.codeId) return;
      const block = (window as any).codeBlocks?.[btn.dataset.codeId];
      if (block) copyToClipboard(block.code, btn.dataset.codeId);
    };
    const node = contentRef.current;
    if (node) {
      node.addEventListener("click", handle);
      return () => node.removeEventListener("click", handle);
    }
  }, [copyToClipboard]);

  // Render copy icons and update text on copy status change
  useEffect(() => {
    if (!contentRef.current) return;

    const icons = contentRef.current.querySelectorAll(".copy-icon");
    icons.forEach((el) => {
      const id = (el as HTMLElement).dataset.codeId;
      const root = createRoot(el as HTMLElement);
      root.render(
        id && copiedCodeId === id ? (
          <Check size={14} strokeWidth={2} color="green" />
        ) : (
          <Copy
            size={14}
            strokeWidth={2}
            color={theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)"}
          />
        )
      );
    });

    const texts = contentRef.current.querySelectorAll(".copy-text");
    texts.forEach((el) => {
      const id = (el as HTMLElement).dataset.codeId;
      el.textContent = id && copiedCodeId === id ? "Copied!" : "Copy";
      if (id && copiedCodeId === id) {
        (el as HTMLElement).style.color = "green";
      } else {
        (el as HTMLElement).style.color =
          theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)";
      }
    });
  }, [parsed, copiedCodeId, theme]);

  return (
    <div
      className={`flex flex-col h-full ${themeClasses} transition-colors duration-200`}
      style={{ userSelect: "text" }}
    >
      {/* Header */}
      <div
        className={`w-full ${headerTheme} border-b px-6 p-4 flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-sm font-medium tracking-wide uppercase">
            Markdown Preview
          </span>
        </div>
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span className="text-sm">Parsing...</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" ref={contentRef}>
        <div
          className={`
            prose prose-lg max-w-none p-8
            ${
              theme === "dark"
                ? "prose-invert prose-headings:text-gray-100 prose-p:text-gray-200 prose-strong:text-gray-100"
                : "prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900"
            }
            prose-headings:scroll-mt-20
            prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-opacity-10
            ${theme === "dark" ? "prose-blockquote:bg-blue-900" : "prose-blockquote:bg-blue-50"}
            prose-table:border-collapse prose-th:border prose-td:border
            ${
              theme === "dark"
                ? "prose-th:border-gray-600 prose-td:border-gray-600"
                : "prose-th:border-gray-300 prose-td:border-gray-300"
            }
            prose-img:rounded-lg prose-img:shadow-lg
            transition-all duration-200
          `}
          style={{
            "--tw-prose-pre-bg": "transparent",
            "--tw-prose-pre-code": "transparent",
            "--tw-prose-pre-padding": "0",
          } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: parsed }}
        />
      </div>
    </div>
  );
}

export default Preview;
