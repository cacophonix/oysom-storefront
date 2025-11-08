"use client"

import { useState } from "react"
import { addToCart } from "@lib/data/cart"
import { useCartSlider } from "@lib/context/cart-slider-context"
import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"

export default function QuickBuyButton({
  variantId,
  countryCode,
}: {
  variantId: string
  countryCode: string
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { openCartSlider } = useCartSlider()

  const handleQuickBuy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isAdding) return

    setIsAdding(true)
    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode,
      })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
      
      // Open cart slider after quick buy
      openCartSlider()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex justify-center mt-2">
      <Button
        onClick={handleQuickBuy}
        disabled={isAdding || showSuccess}
        className="px-6"
        size="small"
        style={{
          backgroundColor: '#FFBB55',
          color: '#000',
          border: 'none',
          minWidth: '120px'
        }}
      >
      {isAdding ? (
        <span className="flex items-center gap-2">
          <Spinner />
          Adding...
        </span>
      ) : showSuccess ? (
        "Added to Cart!"
      ) : (
        "Quick Buy"
      )}
      </Button>
    </div>
  )
}