import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";

export const metadata = {
  title: "Cotizador Web | Crisodevelop",
  description: "Cotizador profesional de servicios web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-text antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
