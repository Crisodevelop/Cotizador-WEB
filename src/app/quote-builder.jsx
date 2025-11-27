"use client";

import { useState, useMemo, useEffect } from "react";
import SERVICES from "./data/services";

function formatUSD(n) {
  return `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`;
}

export default function QuoteBuilder() {
  const [categoryKey, setCategoryKey] = useState("landing");
  const [planId, setPlanId] = useState(SERVICES["landing"].plans[0].id);
  const [addonsState, setAddonsState] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const category = SERVICES[categoryKey];

  const plan = useMemo(() => {
    const found = category.plans.find((p) => p.id === planId);
    return found || category.plans[0];
  }, [category, planId]);

  // === Totales del plan activo (con extras) ===
  const {
    oneTimeTotalActive,
    monthlyTotalActive,
    adsMonthlyActive,
    chosenAddonsActive,
  } = useMemo(() => {
    if (!plan) {
      return {
        oneTimeTotalActive: 0,
        monthlyTotalActive: 0,
        adsMonthlyActive: 0,
        chosenAddonsActive: [],
      };
    }

    const isCampaign = categoryKey === "sem" && plan.type === "combo";

    // En SEM: priceMonthly = fee por trabajo mensual
    //         priceOneTime = inversión mensual recomendada (ads)
    // En el resto: priceOneTime = total, priceMonthly = mensual normal
    let oneTime = isCampaign ? 0 : (plan.priceOneTime || 0);
    let monthly = plan.priceMonthly || 0;
    let adsMonthly = isCampaign ? (plan.priceOneTime || 0) : 0;

    const breakdown = [];

    if (plan.addons) {
      plan.addons.forEach((add) => {
        const val = addonsState[add.id];

        // Addon con cantidad (pricePerUnit)
        if (add.pricePerUnit) {
          const qty = Number(val) || 0;
          if (qty > 0) {
            const ot = add.priceOneTime
              ? add.priceOneTime * qty
              : 0;
            const mo = add.priceMonthly
              ? add.priceMonthly * qty
              : 0;

            // Todos los addons cuentan como servicio (no ads)
            oneTime += ot;
            monthly += mo;

            breakdown.push({
              id: add.id,
              label: add.label,
              qty,
              priceOneTime: ot,
              priceMonthly: mo,
            });
          }
        } else if (val) {
          const ot = add.priceOneTime || 0;
          const mo = add.priceMonthly || 0;

          oneTime += ot;
          monthly += mo;

          breakdown.push({
            id: add.id,
            label: add.label,
            qty: undefined,
            priceOneTime: ot,
            priceMonthly: mo,
          });
        }
      });
    }

    return {
      oneTimeTotalActive: oneTime,
      monthlyTotalActive: monthly,
      adsMonthlyActive: adsMonthly,
      chosenAddonsActive: breakdown,
    };
  }, [plan, addonsState, categoryKey]);

  // === Totales globales (columna derecha) ===
  const { buffetOneTime, buffetMonthly, buffetAds } = useMemo(() => {
    let ot = 0;
    let mo = 0;
    let ads = 0;
    for (const item of selectedItems) {
      ot += item.priceOneTime || 0;
      mo += item.priceMonthly || 0;
      ads += item.adsBudgetMonthly || 0;
    }
    return { buffetOneTime: ot, buffetMonthly: mo, buffetAds: ads };
  }, [selectedItems]);

  const buffetMonthlyGlobal = buffetMonthly + buffetAds;

  // Helper: busca un ítem ya agregado
  function findItemIndex(arr, base) {
    return arr.findIndex(
      (x) => x.categoryKey === base.categoryKey && x.planId === base.planId
    );
  }

  // Agregar/actualizar un plan (si es activo, entra con extras)
  function addPlanToBuffet(p) {
    const base = {
      categoryKey,
      categoryLabel: category.label,
      planId: p.id,
      planName: p.name,
      type: p.type,
    };

    const isActive = p.id === planId;
    const isCampaign = categoryKey === "sem" && p.type === "combo";

    let priceOneTime;
    let priceMonthly;
    let adsBudgetMonthly;
    let addons = [];

    if (isCampaign) {
      // En SEM:
      //  - priceMonthly: fee de trabajo mensual (con extras si activo)
      //  - adsBudgetMonthly: inversión mensual recomendada
      //  - priceOneTime: 0 (no total real)
      priceOneTime = 0;
      priceMonthly = isActive
        ? monthlyTotalActive
        : (p.priceMonthly || 0);
      adsBudgetMonthly = isActive
        ? adsMonthlyActive
        : (p.priceOneTime || 0);
      addons = isActive ? chosenAddonsActive : [];
    } else {
      priceOneTime = isActive
        ? oneTimeTotalActive
        : (p.priceOneTime || 0);
      priceMonthly = isActive
        ? monthlyTotalActive
        : (p.priceMonthly || 0);
      adsBudgetMonthly = 0;
      addons = isActive ? chosenAddonsActive : [];
    }

    const entry = {
      ...base,
      lineId: `${base.categoryKey}-${base.planId}`, // estable para upsert
      priceOneTime,
      priceMonthly,
      adsBudgetMonthly,
      addons,
    };

    setSelectedItems((prev) => {
      const idx = findItemIndex(prev, base);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry; // update
        return copy;
      }
      return [...prev, entry]; // add
    });
  }

  // AUTO-SYNC: si el plan activo ya está en la propuesta, reflejar cambios de extras al instante
  useEffect(() => {
    if (!plan) return;

    const base = {
      categoryKey,
      categoryLabel: category.label,
      planId: plan.id,
      planName: plan.name,
    };

    const isCampaign = categoryKey === "sem" && plan.type === "combo";

    setSelectedItems((prev) => {
      const idx = findItemIndex(prev, base);
      if (idx === -1) return prev;

      const current = prev[idx];

      const expected = {
        priceOneTime: isCampaign ? 0 : oneTimeTotalActive,
        priceMonthly: monthlyTotalActive,
        adsBudgetMonthly: isCampaign ? adsMonthlyActive : 0,
      };

      const needsUpdate =
        current.priceOneTime !== expected.priceOneTime ||
        current.priceMonthly !== expected.priceMonthly ||
        (current.adsBudgetMonthly || 0) !== expected.adsBudgetMonthly ||
        JSON.stringify(current.addons) !==
          JSON.stringify(chosenAddonsActive);

      if (!needsUpdate) return prev;

      const copy = [...prev];
      copy[idx] = {
        ...current,
        priceOneTime: expected.priceOneTime,
        priceMonthly: expected.priceMonthly,
        adsBudgetMonthly: expected.adsBudgetMonthly,
        addons: chosenAddonsActive,
      };
      return copy;
    });
  }, [
    categoryKey,
    category.label,
    plan,
    oneTimeTotalActive,
    monthlyTotalActive,
    adsMonthlyActive,
    chosenAddonsActive,
  ]);

  // === Email (estructura con inversión de anuncios) ===
  const emailText = useMemo(() => {
    const lines = [];
    lines.push(`COTIZACIÓN — ${new Date().toLocaleDateString("es-DO")}`);
    lines.push(`Proveedor: Crisodevelop (crisodevelop.com)`);
    lines.push("");
    lines.push(`RESUMEN`);
    lines.push(`• Total inicial: ${formatUSD(buffetOneTime)}`);
    lines.push(
      `• Total mensual servicios: ${formatUSD(buffetMonthly).replace(
        " USD",
        " USD/mes"
      )}`
    );
    lines.push(
      `• Inversión mensual en anuncios (recomendada): ${formatUSD(
        buffetAds
      ).replace(" USD", " USD/mes")}`
    );
    lines.push(
      `• Total mensual global estimado: ${formatUSD(
        buffetMonthlyGlobal
      ).replace(" USD", " USD/mes")}`
    );
    lines.push("");

    if (selectedItems.length > 0) {
      lines.push(`DETALLE`);
      selectedItems.forEach((item, i) => {
        lines.push(`${i + 1}) ${item.categoryLabel} — ${item.planName}`);

        const s = item.priceOneTime
          ? `Total: ${formatUSD(item.priceOneTime)}`
          : null;
        const m = item.priceMonthly
          ? `Mensual servicio: ${formatUSD(item.priceMonthly).replace(
              " USD",
              " USD/mes"
            )}`
          : null;
        const inv = item.adsBudgetMonthly
          ? `Inversión anuncios recomendada: ${formatUSD(
              item.adsBudgetMonthly
            ).replace(" USD", " USD/mes")}`
          : null;

        if (s || m || inv) {
          lines.push(
            `   ${[s, m, inv].filter(Boolean).join(" | ")}`
          );
        }

        if (item.addons?.length) {
          lines.push(`   Extras incluidos:`);
          item.addons.forEach((a) => {
            const qty =
              typeof a.qty === "number" && a.qty > 0 ? ` x${a.qty}` : "";
            const ot = a.priceOneTime
              ? `Total ${formatUSD(a.priceOneTime)}`
              : null;
            const mo = a.priceMonthly
              ? `Mensual ${formatUSD(a.priceMonthly).replace(
                  " USD",
                  " USD/mes"
                )}`
              : null;
            lines.push(
              `   - ${a.label}${qty}${
                ot || mo
                  ? ` — ${[ot, mo].filter(Boolean).join(" | ")}`
                  : ""
              }`
            );
          });
        }
        lines.push("");
      });
    } else {
      lines.push(`(Aún sin ítems seleccionados)`);
      lines.push("");
    }

    lines.push(
      `Notas: los montos de anuncios son inversión recomendada y se pagan directamente a las plataformas (Meta / Google). Los precios de servicio pueden ajustarse según alcance final, volumen y dependencias de terceros.`
    );
    return lines.join("\n");
  }, [
    selectedItems,
    buffetOneTime,
    buffetMonthly,
    buffetAds,
    buffetMonthlyGlobal,
  ]);

  const mailHref = `mailto:crisodevelop@gmail.com?subject=${encodeURIComponent(
    "Cotización — Crisodevelop"
  )}&body=${encodeURIComponent(emailText)}`;

  const isCampaignActive =
    categoryKey === "sem" && plan && plan.type === "combo";

  return (
    <main className="min-h-screen w-full bg-bg text-text flex flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-7xl grid md:grid-cols-[2fr_1fr] gap-8">
        {/* IZQUIERDA */}
        <section className="bg-surface rounded-2xl shadow-lg p-8 border border-border">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-primary">Cotizador</h1>
            <p className="text-sm text-text/70 mt-2">
              Clic en una tarjeta para seleccionarla; marca extras y agrégala (o
              se actualizará si ya está en la propuesta).
            </p>
          </header>

          {/* CATEGORÍAS */}
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

          {/* PLANES */}
          <div className="space-y-4">
            {category.plans.map((p) => {
              const isActive = planId === p.id;
              const isCampaignCard =
                categoryKey === "sem" && p.type === "combo";

              const showOneTime =
                isActive && !isCampaignCard
                  ? oneTimeTotalActive
                  : p.priceOneTime || 0;
              const showMonthly =
                isActive && !isCampaignCard
                  ? monthlyTotalActive
                  : p.priceMonthly || 0;

              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPlanId(p.id)}
                  onKeyDown={(e) => e.key === "Enter" && setPlanId(p.id)}
                  className={`w-full text-left p-5 rounded-xl border transition cursor-pointer ${
                    isActive
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
                            : "Total + Mensual"}
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
                      {isCampaignCard ? (
                        <>
                          {/* En SEM mostramos explícitamente las dos mensualidades */}
                          <div>
                            {formatUSD(p.priceMonthly || 0).replace(" USD", "")}{" "}
                            <span className="text-[10px] text-text/60 font-normal">
                              USD/mes trabajo
                            </span>
                          </div>
                          <div>
                            {formatUSD(p.priceOneTime || 0).replace(" USD", "")}{" "}
                            <span className="text-[10px] text-text/60 font-normal">
                              USD/mes anuncios
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {p.priceOneTime !== undefined &&
                            p.priceOneTime > 0 && (
                              <div>
                                {formatUSD(showOneTime).replace(" USD", "")}{" "}
                                <span className="text-[10px] text-text/60 font-normal">
                                  USD
                                </span>
                              </div>
                            )}
                          {p.priceMonthly !== undefined &&
                            p.priceMonthly > 0 && (
                              <div>
                                {formatUSD(showMonthly).replace(" USD", "")}{" "}
                                <span className="text-[10px] text-text/60 font-normal">
                                  /mes
                                </span>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addPlanToBuffet(p); // upsert si ya estaba
                      }}
                      className="px-3 py-2 text-xs rounded-lg font-semibold bg-primary text-white hover:bg-secondary transition border border-primary"
                    >
                      Agregar al buffet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* EXTRAS DEL PLAN ACTIVO */}
          {plan.addons && (
            <div className="mt-8">
              <h4 className="font-semibold text-text/80 mb-3">
                Extras opcionales ({plan.name})
              </h4>
              <div className="space-y-3">
                {plan.addons.map((add) => {
                  const hasQty = !!add.pricePerUnit;
                  const val = addonsState[add.id] ?? (hasQty ? 0 : false);

                  const labelPrice = hasQty
                    ? `(por unidad: ${formatUSD(add.pricePerUnit || 0)}${
                        add.priceMonthly
                          ? ` + ${formatUSD(add.priceMonthly)}/mes`
                          : ""
                      })`
                    : [
                        add.priceOneTime
                          ? `Total: ${formatUSD(add.priceOneTime)}`
                          : null,
                        add.priceMonthly
                          ? `Mensual: ${formatUSD(add.priceMonthly)}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(" | ");

                  return (
                    <div
                      key={add.id}
                      className="flex justify-between items-center border border-border rounded-lg p-4"
                    >
                      <div className="text-sm text-text">
                        <div className="font-medium">{add.label}</div>
                        <div className="text-[11px] text-text/60">
                          {labelPrice}
                        </div>
                      </div>

                      {hasQty ? (
                        <input
                          type="number"
                          min={0}
                          value={val}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setAddonsState((prev) => ({
                              ...prev,
                              [add.id]: Number(e.target.value || 0),
                            }))
                          }
                          className="w-20 px-2 py-1 text-xs rounded border border-border bg-surface text-text text-right"
                        />
                      ) : (
                        <button
                          onClick={() =>
                            setAddonsState((prev) => ({
                              ...prev,
                              [add.id]: !prev[add.id],
                            }))
                          }
                          className={`px-3 py-1 text-xs rounded border font-medium ${
                            val
                              ? "bg-primary text-white border-primary"
                              : "bg-surface border-border text-text/70 hover:bg-secondary/10"
                          }`}
                        >
                          {val ? "Quitar" : "Agregar"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PREVIEW DEL PLAN ACTIVO */}
          <div className="mt-8 border border-dashed border-border rounded-xl p-4 text-xs text-text/70 bg-surface/50">
            <div className="font-semibold text-text mb-2 text-sm">
              Vista previa de este plan
            </div>

            {!isCampaignActive && (
              <div className="flex justify-between">
                <span>Total único estimado:</span>
                <span className="font-semibold text-text">
                  {formatUSD(oneTimeTotalActive)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>
                Mensual servicio
                {isCampaignActive ? " (gestión):" : ":"}
              </span>
              <span className="font-semibold text-text">
                {formatUSD(monthlyTotalActive).replace(
                  " USD",
                  " USD / mes"
                )}
              </span>
            </div>

            {isCampaignActive && (
              <>
                <div className="flex justify-between">
                  <span>Inversión mensual en anuncios:</span>
                  <span className="font-semibold text-text">
                    {formatUSD(adsMonthlyActive).replace(
                      " USD",
                      " USD / mes"
                    )}
                  </span>
                </div>
                <div className="flex justify-between mt-1 border-t border-dashed border-border pt-1">
                  <span>Total mensual global (plan):</span>
                  <span className="font-semibold text-text">
                    {formatUSD(
                      monthlyTotalActive + adsMonthlyActive
                    ).replace(" USD", " USD / mes")}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* DERECHA — PROPUESTA TOTAL (con extras visibles) */}
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
                      <div className="text-text/70">{item.planName}</div>
                    </div>
                    <button
                      className="text-[10px] text-text/50 hover:text-primary"
                      onClick={() =>
                        setSelectedItems((prev) =>
                          prev.filter((x) => x.lineId !== item.lineId)
                        )
                      }
                    >
                      Quitar
                    </button>
                  </div>

                  {/* Desglose extras */}
                  {item.addons?.length > 0 && (
                    <div className="mt-3 text-text/70">
                      <div className="font-medium mb-1">
                        Extras incluidos:
                      </div>
                      <ul className="space-y-1">
                        {item.addons.map((a) => (
                          <li
                            key={a.id}
                            className="flex justify-between"
                          >
                            <span>
                              • {a.label}
                              {typeof a.qty === "number" && a.qty > 0
                                ? ` x${a.qty}`
                                : ""}
                            </span>
                            <span className="text-text">
                              {[
                                a.priceOneTime
                                  ? `Total ${formatUSD(
                                      a.priceOneTime
                                    )}`
                                  : null,
                                a.priceMonthly
                                  ? `Mensual ${formatUSD(
                                      a.priceMonthly
                                    ).replace(
                                      " USD",
                                      " USD/mes"
                                    )}`
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(" | ")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 leading-relaxed text-text/70 space-y-1">
                    {item.priceOneTime > 0 && (
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-semibold text-text">
                          {formatUSD(item.priceOneTime)}
                        </span>
                      </div>
                    )}
                    {item.priceMonthly > 0 && (
                      <div className="flex justify-between">
                        <span>Mensual servicios:</span>
                        <span className="font-semibold text-text">
                          {formatUSD(item.priceMonthly).replace(
                            " USD",
                            " USD / mes"
                          )}
                        </span>
                      </div>
                    )}
                    {item.adsBudgetMonthly > 0 && (
                      <div className="flex justify-between">
                        <span>
                          Inversión anuncios (recomendada):
                        </span>
                        <span className="font-semibold text-text">
                          {formatUSD(item.adsBudgetMonthly).replace(
                            " USD",
                            " USD / mes"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border my-6" />

          <div className="text-xs text-text/70 space-y-2">
            <div className="flex justify-between">
              <span>Total inicial:</span>
              <span className="font-semibold text-text">
                {formatUSD(buffetOneTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total mensual servicios</span>
              <span className="font-semibold text-text">
                {formatUSD(buffetMonthly).replace(
                  " USD",
                  " USD / mes"
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                Inversión mensual en anuncios (recomendada)
              </span>
              <span className="font-semibold text-text">
                {formatUSD(buffetAds).replace(
                  " USD",
                  " USD / mes"
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed border-border pt-2 mt-1">
              <span>Total mensual global estimado</span>
              <span className="font-semibold text-text">
                {formatUSD(buffetMonthlyGlobal).replace(
                  " USD",
                  " USD / mes"
                )}
              </span>
            </div>
          </div>

          <a
            href={mailHref}
            className="block w-full text-center bg-primary text-white font-semibold py-3 rounded-xl hover:bg-secondary transition mt-6 text-sm"
          >
            Enviar cotización por correo
          </a>

          <p className="text-[11px] text-text/50 mt-4 leading-relaxed">
            *Los precios de servicio corresponden a honorarios de Crisodevelop.
            La inversión en anuncios es un monto recomendado que se paga
            directamente a las plataformas (Meta / Google) y puede ajustarse
            según resultados y presupuesto.
          </p>
        </aside>
      </div>
    </main>
  );
}
