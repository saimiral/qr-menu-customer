import { useState } from 'react'

export function useCart() {
  const [items, setItems] = useState([])

  const addItem = (menuItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.menuItemId === menuItem.id)
      if (existing) {
        return prev.map(i =>
          i.menuItemId === menuItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1, notes: '' }]
    })
  }

  const removeItem = (menuItemId) => {
    setItems(prev => {
      const existing = prev.find(i => i.menuItemId === menuItemId)
      if (existing?.quantity === 1) {
        return prev.filter(i => i.menuItemId !== menuItemId)
      }
      return prev.map(i =>
        i.menuItemId === menuItemId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    })
  }

  const updateNotes = (menuItemId, notes) => {
    setItems(prev =>
      prev.map(i => i.menuItemId === menuItemId ? { ...i, notes } : i)
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return { items, addItem, removeItem, updateNotes, clearCart, totalItems, totalPrice }
}
