"use client"

import React, { createContext, useContext, useState } from "react"

interface CartSliderContextType {
  isOpen: boolean
  openCartSlider: () => void
  closeCartSlider: () => void
  toggleCartSlider: () => void
}

const CartSliderContext = createContext<CartSliderContextType | undefined>(
  undefined
)

export const CartSliderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const openCartSlider = () => setIsOpen(true)
  const closeCartSlider = () => setIsOpen(false)
  const toggleCartSlider = () => setIsOpen((prev) => !prev)

  return (
    <CartSliderContext.Provider
      value={{ isOpen, openCartSlider, closeCartSlider, toggleCartSlider }}
    >
      {children}
    </CartSliderContext.Provider>
  )
}

export const useCartSlider = () => {
  const context = useContext(CartSliderContext)
  if (context === undefined) {
    throw new Error("useCartSlider must be used within a CartSliderProvider")
  }
  return context
}