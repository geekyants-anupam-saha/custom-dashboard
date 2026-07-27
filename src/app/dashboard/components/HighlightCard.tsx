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
  image?: string;

  heading?: string;
  description?: string;

  avatar?: string;
  username?: string;
  subText?: string;

  postLink?: string;

  buttonText?: string;

  stats?: StatItem[];
}

export default function HighlightCard({
  title,
  image,
  heading,
  description,
  avatar,
  username,
  subText,
  postLink,
  buttonText = "VIEW",
  stats = [],
}: HighlightCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.cardTitle}>
        {title}
      </h2>


      <div className={styles.content}>

        {/* IMAGE */}
        <div className={styles.imageWrapper}>
          {image ? (
            <img
              src={image}
              alt={heading || title}
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              No Image
            </div>
          )}
        </div>



        {/* DETAILS */}
        <div className={styles.details}>


          {/* USER */}
          {(avatar || username) && (
            <div className={styles.user}>
              {avatar && (
                <Image
                  src={avatar}
                  width={48}
                  height={48}
                  alt={username ?? ""}
                  className={styles.avatar}
                />
              )}

              <div>
                {username && (
                  <h4>{username}</h4>
                )}

                {subText && (
                  <span>{subText}</span>
                )}
              </div>
            </div>
          )}



          {/* TITLE */}
          {heading && (
            <h3 className={styles.heading}>
              {heading}
            </h3>
          )}



          {/* DESCRIPTION */}
          {description && (
            <p className={styles.description}>
              {description}
            </p>
          )}



          {/* STATS */}
          {stats.length > 0 && (
            <div className={styles.stats}>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={styles.stat}
                >
                  {stat.icon}

                  <span>
                    {stat.value ?? 0} {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}



          {/* BUTTON */}
          {postLink && (
            <button
              className={styles.button}
              onClick={() =>
                window.open(postLink, "_blank")
              }
            >
              {buttonText}

              <span>
                →
              </span>
            </button>
          )}

        </div>

      </div>
    </article>
  );
}