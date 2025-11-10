"use client";

import { useState, useMemo } from "react";
import SERVICES from "./data/services";

export default function QuoteBuilder() {
  // qué categoría estoy viendo (como antes)
  const [categoryKey, setCategoryKey] = useState("landing");

  // cuál plan está seleccionado dentro de esa categoría (para mostrar addons)
  const [planId, setPlanId] = useState(SERVICES["landing"].plans[0].id);

  // addons toggles del plan activo
  const [addonsState, setAddonsState] = useState({});

  // buffet acumulado de cosas añadidas
  const [selectedItems, setSelectedItems] = useState([]);

  const category = SERVICES[categoryKey];
  const plan = category.plans.find((p) => p.id === planId);

  // añadir el plan visible al buffet
  function addCurrentPlanToBuffet() {
    setSelectedItems((prev) => [
      ...prev,
      {
        // id único de línea
        lineId: `${categoryKey}-${plan.id}-${Date.now()}`,
        categoryLabel: category.label,
        planName: plan.name,
        type: plan.type, // oneTime / monthly / combo
        priceOneTime: plan.priceOneTime || 0,
        priceMonthly: plan.priceMonthly || 0,
      },
    ]);
  }

  // quitar una línea del buffet
  function removeLine(lineId) {
    setSelectedItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }

  // costo del plan activo con addons (para vista previa inmediata)
  const { oneTimeTotalActive, monthlyTotalActive } = useMemo(() => {
    let oneTime = plan.priceOneTime || 0;
    let monthly = plan.priceMonthly || 0;

    if (plan.addons) {
      plan.addons.forEach((add) => {
        const val = addonsState[add.id];
        if (!val) return;

        if (add.priceOneTime) {
          oneTime += add.priceOneTime;
        }
        if (add.priceMonthly) {
          monthly += add.priceMonthly;
        }
        if (add.pricePerUnit && typeof val === "number") {
          oneTime += add.pricePerUnit * val;
        }
      });
    }

    return { oneTimeTotalActive: oneTime, monthlyTotalActive: monthly };
  }, [plan, addonsState]);

  // totales globales del buffet completo
  const { buffetOneTime, buffetMonthly } = useMemo(() => {
    let ot = 0;
    let mo = 0;
    for (const item of selectedItems) {
      ot += item.priceOneTime || 0;
      mo += item.priceMonthly || 0;
    }
    return { buffetOneTime: ot, buffetMonthly: mo };
  }, [selectedItems]);

  // email body
  const mailBody = encodeURIComponent(
    selectedItems
      .map(
        (item) =>
          `Servicio: ${item.categoryLabel}\nPlan: ${item.planName}\nSetup: $${item.priceOneTime || 0} USD\nMensual: $${item.priceMonthly || 0} USD/mes`
      )
      .join("\n\n") +
      `\n\nTOTAL INICIAL: $${buffetOneTime} USD\nTOTAL MENSUAL: $${buffetMonthly} USD/mes`
  );

  const mailHref = `mailto:crisodevelop@gmail.com?subject=Cotización&body=${mailBody}`;

  return (
    <main className="min-h-screen w-full bg-bg text-text flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-7xl grid md:grid-cols-[2fr_1fr] gap-8">
        {/* COLUMNA IZQUIERDA */}
        <section className="bg-surface rounded-2xl shadow-lg p-8 border border-border">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-primary">
              Cotizador
            </h1>
            <p className="text-sm text-text/70 mt-2">
              Elige una categoría, selecciona un plan y súmalo a tu
              propuesta total. Piensa esto como un buffet 🍽️.
            </p>
          </header>

          {/* BOTONES CATEGORÍA */}
          <div className="flex flex-wrap gap-3 mb-8">
            {Object.entries(SERVICES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => {
                  setCategoryKey(key);
                  setPlanId(SERVICES[key].plans[0].id);
                  setAddonsState({});
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  categoryKey === key
                    ? "bg-primary text-white border-primary"
                    : "bg-surface border-border hover:bg-secondary/10 text-text/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* TARJETAS DE PLANES DENTRO DE ESA CATEGORÍA */}
          <div className="space-y-4">
            {category.plans.map((p) => (
              <div
                key={p.id}
                className={`w-full text-left p-5 rounded-xl border transition ${
                  planId === p.id
                    ? "border-primary bg-secondary/10"
                    : "border-border hover:border-secondary/60 bg-surface"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text">{p.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {p.type === "oneTime"
                          ? "Pago único"
                          : p.type === "monthly"
                          ? "Mensual"
                          : "Setup + Mensual"}
                      </span>
                    </div>

                    <ul className="text-xs text-text/60 mt-2 space-y-1">
                      {p.features.slice(0, 4).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                      {p.features.length > 4 && (
                        <li className="text-text/40 italic">+ más…</li>
                      )}
                    </ul>
                  </div>

                  <div className="text-right text-primary font-bold text-sm">
                    {p.priceOneTime && (
                      <div>
                        ${p.priceOneTime}{" "}
                        <span className="text-[10px] text-text/60 font-normal">
                          USD
                        </span>
                      </div>
                    )}
                    {p.priceMonthly && (
                      <div>
                        ${p.priceMonthly}{" "}
                        <span className="text-[10px] text-text/60 font-normal">
                          /mes
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* botones seleccionar + ver addons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => setPlanId(p.id)}
                    className={`px-3 py-2 text-xs rounded-lg border font-medium ${
                      planId === p.id
                        ? "bg-primary text-white border-primary"
                        : "bg-surface border-border text-text/80 hover:bg-secondary/10"
                    }`}
                  >
                    Ver / personalizar
                  </button>

                  <button
                    onClick={addCurrentPlanToBuffet}
                    className="px-3 py-2 text-xs rounded-lg font-semibold bg-primary text-white hover:bg-secondary transition border border-primary"
                  >
                    Agregar al buffet
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADDONS DEL PLAN ACTIVO */}
          {plan.addons && (
            <div className="mt-8">
              <h4 className="font-semibold text-text/80 mb-3">
                Extras opcionales ({plan.name})
              </h4>
              <div className="space-y-3">
                {plan.addons.map((add) => (
                  <div
                    key={add.id}
                    className="flex justify-between items-center border border-border rounded-lg p-4"
                  >
                    <span className="text-sm text-text">
                      {add.label}
                    </span>

                    <button
                      onClick={() =>
                        setAddonsState((prev) => ({
                          ...prev,
                          [add.id]: !prev[add.id],
                        }))
                      }
                      className={`px-3 py-1 text-xs rounded border font-medium ${
                        addonsState[add.id]
                          ? "bg-primary text-white border-primary"
                          : "bg-surface border-border text-text/70 hover:bg-secondary/10"
                      }`}
                    >
                      {addonsState[add.id] ? "Quitar" : "Agregar"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIEW DEL PLAN ACTUAL + ADDONS */}
          <div className="mt-8 border border-dashed border-border rounded-xl p-4 text-xs text-text/70 bg-surface/50">
            <div className="font-semibold text-text mb-2 text-sm">
              Vista previa de este plan
            </div>
            <div className="flex justify-between">
              <span>Setup único estimado:</span>
              <span className="font-semibold text-text">
                ${oneTimeTotalActive} USD
              </span>
            </div>

            <div className="flex justify-between">
              <span>Mensual estimado:</span>
              <span className="font-semibold text-text">
                ${monthlyTotalActive} USD / mes
              </span>
            </div>

            <div className="text-[10px] text-text/50 mt-2 leading-relaxed">
              Estos montos son de este plan + extras marcados. Si lo
              agregas al buffet, lo sumas a la propuesta total.
            </div>
          </div>
        </section>

        {/* COLUMNA DERECHA (RESUMEN BUFFET) */}
        <aside className="bg-surface rounded-2xl shadow-lg p-8 border border-border h-fit sticky top-8">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Propuesta total
          </h2>

          {selectedItems.length === 0 ? (
            <p className="text-xs text-text/50">
              Aún no agregaste nada al buffet.
            </p>
          ) : (
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={item.lineId}
                  className="border border-border rounded-lg p-4 bg-surface/50 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-text">
                        {item.categoryLabel}
                      </div>
                      <div className="text-text/70">
                        {item.planName}
                      </div>
                    </div>

                    <button
                      className="text-[10px] text-text/50 hover:text-primary"
                      onClick={() => removeLine(item.lineId)}
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="mt-3 leading-relaxed text-text/70">
                    {item.priceOneTime > 0 && (
                      <div className="flex justify-between">
                        <span>Setup:</span>
                        <span className="font-semibold text-text">
                          ${item.priceOneTime} USD
                        </span>
                      </div>
                    )}

                    {item.priceMonthly > 0 && (
                      <div className="flex justify-between">
                        <span>Mensual:</span>
                        <span className="font-semibold text-text">
                          ${item.priceMonthly} USD / mes
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL GLOBAL */}
          <div className="border-t border-border my-6" />

          <div className="text-xs text-text/70 space-y-2">
            <div className="flex justify-between">
              <span>Total inicial</span>
              <span className="font-semibold text-text">
                ${buffetOneTime} USD
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total mensual</span>
              <span className="font-semibold text-text">
                ${buffetMonthly} USD / mes
              </span>
            </div>
          </div>

          {/* CTA */}
          <a
            href={mailHref}
            className="block w-full text-center bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition mt-6 text-sm"
          >
            Quiero avanzar
          </a>

          <p className="text-[11px] text-text/50 mt-4 leading-relaxed">
            *Precios estimados. Pueden ajustarse según alcance final,
            volumen de productos y tipo de soporte.
          </p>
        </aside>
      </div>
    </main>
  );
}
