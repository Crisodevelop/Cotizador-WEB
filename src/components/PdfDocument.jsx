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
      className="bg-white text-gray-900 p-8 max-w-3xl mx-auto"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-500">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">COTIZACION</h1>
          <p className="text-gray-500 mt-1">{today}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">Crisodevelop</div>
          <p className="text-sm text-gray-500">crisodevelop.com</p>
          <p className="text-sm text-gray-500">{process.env.NEXT_PUBLIC_EMAIL}</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen de la Propuesta</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Inicial</p>
            <p className="text-2xl font-bold text-blue-600">{formatUSD(buffetOneTime)} USD</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Mensual Servicios</p>
            <p className="text-2xl font-bold text-cyan-600">{formatUSD(buffetMonthly)}/mes</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">Inversion Anuncios</p>
            <p className="text-2xl font-bold text-teal-500">{formatUSD(buffetAds)}/mes</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-blue-200">
            <p className="text-sm text-gray-500">Total Mensual Global</p>
            <p className="text-2xl font-bold text-blue-600">{formatUSD(buffetMonthlyGlobal)}/mes</p>
          </div>
        </div>
      </div>

      {/* Detalle */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalle de Servicios</h2>
        <div className="space-y-4">
          {selectedItems.map((item, index) => (
            <div
              key={item.lineId}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mr-2">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-gray-800">{item.categoryLabel}</span>
                  <span className="text-gray-400 mx-2">—</span>
                  <span className="text-gray-600">{item.planName}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                {item.priceOneTime > 0 && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500 text-xs">Total</p>
                    <p className="font-semibold text-gray-800">{formatUSD(item.priceOneTime)} USD</p>
                  </div>
                )}
                {item.priceMonthly > 0 && (
                  <div className="bg-cyan-50 rounded p-2">
                    <p className="text-gray-500 text-xs">Mensual</p>
                    <p className="font-semibold text-cyan-700">{formatUSD(item.priceMonthly)}/mes</p>
                  </div>
                )}
                {item.adsBudgetMonthly > 0 && (
                  <div className="bg-teal-50 rounded p-2">
                    <p className="text-gray-500 text-xs">Anuncios</p>
                    <p className="font-semibold text-teal-600">{formatUSD(item.adsBudgetMonthly)}/mes</p>
                  </div>
                )}
              </div>

              {item.addons?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Extras incluidos:</p>
                  <ul className="space-y-1">
                    {item.addons.map((a) => (
                      <li key={a.id} className="text-sm flex justify-between text-gray-600">
                        <span>
                          • {a.label}
                          {typeof a.qty === "number" && a.qty > 0 ? ` (x${a.qty})` : ""}
                        </span>
                        <span className="text-gray-800">
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
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-700 mb-2">Notas importantes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Los precios de servicio corresponden a honorarios de Crisodevelop.</li>
          <li>La inversion en anuncios es un monto recomendado que se paga directamente a las plataformas (Meta / Google).</li>
          <li>Los precios pueden ajustarse segun alcance final, volumen y dependencias de terceros.</li>
          <li>Esta cotizacion tiene una validez de 30 dias.</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Crisodevelop — Soluciones Web Profesionales</p>
        <p className="text-xs mt-1">crisodevelop.com | {process.env.NEXT_PUBLIC_EMAIL}</p>
      </div>
    </div>
  );
});

export default PdfDocument;
