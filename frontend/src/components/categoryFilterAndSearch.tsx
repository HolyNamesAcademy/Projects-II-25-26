"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ITEM_COLORS,
  ITEM_SIZES,
  ITEM_TYPES,
  type ItemColor,
  type ItemSize,
  type ItemType,
  type ItemSearchParams,
} from "@/lib/api";

const selectFilterClass =
  "rounded-lg border-2 border-gray-300 bg-neutral-secondary-medium px-3 py-2 text-heading focus:outline-none focus:ring-0 dark:bg-neutral-700 dark:text-white dark:border-gray-600";

function formatEnumOptionLabel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function buildParams(
  query: string,
  type: ItemType | null,
  size: ItemSize | "",
  color: ItemColor | "",
  minPrice: string,
  maxPrice: string
): ItemSearchParams {
  const params: ItemSearchParams = {};
  const q = query.trim();
  if (q) params.query = q;
  if (type) params.type = type;
  if (size) params.size = size;
  if (color) params.color = color;
  const min = Number.parseInt(minPrice, 10);
  if (minPrice.trim() !== "" && !Number.isNaN(min)) params.minPrice = min;
  const max = Number.parseInt(maxPrice, 10);
  if (maxPrice.trim() !== "" && !Number.isNaN(max)) params.maxPrice = max;
  return params;
}

function stateFromParams(p: ItemSearchParams) {
  return {
    search: p.query ?? "",
    selectedType: p.type ? (p.type as ItemType) : null,
    size: (p.size ? (p.size as ItemSize) : "") as ItemSize | "",
    color: (p.color ? (p.color as ItemColor) : "") as ItemColor | "",
    minPrice: p.minPrice != null ? String(p.minPrice) : "",
    maxPrice: p.maxPrice != null ? String(p.maxPrice) : "",
  };
}

export default function CategoryFilterAndSearch({
  urlKey,
  paramsFromUrl,
  onCommitToUrl,
}: {
  /** `useSearchParams().toString()` — when this changes, form syncs from the URL */
  urlKey: string;
  paramsFromUrl: ItemSearchParams;
  onCommitToUrl: (params: ItemSearchParams) => void;
}) {
  const [search, setSearch] = useState(() => paramsFromUrl.query ?? "");
  const [selectedType, setSelectedType] = useState<ItemType | null>(() =>
    paramsFromUrl.type ? (paramsFromUrl.type as ItemType) : null
  );
  const [size, setSize] = useState<ItemSize | "">(
    () => (paramsFromUrl.size as ItemSize | "") || ""
  );
  const [color, setColor] = useState<ItemColor | "">(
    () => (paramsFromUrl.color as ItemColor | "") || ""
  );
  const [minPrice, setMinPrice] = useState(() =>
    paramsFromUrl.minPrice != null ? String(paramsFromUrl.minPrice) : ""
  );
  const [maxPrice, setMaxPrice] = useState(() =>
    paramsFromUrl.maxPrice != null ? String(paramsFromUrl.maxPrice) : ""
  );

  const [isSearchPressed, setIsSearchPressed] = useState(false);

  useEffect(() => {
    const s = stateFromParams(paramsFromUrl);
    setSearch(s.search);
    setSelectedType(s.selectedType);
    setSize(s.size);
    setColor(s.color);
    setMinPrice(s.minPrice);
    setMaxPrice(s.maxPrice);
  }, [urlKey, paramsFromUrl]);

  const apply = useCallback(() => {
    onCommitToUrl(
      buildParams(search, selectedType, size, color, minPrice, maxPrice)
    );
  }, [search, selectedType, size, color, minPrice, maxPrice, onCommitToUrl]);

  return (
    <form
      className="max-w-4xl mx-auto my-4 w-full px-4"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <div
        className="relative flex shadow-xs rounded-lg -space-x-0.5"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <label htmlFor="search-items" className="sr-only">
          Search items
        </label>
        <input
          type="text"
          id="search-items"
          className="relative pl-3 pr-50 py-2.5 bg-neutral-secondary-medium border-2 border-gray-300 text-heading text-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full rounded-l-lg placeholder:text-body dark:bg-neutral-700 dark:text-white dark:border-gray-600"
          placeholder="Search by name or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          onMouseDown={() => setIsSearchPressed(true)}
          onMouseUp={() => setIsSearchPressed(false)}
          onMouseLeave={() => setIsSearchPressed(false)}
          onTouchStart={() => setIsSearchPressed(true)}
          onTouchEnd={() => setIsSearchPressed(false)}
          style={{ backgroundColor: isSearchPressed ? "#e5e7eb" : undefined }}
          className="inline-flex items-center text-black bg-brand hover:bg-brand-strong active:bg-neutral-tertiary-medium active:text-heading box-border border-2 border-gray-300 focus:ring-0 shadow-xs font-medium leading-5 rounded-r-lg text-sm px-4 py-2.5 focus:outline-none"
        >
          <svg
            className="w-4 h-4 me-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          Search
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-category"
            className="text-body dark:text-gray-300"
          >
            Category
          </label>
          <select
            id="filter-category"
            value={selectedType ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setSelectedType(v ? (v as ItemType) : null);
            }}
            className={selectFilterClass}
          >
            <option value="">All categories</option>
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>
                {formatEnumOptionLabel(t)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-size" className="text-body dark:text-gray-300">
            Size
          </label>
          <select
            id="filter-size"
            value={size}
            onChange={(e) => setSize((e.target.value as ItemSize | "") || "")}
            className={selectFilterClass}
          >
            <option value="">Any size</option>
            {ITEM_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-color"
            className="text-body dark:text-gray-300"
          >
            Color
          </label>
          <select
            id="filter-color"
            value={color}
            onChange={(e) => setColor((e.target.value as ItemColor | "") || "")}
            className={selectFilterClass}
          >
            <option value="">Any color</option>
            {ITEM_COLORS.map((c) => (
              <option key={c} value={c}>
                {formatEnumOptionLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-min" className="text-body dark:text-gray-300">
            Min price ($)
          </label>
          <input
            id="filter-min"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="rounded-lg border-2 border-gray-300 bg-neutral-secondary-medium px-3 py-2 text-heading focus:outline-none focus:ring-0 dark:bg-neutral-700 dark:text-white dark:border-gray-600"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-max" className="text-body dark:text-gray-300">
            Max price ($)
          </label>
          <input
            id="filter-max"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-lg border-2 border-gray-300 bg-neutral-secondary-medium px-3 py-2 text-heading focus:outline-none focus:ring-0 dark:bg-neutral-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
        <button
          type="submit"
          className="rounded-lg border-2 border-gray-300 bg-neutral-secondary-medium px-4 py-2 text-sm font-medium hover:bg-neutral-tertiary-medium dark:bg-neutral-700 dark:text-white dark:border-gray-600"
        >
          Apply filters
        </button>
        <button
          type="button"
          className="rounded-lg border-2 border-transparent px-4 py-2 text-sm text-body underline-offset-2 hover:underline dark:text-gray-300"
          onClick={() => {
            setSearch("");
            setSelectedType(null);
            setSize("");
            setColor("");
            setMinPrice("");
            setMaxPrice("");
            onCommitToUrl({});
          }}
        >
          Clear all
        </button>
      </div>
    </form>
  );
}
