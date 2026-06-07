import { HttpTypes } from "@medusajs/types"

export const findCategory = (
  categories: HttpTypes.StoreProductCategory[] | null | undefined,
  { handle, name }: { handle?: string; name?: string }
) => {
  return (categories ?? []).find((cat) => {
    if (handle && cat.handle === handle) {
      return true
    }

    if (name && cat.name.toLowerCase() === name.toLowerCase()) {
      return true
    }

    return false
  })
}
