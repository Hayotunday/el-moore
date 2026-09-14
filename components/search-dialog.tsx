"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { listPublicProperties } from "@/lib/api/properties";
import type { Property, PropertyStatus } from "@/lib/api/types";

const BUDGETS = [
  { label: "Any Budget", max: "" },
  { label: "Under ₦50M", max: "50000000" },
  { label: "₦50M – ₦200M", max: "200000000" },
  { label: "₦200M+", max: "" },
];

export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<PropertyStatus | "">("");
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    listPublicProperties()
      .then((p) => {
        if (!cancelled) setProperties(p);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const locations = useMemo(
    () => Array.from(new Set(properties.map((p) => p.location))).sort(),
    [properties],
  );

  if (!open) return null;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (status) params.set("status", status);
    const max = BUDGETS[budget]?.max;
    if (max) params.set("maxPrice", max);
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center overflow-y-auto bg-[rgba(8,17,15,0.55)] p-5 pb-16 max-[640px]:items-start max-[640px]:pt-24 max-[640px]:pb-5"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search properties"
        className="relative flex w-full max-w-2xl flex-col gap-5 rounded-md bg-card p-8 shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="eyebrow">Find a Property</p>
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
          <div>
            <label className="mb-2 block text-[0.64rem] font-bold tracking-widest text-foreground/55 uppercase">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded border border-line bg-background px-3.5 py-3 text-sm text-foreground"
            >
              <option value="">Any Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[0.64rem] font-bold tracking-widest text-foreground/55 uppercase">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PropertyStatus | "")}
              className="w-full rounded border border-line bg-background px-3.5 py-3 text-sm text-foreground"
            >
              <option value="">Any Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[0.64rem] font-bold tracking-widest text-foreground/55 uppercase">
              Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full rounded border border-line bg-background px-3.5 py-3 text-sm text-foreground"
            >
              {BUDGETS.map((b, i) => (
                <option key={b.label} value={i}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-3 text-xs font-bold tracking-wide text-primary-foreground uppercase whitespace-nowrap hover:bg-primary/90 max-[640px]:w-full"
          >
            <Search className="h-3.5 w-3.5" /> Search
          </button>
        </div>
      </div>
    </div>
  );
}
