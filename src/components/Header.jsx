"use client";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-primary-light to-secondary flex items-center justify-center shadow-glow">
            {/* Flame icon */}
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.577 1.409-4.787 3.5-5.979C8.5 8.5 9 6.5 9 6.5s1.5 2.5 3 2.5c1.5 0 3-2.5 3-2.5s.5 2 .5 3.521c2.091 1.192 3.5 3.402 3.5 5.979 0 3.866-3.134 7-7 7zm0-2c2.761 0 5-2.239 5-5 0-1.657-.895-3.087-2.226-3.873C14.5 11.5 14 10 14 10s-1 1.5-2 1.5-2-1.5-2-1.5-.5 1.5-.774 2.127C7.895 12.913 7 14.343 7 16c0 2.761 2.239 5 5 5z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Cotizador Web</h1>
            <p className="text-xs text-text-muted">@crisodevelop</p>
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
