    'use client';

    import React, { useState, useRef, useEffect } from 'react';
    import { Editor } from '@tiptap/react';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';
    import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';
    import { Sparkles, Loader2, ArrowUpDown, MessageSquarePlus, Smile } from 'lucide-react';
    import { AICommand, processTextWithGeminiStream } from '@/lib/gemini';
    // import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

    interface AICommandsMenuProps {
    editor: Editor | null;
    className?: string;
    }

    export default function AICommandsMenu({ editor, className }: AICommandsMenuProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [hasSelection, setHasSelection] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    // Check if there's a text selection whenever the editor state changes
    useEffect(() => {
        if (!editor) return;
        
        const updateSelection = () => {
        const { state } = editor;
        const { selection } = state;
        const hasText = !selection.empty;
        setHasSelection(hasText);
        };

        editor.on('selectionUpdate', updateSelection);
        editor.on('transaction', updateSelection);
        
        // Initial check
        updateSelection();
        
        return () => {
        editor.off('selectionUpdate', updateSelection);
        editor.off('transaction', updateSelection);
        };
    }, [editor]);

    const handleAICommand = async (command: AICommand) => {
        if (!editor) return;
      
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');
        
        if (!selectedText.trim()) return;
      
        setIsProcessing(true);
        setIsDropdownOpen(false);
        
        try {
          abortControllerRef.current = new AbortController();
          
          const { stream, error } = await processTextWithGeminiStream(selectedText, command);
          
          if (error) {
            console.error(error);
            return;
          }
      
          // Delete the original selection first
          editor.chain().focus().deleteRange({ from, to }).run();
      
          // Initialize position tracking
          let insertPosition = from;
          let fullResponse = '';
      
          for await (const chunk of stream) {
            if (abortControllerRef.current?.signal.aborted) break;
      
            // Calculate only the new text in this chunk
            const newText = chunk.slice(fullResponse.length);
            fullResponse = chunk;
      
            if (newText && command !== AICommand.MakeSEO) {
              // Ensure position is within bounds
              const docSize = editor.state.doc.content.size;
              console.log(newText);
              insertPosition = Math.min(insertPosition, docSize);
    //             const cleanNewText = newText.replace(/\n\s*\n/g, '\n')      // Clean remaining double newlines
    //             .replace(/(\S)\n(\S)/g, '$1 $2') // Fix broken words across lines
    //             .replace(/\n\s*/g, ' ')      // Replace all newlines and following whitespace with a single space
    // .replace(/>\s+</g, '><')     // Remove whitespace between HTML tags
    // .trim();
    // console.log(cleanNewText);
              // Insert the new content
              editor
                .chain()
                .focus()
                .insertContentAt(insertPosition, newText)
                .run();
      
              // Update position for next chunk
              insertPosition += newText.length;
      
              // Small delay to allow editor state to update
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          }
          
          if (fullResponse && command === AICommand.MakeSEO) {
            console.log(fullResponse.length);
            const finalCleanResponse = fullResponse
              .replace(/\n\s*\n/g, '\n')      // Clean remaining double newlines
              .replace(/(\S)\n(\S)/g, '$1 $2') // Fix broken words across lines
              .replace(/\n\s*/g, ' ')      // Replace all newlines and following whitespace with a single space
  .replace(/>\s+</g, '><')     // Remove whitespace between HTML tags
  .trim();
            console.log("from", from, "to", to, "finalCleanResponse", finalCleanResponse);
            editor
            .chain()
            .focus()
            .insertContentAt(from, finalCleanResponse)
            .run();
             
          }
        } catch (error) {
          console.error('Error processing text with Gemini:', 
            error instanceof Error ? error.message : error);
        } finally {
          setIsProcessing(false);
          abortControllerRef.current = null;
        }
      };

    if (!editor) {
        return null;
    }

    const commandOptions = [
        { 
        command: AICommand.ImproveWriting, 
        icon: <Sparkles className="h-4 w-4 mr-2" />,
        description: "Cải thiện chất lượng và độ rõ ràng của văn bản"
        },
        { 
        command: AICommand.Emojify, 
        icon: <Smile className="h-4 w-4 mr-2" />,
        description: "Thêm emoji phù hợp vào văn bản"
        },
        { 
        command: AICommand.MakeShorter, 
        icon: <ArrowUpDown className="h-4 w-4 mr-2 rotate-180" />,
        description: "Rút gọn văn bản mà vẫn giữ nguyên ý nghĩa"
        },
        { 
        command: AICommand.MakeLonger, 
        icon: <MessageSquarePlus className="h-4 w-4 mr-2" />,
        description: "Mở rộng văn bản với chi tiết bổ sung"
        },
        { 
        command: AICommand.MakeSEO, 
        icon: <MessageSquarePlus className="h-4 w-4 mr-2" />,
        description: "Viet bài chuẩn SEO cho website"
        },
    ];
    
    return (
        <div className={cn('relative', className)}>
        {/* <Tooltip> */}
            {/* <TooltipTrigger asChild> */}
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                <Button
                    ref={buttonRef}
                    variant="outline"
                    size="sm"
                    className={cn(
                    'gap-1.5 bg-background',
                    hasSelection ? 'opacity-100' : 'opacity-60 cursor-not-allowed',
                    isProcessing && 'pointer-events-none'
                    )}
                    disabled={!hasSelection || isProcessing}
                    aria-label="AI Commands"
                >
                    {isProcessing ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        <span className="text-xs font-medium">Đang tải...</span>
                    </>
                    ) : (
                    <>
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-medium">AI</span>
                    </>
                    )}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                align="end"
                className="w-56 animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                >
                {commandOptions.map((option) => (
                    <DropdownMenuItem
                    key={option.command}
                    className="cursor-pointer flex items-center py-1.5 px-2 text-sm rounded-sm hover:bg-muted focus:bg-muted group transition-colors"
                    onClick={() => handleAICommand(option.command)}
                    >
                    {option.icon}
                    <div className="flex flex-col">
                        <span className="font-medium">{option.command}</span>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {option.description}
                        </span>
                    </div>
                    </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {/* </TooltipTrigger> */}
            {/* <TooltipContent side="bottom">
            <p className="text-xs">Select text to enable AI commands</p>
            </TooltipContent>
        </Tooltip> */}
        </div>
    );
    }