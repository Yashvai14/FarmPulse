"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function DropdownMenu({ trigger, children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:font-bold hover:text-gray-800 text-gray-600 transition-all duration-300"
      >
        {trigger}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
}

export function DropdownMenuItem({ children, onClick, href, className }: DropdownMenuItemProps) {
  const content = (
    <div
      className={cn(
        "px-4 py-2 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-600 cursor-pointer transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}