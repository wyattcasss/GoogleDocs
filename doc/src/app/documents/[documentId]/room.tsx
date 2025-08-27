"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers } from "./action";
import { toast } from "sonner";

type User = { id: string; name: string; avatar: string }

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = useMemo(
    () => async () =>{
        try{
            const list = await getUsers();
            setUsers(list);
        } catch{
            toast.error("failed to fetch users")
        }
    
    },
    [],
  );


  useEffect(()=>{
    fetchUsers();
  },[fetchUsers]);

  
  return (
    <LiveblocksProvider 
        throttle={16}
        authEndpoint= "/api/liveblocks-auth"
        resolveUsers={({ userIds }) => {
            const resolved = userIds.map((userId) => {
                const foundUser = users.find((user) => user.id === userId);
        
        
                return foundUser || {
                    id: userId,
                    name: "Anonymous (not found)",
                    avatar: ""
                };
            });
    
            return resolved;
        }}
        resolveMentionSuggestions={({ text })=>{
            let filteredUsers = users;
            if (text){
                filteredUsers = users.filter((user)=>
                    user.name.toLowerCase().includes(text.toLowerCase())
                );
            }
            return filteredUsers.map((user) => user.id);
        }}
        resolveRoomsInfo={()=> []}
    >
      <RoomProvider id={params.documentId as string} >
        <ClientSideSuspense fallback={<FullscreenLoader label="Room Loading"/>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}