"use client";

import { signOut } from "next-auth/react";

export function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="btn-ghost text-sm px-4 py-2"
    >
      Sign Out
    </button>
  );
}
