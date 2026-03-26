"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ItemListBuy from "@/components/itemListBuy";
import NavMenu from "@/components/navMenu";
import CategoryFilterAndSearch from "@/components/categoryFilterAndSearch";
import {
  api,
  type Item,
  type ItemSearchParams,
  handleApiError,
  itemSearchParamsToUrlSearchParams,
  parseItemSearchParamsFromQueryString,
} from "@/lib/api";

function ItemsMain() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const searchParamsRef = useRef<ItemSearchParams>({});

  const urlKey = searchParams.toString();
  const paramsFromUrl = useMemo(
    () => parseItemSearchParamsFromQueryString(urlKey),
    [urlKey]
  );

  const mergeFavoriteState = useCallback(async (list: Item[]) => {
    try {
      const favs = await api.items.favorites.fetch();
      const favIds = new Set(favs.map((f) => f.id));
      return list.map((i) => ({ ...i, favorite: favIds.has(i.id) }));
    } catch {
      return list;
    }
  }, []);

  const fetchWithParams = useCallback(
    async (params: ItemSearchParams) => {
      setLoadError(null);
      searchParamsRef.current = params;
      try {
        const list = await api.items.search(params);
        setItems(await mergeFavoriteState(list));
      } catch (e) {
        setLoadError(handleApiError(e));
      }
    },
    [mergeFavoriteState]
  );

  const reloadWithCurrentFilters = useCallback(async () => {
    await fetchWithParams(searchParamsRef.current);
  }, [fetchWithParams]);

  const commitFiltersToUrl = useCallback(
    (params: ItemSearchParams) => {
      const sp = itemSearchParamsToUrlSearchParams(params);
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    const parsed = parseItemSearchParamsFromQueryString(urlKey);
    fetchWithParams(parsed);
  }, [urlKey, fetchWithParams]);

  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64 dark:bg-neutral-700">
        <h1 className="text-5xl align-middle text-center dark:text-white">
          Shop by Category
        </h1>

        <CategoryFilterAndSearch
          urlKey={urlKey}
          paramsFromUrl={paramsFromUrl}
          onCommitToUrl={commitFiltersToUrl}
        />

        {loadError && (
          <p className="text-red-500 text-center px-4" role="alert">
            {loadError}
          </p>
        )}

        <ItemListBuy items={items} updateItems={reloadWithCurrentFilters} />
      </main>
    </div>
  );
}

export default function Items() {
  return (
    <Suspense
      fallback={
        <div>
          <NavMenu />
          <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64 dark:bg-neutral-700 pt-8">
            <p className="text-body dark:text-gray-300">Loading…</p>
          </main>
        </div>
      }
    >
      <ItemsMain />
    </Suspense>
  );
}
