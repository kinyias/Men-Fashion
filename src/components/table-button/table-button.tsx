"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- UI Primitives ---
import { Button, ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu"

/**
 * Props for the TableButton component.
 */
export interface TableButtonProps extends ButtonProps {
  /**
   * The TipTap editor instance.
   */
  editor?: Editor | null
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
}

/**
 * Button component for inserting tables in a TipTap editor.
 */
export const TableButton = React.forwardRef<HTMLButtonElement, TableButtonProps>(
  (
    {
      editor: providedEditor,
      text,
      className = "",
      disabled,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const editor = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = React.useState(false)
    const [rows, setRows] = React.useState(3)
    const [cols, setCols] = React.useState(3)

    const handleInsertTable = React.useCallback(() => {
      if (!editor) return
      
      editor
        .chain()
        .focus()
        .insertTable({ rows, cols, withHeaderRow: true })
        .run()
      
      setIsOpen(false)
    }, [editor, rows, cols])

    if (!editor || !editor.isEditable) {
      return null
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            type="button"
            className={className.trim()}
            disabled={disabled}
            data-style="ghost"
            data-disabled={disabled}
            role="button"
            tabIndex={-1}
            aria-label="Insert Table"
            tooltip="Insert Table"
            onClick={onClick}
            {...buttonProps}
          >
            {children || (
              <>
                <svg 
                  className="tiptap-button-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
                {text && <span className="tiptap-button-text">{text}</span>}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="p-2">
            <div className="mb-2 text-sm font-medium">Insert Table</div>
            <div className="flex gap-2 mb-2">
              <div>
                <label className="block text-xs mb-1">Rows</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Columns</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>
            <button 
              onClick={handleInsertTable}
              className="w-full px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Insert
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

TableButton.displayName = "TableButton"