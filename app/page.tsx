
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Editor2 from "@/components/Editor2";
import Preview from "@/components/Preview";

export default function Home() {
  const [markdown , setMarkdown] = useState('# Markdown Editor');
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const storedMarkDown = localStorage.getItem('MARKDOWN');
    if(storedMarkDown){
      setMarkdown(storedMarkDown)
    }
  },[])

  const callBack = (markdown:string)=>{
    setMarkdown(markdown);
    localStorage.setItem('MARKDOWN',markdown);
  }

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    let newLeftWidth = ((event.clientX - containerRect.left) / containerRect.width) * 100;
    newLeftWidth = Math.max(10, Math.min(90, newLeftWidth)); // constrain between 10% - 90%
    setLeftWidth(newLeftWidth);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, onMouseMove]);

  return (
    <main
      ref={containerRef}
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      <div style={{ width: `${leftWidth}%`, overflow: "auto" }}>
        <Editor2 markdown={markdown} setMarkdown={callBack} />
      </div>
      <div
        style={{
          width: "5px",
          cursor: "col-resize",
          backgroundColor: "#444",
          zIndex: 10,
        }}
        onMouseDown={onMouseDown}
      />
      <div style={{ flexGrow: 1, overflow: "auto" }}>
        <Preview markdown={markdown} theme="dark" showLineNumbers={false} enableCopyCode={true} />
      </div>
    </main>
  );
}
