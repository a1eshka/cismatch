// /pages/api/auth/login/steam.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        // Redirect the user to Steam for authentication
        const steamAuthUrl = 'https://steamcommunity.com/openid/login'; // The Steam OpenID login URL
        const redirectUri = `${process.env.BASE_URL}/steam-login-callback`; // Define your callback URL

        // Create the URL for the Steam login redirect
        const steamLoginUrl = `${steamAuthUrl}?openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.mode=checkid_setup&openid.return_to=${encodeURIComponent(redirectUri)}`;

        return res.redirect(steamLoginUrl);
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
