import TaskPrioritizer from '../components/TaskPrioritizer'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          AI Task <span className={styles.gradientText}>Priority</span> Maker
        </h1>
        <p className={styles.subtitle}>Let AI sort out your chaos.</p>
      </header>

      <TaskPrioritizer />
    </main>
  )
}
