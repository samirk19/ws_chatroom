"use client";

import { useState } from "react";

interface Props {
  onSend: (content: string) => void;
  disabled: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none placeholder-gray-400 resize-none"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
