"use client"

import { useCartSlider } from "@lib/context/cart-slider-context"
import { HttpTypes } from "@medusajs/types"
import ShoppingCart from "@modules/common/icons/shopping-cart"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const { openCartSlider } = useCartSlider()

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  return (
    <button
      className="h-full hover:text-ui-fg-base flex items-center gap-2"
      onClick={openCartSlider}
      data-testid="nav-cart-link"
    >
      <ShoppingCart size="20" />
      <span className="text-sm">Cart ({totalItems})</span>
    </button>
  )
}

export default CartDropdown
