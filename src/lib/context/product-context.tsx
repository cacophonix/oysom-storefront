"use client"

import { HttpTypes } from "@medusajs/types"
import { createContext, useContext, useState, ReactNode } from "react"

type ProductContextType = {
  selectedVariant: HttpTypes.StoreProductVariant | undefined
  setSelectedVariant: (variant: HttpTypes.StoreProductVariant | undefined) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>()

  return (
    <ProductContext.Provider value={{ selectedVariant, setSelectedVariant }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
}