"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_tsL3Xv43WcwsNxKwQLgtgdwh3356fWSz_P3FrIKIz3qY8J3vF7O3JZipvyQx7Vhg"}>
      <RoomProvider id={params.documentId as string} >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}