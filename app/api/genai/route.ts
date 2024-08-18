import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StreamingTextResponse,GoogleGenerativeAIStream } from "ai";

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const prompt = reqBody.data.prompt;

  const genAI = new GoogleGenerativeAI('AIzaSyAA_Ow5GgRLBCpHTZpmwu9gyp1_DgJiTgk');

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: {
      role: "system",
      parts: [
        {
          text: "You are Crowdin AI, an InApp assistant for the app named 'Crowdin'. The app is a Crowd Alert App which alerts the users about nearby traffic-related issues, and animal attacks reported. The primary source of data is the users themselves, so be like the AI for the app and assist users' needs. Don't answer out-of-scope questions. Also, provide disaster relief information and help users with their account-related issues. No support for markdown formatting."
        }
      ]
    }
  });

  const streamingResponse = await model.generateContentStream(prompt);
  // const text = streamingResponse.response.text();
  // console.log(text);
  console.log(streamingResponse);

  // return NextResponse.json({ content: text });
  return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
}
