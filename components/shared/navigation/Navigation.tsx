'use client'; // Помечаем как клиентский компонент

import { cn } from "@/lib/utils";
import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/shared/Conatiner";
import { House, Server, Swords, Users, UserSearch, Menu, X, Crown } from "lucide-react";
import UserNav from "./UserNav";
interface NavLinkProps {
    href: string;
    icon: React.ElementType;
    children: ReactNode;
  }
interface HeaderProps {
    userId: string | null;
    userData: {
        name: string;
        balance: number;
        steam_avatar: string;
        avatar_url: string;
    } | null;
}

// Компонент для навигационных ссылок
const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 font-extrabold text-gray-300 hover:text-green-400 transition-colors duration-200 relative",
                isActive && "text-green-400"
            )}
        >
            <Icon size={18} className={cn("transition-colors duration-200", isActive ? "text-green-400" : "text-gray-400")} />
            <span>{children}</span>
            {isActive && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-green-500 rounded-full"></span>
            )}
        </Link>
    );
};

const Header = ({ userId, userData }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для управления меню

    // Закрываем меню при изменении размера экрана
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header className="bg-gray-950/90 backdrop-blur-sm shadow-lg rounded-xl">
            <Container className="flex items-center justify-between py-4 px-4 md:px-0">
                {/* Левая часть */}
                <div className="flex items-center gap-4">
                    <img
                        className="w-10 h-10"
                        src={`${process.env.NEXT_PUBLIC_API_HOST}/media/logos/logo.png`}
                        alt="CISMATCH Logo"
                    />

                </div>

                {/* Центральная часть (навигация) */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink href="/" icon={House}>
                        ГЛАВНАЯ
                    </NavLink>
                    {/*<NavLink href="/streamers" icon={Users}>
                        СТРИМЕРЫ
                    </NavLink>*/}
                    <NavLink href="/raffles" icon={Crown}>
                        РАЗДАЧИ
                    </NavLink>
                    <NavLink href="/buying" icon={Swords}>
                        СКУПКА
                    </NavLink>
                    <NavLink href="/servers" icon={Server}>
                        СЕРВЕРА
                    </NavLink>
                </nav>

                {/* Правая часть (юзер меню) */}
                <div className="hidden md:block">
                    {userData ? (
                        <UserNav
                            userId={userId}
                            name={userData.name}
                            balance={userData.balance}
                            steam_avatar={userData.steam_avatar}
                            avatar_url={userData.avatar_url}
                        />
                    ) : (
                        <UserNav userId={null} />
                    )}
                </div>

                {/* Кнопка бургера для мобильных устройств */}
                <button
                    className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </Container>

            {/* Мобильное меню */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800/95 backdrop-blur-sm">
                    <Container className="flex flex-col gap-4 py-4 px-4 md:px-0">
                        <NavLink href="/" icon={House}>
                            ГЛАВНАЯ
                        </NavLink>
                        <NavLink href="/raffles" icon={UserSearch}>
                            РАЗДАЧИ
                        </NavLink>
                        <NavLink href="/buying" icon={Swords}>
                        СКУПКА
                        </NavLink>
                        <NavLink href="/servers" icon={Server}>
                            СЕРВЕРА
                        </NavLink>

                        {/* Юзер меню для мобильных устройств */}
                        <div className="mt-4">
                            {userData ? (
                                <UserNav
                                    userId={userId}
                                    name={userData.name}
                                    balance={userData.balance}
                                    steam_avatar={userData.steam_avatar}
                                    avatar_url={userData.avatar_url}
                                />
                            ) : (
                                <UserNav userId={null} />
                            )}
                        </div>
                    </Container>
                </div>
            )}
        </header>
    );
};

export default Header;