import { isEmpty } from "./isEmpty"
import { toBengaliNumerals } from "./bengali-numerals"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return toBengaliNumerals(amount.toString())
  }

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)

  // Replace BDT with ৳ symbol for Bangladeshi Taka
  const withCurrencySymbol = formatted.replace(/BDT\s*/g, "৳")
  
  // Convert all numerals to Bengali
  return toBengaliNumerals(withCurrencySymbol)
}
