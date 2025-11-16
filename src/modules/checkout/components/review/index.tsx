"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const Review = ({ cart }: { cart: any }) => {
  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  const missingFields = []
  if (!cart.shipping_address?.first_name) missingFields.push("Name")
  if (!cart.shipping_address?.address_1) missingFields.push("Address")
  
  // Check if police station is included in the address
  const hasPoliceStation = cart.shipping_address?.address_1?.includes("Police Station:")
  if (!hasPoliceStation) missingFields.push("Police Station")
  
  if (!cart.shipping_address?.city) missingFields.push("District")
  if (!cart.shipping_address?.phone) missingFields.push("Phone (Required)")
  if (!cart.shipping_methods || cart.shipping_methods.length === 0) missingFields.push("Shipping method")

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          অর্ডার কনফার্ম করুন
        </Heading>
      </div>
      <div className="flex items-start gap-x-1 w-full mb-6">
        <div className="w-full">
          {missingFields.length > 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <Text className="txt-medium-plus text-yellow-800 mb-2 font-semibold">
                Please complete the following required fields before placing your order:
              </Text>
              <ul className="list-disc list-inside">
                {missingFields.map((field) => (
                  <li key={field} className="txt-medium text-yellow-700">
                    {field}
                  </li>
                ))}
              </ul>
              <Text className="txt-small text-yellow-700 mt-2">
                Your address will be saved automatically when you click "Place Order"
              </Text>
            </div>
          ) : (
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              By clicking the Place Order button, you confirm that you have
              read, understand and accept our Terms of Use, Terms of Sale and
              Returns Policy and acknowledge that you have read ঐতিহ্যের সম্ভার&apos;s Privacy Policy.
            </Text>
          )}
        </div>
      </div>
      <PaymentButton cart={cart} data-testid="submit-order-button" />
    </div>
  )
}

export default Review
