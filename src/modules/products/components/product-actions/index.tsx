"use client"

import { addToCart } from "@lib/data/cart"
import { useCartSlider } from "@lib/context/cart-slider-context"
import { useProduct } from "@lib/context/product-context"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { toBengaliNumerals } from "@lib/util/bengali-numerals"
import { isEqual } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { openCartSlider } = useCartSlider()
  const { setSelectedVariant } = useProduct()

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Update context when selected variant changes
  useEffect(() => {
    setSelectedVariant(selectedVariant)
  }, [selectedVariant, setSelectedVariant])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  // Get max quantity available
  const maxQuantity = useMemo(() => {
    if (!selectedVariant) return 1
    
    // If we don't manage inventory or allow backorders, no limit
    if (!selectedVariant.manage_inventory || selectedVariant.allow_backorder) {
      return 99
    }

    // Otherwise, limit to inventory quantity
    return Math.max(selectedVariant.inventory_quantity || 1, 1)
  }, [selectedVariant])

  // Adjust quantity if it exceeds max when variant changes
  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity)
    }
  }, [maxQuantity, quantity])

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity))
    setQuantity(validQuantity)
  }

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode: "bd",
    })

    setIsAdding(false)
    
    // Don't open cart slider for regular "Add to cart"
    // Cart slider only opens for "Quick buy" button
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        {/* Quantity Selector */}
        <div className="flex flex-col gap-y-2">
          <label className="text-sm font-medium text-ui-fg-base">Quantity</label>
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isAdding || !selectedVariant}
              className="w-10 h-10 flex items-center justify-center border border-ui-border-base rounded-md hover:bg-ui-bg-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="text-lg">−</span>
            </button>
            <div className="w-20 h-10 flex items-center justify-center border border-ui-border-base rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="text-base font-medium">{toBengaliNumerals(quantity)}</span>
            </div>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity || isAdding || !selectedVariant}
              className="w-10 h-10 flex items-center justify-center border border-ui-border-base rounded-md hover:bg-ui-bg-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <span className="text-lg">+</span>
            </button>
            {selectedVariant?.manage_inventory && !selectedVariant?.allow_backorder && (
              <span className="text-sm text-ui-fg-subtle ml-2">
                {toBengaliNumerals(maxQuantity)} available
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
          style={
            !inStock || !selectedVariant || !!disabled || !isValidVariant
              ? undefined
              : {
                  backgroundColor: '#FFBB55',
                  color: '#000',
                  border: 'none'
                }
          }
        >
          {!selectedVariant && !options
            ? "Select variant"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
          quantity={quantity}
          maxQuantity={maxQuantity}
          onQuantityChange={handleQuantityChange}
        />
      </div>
    </>
  )
}
