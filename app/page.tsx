import AdvertList from "@/components/shared/adverts/AdvertsList";
import { Container } from "@/components/shared/Conatiner";
import DailyGrenades from "@/components/shared/grenades/DailyGrenades";
import MiniNewsList from "@/components/shared/mininews/MiniNewsList";
import PostList from "@/components/shared/PostList";
import ServerList from "@/components/shared/servers/ServerList";
import Social from "@/components/shared/social/Social";


export const metadata = {
  title: 'CISMatch - Платформа поиска игроков и команд, новости CS2, скупка скинов CS2, игровые сервера CS2.',
  description: 'Ищи тиммейтов, вступай в команды и читай свежие новости из мира Counter-Strike 2. Все для CS2 комьюнити в одном месте. Игровые сервера и скупка скинов. Смок и Флешка дня.',
  keywords: 'cs2, поиск игроков cs2, поиск команд, поиск тиммейтов, мониторинг серверов кс, команды cs2, новости cs2, киберспорт cs2, тиммейты, скупка скинов, продать скин, cismatch'
};

export default function Home() {
  return (
    <>
      <Container>
        <MiniNewsList/>
        {/* Основной контейнер */}
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Левая часть (PostList) */}
          <div className="w-full md:w-1/2">
            <PostList />
          </div>

          {/* Правая часть (ServerList и AdvertList) */}
          <div className="w-full md:w-1/2">
            {/* ServerList с отступами */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-10 mb-8">
              <ServerList showLimited={true} />
            </div>
            {/* AdvertList с отступом */}
            <div className="mb-8">
              <AdvertList />
            </div>
            <div className=" mb-8">
              <DailyGrenades/>
            </div>
            <div className="mb-8">
              <Social />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}