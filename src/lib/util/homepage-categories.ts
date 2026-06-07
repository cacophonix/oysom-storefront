import { HttpTypes } from "@medusajs/types"

import {
  homepageConfig,
  HomepageCategorySectionConfig,
} from "@lib/config/homepage"
import { findCategory } from "@lib/util/find-category"

export type HomepageCategorySection = {
  key: string
  categoryId: string
  title: string
  emptyMessage: string
}

export const getEnabledHomepageCategoryConfigs = (): HomepageCategorySectionConfig[] => {
  return homepageConfig.categorySections.filter((section) => section.enabled)
}

export const buildHomepageCategorySections = (
  categories: HttpTypes.StoreProductCategory[] | null | undefined
): HomepageCategorySection[] => {
  return getEnabledHomepageCategoryConfigs().flatMap((config) => {
    const category = findCategory(categories, {
      handle: config.handle,
      name: config.name,
    })

    if (!category?.id) {
      return []
    }

    return [
      {
        key: config.id,
        categoryId: category.id,
        title: category.name ?? config.defaultTitle,
        emptyMessage: config.emptyMessage,
      },
    ]
  })
}

export const getHomepageFeaturedCategoryIds = (
  sections: HomepageCategorySection[]
): string[] => {
  return sections.map((section) => section.categoryId)
}

export const productBelongsToCategories = (
  product: HttpTypes.StoreProduct,
  categoryIds: string[]
): boolean => {
  if (!categoryIds.length) {
    return false
  }

  const productCategoryIds = (product.categories ?? []).map((category) => category.id)

  return productCategoryIds.some((id) => categoryIds.includes(id))
}

export const filterProductsExcludingCategories = (
  products: HttpTypes.StoreProduct[],
  excludedCategoryIds: string[]
): HttpTypes.StoreProduct[] => {
  if (!excludedCategoryIds.length) {
    return products
  }

  return products.filter(
    (product) => !productBelongsToCategories(product, excludedCategoryIds)
  )
}

export const groupProductsByCategory = (
  products: HttpTypes.StoreProduct[],
  allCategories: HttpTypes.StoreProductCategory[],
  excludedCategoryIds: string[] = []
): HttpTypes.StoreProduct[] => {
  const orderedProducts: HttpTypes.StoreProduct[] = []
  const seenProductIds = new Set<string>()
  const categoriesToGroup = allCategories.filter(
    (category) => !excludedCategoryIds.includes(category.id)
  )

  for (const category of categoriesToGroup) {
    for (const product of products) {
      if (seenProductIds.has(product.id)) {
        continue
      }

      if (productBelongsToCategories(product, [category.id])) {
        seenProductIds.add(product.id)
        orderedProducts.push(product)
      }
    }
  }

  for (const product of products) {
    if (!seenProductIds.has(product.id)) {
      seenProductIds.add(product.id)
      orderedProducts.push(product)
    }
  }

  return orderedProducts
}

/**
 * Builds one combined homepage product list:
 * prioritized categories first (in config order), then remaining products grouped by category.
 */
export const buildHomepageProductList = (
  products: HttpTypes.StoreProduct[],
  categorySections: HomepageCategorySection[],
  allCategories: HttpTypes.StoreProductCategory[] = []
): HttpTypes.StoreProduct[] => {
  const orderedProducts: HttpTypes.StoreProduct[] = []
  const seenProductIds = new Set<string>()

  for (const section of categorySections) {
    for (const product of products) {
      if (seenProductIds.has(product.id)) {
        continue
      }

      if (productBelongsToCategories(product, [section.categoryId])) {
        seenProductIds.add(product.id)
        orderedProducts.push(product)
      }
    }
  }

  const remainingProducts = products.filter(
    (product) => !seenProductIds.has(product.id)
  )

  const featuredCategoryIds = getHomepageFeaturedCategoryIds(categorySections)
  const groupedRemainingProducts = groupProductsByCategory(
    remainingProducts,
    allCategories,
    featuredCategoryIds
  )

  return [...orderedProducts, ...groupedRemainingProducts]
}
