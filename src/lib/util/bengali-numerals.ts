// Convert English numerals to Bengali numerals
export const toBengaliNumerals = (text: string | number): string => {
  const bengaliNumerals: { [key: string]: string } = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯'
  }

  return String(text).replace(/[0-9]/g, (digit) => bengaliNumerals[digit] || digit)
}