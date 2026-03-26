"use client";

import { useCallback, useEffect, useState } from "react";
import ItemListSell from "@/components/itemListSell";
import NavMenu from "@/components/navMenu";
import PrimaryButton from "@/components/primaryButton";
import { api, type Item, handleApiError } from "@/lib/api";

export default function Sell() {
  const [items, setItems] = useState<Item[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadMyItems = useCallback(async () => {
    setLoadError(null);
    try {
      const list = await api.items.list();
      setItems(list);
    } catch (e) {
      setLoadError(handleApiError(e));
    }
  }, []);

  useEffect(() => {
    loadMyItems();
  }, [loadMyItems]);

  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64 dark:bg-neutral-700">
        <h1 className="text-5xl align-middle text-center dark:text-white">
          Sell
        </h1>

        <PrimaryButton text="Add New Item" type="link" href="/sell/add-item" />

        {loadError && (
          <p className="text-red-500 text-center px-4" role="alert">
            {loadError}
          </p>
        )}

        <ItemListSell items={items} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
