import styles from "../loading.module.scss";

export default function DashboardSkeleton() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logo} />
        </div>
        <div className={styles.right}>
          <div className={styles.dateButton} />
          <div className={styles.divider} />
          <div className={styles.logoutButton} />
        </div>
      </header>

      <main className={styles.container}>
        <section className={styles.statsGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.icon} />

              <div className={styles.statContent}>
                <div className={styles.smallLine} />
                <div className={styles.bigLine} />
              </div>
            </div>
          ))}
        </section>

        <section className={styles.highlightGrid}>
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className={styles.highlightCard}>
              <div className={styles.image} />

              <div className={styles.content}>
                <div className={styles.title} />
                <div className={styles.text} />
                <div className={styles.textShort} />

                <div className={styles.stats}>
                  <div className={styles.stat} />
                  <div className={styles.stat} />
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
