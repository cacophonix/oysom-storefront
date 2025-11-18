import { HttpTypes } from "@medusajs/types"

/**
 * Calculates the weight-based delivery charge for cart items
 * Formula: Math.ceil((totalWeight - 1000g) / 1000) × 20 BDT
 * First 1 KG is free, then 20 taka per additional KG (or fraction thereof)
 * 
 * @param items - Array of cart or order items with product information
 * @returns Weight delivery charge in the smallest currency unit (e.g., paisa for BDT)
 */
export function calculateWeightCharge(
  items: Array<{
    quantity: number
    product?: { weight?: number | null } | null
    variant?: { weight?: number | null; product?: { weight?: number | null } | null } | null
  }>
): number {
  // Calculate total weight in grams
  const totalWeightGrams = items.reduce((total, item) => {
    // Priority: 1. variant.weight, 2. product.weight, 3. variant.product.weight
    const weight = item.variant?.weight ?? item.product?.weight ?? item.variant?.product?.weight ?? 0
    return total + (item.quantity * weight)
  }, 0)

  // If total weight is 1kg or less, no charge
  if (totalWeightGrams <= 1000) {
    return 0
  }

  // Calculate extra weight beyond 1kg (ensure non-negative)
  const extraWeightGrams = Math.max(0, totalWeightGrams - 1000)
  
  // Round up to nearest kg
  const extraWeightKG = Math.ceil(extraWeightGrams / 1000)
  
  // Calculate charge: 20 taka per kg
  // Return in Taka (same unit as other cart totals from Medusa)
  const chargeInTaka = extraWeightKG * 20
  
  return chargeInTaka
}

/**
 * Get the total weight in grams for display purposes
 * @param items - Array of cart or order items with product information
 * @returns Total weight in grams
 */
export function getTotalWeight(
  items: Array<{
    quantity: number
    product?: { weight?: number | null } | null
    variant?: { weight?: number | null; product?: { weight?: number | null } | null } | null
  }>
): number {
  return items.reduce((total, item) => {
    // Priority: 1. variant.weight, 2. product.weight, 3. variant.product.weight
    const weight = item.variant?.weight ?? item.product?.weight ?? item.variant?.product?.weight ?? 0
    return total + (item.quantity * weight)
  }, 0)
}

/**
 * Get the chargeable weight in kg (excluding first 1kg)
 * @param items - Array of cart or order items with product information
 * @returns Chargeable weight in kg (rounded up)
 */
export function getChargeableWeightKG(
  items: Array<{
    quantity: number
    product?: { weight?: number | null } | null
    variant?: { weight?: number | null; product?: { weight?: number | null } | null } | null
  }>
): number {
  const totalWeightGrams = getTotalWeight(items)
  
  if (totalWeightGrams <= 1000) {
    return 0
  }
  
  const extraWeightGrams = Math.max(0, totalWeightGrams - 1000)
  return Math.ceil(extraWeightGrams / 1000)
}