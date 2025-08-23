"use client"
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/use-editor-store';
import { useEditor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, ListTodoIcon, LucideIcon, MessageSquare, MessageSquarePlusIcon, PrinterIcon, Redo2Icon, RemoveFormatting, RemoveFormattingIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
interface ToolbarButtonProps{
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}
const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
}: ToolbarButtonProps)=>{
    return(
        <button 
            onClick={onClick}
            className={cn(
                "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                isActive && "bg-neutral-200/80"
            )}
        >
            <Icon className = "size-4"/>
        </button>
    )
}
export const Toolbar = () =>{
    const { editor } = useEditorStore();
    const sections: { 
        label: string; 
        icon: LucideIcon; 
        onClick: () => void;
        isActive?: boolean;
    }[][]= [
        [
            {
                label: "Undo",
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run(),
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run(),
            },
            {
                label: "Print",
                icon: PrinterIcon,
                onClick: () => window.print(),
            },
             {
                label: "Spell Check",
                icon: SpellCheckIcon,
                onClick: () => {
                    const current = editor?.view.dom.getAttribute("spellcheck");
                    editor?.view.dom.setAttribute("spellcheck",current === "false" ? "true" : "false")
                },
            }
          
        ],
        [
            {
                label: "Bold",
                icon: BoldIcon,
                isActive: editor?.isActive("bold"),
                onClick: () => editor?.chain().focus().toggleBold().run(),
            },
            {
                label: "Italic",
                icon: ItalicIcon,
                isActive: editor?.isActive("italic"),
                onClick: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
                label: "Underline",
                icon: UnderlineIcon,
                isActive: editor?.isActive("underline"),
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
            },
        ],
        [
            {
                label: "Comment",
                icon: MessageSquarePlusIcon,
                onClick: () => console.log("ToDO: comemnt"),
                isActive: false,
            },
            {
                label: "List Todo",
                icon: ListTodoIcon,
                onClick: () => editor?.chain().focus().toggleTaskList().run(),
                isActive: editor?.isActive("taskList")
            },
            {
                label: "Remove Formatting",
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
            }
        ]
    ];
    return(
        <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5
        overflow-x-auto">{sections[0].map((item)=>(
            <ToolbarButton key={item.label} {...item}/>))}
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            {}
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            {}
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            {}
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            {sections[1].map((item)=>(
                <ToolbarButton key={item.label} {...item}/>
            ))}
            {}
            {}
            <Separator orientation="vertical" className="h-6 bg-neutral-300"/>
            {}
            {}
            {}
            {}
            {}
            {sections[2].map((item)=>(
                <ToolbarButton key={item.label} {...item}/>
            ))}
        </div>
    )
}