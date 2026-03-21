"use client";

import { use, useCallback, useEffect, useState } from "react";
import ItemListBuy from "@/components/itemListBuy";
import NavMenu from "@/components/navMenu";
import CategoryFilterAndSearch from "@/components/categoryFilterAndSearch";
import { api, type Item, handleApiError } from "@/lib/api";

export default function List() {
  const [items, setItems] = useState<Item[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mergeFavoriteState = useCallback(async (list: Item[]) => {
    try {
      const favs = await api.items.favorites.fetch();
      const favIds = new Set(favs.map((f) => f.id));
      return list.map((i) => ({ ...i, favorite: favIds.has(i.id) }));
    } catch {
      return list;
    }
  }, []);


  const loadItems = useCallback(async () => {
    setLoadError(null);
    try {
      const list = await api.items.search({});
      setItems(await mergeFavoriteState(list));
    } catch (e) {
      setLoadError(handleApiError(e));
    }
  }, [mergeFavoriteState]);

  useEffect(() => {
    loadItems();
  }, []);

  const handleSearch = async (query: string) => {
    setLoadError(null);
    try {
      const q = query.trim();
      const list = q
        ? await api.items.search({ query: q })
        : await api.items.search({});
      setItems(list);
    } catch (e) {
      setLoadError(handleApiError(e));
    }
  };

  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64 dark:bg-gray-900">
        <h1 className="text-5xl align-middle text-center dark:text-white">
          Shop by Category
        </h1>

        <CategoryFilterAndSearch onSearch={handleSearch} />

        {loadError && (
          <p className="text-red-500 text-center px-4" role="alert">
            {loadError}
          </p>
        )}

        <ItemListBuy items={items} updateItems={loadItems} />
      </main>
    </div>
  );
}
