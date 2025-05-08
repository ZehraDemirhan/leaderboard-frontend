import Pusher from 'pusher-js'

Pusher.logToConsole = true;

export const pusher = new Pusher(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
        cluster:           process.env.NEXT_PUBLIC_PUSHER_CLUSTER || '',
        wsHost:            process.env.NEXT_PUBLIC_PUSHER_HOST,
        wsPort:            Number(process.env.NEXT_PUBLIC_PUSHER_PORT),
        wssPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT),
        forceTLS:          true,
        wsPath: process.env.NEXT_PUBLIC_PUSHER_PATH,
        enabledTransports: ['ws','wss'],
        disableStats:      true,

        // 👇 Add these two:
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/broadcast/channel`,
    }
)
