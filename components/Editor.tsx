import React from "react";

interface editorProps {
  markdown: string;
  setMarkdown : (markdown: string)=> void;
}
function Editor({ markdown , setMarkdown }: editorProps) {

  
    const saveMDXFile = (fileName:string,context:string)=>{
        try {
            const blob = new Blob([context],{ type:'text/mdx'});

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileName}.mdx`
            link.click()
            console.log(`File Saved :${fileName}.mdx`);
            // URL.revokeObjectURL(link.href);
        } catch (error) {
            console.log('Error savinng mdx file', error);
            
        }
    }

    const handlePublish = ()=>{
        const fileName = `markdown-${Date.now()}`
        saveMDXFile(fileName,markdown);
        alert('Saved Succefully')
    };


  return (
    <div className=" border-r-2 border-gray-700">
      <div className="w-full bg-gray-900 p-3  text-gray-500  uppercase tracking-wider flex justify-between gap-2">
        <div>Markdown</div> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-[-8px] h-8 px-3 rounded" onClick={handlePublish}>Save</button>
      </div>
      

      <textarea className="w-full h-full bg-gray-800 outline-none p-6" onChange={e => setMarkdown(e.target.value)} value={markdown}/>
    </div>
  );
}

export default Editor;
