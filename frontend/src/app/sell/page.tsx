"use client";

import { useCallback, useEffect, useState } from "react";
import ItemListSell from "@/components/itemListSell";
import NavMenu from "@/components/navMenu";
import PrimaryButton from "@/components/primaryButton";
import { api, type Item, handleApiError } from "@/lib/api";

export default function List() {
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

  async function updateFavorite(item: Item) {
    try {
      if (item.favorite) {
        await api.items.favorites.add(item.id);
      } else {
        await api.items.favorites.remove(item.id);
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, favorite: item.favorite } : i
        )
      );
    } catch (e) {
      setLoadError(handleApiError(e));
      await loadMyItems();
    }
  }

  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64 dark:bg-gray-900">
        <h1 className="text-5xl align-middle text-center dark:text-white">
          Sell
        </h1>

        <PrimaryButton text="Add New Item" type="link" href="/sell/add-item" />

        {loadError && (
          <p className="text-red-500 text-center px-4" role="alert">
            {loadError}
          </p>
        )}

        <ItemListSell items={items} UpdateFavorite={updateFavorite} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
