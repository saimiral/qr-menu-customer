import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { useCart } from '../useCart'
import styles from './MenuPage.module.css'

export default function MenuPage() {
  const { qrToken } = useParams()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const categoryRefs = useRef([])
  const { items, addItem, removeItem, totalItems, totalPrice, clearCart } = useCart()

  useEffect(() => {
    api.get(`/menu/${qrToken}`)
      .then(res => {
        setMenu(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Το μενού δεν βρέθηκε.')
        setLoading(false)
      })
  }, [qrToken])

  const scrollToCategory = (index) => {
    setActiveCategory(index)
    categoryRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const getQuantity = (itemId) => {
    return items.find(i => i.menuItemId === itemId)?.quantity || 0
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) return
    setSubmitting(true)
    try {
      await api.post('/orders', {
        qrToken,
        items: items.map(i => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
          notes: i.notes || null,
        }))
      })
      clearCart()
      navigate('/confirmation')
    } catch (err) {
        const message = err.response?.data?.message || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.'
        alert(message)
    } finally {
        setSubmitting(false)
    }
  }

  if (loading) return (
    <div className={styles.centered}>
      <div className={styles.spinner} />
    </div>
  )

  if (error) return (
    <div className={styles.centered}>
      <p className={styles.errorText}>{error}</p>
    </div>
  )

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.storeName}>{menu.storeName}</h1>
          <span className={styles.tableTag}>Τραπέζι {menu.tableNumber}</span>
        </div>
      </header>

      {/* Category tabs */}
      <nav className={styles.categoryNav}>
        {menu.categories.map((cat, i) => (
          <button
            key={cat.id}
            className={`${styles.categoryTab} ${activeCategory === i ? styles.activeTab : ''}`}
            onClick={() => scrollToCategory(i)}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {/* Menu items */}
      <main className={styles.main}>
        {menu.categories.map((cat, i) => (
          <section
            key={cat.id}
            ref={el => categoryRefs.current[i] = el}
            className={styles.categorySection}
          >
            <h2 className={styles.categoryTitle}>{cat.name}</h2>
            <div className={styles.itemsList}>
              {cat.items.map(item => {
                const qty = getQuantity(item.id)
                return (
                  <div key={item.id} className={styles.itemCard}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      {item.description && (
                        <span className={styles.itemDesc}>{item.description}</span>
                      )}
                      <span className={styles.itemPrice}>{Number(item.price).toFixed(2)}€</span>
                    </div>
                    <div className={styles.itemActions}>
                      {qty === 0 ? (
                        <button className={styles.addBtn} onClick={() => addItem(item)}>
                          +
                        </button>
                      ) : (
                        <div className={styles.qtyControl}>
                          <button className={styles.qtyBtn} onClick={() => removeItem(item.id)}>−</button>
                          <span className={styles.qtyNum}>{qty}</span>
                          <button className={styles.qtyBtn} onClick={() => addItem(item)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
        <div className={styles.bottomPad} />
      </main>

      {/* Cart bar */}
      {totalItems > 0 && (
        <div className={styles.cartBar}>
          <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
            <span className={styles.cartBadge}>{totalItems}</span>
            <span>Δες την παραγγελία</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </button>
        </div>
      )}

      {/* Cart modal */}
      {cartOpen && (
        <div className={styles.overlay} onClick={() => setCartOpen(false)}>
          <div className={styles.cartModal} onClick={e => e.stopPropagation()}>
            <div className={styles.cartHeader}>
              <h2 className={styles.cartTitle}>Η παραγγελία σου</h2>
              <button className={styles.closeBtn} onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className={styles.cartItems}>
              {items.map(item => (
                <div key={item.menuItemId} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <span className={styles.cartItemName}>{item.name}</span>
                    <span className={styles.cartItemPrice}>{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                  <div className={styles.qtyControl}>
                    <button className={styles.qtyBtn} onClick={() => removeItem(item.menuItemId)}>−</button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => addItem({ id: item.menuItemId, name: item.name, price: item.price })}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <span>Σύνολο</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
              <button
                className={styles.orderBtn}
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? 'Αποστολή...' : 'Αποστολή παραγγελίας'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
