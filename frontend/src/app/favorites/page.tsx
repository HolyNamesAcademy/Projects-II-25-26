"use client";

import ItemListBuy from "@/components/itemListBuy";
import NavMenu from "@/components/navMenu";
import { useEffect, useState, useCallback } from "react";
import { api, type Item, handleApiError } from "@/lib/api";

export default function Favorites() {
  const [items, setItems] = useState<Item[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
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
      const favoriteItems = await api.items.favorites.fetch();
      setItems(await mergeFavoriteState(favoriteItems));
    } catch (e) {
      setLoadError(handleApiError(e));
    } finally {
      setLoaded(true);
    }
  }, [mergeFavoriteState]);

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64 dark:bg-neutral-700">
        <h1 className="text-5xl align-middle text-center dark:text-white">
          Favorites
        </h1>

        {loadError && (
          <p className="text-red-500 text-center px-4" role="alert">
            {loadError}
          </p>
        )}

        {loaded && !loadError && items.length === 0 ? (
          <div
            className="flex flex-col items-center gap-4 px-4 text-center text-gray-600 dark:text-gray-400 max-w-md"
            role="status"
          >
            <p>You have not saved any favorites yet.</p>
          </div>
        ) : (
          <ItemListBuy items={items} updateItems={loadItems} />
        )}
      </main>
    </div>
  );
}
