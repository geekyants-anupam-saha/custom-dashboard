import styles from "../../loading.module.scss";

export default function DashboardSkeleton() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logo} />
        </div>
        <div className={styles.right}>
          <div className={styles.logoutButton} />
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.controlsRow}>
          <div className={styles.dateText} />
          <div className={styles.lastUpdatedText} />
        </div>

        <div>
          <div className={styles.heading} />
          <section className={styles.statsGrid}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.iconWrapper}>
                  <div className={styles.icon} />
                </div>

                <div className={styles.statContent}>
                  <div className={styles.bigLine} />
                  <div className={styles.smallLine} />
                </div>
              </div>
            ))}
          </section>
        </div>

        <div>
          <div className={styles.heading} />
          <section className={styles.highlightGrid}>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className={styles.highlightCard}>
                <div className={styles.content}>
                  <div className={styles.image} />
                  <div className={styles.details}>
                    <div className={styles.userLine} />
                    <div className={styles.title} />
                    
                    <div className={styles.stats}>
                      <div className={styles.stat} />
                      <div className={styles.stat} />
                    </div>

                    <div className={styles.button} />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
