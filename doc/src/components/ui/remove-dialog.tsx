"use client"
import{
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RemoveDialogProps{
    documentId: Id<"documents">;
    children: React.ReactNode;
}

export const RemoveDialog = ({
    documentId,
    children,
}: RemoveDialogProps) => {
    const router = useRouter();
    const remove= useMutation(api.documents.removeById);
    const [isRemoving, setIsRemoving] = useState(false);


    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e)=> e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action can't be undone. This will permanently delete your document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e)=> e.stopPropagation()}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        disabled={isRemoving}
                    onClick={(e)=>{
                        e.stopPropagation();
                        setIsRemoving(true);
                        remove({ id: documentId})
                            .then(()=>{
                                router.push("/")
                            })
                            .finally(()=> setIsRemoving(false));

                    }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}