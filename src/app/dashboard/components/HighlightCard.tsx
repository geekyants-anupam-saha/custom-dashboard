import React, { ReactNode } from "react";
import styles from "./HighlightCard.module.scss";
import ArrowRight from "@/components/icons/ArrowRight";

interface StatItem {
  icon: ReactNode;
  value: string | number;
  label: string;
}

interface HighlightCardProps {
  title: string;
  image?: string;

  heading?: string;

  avatar?: ReactNode;
  username?: string;

  postLink?: string;

  buttonText?: string;

  stats?: StatItem[];
}

export default function HighlightCard({
  title,
  image,
  heading,
  avatar,
  username,
  postLink,
  buttonText = "VIEW",
  stats = [],
}: HighlightCardProps) {
  const Avatar = () => <div className={styles.avatar}>{avatar}</div>;
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>

      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          {image ? (
            <img src={image} alt={heading || title} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>No Image</div>
          )}
        </div>

        <div className={styles.details}>
          {(avatar || username) && (
            <div className={styles.user}>
              {avatar && <Avatar />}

              <div>{username && <h4>{username}</h4>}</div>
            </div>
          )}

          {heading && <h3 className={styles.heading}>{heading}</h3>}
          {stats.length > 0 && (
            <div className={styles.stats}>
              {stats.map((stat, index) => (
                <React.Fragment key={stat.label}>
                  <div className={styles.stat}>
                    {stat.icon}

                    <span>
                      {stat.value ?? 0} {stat.label}
                    </span>
                  </div>
                  {index < stats.length - 1 && (
                    <span className={styles.statDivider}>|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {postLink && (
            <button
              className={styles.button}
              onClick={() => window.open(postLink, "_blank")}
            >
              <span>
                {" "}
                {buttonText}
                <ArrowRight color="black" />
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
