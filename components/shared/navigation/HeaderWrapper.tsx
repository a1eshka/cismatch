import { getUserId, getUserData } from "@/app/lib/actions";
import Header from "./Navigation";


export default async function HeaderWrapper() {
    const userId = await getUserId();
    let userData = null;
    if (userId) {
        userData = await getUserData(userId);
    }

    return <Header userId={userId} userData={userData} />;
}