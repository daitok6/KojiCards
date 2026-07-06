"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "koji-announcement-dismissed";

interface Props {
  message: string;
  link?: string;
}

export function AnnouncementBanner({ message, link }: Props) {
  const [visible, setVisible] = useState(false);

  // Only show once mounted, and only if this exact message hasn't been dismissed —
  // editing the message in admin changes the stored value and it reappears.
  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (dismissed !== message) setVisible(true);
  }, [message]);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, message);
    setVisible(false);
  }

  if (!visible) return null;

  const content = (
    <span className="text-sm text-white font-medium truncate">{message}</span>
  );

  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5"
      style={{
        background: "linear-gradient(90deg, rgba(168,85,247,0.18), rgba(59,130,246,0.18), rgba(6,182,212,0.18))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex-1 min-w-0 flex items-center justify-center gap-2 text-center">
        {link ? (
          <a href={link} className="no-underline hover:opacity-80 transition-opacity truncate">
            {content}
          </a>
        ) : (
          content
        )}
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="flex-shrink-0 text-white/50 hover:text-white transition-colors leading-none"
      >
        ✕
      </button>
    </div>
  );
}
