"use client";

import { useState } from "react";
import { deleteCard } from "@/lib/actions";

interface Props {
  cardId: string;
  className?: string;
}

export function AdminDeleteButton({ cardId, className = "" }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleDelete() {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setDeleting(true);
    await deleteCard(cardId);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium disabled:opacity-50 ${
        confirmed
          ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
          : "bg-transparent border-red-500/20 text-red-500/60 hover:border-red-500/50 hover:text-red-400"
      } ${className}`}
    >
      {deleting ? "Deleting…" : confirmed ? "Confirm?" : "Delete"}
    </button>
  );
}
