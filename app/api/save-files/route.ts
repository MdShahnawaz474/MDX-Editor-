import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const { fileName, content, saveLocation, userRequested } = await req.json();

    // Check if the save was explicitly requested by the user
    if (!userRequested) {
      return NextResponse.json(
        { 
          success: false, 
          error: "File save must be explicitly requested by user" 
        }, 
        { status: 400 }
      );
    }

    // Validate required fields
    if (!fileName || !content) {
      return NextResponse.json(
        { 
          success: false, 
          error: "fileName and content are required" 
        }, 
        { status: 400 }
      );
    }

    // Use provided save location or default
    const saveDirectory = saveLocation || "D:\\FirstBench\\mark-down-editor\\app";
    
    // Security check: Ensure the path is safe (basic validation)
    const normalizedPath = path.normalize(saveDirectory);
    if (normalizedPath.includes('..')) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid save path" 
        }, 
        { status: 400 }
      );
    }
    
    // Ensure directory exists
    try {
      await fs.mkdir(normalizedPath, { recursive: true });
    } catch (mkdirError) {
      console.error("Error creating directory:", mkdirError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Cannot create save directory. Please check the path and permissions." 
        }, 
        { status: 500 }
      );
    }
    
    // Clean filename and add extension
    const cleanFileName = fileName.replace(/[<>:"/\\|?*]/g, '_');
    const fullFileName = `${cleanFileName}.mdx`;
    const filePath = path.join(normalizedPath, fullFileName);
    
    // Check if file already exists and create backup name if needed
    let finalPath = filePath;
    let counter = 1;
    while (true) {
      try {
        await fs.access(finalPath);
        // File exists, create a new name
        const baseName = path.parse(filePath).name;
        const extension = path.parse(filePath).ext;
        finalPath = path.join(normalizedPath, `${baseName}_${counter}${extension}`);
        counter++;
      } catch {
        // File doesn't exist, we can use this path
        break;
      }
    }
    
    // Write the file
    await fs.writeFile(finalPath, content, "utf-8");
    
    return NextResponse.json({ 
      success: true, 
      message: `File saved successfully!`,
      filePath: finalPath,
      fileName: path.basename(finalPath),
      saveLocation: normalizedPath,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to save file",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}