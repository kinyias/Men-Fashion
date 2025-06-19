import { SanPhamWithRating } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SeenProduct extends SanPhamWithRating {
  seenAt: number // Timestamp for sorting
}

interface ProductSeenState {
  products: SeenProduct[]
  addSeenProduct: (product: Omit<SeenProduct, 'seenAt'>) => void
  clearSeenProducts: () => void
  getRecentProducts: () => SeenProduct[]
}

export const useProductSeenStore = create<ProductSeenState>()(
  persist(
    (set, get) => ({
      products: [],

      // Add a product to seen list
      addSeenProduct: (product) => {
        set((state) => {
          const now = Date.now()
          
          // Check if product already exists in seen list
          const existingIndex = state.products.findIndex(
            (p) => p.ma === product.ma
          )

          let updatedProducts = [...state.products]

          if (existingIndex >= 0) {
            // Update existing product's timestamp and move to front
            updatedProducts[existingIndex] = {
              ...updatedProducts[existingIndex],
              ...product,
              seenAt: now
            }
            // Move to front
            const updatedProduct = updatedProducts.splice(existingIndex, 1)[0]
            updatedProducts.unshift(updatedProduct)
          } else {
            // Add new product to front
            const newProduct: SeenProduct = {
              ...product,
              seenAt: now
            }
            updatedProducts.unshift(newProduct)
          }

          // Keep only the 10 most recent products
          updatedProducts = updatedProducts.slice(0, 10)

          return { products: updatedProducts }
        })
      },

      // Clear all seen products
      clearSeenProducts: () => set({ products: [] }),

      // Get products sorted by most recently seen
      getRecentProducts: () => {
        return get().products.sort((a, b) => b.seenAt - a.seenAt)
      },
    }),
    {
      name: "product-seen-storage", // unique name for localStorage
    },
  ),
)