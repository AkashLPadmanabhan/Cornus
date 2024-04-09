"use client";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [mode, setMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const surpriseOptions = [
    "Who founded Ethereum?",
    "How did the universe originate",
    "Do plants have consciousness?",
  ];

  const savvyPrompt = `You are in Savvy Mode. Answer the questions in a more objective way, with less jargons and in a simple way.
      Do not use any bold text or any special characters. Only simple plain English. \n\n`;

  const friendlyPrompt = `You are in Friendly Mode. Answer the questions in a friendly way with chit chat manner. Be fun and joyfull. 
    You are humorous and comic. You are dreamy.
    Do not use any bold text or any special characters. Only simple plain English. \n\n`;

  const systemPrompt = `Your name is Cornus, You are a helpful chatbot who answers to following question briefly in one sentence of 50 words. 
    You are created by Akash Padmanabhan. You have 2 modes, Friendly mode and Savvy Mode. Friendly Mode will Answer in a friendly way and 
    Savvy Mode will Answer in a more objective way.
    \n\n`;

  const surprise = () => {
    const randomOption = Math.floor(Math.random() * 3);
    setValue(surpriseOptions[randomOption]);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Please enter a question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: systemPrompt + (mode ? savvyPrompt : friendlyPrompt) + value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      setLoading(true);
      const response = await fetch("api/gemini", options);
      const data = await response.json();
      setLoading(false);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [{ text: value }],
        },
        {
          role: "model",
          parts: [{ text: data.text }],
        },
      ]);
      setValue("");
    } catch (error) {
      setError(error.message);
    }
  };

  const clear = () => {
    setValue("");
    setError("");
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const modeSet = () => {
    setMode(!mode);
  };

  return (
    <div className="dark min-h-screen bg-gray-900">
      <div className="fixed top-0 left-0 right-0 w-full bg-gray-900 z-12">
        <div className="p-5 text-center">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
            Cornus
          </h1>
        </div>
        <section className="text-white w-full max-w-xl p-4 mx-auto rounded-lg">
          <div className="my-4 flex justify-between items-center">
            <p className="flex-1">What do you want to know?</p>
            <button
              onClick={surprise}
              disabled={!chatHistory}
              className="bg-gray-900 border-2 border-white text-white px-4 py-2 rounded-full hover:bg-cyan-500 mr-1"
            >
              Surprise!
            </button>
            <button
              onClick={clearChat}
              className="bg-gray-900 border-2 border-white text-white px-4 py-2 rounded-full hover:bg-cyan-500 mr-1"
            >
              clear
            </button>
            <button
              onClick={modeSet}
              className="bg-gray-900 border-2 border-white text-white px-4 py-2 rounded-full hover:bg-cyan-500"
            >
              {mode ? "savvy" : "friendly"}
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="What is AI ?"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
              className="flex-1 p-4 mr-2 text-xl rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-white"
            />

            {loading ? (
              <p>⏳Loading...</p>
            ) : error ? (
              <button
                onClick={clear}
                className="bg-gray-900 border-2 border-white text-white px-4 py-2 rounded-full hover:bg-cyan-500"
              >
                Clear
              </button>
            ) : (
              <button
                onClick={getResponse}
                className="bg-gray-900 border-2 border-white text-white px-4 py-2 rounded-full hover:bg-cyan-500"
              >
                Ask Me
              </button>
            )}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </section>
      </div>
      <div className="pt-[250px]">
        <div className="text-white w-full max-w-xl p-4 mx-auto">
          <div className="mt-4">
            {chatHistory.map((chatItem, index) => (
              <div key={index} className="my-2">
                <p>
                  <span className="font-bold text-cyan-200">
                    {chatItem.role}:
                  </span>{" "}
                  {chatItem.parts[0].text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
