"use client";

import { useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import PdfDocument from "./PdfDocument";

function formatUSD(n) {
  return `$${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function ProposalSidebar({
  selectedItems,
  onRemoveItem,
  buffetOneTime,
  buffetMonthly,
  buffetAds,
  emailText,
}) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const pdfRef = useRef(null);

  const buffetMonthlyGlobal = buffetMonthly + buffetAds;

  const mailHref = `mailto:${process.env.NEXT_PUBLIC_EMAIL}?subject=${encodeURIComponent(
    "Cotizacion — Crisodevelop"
  )}&body=${encodeURIComponent(emailText)}`;

  const whatsappText = emailText.replace(/\n/g, "%0A");
  const whatsappHref = `https://wa.me/18098041000?text=${whatsappText}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const handleGeneratePdf = async () => {
    if (selectedItems.length === 0) return;

    setGeneratingPdf(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const element = pdfRef.current;
      const opt = {
        margin: 10,
        filename: `cotizacion-crisodevelop-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <>
      <aside className="glass rounded-2xl p-6 border border-border h-fit sticky top-8 animate-slide-up">
        <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-primary"}`}>
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          Propuesta Total
        </h2>

        {selectedItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-light flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-sm text-text-muted">
              Selecciona servicios para armar tu propuesta
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {selectedItems.map((item) => (
              <div
                key={item.lineId}
                className="border border-border rounded-xl p-4 bg-surface/50 text-sm animate-fade-in"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-text">{item.categoryLabel}</div>
                    <div className="text-text-muted text-xs">{item.planName}</div>
                  </div>
                  <button
                    className="text-text-muted hover:text-accent transition-colors p-1"
                    onClick={() => onRemoveItem(item.lineId)}
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {item.addons?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 text-text-muted">
                    <div className="text-xs font-medium mb-1">Extras:</div>
                    <ul className="space-y-1">
                      {item.addons.map((a) => (
                        <li key={a.id} className="text-xs flex justify-between">
                          <span>
                            {a.label}
                            {typeof a.qty === "number" && a.qty > 0 ? ` x${a.qty}` : ""}
                          </span>
                          <span className="text-text">
                            {a.priceOneTime ? formatUSD(a.priceOneTime) : ""}
                            {a.priceOneTime && a.priceMonthly ? " + " : ""}
                            {a.priceMonthly ? `${formatUSD(a.priceMonthly)}/mes` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-border/50 space-y-1 text-xs">
                  {item.priceOneTime > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Total:</span>
                      <span className="font-semibold text-text">
                        {formatUSD(item.priceOneTime)} USD
                      </span>
                    </div>
                  )}
                  {item.priceMonthly > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Mensual:</span>
                      <span className="font-semibold text-secondary">
                        {formatUSD(item.priceMonthly)}/mes
                      </span>
                    </div>
                  )}
                  {item.adsBudgetMonthly > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Anuncios:</span>
                      <span className="font-semibold text-accent">
                        {formatUSD(item.adsBudgetMonthly)}/mes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totales */}
        <div className="border-t border-border my-6" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Total inicial</span>
            <span className="font-bold text-lg text-text">
              {formatUSD(buffetOneTime)} USD
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Mensual servicios</span>
            <span className="font-bold text-text">
              {formatUSD(buffetMonthly)}/mes
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Inversion anuncios</span>
            <span className="font-bold text-text">
              {formatUSD(buffetAds)}/mes
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-dashed border-border">
            <span className="text-text font-medium">Total mensual global</span>
            <span className="font-bold text-xl text-success">
              {formatUSD(buffetMonthlyGlobal)}/mes
            </span>
          </div>
        </div>

        {/* Botones de accion */}
        <div className="mt-6 space-y-3">
          <a
            href={mailHref}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:shadow-glow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Enviar por Email
          </a>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl font-medium text-sm bg-success/20 text-success border border-success/30 hover:bg-success/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>

            <button
              onClick={handleCopy}
              className={`py-2.5 px-4 rounded-xl font-medium text-sm border transition-all duration-300 flex items-center justify-center gap-2 ${
                copied
                  ? "bg-success/20 text-success border-success/30"
                  : "bg-surface-light text-text-muted border-border hover:border-primary hover:text-primary"
              }`}
            >
              {copied ? (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleGeneratePdf}
            disabled={generatingPdf || selectedItems.length === 0}
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              generatingPdf
                ? "bg-primary/20 text-primary border border-primary/30"
                : selectedItems.length === 0
                ? "bg-surface-light text-text-muted/50 border border-border cursor-not-allowed"
                : "bg-surface-light text-text-muted border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {generatingPdf ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Generando PDF...
              </>
            ) : (
              <>
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Descargar PDF
              </>
            )}
          </button>

          <button
            onClick={() => setShowPdfPreview(!showPdfPreview)}
            className="w-full py-2 px-4 rounded-xl font-medium text-xs text-text-muted hover:text-primary transition-colors"
          >
            {showPdfPreview ? "Ocultar vista previa PDF" : "Ver vista previa PDF"}
          </button>
        </div>

        <p className="text-[10px] text-text-muted mt-4 leading-relaxed">
          *Precios de servicio = honorarios Crisodevelop. La inversion en anuncios
          se paga directamente a Meta / Google.
        </p>
      </aside>

      {/* Hidden PDF Document for generation */}
      <div
        className={`fixed inset-0 z-50 bg-black/80 overflow-auto ${
          showPdfPreview ? "block" : "hidden"
        }`}
        onClick={() => setShowPdfPreview(false)}
      >
        <div
          className="min-h-screen py-8 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Vista Previa del PDF</h3>
              <button
                onClick={() => setShowPdfPreview(false)}
                className="text-white/70 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <PdfDocument
                ref={pdfRef}
                selectedItems={selectedItems}
                buffetOneTime={buffetOneTime}
                buffetMonthly={buffetMonthly}
                buffetAds={buffetAds}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden element for PDF generation */}
      <div className="fixed -left-[9999px] top-0">
        <PdfDocument
          ref={pdfRef}
          selectedItems={selectedItems}
          buffetOneTime={buffetOneTime}
          buffetMonthly={buffetMonthly}
          buffetAds={buffetAds}
        />
      </div>
    </>
  );
}
