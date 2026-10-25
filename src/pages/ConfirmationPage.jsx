import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api'
import styles from './ConfirmationPage.module.css'

const STATUS_LABELS = {
  PENDING: 'Η παραγγελία σου εστάλη στην κουζίνα...',
  PREPARING: 'Η παραγγελία σου ετοιμάζεται...',
  READY: 'Η παραγγελία σου είναι έτοιμη!',
  PAID: 'Η παραγγελία ολοκληρώθηκε.',
}

export default function ConfirmationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const publicToken = location.state?.publicToken
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!publicToken) return

    let interval

    const poll = () => {
      api.get(`/orders/track/${publicToken}`)
        .then(res => {
          setStatus(res.data.status)
          if (res.data.status === 'PAID' && interval) {
            clearInterval(interval)
          }
        })
        .catch(() => {}) // αγνόησε προσωρινό network error, ξαναδοκιμάζει στο επόμενο interval
    }

    poll()
    interval = setInterval(poll, 4000)
    return () => clearInterval(interval)
  }, [publicToken])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Παραγγελία στάλθηκε!</h1>
        <p className={styles.subtitle}>
          {status ? (STATUS_LABELS[status] || 'Η παραγγελία σου έφτασε στην κουζίνα.') : 'Η παραγγελία σου έφτασε στην κουζίνα.'}
        </p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Παράγγειλε κάτι ακόμα
        </button>
      </div>
    </div>
  )
}