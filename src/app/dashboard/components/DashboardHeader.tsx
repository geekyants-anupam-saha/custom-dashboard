"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useRive } from "@rive-app/react-canvas";
import styles from "./DashboardHeader.module.scss";

interface DashboardHeaderProps {
  onLogout: () => void;
  handleDateChange?: (
    startDate: string,
    endDate: string,
  ) => void;
}

type DateRange = {
  label: string;
  startDate: string;
  endDate: string;
};

const dateRanges: DateRange[] = [
  {
    label: "LAST WEEK",
    startDate: "2026-06-24",
    endDate: "2026-07-01",
  },
  {
    label: "LAST MONTH",
    startDate: "2026-06-01",
    endDate: "2026-07-01",
  },
  {
    label: "LAST QUARTER",
    startDate: "2026-04-01",
    endDate: "2026-07-01",
  },
  {
    label: "LAST YEAR",
    startDate: "2025-07-01",
    endDate: "2026-07-01",
  },
];

export default function DashboardHeader({
  onLogout,
  handleDateChange,
}: DashboardHeaderProps) {
  const [isDateMenuOpen, setIsDateMenuOpen] =
    useState(false);

  const [selectedRange, setSelectedRange] =
    useState<DateRange>({
      label: "LAST 12 MONTHS",
      startDate: "2025-07-01",
      endDate: "2026-07-01",
    });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { RiveComponent } = useRive({
    src: "/wou-logo-2.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsDateMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");

    const formattedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );

    return formattedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  };

  const handleRangeSelect = (
    range: DateRange,
  ) => {
    // Update selected range
    setSelectedRange(range);

    // Close dropdown
    setIsDateMenuOpen(false);

    // Call parent callback
    handleDateChange?.(
      range.startDate,
      range.endDate,
    );
  };

  const handleCustomRange = () => {
    setIsDateMenuOpen(false);

    // Open your custom date picker here
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div
          style={{
            width: 160,
            height: 60,
            cursor: "pointer",
          }}
        >
          <RiveComponent />
        </div>
      </div>

      <div className={styles.right}>
        <div
          className={styles.dateDropdown}
          ref={dropdownRef}
        >
          <button
            type="button"
            className={styles.dateButton}
            onClick={() =>
              setIsDateMenuOpen(
                (previous) => !previous,
              )
            }
          >
            <CalendarDays size={18} />

            {/* Selected range label */}
            <span>
              {selectedRange.label}
            </span>

            {/* Selected date range */}
            <span className={styles.date}>
              {formatDate(
                selectedRange.startDate,
              )}{" "}
              -{" "}
              {formatDate(
                selectedRange.endDate,
              )}
            </span>

            <ChevronDown
              size={16}
              className={
                isDateMenuOpen
                  ? styles.chevronOpen
                  : ""
              }
            />
          </button>

          {isDateMenuOpen && (
            <div className={styles.dateMenu}>
              <div className={styles.menuTitle}>
                SELECT DATE RANGE
              </div>

              <div
                className={styles.menuDivider}
              />

              {dateRanges.map((range) => (
                <button
                  type="button"
                  key={range.label}
                  className={styles.dateOption}
                  onClick={() =>
                    handleRangeSelect(range)
                  }
                >
                  <span
                    className={
                      styles.optionLabel
                    }
                  >
                    {range.label}
                  </span>

                  <span
                    className={
                      styles.optionDate
                    }
                  >
                    (
                    {formatDate(
                      range.startDate,
                    )}{" "}
                    -{" "}
                    {formatDate(
                      range.endDate,
                    )}
                    )
                  </span>
                </button>
              ))}

              <button
                type="button"
                className={styles.dateOption}
                onClick={handleCustomRange}
              >
                <span
                  className={
                    styles.optionLabel
                  }
                >
                  CUSTOM RANGE
                </span>
              </button>
            </div>
          )}
        </div>

        <div className={styles.divider} />

        <button
          type="button"
          className={styles.logout}
          onClick={onLogout}
        >
          Logout
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}