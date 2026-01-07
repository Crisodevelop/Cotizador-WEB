"use client";

function formatUSD(n) {
  return `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function PlanPreview({
  isCampaign,
  oneTimeTotal,
  monthlyTotal,
  adsMonthly,
}) {
  return (
    <div className="mt-8 bg-surface border border-primary/30 rounded-2xl p-5 animate-fade-in shadow-glow">
      <div className="font-semibold text-text mb-3 flex items-center gap-2">
        <svg
          className="w-4 h-4 text-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Vista previa del plan seleccionado
      </div>

      <div className="space-y-2 text-sm">
        {!isCampaign && oneTimeTotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Total unico estimado:</span>
            <span className="font-bold text-lg text-text">
              {formatUSD(oneTimeTotal)} USD
            </span>
          </div>
        )}

        {monthlyTotal > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-text-muted">
              Mensual servicio{isCampaign ? " (gestion):" : ":"}
            </span>
            <span className="font-semibold text-secondary">
              {formatUSD(monthlyTotal)}/mes
            </span>
          </div>
        )}

        {isCampaign && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Inversion mensual en anuncios:</span>
              <span className="font-semibold text-accent">
                {formatUSD(adsMonthly)}/mes
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-border">
              <span className="text-text">Total mensual global (plan):</span>
              <span className="font-bold text-lg gradient-text">
                {formatUSD(monthlyTotal + adsMonthly)}/mes
              </span>
            </div>
          </>
        )}

        {!isCampaign && oneTimeTotal === 0 && monthlyTotal === 0 && (
          <p className="text-text-muted text-center py-2">
            Selecciona extras para ver el total
          </p>
        )}
      </div>
    </div>
  );
}
