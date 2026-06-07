"use client"

import { convertToLocale } from "@lib/util/money"
import { toBengaliNumerals } from "@lib/util/bengali-numerals"
import { calculateWeightCharge, getTotalWeight, getChargeableWeightKG } from "@lib/util/calculate-weight-charge"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
    items?: Array<{
      quantity: number
      product?: { weight?: number | null } | null
      variant?: { product?: { weight?: number | null } | null } | null
    }>
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
    items,
  } = totals

  // Calculate weight delivery charge
  const weightCharge = items ? calculateWeightCharge(items) : 0
  const totalWeightGrams = items ? getTotalWeight(items) : 0
  const chargeableWeightKG = items ? getChargeableWeightKG(items) : 0

  // Calculate total including weight charge
  const totalWithWeightCharge = (total ?? 0) + weightCharge

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>সর্বমোট (শিপিং এবং ট্যাক্স ছাড়া)</span>
          <span data-testid="cart-subtotal" data-value={item_subtotal || 0}>
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>ডেলিভারি খরচ</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        {weightCharge > 0 && (
          <div className="flex items-center justify-between">
            <span className="flex gap-x-1 items-center">
              ওজনের জন্যে এক্সট্রা খরচ ({toBengaliNumerals((totalWeightGrams / 1000).toFixed(2))} কেজি)
              <span className="text-ui-fg-muted text-xs">
                ({toBengaliNumerals(chargeableWeightKG)} কেজি × ২০ ৳)
              </span>
            </span>
            <span data-testid="cart-weight-charge" data-value={weightCharge}>
              {convertToLocale({ amount: weightCharge, currency_code })}
            </span>
          </div>
        )}
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      <div className="h-px w-full border-b border-gray-200 my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>সর্বমোট</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={totalWithWeightCharge}
        >
          {convertToLocale({ amount: totalWithWeightCharge, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-gray-200 mt-4" />
    </div>
  )
}

export default CartTotals
