/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ArrowLeft from "@/components/icons/ArrowLeft";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarDays } from "lucide-react";
import styles from "./DateRangeModal.module.scss";
import { DateRangeOption, getPresetRanges } from "./dateRanges";

interface DateRangeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: () => void;
}

export default function DateRangeModal({
  open,
  onClose,
  onSelect,
}: DateRangeModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modalRef = useRef<HTMLDivElement>(null);

  const ranges = getPresetRanges();

  const selectedRange = searchParams.get("range") ?? "lastMonth";

  const [view, setView] = useState<"list" | "custom">("list");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  const currentStartIso =
    searchParams.get("startDate") ??
    ranges.find((r) => r.key === "lastMonth")?.startDate;
  const currentEndIso =
    searchParams.get("endDate") ??
    ranges.find((r) => r.key === "lastMonth")?.endDate;

  const toYYYYMMDD = (isoString?: string | Date | null) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (open) {
      setView(selectedRange === "custom" ? "custom" : "list");
      setCustomStart(toYYYYMMDD(currentStartIso));
      setCustomEnd(toYYYYMMDD(currentEndIso));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const selectRange = (range: DateRangeOption) => {
    if (range.key === "custom") {
      setView("custom");
      return;
    }

    onSelect?.();
    const params = new URLSearchParams(searchParams.toString());

    params.set("range", range.key);
    params.set("startDate", range.startDate);
    params.set("endDate", range.endDate);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });

    onClose();
  };

  const applyCustom = () => {
    if (!customStart || !customEnd) return;

    onSelect?.();
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", "custom");
    params.set("startDate", customStart);
    params.set("endDate", customEnd);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });

    onClose();
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <div ref={modalRef} className={styles.modal}>
        {view === "list" ? (
          <>
            <h4>Select Date Range</h4>
            <div className={styles.divider} />
            <div className={styles.list}>
              {ranges.map((range) => (
                <button
                  key={range.key}
                  type="button"
                  onClick={() => selectRange(range)}
                  className={`${styles.item} ${
                    selectedRange === range.key ? styles.active : ""
                  }`}
                >
                  <div>
                    <span className={styles.label}>{range.label}</span>
                    {range.key !== "custom" && (
                      <span className={styles.date}>
                        ({range.displayRange})
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={styles.headerTop}>
              <button
                className={styles.backBtn}
                onClick={() => setView("list")}
              >
                <ArrowLeft size={20} />
              </button>
              <h4 className={styles.customHeader}>CUSTOM DATE RANGE</h4>
            </div>
            <div className={styles.divider} />
            <div className={styles.customForm}>
              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    readOnly
                    className={styles.dateInput}
                    value={customStart}
                    onClick={() => {
                      setOpenStartPicker(!openStartPicker);
                      setOpenEndPicker(false);
                    }}
                    placeholder="Start date"
                  />
                  <CalendarDays
                    size={18}
                    color="var(--white-58)"
                    className={styles.calendarIcon}
                  />
                  {openStartPicker && (
                    <>
                      <div
                        className={styles.pickerBackdrop}
                        onClick={() => setOpenStartPicker(false)}
                      />
                      <div className={styles.pickerPopover}>
                        <DayPicker
                          mode="single"
                          selected={
                            customStart
                              ? new Date(customStart + "T00:00:00")
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              setCustomStart(toYYYYMMDD(date));
                            }
                            setOpenStartPicker(false);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    readOnly
                    className={styles.dateInput}
                    value={customEnd}
                    onClick={() => {
                      setOpenEndPicker(!openEndPicker);
                      setOpenStartPicker(false);
                    }}
                    placeholder="End date"
                  />
                  <CalendarDays
                    size={18}
                    color="var(--white-58)"
                    className={styles.calendarIcon}
                  />
                  {openEndPicker && (
                    <>
                      <div
                        className={styles.pickerBackdrop}
                        onClick={() => setOpenEndPicker(false)}
                      />
                      <div className={styles.pickerPopover}>
                        <DayPicker
                          mode="single"
                          selected={
                            customEnd
                              ? new Date(customEnd + "T00:00:00")
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              setCustomEnd(toYYYYMMDD(date));
                            }
                            setOpenEndPicker(false);
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button className={styles.applyBtn} onClick={applyCustom}>
                APPLY
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
