import { useNavigate } from 'react-router-dom'
import styles from './ConfirmationPage.module.css'

export default function ConfirmationPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Παραγγελία στάλθηκε!</h1>
        <p className={styles.subtitle}>
          Η παραγγελία σου έφτασε στην κουζίνα.<br />
          Θα σε εξυπηρετήσουμε σύντομα.
        </p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Παράγγειλε κάτι ακόμα
        </button>
      </div>
    </div>
  )
}
