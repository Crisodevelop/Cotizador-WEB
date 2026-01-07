"use client";

import { forwardRef } from "react";

function formatUSD(n) {
  return `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

const PdfDocument = forwardRef(function PdfDocument(
  { selectedItems, buffetOneTime, buffetMonthly, buffetAds },
  ref
) {
  const buffetMonthlyGlobal = buffetMonthly + buffetAds;
  const today = new Date().toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={ref}
      className="bg-white text-gray-900 p-4 sm:p-8 max-w-3xl mx-auto"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6 pb-4 border-b-2 border-teal-500">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-600">COTIZACION</h1>
          <p className="text-gray-500 text-sm mt-1">{today}</p>
        </div>
        <div className="sm:text-right">
          <div className="text-lg sm:text-xl font-bold text-gray-800">Crisodevelop</div>
          <p className="text-xs sm:text-sm text-gray-500">crisodevelop.com</p>
          <p className="text-xs sm:text-sm text-gray-500">{process.env.NEXT_PUBLIC_EMAIL}</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 sm:p-6 mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Resumen de la Propuesta</h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">Total Inicial</p>
            <p className="text-lg sm:text-2xl font-bold text-teal-600">{formatUSD(buffetOneTime)}</p>
            <p className="text-xs text-gray-400">USD</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">Mensual Servicios</p>
            <p className="text-lg sm:text-2xl font-bold text-cyan-600">{formatUSD(buffetMonthly)}</p>
            <p className="text-xs text-gray-400">/mes</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-500">Inversion Anuncios</p>
            <p className="text-lg sm:text-2xl font-bold text-teal-500">{formatUSD(buffetAds)}</p>
            <p className="text-xs text-gray-400">/mes</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border-2 border-teal-200">
            <p className="text-xs sm:text-sm text-gray-500">Total Mensual</p>
            <p className="text-lg sm:text-2xl font-bold text-teal-600">{formatUSD(buffetMonthlyGlobal)}</p>
            <p className="text-xs text-gray-400">/mes</p>
          </div>
        </div>
      </div>

      {/* Detalle */}
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Detalle de Servicios</h2>
        <div className="space-y-3 sm:space-y-4">
          {selectedItems.map((item, index) => (
            <div
              key={item.lineId}
              className="border border-gray-200 rounded-xl p-3 sm:p-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">
                  {index + 1}
                </span>
                <span className="font-semibold text-gray-800 text-sm sm:text-base">{item.categoryLabel}</span>
                <span className="text-gray-400">—</span>
                <span className="text-gray-600 text-sm sm:text-base">{item.planName}</span>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {item.priceOneTime > 0 && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1 min-w-[100px]">
                    <p className="text-gray-500 text-xs">Total</p>
                    <p className="font-semibold text-gray-800">{formatUSD(item.priceOneTime)}</p>
                  </div>
                )}
                {item.priceMonthly > 0 && (
                  <div className="bg-cyan-50 rounded-lg px-3 py-2 flex-1 min-w-[100px]">
                    <p className="text-gray-500 text-xs">Mensual</p>
                    <p className="font-semibold text-cyan-700">{formatUSD(item.priceMonthly)}/mes</p>
                  </div>
                )}
                {item.adsBudgetMonthly > 0 && (
                  <div className="bg-teal-50 rounded-lg px-3 py-2 flex-1 min-w-[100px]">
                    <p className="text-gray-500 text-xs">Anuncios</p>
                    <p className="font-semibold text-teal-600">{formatUSD(item.adsBudgetMonthly)}/mes</p>
                  </div>
                )}
              </div>

              {item.addons?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Extras incluidos:</p>
                  <ul className="space-y-1.5">
                    {item.addons.map((a) => (
                      <li key={a.id} className="text-xs sm:text-sm flex flex-wrap justify-between gap-1 text-gray-600">
                        <span>
                          • {a.label}
                          {typeof a.qty === "number" && a.qty > 0 ? ` (x${a.qty})` : ""}
                        </span>
                        <span className="text-gray-800 font-medium">
                          {a.priceOneTime ? `${formatUSD(a.priceOneTime)}` : ""}
                          {a.priceOneTime && a.priceMonthly ? " + " : ""}
                          {a.priceMonthly ? `${formatUSD(a.priceMonthly)}/mes` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notas */}
      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
        <p className="font-medium text-gray-700 mb-2">Notas importantes:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Los precios corresponden a honorarios de Crisodevelop.</li>
          <li>La inversion en anuncios se paga directamente a Meta / Google.</li>
          <li>Los precios pueden ajustarse segun alcance final.</li>
          <li>Cotizacion valida por 30 dias.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500">
        <p className="font-medium">Crisodevelop — Soluciones Web</p>
        <p className="text-xs mt-1">crisodevelop.com | {process.env.NEXT_PUBLIC_EMAIL}</p>
      </div>
    </div>
  );
});

export default PdfDocument;
