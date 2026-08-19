import { useEffect } from "react";
import { Icon } from "./Icon";
import { TransactionList } from "./TransactionList";
import { EmptyState } from "./EmptyState";
import { type Transaction } from "@/lib/app-store";

/**
 * Bottom-sheet overlay listing every transaction.
 * Pure UI overlay: no routing, no URL change.
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Semua transaksi"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card flex max-h-[85vh] w-full max-w-md flex-col rounded-t-[28px] px-margin-main pb-8 pt-4"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-outline/50" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-title text-on-surface">Semua Transaksi</h2>
            <span className="text-meta text-on-surface-variant/80">{items.length} entri</span>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant transition-transform active:scale-95"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {items.length ? (
            <TransactionList items={items} />
          ) : (
            <EmptyState icon="receipt" title="Belum ada transaksi" />
          )}
        </div>
      </div>
    </div>
  );
}
