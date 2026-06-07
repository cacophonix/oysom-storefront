import { describe, expect, it } from "vitest"
import { HttpTypes } from "@medusajs/types"

import {
  buildHomepageCategorySections,
  buildHomepageProductList,
  filterProductsExcludingCategories,
  getEnabledHomepageCategoryConfigs,
  getHomepageFeaturedCategoryIds,
  groupProductsByCategory,
} from "../homepage-categories"

const makeCategory = (
  overrides: Partial<HttpTypes.StoreProductCategory> &
    Pick<HttpTypes.StoreProductCategory, "id" | "name" | "handle">
): HttpTypes.StoreProductCategory =>
  ({
    ...overrides,
  }) as HttpTypes.StoreProductCategory

const makeProduct = (
  overrides: Partial<HttpTypes.StoreProduct> &
    Pick<HttpTypes.StoreProduct, "id" | "title">
): HttpTypes.StoreProduct =>
  ({
    categories: [],
    ...overrides,
  }) as HttpTypes.StoreProduct

describe("buildHomepageCategorySections", () => {
  it("uses enabled homepage config entries in configured order", () => {
    const enabledConfigs = getEnabledHomepageCategoryConfigs()

    expect(enabledConfigs.map((config) => config.id)).toEqual(["fruits", "food"])
  })

  it("returns fruits before food when both categories exist", () => {
    const sections = buildHomepageCategorySections([
      makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
      makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" }),
    ])

    expect(sections).toHaveLength(2)
    expect(sections[0]).toMatchObject({
      key: "fruits",
      categoryId: "pcat_fruits",
    })
    expect(sections[1]).toMatchObject({
      key: "food",
      categoryId: "pcat_food",
    })
  })

  it("returns only food when fruits category is missing", () => {
    const sections = buildHomepageCategorySections([
      makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
      makeCategory({ id: "pcat_other", name: "Electronics", handle: "electronics" }),
    ])

    expect(sections).toHaveLength(1)
    expect(sections[0]).toMatchObject({
      key: "food",
      categoryId: "pcat_food",
    })
  })

  it("handles null or undefined category lists without throwing", () => {
    expect(buildHomepageCategorySections(null)).toEqual([])
    expect(buildHomepageCategorySections(undefined)).toEqual([])
  })
})

