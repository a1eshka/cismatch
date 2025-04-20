import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            })
                .then(response => response.json())
                .then((json) => {

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    
    post: async function(url: string, data: any): Promise<any> {

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`
                    
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    postWithoutToken: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },
    put: async function (url: string, data: any): Promise<any> {
        console.log('put', url, data);

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'PUT',
                body: JSON.stringify(data), // Преобразуем данные в JSON
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);
                    resolve(json);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    postFormData: async function (url: string, data: FormData): Promise<any> {
        const token = await getAccessToken();

        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then((json) => {
                console.log('Response:', json);
                return json;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    },
    putFormData: async function (url: string, data: any): Promise<any> {
        console.log('put', url, data);
    
        const token = await getAccessToken();
    
        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'PUT',
                body: data, // ✅ Передаём `FormData` напрямую
                headers: {
                    'Accept': 'application/json',
                    ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }), // ❗️ Оставляем `Content-Type` пустым для `FormData`
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response:', json);
                    resolve(json);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    delete: async function (url: string): Promise<any> {
        const token = await getAccessToken();
    
        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then((json) => {
                console.log('Response:', json);
                return json;
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
    },
}


export default apiService;