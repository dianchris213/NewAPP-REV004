import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { TransactionList } from "./TransactionList";
import { EmptyState } from "./EmptyState";
import { type Transaction } from "@/lib/app-store";

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * True full-screen overlay listing every transaction.
 * Pure UI overlay: no routing, no URL change. Covers the bottom nav entirely;
 * closing is only possible through the X button.
 */
export function AllTransactionsSheet({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: Transaction[];
}) {
  const [month, setMonth] = useState("all");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const categories = useMemo(
    () => Array.from(new Set(items.map((t) => t.category))).sort(),
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter((t) => {
        if (type !== "all" && t.type !== type) return false;
        if (category !== "all" && t.category !== category) return false;
        if (month !== "all" && String(new Date(t.date).getMonth()) !== month) return false;
        return true;
      }),
    [items, month, type, category],
  );

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-label="Semua transaksi"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/15 px-margin-main pt-safe-area-top pb-3">
        <div className="flex flex-col">
          <h2 className="text-title text-on-surface">Semua Transaksi</h2>
          <span className="text-meta text-on-surface-variant/80">{filtered.length} entri</span>
        </div>
        <button
          type="button"
          aria-label="Tutup"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant transition-transform active:scale-95"
        >
          <Icon name="close" className="text-[20px]" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 px-margin-main py-3">
        <FilterSelect
          label="Bulan"
          value={month}
          onChange={setMonth}
          options={[
            { value: "all", label: "Semua Bulan" },
            ...MONTHS.map((m, i) => ({ value: String(i), label: m })),
          ]}
        />
        <FilterSelect
          label="Jenis"
          value={type}
          onChange={(v) => setType(v as "all" | "income" | "expense")}
          options={[
            { value: "all", label: "Semua Jenis" },
            { value: "income", label: "Pemasukan" },
            { value: "expense", label: "Pengeluaran" },
          ]}
        />
        <FilterSelect
          label="Kategori"
          value={category}
          onChange={setCategory}
          options={[
            { value: "all", label: "Semua Kategori" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-margin-main pb-10">
        {filtered.length ? (
          <TransactionList items={filtered} />
        ) : (
          <EmptyState icon="receipt" title="Tidak ada transaksi" />
        )}
      </div>
    </div>,
    document.body,
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant/70">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full min-w-0 rounded-full border border-outline-variant/30 bg-surface-container-high px-3 text-[12px] font-medium text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
