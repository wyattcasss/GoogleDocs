import {Liveblocks} from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks ({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!
});

export async function POST(req: Request){
    const { userId, orgId } = await auth();
    
    // Add debugging
    console.log("=== DEBUG AUTH ===");
    console.log("userId:", userId);
    console.log("orgId:", orgId);
    
    if(!userId){
        console.log("No userId - returning 401");
        return new Response("Unauthorized", {status: 401});
    }
    
    const user = await currentUser();
    if(!user){
        console.log("No user - returning 401");
        return new Response("Unauthorized", {status: 401});
    }
    
    const { room } = await req.json();
    console.log("room:", room);
    
    const document = await convex.query(api.documents.getById, { id: room })
    console.log("document:", document);
    
    if(!document){
        console.log("No document - returning 401");
        return new Response("Unauthorized", {status: 401});
    }

    const isOwner = document.ownerId === user.id;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === orgId);
    
    console.log("document.ownerId:", document.ownerId);
    console.log("user.id:", user.id);
    console.log("isOwner:", isOwner);
    console.log("document.organizationId:", document.organizationId);
    console.log("orgId:", orgId);
    console.log("isOrganizationMember:", isOrganizationMember);

    if(!isOwner && !isOrganizationMember){
        console.log("Not owner and not org member - returning 401");
        return new Response("Unauthorized", {status: 401});
    }
    
    const name  = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous"
    const nameToNumber = name.split("").reduce((acc,char)=> acc+ char.charCodeAt(0),0)
    const hue = Math.abs(nameToNumber) % 360;
    const color = `hsl(${hue}, 80%, 60%)`;

    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
            name,
            avatar: user.imageUrl,
            color,
        },
    })
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new Response(body, { status });
};