import Image from "next/image";
import { ReactNode } from "react";
import styles from "./HighlightCard.module.scss";

interface StatItem {
  icon: ReactNode;
  value: string | number;
  label: string;
}

interface HighlightCardProps {
  title: string;
  image: string;

  heading?: string;
  postLink?: string;

  description?: string;

  avatar?: string;

  username?: string;

  subText?: string;

  stats: StatItem[];
}

export default function HighlightCard({
  title,
  image,
  heading,
  postLink,
  description,
  avatar,
  username,
  subText,
  stats,
}: HighlightCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>

      <div
        className={styles.imageWrapper}
        onClick={() => window.open(postLink, "_blank")}
      >
        <img src={image} alt={heading || ""} className={styles.image} />
      </div>

      <div className={styles.bottom}>
        {(avatar || username) && (
          <div className={styles.user}>
            {avatar && (
              <Image
                src={avatar}
                alt={username ?? ""}
                width={56}
                height={56}
                className={styles.avatar}
              />
            )}

            <div>
              <h4>{username}</h4>
              <span>{subText}</span>
            </div>
          </div>
        )}

        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.badge}>
              {stat.icon}

              <span>
                {stat.value} {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <h3 className={styles.heading}>{heading}</h3>

      {description && <p className={styles.description}>{description}</p>}
    </article>
  );
}
