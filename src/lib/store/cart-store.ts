import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  ma: number
  ten: string
  gia: number
  mauSac: {
    ma: number
    ten: string
    ma_mau: string
  }
  kichCo: {
    ma: number
    ten: string
  }
  soLuong: number
  hinhAnh: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: CartItem) => void
  updateItemQuantity: (itemId: number, mamausac: number, makichco: number, soluong: number) => void
  removeItem: (itemId: number, mamausac: number, makichco: number) => void
  clearCart: () => void
  findCartItem: (itemId: number, mamausac: number, makichco: number) => CartItem | undefined
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Cart visibility controls
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Cart item management
      addItem: (item) => {
        set((state) => {
          // Check if the item already exists in the cart
          const existingItemIndex = state.items.findIndex(
            (i) => i.ma === item.ma && i.mauSac.ma === item.mauSac.ma && i.kichCo.ma === item.kichCo.ma,
          )

          if (existingItemIndex >= 0) {
            // Update quantity if item exists
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].soLuong += item.soLuong
            return { items: updatedItems }
          } else {
            // Add new item if it doesn't exist
            return { items: [...state.items, item] }
          }
        })
        // Open cart after adding item
        get().openCart()
      },

      updateItemQuantity: (itemId, mamausac, makichco, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.ma === Number(itemId) && item.mauSac.ma === mamausac && item.kichCo.ma === makichco) {
              return { ...item, soLuong: quantity }
            }
            return item
          }),
        }))
      },

      removeItem: (itemId, mamausac, makichco) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.ma ===  Number(itemId) && item.mauSac.ma === mamausac && item.kichCo.ma === makichco),
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      findCartItem: (itemId, mamausac, makichco) => {
        return get().items.find((item) => item.ma ===  Number(itemId) && item.mauSac.ma === mamausac && item.kichCo.ma === makichco)
      },

      // Derived values
      itemCount: () => {
        return get().items.reduce((total, item) => total + item.soLuong, 0)
      },

      subtotal: () => {
        return get().items.reduce((total, item) => total + item.gia * item.soLuong, 0)
      },
    }),
    {
      name: "cart-storage", // unique name for localStorage
    },
  ),
)
