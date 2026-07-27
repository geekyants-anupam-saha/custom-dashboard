"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ChevronDown, LogOut } from "lucide-react";

import DateRangeModal from "../components/DateRangeModal/DateRangeModal";
import { getRangeByKey } from "../components/DateRangeModal/dateRanges";

import styles from "./DashboardHeader.module.scss";
import Logo from "@/components/icons/Logo";

interface DashboardHeaderProps {
  onLogout: () => void;
  onDateSelect?: () => void;
}

export default function DashboardHeader({
  onLogout,
  onDateSelect,
}: DashboardHeaderProps) {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const selectedRange = useMemo(() => {
    const range = searchParams.get("range");

    return getRangeByKey(range ?? "lastYear");
  }, [searchParams]);

  const customStart = searchParams.get("startDate");
  const customEnd = searchParams.get("endDate");

  const displayDate =
    customStart && customEnd
      ? `${new Date(customStart).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${new Date(customEnd).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : selectedRange.displayRange;

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div
          style={{
            width: 160,
            height: 60,
            cursor: "pointer",
          }}
        >
          <Logo />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.dateWrapper}>
          <button
            className={styles.dateButton}
            onClick={() => setOpen((prev) => !prev)}
          >
            <CalendarDays color="white" size={18} />

            <span>{selectedRange.label}</span>

            <span className={styles.date}>{displayDate}</span>

            <ChevronDown
              color="white"
              size={16}
              className={open ? styles.rotate : ""}
            />
          </button>

          <DateRangeModal
            open={open}
            onClose={() => setOpen(false)}
            onSelect={onDateSelect}
          />
        </div>

        <div className={styles.divider} />

        <button className={styles.logout} onClick={onLogout}>
          Logout
          <LogOut color="white" size={18} />
        </button>
      </div>
    </div>
  );
}
