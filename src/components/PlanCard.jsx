"use client";

function formatUSD(n) {
  return `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function PlanCard({
  plan,
  isActive,
  isAdded,
  isRecommended,
  isCampaign,
  showOneTime,
  showMonthly,
  onSelect,
  onAdd,
  onRemove,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={`
        relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${isActive ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary/50"}
      `}
    >
      {/* Badge agregado */}
      {isAdded && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-success text-white text-xs font-medium px-2.5 py-1 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Agregado
        </div>
      )}

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h3 className="font-semibold text-lg text-text">{plan.name}</h3>
          </div>
          <ul className="text-sm text-text-muted space-y-1.5">
            {plan.features.slice(0, 4).map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{f}</span>
              </li>
            ))}
            {plan.features.length > 4 && (
              <li className="text-text-muted/60 italic pl-4">
                + {plan.features.length - 4} mas...
              </li>
            )}
          </ul>
        </div>

        <div className="text-right flex-shrink-0">
          {isCampaign ? (
            <div className="space-y-1">
              <div className="text-xl font-bold text-primary">
                {formatUSD(plan.priceMonthly)}
                <span className="text-xs text-text-muted font-normal block">
                  /mes trabajo
                </span>
              </div>
              <div className="text-lg font-semibold text-text-muted">
                {formatUSD(plan.priceOneTime)}
                <span className="text-xs text-text-muted font-normal block">
                  /mes anuncios
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {plan.priceOneTime > 0 && (
                <div className="text-xl font-bold text-primary">
                  {formatUSD(showOneTime)}
                  <span className="text-xs text-text-muted font-normal ml-1">USD</span>
                </div>
              )}
              {plan.priceMonthly > 0 && (
                <div className="text-lg font-semibold text-text-muted">
                  {formatUSD(showMonthly)}
                  <span className="text-xs font-normal ml-1">/mes</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border/50">
        {isAdded ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all duration-300"
          >
            Quitar de propuesta
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className={`
              w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300
              ${
                isRecommended
                  ? "gradient-btn text-white shadow-glow hover:shadow-glow-lg"
                  : "bg-surface-light border border-border text-text hover:border-primary hover:text-primary"
              }
            `}
          >
            Agregar a propuesta
          </button>
        )}
      </div>
    </div>
  );
}
