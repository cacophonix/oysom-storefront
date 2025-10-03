"use client"

import ReactCountryFlag from "react-country-flag"
import { StateType } from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  // Always show Bangladesh since we only support Bangladesh
  return (
    <div>
      <div className="py-1 w-full">
        <div className="txt-compact-small flex items-start gap-x-2">
          <span>Shipping to:</span>
          <span className="txt-compact-small flex items-center gap-x-2">
            <ReactCountryFlag
              svg
              style={{
                width: "16px",
                height: "16px",
              }}
              countryCode="bd"
            />
            Bangladesh
          </span>
        </div>
      </div>
    </div>
  )
}

export default CountrySelect
