import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata = {
  title: "Campus Check",
  description: "Manage attendance efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

