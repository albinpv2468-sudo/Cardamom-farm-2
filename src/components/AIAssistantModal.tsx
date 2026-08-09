import React, { useState } from "react";
import { Bot, Send, X, Sparkles, User, RefreshCw, AlertCircle } from "lucide-react";
import { FarmState } from "../types/farm";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: FarmState;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Namaskaram! I am your AI Cardamom Cultivation Specialist. Ask me anything about IISR guidelines, NPK dosages, Capsule Rot (Azhukal) control, thrips management, drying ratios, or market auction strategies.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "How to prevent Capsule Rot (Azhukal)?",
    "IISR NPK fertilizer schedule per hectare?",
    "How to cure cardamom to preserve 8mm green color?",
    "Cardamom Thrips control measures?",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          context: {
            plotsCount: state.plots.length,
            totalAcres: state.plots.reduce((acc, p) => acc + p.areaAcres, 0),
            totalHarvestsCount: state.harvests.length,
            totalExpensesCount: state.expenses.length,
          },
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || "Unable to retrieve recommendation. Please check your network.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiReply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Standard IISR Cardamom Recommendation: For Capsule Rot (Azhukal), perform 1% Bordeaux mixture spraying on collar regions and panicles pre-monsoon, followed by Trichoderma harzianum soil application with neem cake.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div className="w-full max-w-2xl bg-emerald-950 text-white rounded-2xl border border-emerald-800 shadow-2xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-emerald-800 flex items-center justify-between bg-emerald-900/60 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-emerald-950">
              <Sparkles className="w-5 h-5 fill-emerald-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>IISR Cardamom AI Agronomist</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[9px] font-bold">
                  Powered by Gemini 2.5
                </span>
              </h3>
              <p className="text-[11px] text-emerald-300">
                Agronomic expert for High Range Idukki & Western Ghats cardamom planters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-emerald-800 text-emerald-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 bg-emerald-900/30 border-b border-emerald-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-amber-400 font-bold shrink-0">Quick Queries:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 whitespace-nowrap shrink-0 transition"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="p-1.5 rounded-lg bg-amber-500 text-emerald-950 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === "user"
                    ? "bg-amber-500 text-emerald-950 font-medium rounded-tr-xs"
                    : "bg-emerald-900/80 border border-emerald-700/80 text-emerald-100 rounded-tl-xs whitespace-pre-wrap"
                }`}
              >
                {m.text}
              </div>

              {m.sender === "user" && (
                <div className="p-1.5 rounded-lg bg-emerald-800 text-emerald-200 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-amber-400 text-xs italic p-2 bg-emerald-900/40 rounded-xl w-fit">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemini AI is analyzing cardamom disease and agronomy data...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-emerald-800 bg-emerald-900/40 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fertilizer dosage, Azhukal control, drying ratio..."
              className="flex-1 p-2.5 rounded-xl bg-emerald-900 border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
