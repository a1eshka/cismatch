import React from 'react';
import { CircleUserRound, FileText, Server, BriefcaseBusiness, LogOut } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    handleShowProfile: () => void;
    handleShowPosts: () => void;
    handleShowServers: () => void;
    handleShowOrders: () => void;
    isOwnProfile: boolean;
  }

const Sidebar: React.FC<SidebarProps> = ({ activeTab, handleShowProfile, handleShowPosts, handleShowServers, handleShowOrders, isOwnProfile }) => {
    const getButtonClasses = (tab: string) => 
        `flex items-center space-x-3 p-3 rounded-lg cursor-pointer 
        ${activeTab === tab ? 'bg-gray-700/40 text-white' : 'hover:bg-gray-700/30'}`;

    return (
        isOwnProfile && (
            <aside className="hidden md:block md:w-64 p-6 my-10 md:ml-10 bg-gray-800 rounded-xl space-y-4 top-10 self-start main-block-bg">
                <nav className="flex flex-col space-y-4">
                    <button onClick={handleShowProfile} className={getButtonClasses('profile')}>
                        <CircleUserRound size={20} />
                        <span>Профиль</span>
                    </button>
                    <button onClick={handleShowPosts} className={getButtonClasses('posts')}>
                        <FileText size={20} />
                        <span>Посты</span>
                    </button>
                    <button onClick={handleShowServers} className={getButtonClasses('servers')}>
                        <Server size={20} />
                        <span>Сервера</span>
                    </button>
                    <button onClick={handleShowOrders} className={getButtonClasses('orders')}>
                        <BriefcaseBusiness size={20} />
                        <span>Продажи</span>
                    </button>
                    <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600/20 cursor-pointer text-red-500">
                        <LogOut size={20} />
                        <span>Выйти</span>
                    </button>
                </nav>
            </aside>
        )
    );
};

export default Sidebar;
