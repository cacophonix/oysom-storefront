"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import X from "@modules/common/icons/x"
import Thumbnail from "@modules/products/components/thumbnail"
import { useCartSlider } from "@lib/context/cart-slider-context"
import { useEffect } from "react"

type CartSliderProps = {
  cart?: HttpTypes.StoreCart | null
}

export default function CartSlider({ cart }: CartSliderProps) {
  const { isOpen, closeCartSlider } = useCartSlider()

  const totalItems =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cart?.subtotal ?? 0

  // Lock body scroll when slider is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300"
          onClick={closeCartSlider}
        />
      )}

      {/* Slider */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">
            Shopping Cart ({totalItems})
          </h2>
          <button
            onClick={closeCartSlider}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart && cart.items?.length ? (
            <div className="p-6 space-y-6">
              {cart.items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0"
                    data-testid="cart-item"
                  >
                    <LocalizedClientLink
                      href={`/products/${item.product_handle}`}
                      className="w-24 h-24 flex-shrink-0"
                      onClick={closeCartSlider}
                    >
                      <Thumbnail
                        thumbnail={item.thumbnail}
                        images={item.variant?.product?.images}
                        size="square"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </LocalizedClientLink>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-medium text-base mb-1 truncate">
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            onClick={closeCartSlider}
                            data-testid="product-link"
                          >
                            {item.title}
                          </LocalizedClientLink>
                        </h3>
                        <LineItemOptions
                          variant={item.variant}
                          data-testid="cart-item-variant"
                          data-value={item.variant}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className="text-sm text-gray-600"
                            data-testid="cart-item-quantity"
                            data-value={item.quantity}
                          >
                            Qty: {item.quantity}
                          </span>
                          <LineItemPrice
                            item={item}
                            style="tight"
                            currencyCode={cart.currency_code}
                          />
                        </div>
                      </div>
                      <DeleteButton
                        id={item.id}
                        className="text-sm text-red-600 hover:text-red-800 self-start mt-2"
                        data-testid="cart-item-remove-button"
                      >
                        Remove
                      </DeleteButton>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-center mb-6">
                Add some products to get started
              </p>
              <LocalizedClientLink href="/store" onClick={closeCartSlider}>
                <Button>Explore products</Button>
              </LocalizedClientLink>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items?.length ? (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Subtotal</span>
              <span
                className="font-bold text-xl"
                data-testid="cart-subtotal"
                data-value={subtotal}
              >
                {convertToLocale({
                  amount: subtotal,
                  currency_code: cart.currency_code,
                })}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Taxes and shipping calculated at checkout
            </p>
            <LocalizedClientLink
              href="/checkout"
              onClick={closeCartSlider}
              className="block"
            >
              <Button
                className="w-full"
                size="large"
                data-testid="go-to-checkout-button"
                style={{
                  backgroundColor: '#FFBB55',
                  color: '#000',
                  border: 'none'
                }}
              >
                Checkout
              </Button>
            </LocalizedClientLink>
          </div>
        ) : null}
      </div>
    </>
  )
}