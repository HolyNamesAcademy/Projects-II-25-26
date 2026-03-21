"use client";

import ItemListToggle from "@/components/itemListToggle";
import NavMenu from "@/components/navMenu";
import { useEffect, useState } from "react";
import { api, type Item, handleApiError } from "@/lib/api";

export default function FavoriteList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function UpdateFavorite(item: Item) {
    if (item.favorite) {
      await api.items.favorites.add(item.id);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, favorite: true } : i))
      );
    } else {
      await api.items.favorites.remove(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  }
  useEffect(() => {
    async function fetchFavorites() {
      setLoadError(null);
      try {
        const favoriteItems = await api.items.favorites.fetch();
        setItems(favoriteItems);
      } catch (e) {
        setLoadError(handleApiError(e));
      }
    }
    fetchFavorites();
  }, []);

  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64 dark:bg-gray-900">
        <h1 className="text-5xl align-middle text-center dark:text-white">
          Favorites
        </h1>

        {loadError && (
          <p className="text-red-500 text-center px-4" role="alert">
            {loadError}
          </p>
        )}

        <ItemListToggle items={items} UpdateFavorite={UpdateFavorite} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
