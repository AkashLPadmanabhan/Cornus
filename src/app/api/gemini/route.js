import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req, res) {
  const data = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: data.history,
  });

  const msg = data.message;
  const result = await chat.sendMessage(msg);
  const response = result.response;
  const text = response.text();
  console.log(text);

  return NextResponse.json({ text: text }, { status: 200 });
}
