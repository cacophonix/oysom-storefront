export type HomepageCategorySectionConfig = {
  /** Unique section key used in React lists */
  id: string
  /** Set to false to exclude this category from homepage ordering */
  enabled: boolean
  /** Medusa category handle, e.g. "fruits" */
  handle?: string
  /** Fallback match by category name, e.g. "Fruits" */
  name?: string
  defaultTitle: string
  emptyMessage: string
}

export type HomepageProductsSectionConfig = {
  title: string
  emptyMessage: string
}

/**
 * Control homepage product ordering under "আমাদের পণ্যসমূহ".
 * Products appear in one combined list:
 * 1. Prioritized categories below, in order (e.g. fruits, then food)
 * 2. Remaining products grouped by category
 */
export const homepageConfig = {
  categorySections: [
    {
      id: "fruits",
      enabled: true,
      handle: "fruits",
      name: "fruits",
      defaultTitle: "ফল",
      emptyMessage: "No products found in the Fruits category.",
    },
    {
      id: "food",
      enabled: true,
      handle: "food",
      name: "food",
      defaultTitle: "খাবার",
      emptyMessage: "No products found in the Food category.",
    },
  ] satisfies HomepageCategorySectionConfig[],

  productsSection: {
    title: "আমাদের পণ্যসমূহ",
    emptyMessage: "No products available.",
  } satisfies HomepageProductsSectionConfig,

  /** Max products fetched for the homepage */
  productLimit: 100,
}