describe("buildHomepageProductList", () => {
  const allCategories = [
    makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" }),
    makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
    makeCategory({ id: "pcat_books", name: "Books", handle: "books" }),
    makeCategory({ id: "pcat_clothing", name: "Clothing", handle: "clothing" }),
  ]

  const products = [
    makeProduct({
      id: "prod_fruit",
      title: "Mango",
      categories: [makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" })],
    }),
    makeProduct({
      id: "prod_food",
      title: "Rice",
      categories: [makeCategory({ id: "pcat_food", name: "Food", handle: "food" })],
    }),
    makeProduct({
      id: "prod_book",
      title: "Book",
      categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
    }),
    makeProduct({
      id: "prod_shirt",
      title: "Shirt",
      categories: [makeCategory({ id: "pcat_clothing", name: "Clothing", handle: "clothing" })],
    }),
  ]

  it("orders products as fruits, food, then remaining categories grouped", () => {
    const sections = buildHomepageCategorySections(allCategories)

    const ordered = buildHomepageProductList(products, sections, allCategories)

    expect(ordered.map((product) => product.id)).toEqual([
      "prod_fruit",
      "prod_food",
      "prod_book",
      "prod_shirt",
    ])
  })

  it("shows food first then grouped categories when fruits is missing", () => {
    const sections = buildHomepageCategorySections([
      makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
      ...allCategories.slice(2),
    ])

    const ordered = buildHomepageProductList(products, sections, allCategories)

    expect(ordered.map((product) => product.id)).toEqual([
      "prod_food",
      "prod_fruit",
      "prod_book",
      "prod_shirt",
    ])
  })

  it("groups all products by category when no prioritized categories exist", () => {
    const ordered = buildHomepageProductList(products, [], allCategories)

    expect(ordered.map((product) => product.id)).toEqual([
      "prod_fruit",
      "prod_food",
      "prod_book",
      "prod_shirt",
    ])
  })

  it("does not duplicate products that appear in an earlier prioritized category", () => {
    const duplicateProduct = makeProduct({
      id: "prod_both",
      title: "Fruit Snack",
      categories: [
        makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" }),
        makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
      ],
    })

    const sections = buildHomepageCategorySections(allCategories)
    const ordered = buildHomepageProductList(
      [...products, duplicateProduct],
      sections,
      allCategories
    )

    expect(ordered.filter((product) => product.id === "prod_both")).toHaveLength(1)
    expect(ordered.findIndex((product) => product.id === "prod_both")).toBe(1)
  })
})

describe("homepage prioritization", () => {
  const allCategories = [
    makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" }),
    makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
    makeCategory({ id: "pcat_books", name: "Books", handle: "books" }),
    makeCategory({ id: "pcat_clothing", name: "Clothing", handle: "clothing" }),
    makeCategory({ id: "pcat_electronics", name: "Electronics", handle: "electronics" }),
  ]

  it("keeps multiple products together within each prioritized category", () => {
    const products = [
      makeProduct({
        id: "prod_mango",
        title: "Mango",
        categories: [makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" })],
      }),
      makeProduct({
        id: "prod_banana",
        title: "Banana",
        categories: [makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" })],
      }),
      makeProduct({
        id: "prod_rice",
        title: "Rice",
        categories: [makeCategory({ id: "pcat_food", name: "Food", handle: "food" })],
      }),
      makeProduct({
        id: "prod_book",
        title: "Book",
        categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
      }),
    ]

    const sections = buildHomepageCategorySections(allCategories)
    const ordered = buildHomepageProductList(products, sections, allCategories)

    expect(ordered.map((product) => product.id)).toEqual([
      "prod_mango",
      "prod_banana",
      "prod_rice",
      "prod_book",
    ])
  })

  it("continues to show non-prioritized categories when prioritized categories are missing", () => {
    const products = [
      makeProduct({
        id: "prod_book",
        title: "Book",
        categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
      }),
      makeProduct({
        id: "prod_shirt",
        title: "Shirt",
        categories: [makeCategory({ id: "pcat_clothing", name: "Clothing", handle: "clothing" })],
      }),
    ]

    const ordered = buildHomepageProductList(products, [], allCategories)

    expect(ordered.map((product) => product.id)).toEqual([
      "prod_book",
      "prod_shirt",
    ])
  })

  it("does not surface prioritized categories again in the grouped remainder", () => {
    const products = [
      makeProduct({
        id: "prod_mango",
        title: "Mango",
        categories: [makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" })],
      }),
      makeProduct({
        id: "prod_rice",
        title: "Rice",
        categories: [makeCategory({ id: "pcat_food", name: "Food", handle: "food" })],
      }),
      makeProduct({
        id: "prod_book",
        title: "Book",
        categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
      }),
    ]

    const sections = buildHomepageCategorySections(allCategories)
    const featuredCategoryIds = getHomepageFeaturedCategoryIds(sections)
    const ordered = buildHomepageProductList(products, sections, allCategories)
    const remainder = ordered.slice(2)

    expect(featuredCategoryIds).toEqual(["pcat_fruits", "pcat_food"])
    expect(remainder.map((product) => product.id)).toEqual(["prod_book"])
    expect(
      remainder.some((product) =>
        product.categories?.some((category) =>
          featuredCategoryIds.includes(category.id ?? "")
        )
      )
    ).toBe(false)
  })

  it("groups multiple non-prioritized categories after prioritized products", () => {
    const products = [
      makeProduct({
        id: "prod_mango",
        title: "Mango",
        categories: [makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" })],
      }),
      makeProduct({
        id: "prod_laptop",
        title: "Laptop",
        categories: [
          makeCategory({ id: "pcat_electronics", name: "Electronics", handle: "electronics" }),
        ],
      }),
      makeProduct({
        id: "prod_book",
        title: "Book",
        categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
      }),
      makeProduct({
        id: "prod_tablet",
        title: "Tablet",
        categories: [
          makeCategory({ id: "pcat_electronics", name: "Electronics", handle: "electronics" }),
        ],
      }),
    ]

    const sections = buildHomepageCategorySections(allCategories)
    const ordered = buildHomepageProductList(products, sections, allCategories)

    expect(ordered.map((product) => product.id)).toEqual([
      "prod_mango",
      "prod_book",
      "prod_laptop",
      "prod_tablet",
    ])
  })

  it("places uncategorized products after grouped categories", () => {
    const products = [
      makeProduct({
        id: "prod_mango",
        title: "Mango",
        categories: [makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" })],
      }),
      makeProduct({
        id: "prod_misc",
        title: "Misc",
        categories: [],
      }),
      makeProduct({
        id: "prod_book",
        title: "Book",
        categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
      }),
    ]

    const sections = buildHomepageCategorySections(allCategories)
    const ordered = buildHomepageProductList(products, sections, allCategories)

    expect(ordered.map((product) => product.id)).toEqual([
      "prod_mango",
      "prod_book",
      "prod_misc",
    ])
  })

  it("uses config category order for prioritization, not store category order", () => {
    const sections = buildHomepageCategorySections(allCategories)

    expect(sections.map((section) => section.key)).toEqual(["fruits", "food"])
  })
})

describe("groupProductsByCategory", () => {
  const allCategories = [
    makeCategory({ id: "pcat_books", name: "Books", handle: "books" }),
    makeCategory({ id: "pcat_clothing", name: "Clothing", handle: "clothing" }),
  ]

  it("groups products in category list order", () => {
    const products = [
      makeProduct({
        id: "prod_shirt",
        title: "Shirt",
        categories: [makeCategory({ id: "pcat_clothing", name: "Clothing", handle: "clothing" })],
      }),
      makeProduct({
        id: "prod_book",
        title: "Book",
        categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
      }),
    ]

    expect(groupProductsByCategory(products, allCategories).map((product) => product.id)).toEqual([
      "prod_book",
      "prod_shirt",
    ])
  })

  it("puts uncategorized products last", () => {
    const products = [
      makeProduct({ id: "prod_misc", title: "Misc", categories: [] }),
      makeProduct({
        id: "prod_book",
        title: "Book",
        categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
      }),
    ]

    expect(groupProductsByCategory(products, allCategories).map((product) => product.id)).toEqual([
      "prod_book",
      "prod_misc",
    ])
  })
})

describe("homepage product helpers", () => {
  const products = [
    makeProduct({
      id: "prod_fruit",
      title: "Mango",
      categories: [makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" })],
    }),
    makeProduct({
      id: "prod_book",
      title: "Book",
      categories: [makeCategory({ id: "pcat_books", name: "Books", handle: "books" })],
    }),
  ]

  it("filters products assigned to excluded categories", () => {
    const filtered = filterProductsExcludingCategories(products, ["pcat_fruits"])

    expect(filtered.map((product) => product.id)).toEqual(["prod_book"])
  })

  it("returns all featured category ids from configured sections", () => {
    const sections = buildHomepageCategorySections([
      makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" }),
      makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
    ])

    expect(getHomepageFeaturedCategoryIds(sections)).toEqual([
      "pcat_fruits",
      "pcat_food",
    ])
  })
})
