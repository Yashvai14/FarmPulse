"use client"

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'

interface MobileMenuProps {
  children: React.ReactNode
}

export default function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-lg">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}