"use client"
import { ClientSideSuspense, useOthers, useSelf } from "@liveblocks/react/suspense";
import { Separator } from "@/components/ui/separator";

const AVATAR_SIZE = 36;

export const Avatars = () => {
    return(
        <ClientSideSuspense fallback={null}>
            <AvatarStack/>
        </ClientSideSuspense>
    )
}

const AvatarStack = () => {
    const users = useOthers();
    const currentUsers = useSelf();

    // Add debugging
    console.log("=== AVATAR DEBUG ===");
    console.log("Current user:", currentUsers);
    console.log("Current user info:", currentUsers?.info);
    console.log("Other users:", users);
    console.log("Users length:", users.length);

    if(users.length===0) return null;
    return(
        <>
            <div className="flex items-center">
                {currentUsers && (
                    <div className="relative ml-2">
                        <Avatar src={currentUsers.info.avatar} name="You"/>
                    </div>
                )}
                <div className="flex">
                    {users.map(({ connectionId, info }) => {
                        return(
                            <Avatar key={connectionId} src={info.avatar} name={info.name}/>
                        )
                    })}
                </div>
            </div>
            <Separator orientation="vertical" className="h-6"/>
        </>
    )
}

interface AvatarProps {
    src: string;
    name: string;
}

const Avatar = ({ src, name }: AvatarProps) => {
    return (
        <div 
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            className="group -ml-2 flex shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400"
        >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-black 
            whitespace-nowrap transition-opacity">
                {name}
            </div>
            <img
                alt={name}
                src={src}
                className="size-full rounded-full"
            />
        </div>
    )
}