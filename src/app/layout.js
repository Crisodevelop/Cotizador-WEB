import "./globals.css";

export const metadata = {
  title: "Cotizador Web",
  description: "Cotizador profesional con Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
