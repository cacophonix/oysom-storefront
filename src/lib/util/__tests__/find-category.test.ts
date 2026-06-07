import { describe, expect, it } from "vitest"
import { HttpTypes } from "@medusajs/types"

import { findCategory } from "../find-category"

const makeCategory = (
  overrides: Partial<HttpTypes.StoreProductCategory> &
    Pick<HttpTypes.StoreProductCategory, "id" | "name" | "handle">
): HttpTypes.StoreProductCategory =>
  ({
    ...overrides,
  }) as HttpTypes.StoreProductCategory

describe("findCategory", () => {
  const categories = [
    makeCategory({ id: "pcat_fruits", name: "Fruits", handle: "fruits" }),
    makeCategory({ id: "pcat_food", name: "Food", handle: "food" }),
  ]

  it("finds a category by handle", () => {
    expect(
      findCategory(categories, { handle: "food", name: "food" })?.id
    ).toBe("pcat_food")
  })

  it("finds a category by name when handle does not match", () => {
    expect(
      findCategory(categories, { handle: "missing", name: "food" })?.id
    ).toBe("pcat_food")
  })

  it("returns undefined when category is missing", () => {
    expect(findCategory(categories, { handle: "missing", name: "missing" })).toBeUndefined()
  })

  it("does not throw when categories is null or undefined", () => {
    expect(findCategory(null, { handle: "food" })).toBeUndefined()
    expect(findCategory(undefined, { name: "food" })).toBeUndefined()
  })
})
