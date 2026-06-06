"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles,
  Minimize2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = (text: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay and provide hardcoded responses
    setTimeout(() => {
      let response = "I'm the PayFlex AI assistant! Since this is a demo environment, I have a few specific answers ready. Try asking me about credit scores, limits, or how to improve eligibility.";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("credit score") || lowerText.includes("calculated")) {
        response = "Your credit score (0-100) is calculated using 4 weighted factors:\n1. Income Stability (25%)\n2. Credit History Depth (25%)\n3. Default Track Record (30%)\n4. Debt Burden Ratio (20%)";
      } else if (lowerText.includes("limit")) {
        response = "Your eligible limit is calculated based on your monthly income (25% base) multiplied by your Risk Grade multiplier (A=1.2x, B=1.0x, C=0.85x, D=0.7x). For conditional approvals, this limit is further reduced to 80%.";
      } else if (lowerText.includes("improve") || lowerText.includes("eligibility")) {
        response = "To improve your eligibility:\n- Maintain a clean payment history (0 defaults)\n- Build a longer credit depth\n- Keep the product price well below 50% of your annual income\n- Ensure you meet the minimum income threshold of ₹15,000";
      } else if (lowerText.includes("hello") || lowerText.includes("hi")) {
        response = "Hello! I'm here to help you understand the PayFlex BNPL engine. What would you like to know?";
      }

      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const quickQuestions = [
    "How is my credit score calculated?",
    "What affects my BNPL limit?",
    "How can I improve my eligibility?",
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full",
          "bg-[#FF6600] text-white shadow-lg hover:shadow-xl",
          "transition-all duration-300 hover:scale-105",
          isOpen && "hidden"
        )}
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-medium">AI Assistant</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed z-50 flex flex-col shadow-2xl border-0 overflow-hidden",
            "transition-all duration-300",
            isExpanded 
              ? "inset-4 rounded-2xl" 
              : "bottom-6 right-6 w-[380px] h-[520px] rounded-2xl"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#FF6600] to-[#FF8533] text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">PayFlex AI Assistant</h3>
                <p className="text-xs text-white/80">BNPL Expert</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 rounded-full bg-[#FF6600]/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-[#FF6600]" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  How can I help you today?
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask me anything about BNPL eligibility, EMI calculations, or credit improvement tips.
                </p>
                <div className="space-y-2 w-full">
                  {quickQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sendMessage(question);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg bg-card border border-border hover:border-[#FF6600]/50 hover:bg-[#FF6600]/5 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6600] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                    message.role === "user"
                      ? "bg-[#FF6600] text-white rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  )}
                >
                  <span className="whitespace-pre-wrap">{message.content}</span>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6600] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF6600] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[#FF6600] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[#FF6600] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-border bg-card"
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about BNPL eligibility..."
                className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-[#FF6600]"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-[#FF6600] hover:bg-[#FF6600]/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  );
}
