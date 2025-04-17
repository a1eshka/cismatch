'use server';

import { cookies } from 'next/headers';

export async function handleRefresh() {

    const refreshToken = await getRefreshToken();

    const token = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/token/refresh/`, {
        method: 'POST',
        body: JSON.stringify({
            refresh: refreshToken
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }) 
        .then(response => response.json())
        .then((json) => {
            
            if (json.access) {
                cookies().set('session_access_token', json.access, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60* 60, //60 min
                    path: '/'
                });
            
                return json.access;
            } else {
                resetAuthCookies();
            }
        })
        .catch((error) => {

            resetAuthCookies();
        })

    return token;
}

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
    const cookieStore = cookies(); // Используйте cookies() асинхронно

    cookieStore.set('session_userid', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // one week
      path: '/',
    });
  
    cookieStore.set('session_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 60 minutes
      path: '/',
    });
  
    cookieStore.set('session_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // one week
      path: '/',
    });
  }

  export async function resetAuthCookies() {
    const cookieStore = cookies();

    cookieStore.set('session_userid', '', {
        expires: new Date(0), // Устанавливаем срок действия в прошлом
        path: '/' // Убедитесь, что куки действуют для всего сайта
    });

    cookieStore.set('session_access_token', '', {
        expires: new Date(0),
        path: '/'
    });

    cookieStore.set('session_refresh_token', '', {
        expires: new Date(0),
        path: '/'
    });
    
  // Удаление Django-куков
    cookieStore.set("csrftoken", '', {
            expires: new Date(0),
            path: '/'
        });
    cookieStore.set("sessionid", '', {
            expires: new Date(0),
            path: '/'
        });
}



//Get data

export async function getUserId() {
    const userId = (await cookies()).get('session_userid')?.value

    return userId ? userId : null
}

export async function getAccessToken() {
    let accessToken = cookies().get('session_access_token')?.value;

    if (!accessToken) {
        accessToken = await handleRefresh();
    }

    return accessToken;
}

export async function getRefreshToken() {
    let refreshToken = cookies().get('session_refresh_token')?.value;
    return refreshToken;
}

export async function getUserData(userId: string | null) {
    if (!userId) {
        return null;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/auth/user/${userId}/`);
        const data = await response.json();

        if (data && data.data) {
            return data.data; // Это возвращает объект с данными пользователя
        } else {
            console.error('Ошибка получения данных пользователя');
            return null;
        }
    } catch (error) {
        console.error('Ошибка запроса:', error);
        return null;
    }
}