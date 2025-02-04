import { NextResponse } from "next/server";  

const API_KEY = process.env.REMOVE_BG_API_KEY;  

export async function POST(req: Request) {  
  const { image } = await req.json();  

  if (!API_KEY) {  
    console.error("API key is not defined.");  
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });  
  }  

  try {  
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {  
      method: "POST",  
      headers: {  
        "X-Api-Key": API_KEY,  
        "Content-Type": "application/json",  
      },  
      body: JSON.stringify({  
        image: image.split(",")[1],   
        size: "auto",  
      }),  
    });  

    // Check if the response is OK  
    if (!response.ok) {  
      const errorText = await response.text(); // Obtain the error message from the response  
      console.error("Background removal failed:", response.status, errorText);  
      throw new Error(`Background removal failed: ${response.status} ${errorText}`);  
    }  

    const data = await response.arrayBuffer();  
    const base64 = Buffer.from(data).toString("base64");  
    const processedImage = `data:image/png;base64,${base64}`;  

    return NextResponse.json({ image: processedImage });  
} catch (error) {}
}  