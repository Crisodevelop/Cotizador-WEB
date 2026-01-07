"use client";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Crisodevelop</h1>
            <p className="text-xs text-text-muted">Cotizador de Servicios</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a
            href="https://crisodevelop.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="hidden sm:inline">crisodevelop.com</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
