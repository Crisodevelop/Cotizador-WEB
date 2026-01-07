"use client";

import { useState, useMemo, useEffect } from "react";
import SERVICES from "./data/services";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  Header,
  Footer,
  CategoryTabs,
  PlanCard,
  AddonsPanel,
  ProposalSidebar,
  PlanPreview,
} from "../components";

function formatUSD(n) {
  return `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`;
}

export default function QuoteBuilder() {
  const [categoryKey, setCategoryKey] = useState("landing");
  const [planId, setPlanId] = useState(SERVICES["landing"].plans[1]?.id || SERVICES["landing"].plans[0].id);
  const [addonsState, setAddonsState] = useState({});
  const [selectedItems, setSelectedItems, clearSelectedItems, isHydrated] =
    useLocalStorage("cotizador-items", []);

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

    let oneTime = isCampaign ? 0 : plan.priceOneTime || 0;
    let monthly = plan.priceMonthly || 0;
    let adsMonthly = isCampaign ? plan.priceOneTime || 0 : 0;

    const breakdown = [];

    if (plan.addons) {
      plan.addons.forEach((add) => {
        const val = addonsState[add.id];

        if (add.pricePerUnit) {
          const qty = Number(val) || 0;
          if (qty > 0) {
            const ot = add.priceOneTime ? add.priceOneTime * qty : 0;
            const mo = add.priceMonthly ? add.priceMonthly * qty : 0;

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

  // === Totales globales ===
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

  // Helper: busca un item ya agregado
  function findItemIndex(arr, base) {
    return arr.findIndex(
      (x) => x.categoryKey === base.categoryKey && x.planId === base.planId
    );
  }

  // Agregar/actualizar un plan
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
      priceOneTime = 0;
      priceMonthly = isActive ? monthlyTotalActive : p.priceMonthly || 0;
      adsBudgetMonthly = isActive ? adsMonthlyActive : p.priceOneTime || 0;
      addons = isActive ? chosenAddonsActive : [];
    } else {
      priceOneTime = isActive ? oneTimeTotalActive : p.priceOneTime || 0;
      priceMonthly = isActive ? monthlyTotalActive : p.priceMonthly || 0;
      adsBudgetMonthly = 0;
      addons = isActive ? chosenAddonsActive : [];
    }

    const entry = {
      ...base,
      lineId: `${base.categoryKey}-${base.planId}`,
      priceOneTime,
      priceMonthly,
      adsBudgetMonthly,
      addons,
    };

    setSelectedItems((prev) => {
      const idx = findItemIndex(prev, base);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [...prev, entry];
    });
  }

  // AUTO-SYNC
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
        JSON.stringify(current.addons) !== JSON.stringify(chosenAddonsActive);

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
    setSelectedItems,
  ]);

  // === Email text ===
  const emailText = useMemo(() => {
    const lines = [];
    lines.push(`COTIZACION — ${new Date().toLocaleDateString("es-DO")}`);
    lines.push(`Proveedor: Crisodevelop (crisodevelop.com)`);
    lines.push("");
    lines.push(`RESUMEN`);
    lines.push(`• Total inicial: ${formatUSD(buffetOneTime)}`);
    lines.push(
      `• Total mensual servicios: ${formatUSD(buffetMonthly).replace(" USD", " USD/mes")}`
    );
    lines.push(
      `• Inversion mensual en anuncios (recomendada): ${formatUSD(buffetAds).replace(
        " USD",
        " USD/mes"
      )}`
    );
    lines.push(
      `• Total mensual global estimado: ${formatUSD(buffetMonthly + buffetAds).replace(
        " USD",
        " USD/mes"
      )}`
    );
    lines.push("");

    if (selectedItems.length > 0) {
      lines.push(`DETALLE`);
      selectedItems.forEach((item, i) => {
        lines.push(`${i + 1}) ${item.categoryLabel} — ${item.planName}`);

        const s = item.priceOneTime ? `Total: ${formatUSD(item.priceOneTime)}` : null;
        const m = item.priceMonthly
          ? `Mensual servicio: ${formatUSD(item.priceMonthly).replace(" USD", " USD/mes")}`
          : null;
        const inv = item.adsBudgetMonthly
          ? `Inversion anuncios recomendada: ${formatUSD(item.adsBudgetMonthly).replace(
              " USD",
              " USD/mes"
            )}`
          : null;

        if (s || m || inv) {
          lines.push(`   ${[s, m, inv].filter(Boolean).join(" | ")}`);
        }

        if (item.addons?.length) {
          lines.push(`   Extras incluidos:`);
          item.addons.forEach((a) => {
            const qty = typeof a.qty === "number" && a.qty > 0 ? ` x${a.qty}` : "";
            const ot = a.priceOneTime ? `Total ${formatUSD(a.priceOneTime)}` : null;
            const mo = a.priceMonthly
              ? `Mensual ${formatUSD(a.priceMonthly).replace(" USD", " USD/mes")}`
              : null;
            lines.push(
              `   - ${a.label}${qty}${ot || mo ? ` — ${[ot, mo].filter(Boolean).join(" | ")}` : ""}`
            );
          });
        }
        lines.push("");
      });
    } else {
      lines.push(`(Aun sin items seleccionados)`);
      lines.push("");
    }

    lines.push(
      `Notas: los montos de anuncios son inversion recomendada y se pagan directamente a las plataformas (Meta / Google). Los precios de servicio pueden ajustarse segun alcance final, volumen y dependencias de terceros.`
    );
    return lines.join("\n");
  }, [selectedItems, buffetOneTime, buffetMonthly, buffetAds]);

  const isCampaignActive = categoryKey === "sem" && plan && plan.type === "combo";

  const handleCategoryChange = (key) => {
    setCategoryKey(key);
    setPlanId(SERVICES[key].plans[1]?.id || SERVICES[key].plans[0].id);
    setAddonsState({});
  };

  const handleAddonChange = (id, value) => {
    setAddonsState((prev) => ({ ...prev, [id]: value }));
  };

  const handleRemoveItem = (lineId) => {
    setSelectedItems((prev) => prev.filter((x) => x.lineId !== lineId));
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Header />

      <main className="flex-1 w-full px-6 md:px-10 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Intro */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text mb-2">
              Arma tu <span className="gradient-text">propuesta</span>
            </h2>
            <p className="text-text-muted">
              Selecciona los servicios que necesitas y personaliza con extras opcionales.
              {selectedItems.length > 0 && (
                <button
                  onClick={clearSelectedItems}
                  className="ml-3 text-accent hover:text-accent/80 text-sm underline"
                >
                  Limpiar propuesta
                </button>
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* IZQUIERDA */}
            <section className="space-y-8">
              {/* Categorias */}
              <CategoryTabs
                services={SERVICES}
                activeKey={categoryKey}
                onSelect={handleCategoryChange}
              />

              {/* Planes */}
              <div className="space-y-4">
                {category.plans.map((p, index) => {
                  const isActive = planId === p.id;
                  const isCampaignCard = categoryKey === "sem" && p.type === "combo";
                  const isAdded = selectedItems.some(
                    (item) => item.categoryKey === categoryKey && item.planId === p.id
                  );
                  const isRecommended = index === 1;

                  const showOneTime =
                    isActive && !isCampaignCard ? oneTimeTotalActive : p.priceOneTime || 0;
                  const showMonthly =
                    isActive && !isCampaignCard ? monthlyTotalActive : p.priceMonthly || 0;

                  return (
                    <PlanCard
                      key={p.id}
                      plan={p}
                      isActive={isActive}
                      isAdded={isAdded}
                      isRecommended={isRecommended}
                      isCampaign={isCampaignCard}
                      showOneTime={showOneTime}
                      showMonthly={showMonthly}
                      onSelect={() => setPlanId(p.id)}
                      onAdd={() => addPlanToBuffet(p)}
                      onRemove={() => handleRemoveItem(`${categoryKey}-${p.id}`)}
                    />
                  );
                })}
              </div>

              {/* Addons */}
              <AddonsPanel
                addons={plan.addons}
                addonsState={addonsState}
                onChange={handleAddonChange}
                planName={plan.name}
              />

              {/* Preview */}
              <PlanPreview
                isCampaign={isCampaignActive}
                oneTimeTotal={oneTimeTotalActive}
                monthlyTotal={monthlyTotalActive}
                adsMonthly={adsMonthlyActive}
              />
            </section>

            {/* DERECHA */}
            <ProposalSidebar
              selectedItems={selectedItems}
              onRemoveItem={handleRemoveItem}
              buffetOneTime={buffetOneTime}
              buffetMonthly={buffetMonthly}
              buffetAds={buffetAds}
              emailText={emailText}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
