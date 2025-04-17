"use client";

import { useState } from "react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { Button } from "@/components/ui/button";
import { BadgeRussianRuble, BriefcaseBusiness, ChevronDown, CirclePlus, CircleUserRound, FileText, Server, Settings, User, UserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LogoutButton from "../buttons/LogoutButton";
import useAddPostModal from "@/app/hooks/useAddPostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface UserNavProps {
  userId?: string | null;
  name?: string;
  balance?: number | null;
  steam_avatar?: string;
  avatar_url?: string;
}

const UserNav: React.FC<UserNavProps> = ({
  userId,
  name,
  balance,
  steam_avatar,
  avatar_url,
}) => {
  const addPostModal = useAddPostModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={() => {
          if (userId) {
            addPostModal.open();
          } else {
            loginModal.open();
          }
        }}
        className="flex items-center bg-green-500/10 shadow-green-600/20 text-green-500 hover:bg-green-800/20 gap-1"
      >
        <CirclePlus size={16} />Добавить пост
      </Button>

      {isLoading ? (
        // Скелетон для баланса и аватара
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 bg-gray-700" /> {/* Скелетон для баланса */}
          <Skeleton className="h-10 w-10 rounded-full bg-gray-700" /> {/* Скелетон для аватара */}
        </div>
      ) : userId ? (
        <>
          <div className="text-white font-medium">{balance} ₽</div>
          <Avatar>
            <AvatarImage src={steam_avatar || avatar_url || `${process.env.NEXT_PUBLIC_API_HOST}/media/logos/logo.png`} alt={name} />
            <AvatarFallback className="bg-gray-300 text-gray-800"><UserRound /></AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white">
              <DropdownMenuLabel className="border-gray-700">{name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/profile/${userId}`} className="text-gray-400">
                <DropdownMenuItem className="cursor-pointer"><CircleUserRound size={16}/>Мой профиль</DropdownMenuItem>
              </Link>
              <Link href={`/profile/${userId}?tab=posts`} className="text-gray-400">
                <DropdownMenuItem className="cursor-pointer"><FileText size={16}/>Посты</DropdownMenuItem>
              </Link>
              <Link href={`/profile/${userId}?tab=servers`} className="text-gray-400">
                <DropdownMenuItem className="cursor-pointer"><Server size={16}/>Сервера</DropdownMenuItem>
              </Link>
              <Link href={`/profile/${userId}?tab=orders`} className="text-gray-400">
                <DropdownMenuItem className="cursor-pointer"><BriefcaseBusiness size={16}/>Продажи</DropdownMenuItem>
              </Link>
              <Link href={`/profile/${userId}#edit-profile`} className="text-gray-400">
                <DropdownMenuItem className="cursor-pointer"><Settings size={16}/>Настройки</DropdownMenuItem>
              </Link>
              <LogoutButton setIsLoading={setIsLoading} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button
          onClick={() => loginModal.open()}
          className="flex items-center gap-1 bg-green-500/10 shadow-green-600/20 text-green-500 hover:bg-green-800/20"
        >
          <User size={16} /> Войти
        </Button>
      )}
    </div>
  );
};

export default UserNav;