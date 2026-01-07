"use client";

function formatUSD(n) {
  return `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function AddonsPanel({ addons, addonsState, onChange, planName }) {
  if (!addons || addons.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <h4 className="font-semibold text-text mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Extras opcionales
        <span className="text-sm font-normal text-text-muted">({planName})</span>
      </h4>
      <div className="space-y-3">
        {addons.map((add) => {
          const hasQty = !!add.pricePerUnit;
          const val = addonsState[add.id] ?? (hasQty ? 0 : false);
          const isSelected = hasQty ? val > 0 : val;

          const labelPrice = hasQty
            ? `${formatUSD(add.pricePerUnit)} por unidad`
            : [
                add.priceOneTime ? `${formatUSD(add.priceOneTime)}` : null,
                add.priceMonthly ? `${formatUSD(add.priceMonthly)}/mes` : null,
              ]
                .filter(Boolean)
                .join(" + ");

          return (
            <div
              key={add.id}
              className={`
                flex justify-between items-center border-2 rounded-xl p-4 transition-all duration-300
                ${isSelected ? "border-success bg-success/10" : "border-border bg-surface"}
              `}
            >
              <div className="text-sm">
                <div className="font-medium text-text flex items-center gap-2">
                  {isSelected && (
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {add.label}
                </div>
                <div className="text-xs text-text-muted mt-0.5">{labelPrice}</div>
              </div>

              {hasQty ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChange(add.id, Math.max(0, (Number(val) || 0) - 1))}
                    className="w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={val}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onChange(add.id, Number(e.target.value || 0))}
                    className="w-14 px-2 py-1.5 text-sm rounded-lg border border-border bg-surface text-text text-center focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={() => onChange(add.id, (Number(val) || 0) + 1)}
                    className="w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onChange(add.id, !val)}
                  className={`
                    px-4 py-2 text-xs rounded-lg font-medium transition-all duration-300
                    ${
                      val
                        ? "bg-success text-white"
                        : "bg-primary text-white hover:bg-primary/90"
                    }
                  `}
                >
                  {val ? "Quitar" : "Agregar"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
