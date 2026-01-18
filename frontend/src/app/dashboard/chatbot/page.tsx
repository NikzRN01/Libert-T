"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Initial greeting
        setMessages([
            {
                id: "1",
                role: "assistant",
                content: "Hello! I'm your SkillXIntell AI Assistant. I can help you with career guidance, skill development, and personalized recommendations. What would you like to know?",
                timestamp: new Date(),
            },
        ]);
    }, []);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            
            // Call the new Gemini-powered chat endpoint
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/chat/message`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        message: input,
                        conversationHistory: messages,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.reply || "I'm having trouble generating a response. Please try again.",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "I encountered an error processing your request. Please try again!",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm currently unavailable. Please try again later.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <div className="max-w-4xl mx-auto h-screen flex flex-col">
                {/* Header */}
                <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 md:p-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/analytics"
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                <MessageCircle className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">SkillXIntell Assistant</h1>
                                <p className="text-xs text-slate-500">AI-powered career guidance</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} gap-3`}
                        >
                            {message.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                                    <MessageCircle className="h-4 w-4 text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-sm md:max-w-md lg:max-w-xl break-words ${
                                    message.role === "user"
                                        ? "flex flex-col items-end"
                                        : "flex flex-col items-start"
                                }`}
                            >
                                <div
                                    className={`px-5 py-4 rounded-2xl ${
                                        message.role === "user"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-md"
                                            : "bg-white text-slate-900 rounded-bl-none border border-slate-200/80 shadow-sm"
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <p
                                    className={`text-xs mt-2 px-1 ${
                                        message.role === "user"
                                            ? "text-slate-500"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            {message.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-xs text-white font-bold">You</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                                <MessageCircle className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white text-slate-900 px-5 py-4 rounded-2xl rounded-bl-none border border-slate-200/80 shadow-sm">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200/60 bg-white/70 backdrop-blur-xl p-4 md:p-6 sticky bottom-0">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Ask me about careers, skills, or recommendations..."
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200/60 bg-white/50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={loading || !input.trim()}
                            className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="h-4 w-4" />
                            <span className="hidden md:inline">Send</span>
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                        Powered by SkillXIntell AI • Ask anything about your career journey
                    </p>
                </div>
            </div>
        </div>
    );
}
