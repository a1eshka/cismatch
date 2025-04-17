'use client';

import { useRouter } from "next/navigation";
import { resetAuthCookies } from "@/app/lib/actions";
import { LogOut, User } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface LogoutButtonProps {
    setIsLoading: (isLoading: boolean) => void;
  }
  
  const LogoutButton: React.FC<LogoutButtonProps> = ({ setIsLoading }) => {
    const router = useRouter();
    const deleteAllCookies = () => {
      const cookies = document.cookie.split(";");
    
      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      });
    };
    const submitLogout = async () => {
      setIsLoading(true); // Начинаем загрузку
      await resetAuthCookies(); // Удаляем cookies
      setIsLoading(false); // Завершаем загрузку
      router.refresh();
      router.push("/");
    };
  
    return (
      <DropdownMenuItem>
        <button onClick={submitLogout} className="w-full flex items-center gap-2 text-gray-400">
          <LogOut size={16} /> Выйти
        </button>
      </DropdownMenuItem>
    );
  };

export default LogoutButton;