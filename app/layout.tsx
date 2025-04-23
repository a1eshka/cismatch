import type { Metadata } from "next";
import "./globals.css";
import LoginModal from "@/components/shared/modals/LoginModal";
import SignUpModal from "@/components/shared/modals/SignUpModal";
import AddPostModal from "@/components/shared/modals/AddPostModal";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Montserrat, Roboto } from 'next/font/google'
import HeaderWrapper from "@/components/shared/navigation/HeaderWrapper";
import CookieConsent from "@/components/shared/CookieConsent";
import Footer from "@/components/shared/navigation/Footer";
 
const montserrat = Montserrat({
  weight: ['300','400','500','600','700'], // Вы можете добавить другие веса, если нужно
  subsets: ['latin'],
  display: 'swap', // Ускоряет отображение текста
});

export const metadata: Metadata = {
  title: "CISMatch",
  description: "Поиск тиммейтов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ru">
      <body
        className={montserrat.className}
      >

        <HeaderWrapper />
        <ToastContainer 
        autoClose={2000}
        theme="dark"/>
        {children}
        <CookieConsent />
        <LoginModal/>
        <SignUpModal/>
        <AddPostModal/>
        <Footer/>
      </body>

    </html>
  );
}
