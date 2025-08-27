import {Liveblocks} from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const liveblocks = new Liveblocks ({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!
});

export async function POST(req: Request){
    const { sessionClaims } = await auth();
    
    // Add debugging
    console.log("=== DEBUG AUTH ===");
    console.log("sessionClaims:", sessionClaims);
    
    if(!sessionClaims){
        console.log("No sessionClaims - returning 401");
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
    // Get orgId from sessionClaims.o.id with proper type checking
    const orgId = (sessionClaims as any)?.o?.id;
    const isOrganizationMember = !!(document.organizationId && document.organizationId === orgId);
    
    console.log("document.ownerId:", document.ownerId);
    console.log("user.id:", user.id);
    console.log("isOwner:", isOwner);
    console.log("document.organizationId:", document.organizationId);
    console.log("orgId from sessionClaims:", orgId);
    console.log("isOrganizationMember:", isOrganizationMember);

    if(!isOwner && !isOrganizationMember){
        console.log("Not owner and not org member - returning 401");
        return new Response("Unauthorized", {status: 401});
    }
    
    console.log("Authorization successful!");
    
    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
            name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
            avatar: user.imageUrl,
        },
    })
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new Response(body, { status });
};