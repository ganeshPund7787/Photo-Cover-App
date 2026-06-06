// export const runtime = 'nodejs'
// export const dynamic = 'force-dynamic'
// import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
// export const GET = handleAuth();
// console.log("This is from route file : ", GET);



export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

// ✅ Wrap in async function — defers handleAuth() to request time
export async function GET(request: Request, context: any) {
    const handler = handleAuth()
    return handler(request, context)
}