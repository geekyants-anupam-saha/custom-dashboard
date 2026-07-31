import styles from "./not-found.module.scss";
import Plug from "@/components/icons/Plugs";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <Plug width={96} height={96} />
        </div>
        
        <h2 className={styles.title}>Page not found</h2>
        
        <p className={styles.subtitle}>
          We couldn&apos;t find the page you were looking for.Check
          the URL to make sure it&apos;s correct and try again.
        </p>
      </div>
    </div>
  );
}
