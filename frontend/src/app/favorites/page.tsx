"use client";

import ItemListToggle from "@/components/itemListToggle";
import NavMenu from "@/components/navMenu";
import { useEffect, useState } from "react";
import { api, type Item } from "@/lib/api";

export default function FavoriteList() {
  const [items, setItems] = useState<Item[]>([]);

  async function UpdateFavorite(item: Item) {
    if (item.favorite) {
      await api.items.favorites.add(item.id);
    } else {
      await api.items.favorites.remove(item.id);
    }
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id ? { ...i, favorite: item.favorite } : i
      )
    );
  }
  useEffect(() => {
    async function fetchFavorites() {
      const favoriteItems = await api.items.favorites.fetch();
      setItems(favoriteItems);
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

        <ItemListToggle items={items} UpdateFavorite={UpdateFavorite} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
