import ServerList from "@/components/shared/servers/ServerList";
import ThirdPartyServerList from "@/components/shared/servers/ThirdPartyServersList";


export const metadata = {
  title: 'CISMatch - Игровые сервера для тренировки CS2. Мониторинг серверов.',
  description: 'Играй на лучших серверах CS2 для тренировок, 1v1, retake и DM. Добавляй свои сервера в мониторинг и находи игроков. Мониторинг серверов CS2',
  keywords: 'сервера CS2, тренировки CS2, мониторинг серверов CS2, 1v1 CS2, retake сервера, DM сервера, приватные сервера CS2, игровые сервера cs2'
};

export default function Servers() {
  return (
    <>
      <div className="mx-auto max-w-[1280px] mt-8 text-lg font-semibold underline text-white decoration-green-600">Наши сервера:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-[1280px] my-10">
        <ServerList showLimited={false} />
      </div>
      <div className="mx-auto max-w-[1280px] my-10">
        <ThirdPartyServerList />
      </div>
    </>
  );
}