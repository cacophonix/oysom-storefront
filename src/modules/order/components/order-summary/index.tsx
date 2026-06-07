import { convertToLocale } from "@lib/util/money"
import { toBengaliNumerals } from "@lib/util/bengali-numerals"
import { calculateWeightCharge, getTotalWeight, getChargeableWeightKG } from "@lib/util/calculate-weight-charge"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  // Calculate weight delivery charge
  const weightCharge = order.items ? calculateWeightCharge(order.items) : 0
  const totalWeightGrams = order.items ? getTotalWeight(order.items) : 0
  const chargeableWeightKG = order.items ? getChargeableWeightKG(order.items) : 0

  // Calculate total including weight charge
  const totalWithWeightCharge = (order.total ?? 0) + weightCharge

  return (
    <div>
      <h2 className="text-base-semi">Order Summary</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>সর্বমোট</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>ডেলিভারি খরচ</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          {weightCharge > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex gap-x-1 items-center">
                ওজনের জন্যে এক্সট্রা খরচ ({toBengaliNumerals((totalWeightGrams / 1000).toFixed(2))} কেজি)
                <span className="text-ui-fg-muted text-xs">
                  ({toBengaliNumerals(chargeableWeightKG)} কেজি × ২০ ৳)
                </span>
              </span>
              <span>{getAmount(weightCharge)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Taxes</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>সর্বমোট</span>
          <span>{getAmount(totalWithWeightCharge)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
