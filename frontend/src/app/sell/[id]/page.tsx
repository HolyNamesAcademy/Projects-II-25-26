"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ItemImage from "@/components/itemImage";
import PrimaryButton from "@/components/primaryButton";
import NavMenu from "@/components/navMenu";
import { api, type Item, handleApiError } from "@/lib/api";

export default function SellerItemDetail() {
  const params = useParams();
  const idParam = params?.id;
  const id =
    typeof idParam === "string"
      ? Number.parseInt(idParam, 10)
      : Array.isArray(idParam)
        ? Number.parseInt(idParam[0], 10)
        : NaN;

  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingFavorite, setPendingFavorite] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setError("Invalid item");
      return;
    }
    setError(null);
    try {
      const data = await api.items.getById(id);
      setItem(data);
    } catch (e) {
      setError(handleApiError(e));
      setItem(null);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFavoriteClick = async () => {
    if (!item || pendingFavorite) return;
    const next = !item.favorite;
    setPendingFavorite(true);
    setItem({ ...item, favorite: next });
    try {
      if (next) {
        await api.items.favorites.add(item.id);
      } else {
        await api.items.favorites.remove(item.id);
      }
    } catch (e) {
      setError(handleApiError(e));
      setItem((prev) => (prev ? { ...prev, favorite: item.favorite } : prev));
    } finally {
      setPendingFavorite(false);
    }
  };

  if (error && !item) {
    return (
      <>
        <NavMenu />
        <section className="min-h-screen sm:ml-64 dark:bg-gray-900 px-4 py-16">
          <p className="text-red-500 text-center" role="alert">
            {error}
          </p>
        </section>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <NavMenu />
        <section className="min-h-screen sm:ml-64 dark:bg-gray-900 px-4 py-16">
          <p className="text-center dark:text-white">Loading…</p>
        </section>
      </>
    );
  }

  return (
    <>
      <NavMenu />
      <section className="min-h-screen flex flex-col justify-between mx-auto py-8 bg-white md:py-16 dark:bg-gray-900 antialiased sm:ml-64">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <ItemImage
                className="w-full rounded-lg object-cover"
                image={item.image}
                alt={item.name}
                width={400}
                height={400}
                variant="detail"
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {item.name}
              </h1>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleFavoriteClick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleFavoriteClick();
                  }}
                  style={{
                    cursor: pendingFavorite ? "wait" : "pointer",
                    fontSize: "24px",
                  }}
                >
                  {item.favorite ? "❤️" : "♡"}
                </div>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              <h2 className="dark:text-white">
                <u>Description</u>
              </h2>
              <p className="dark:text-white whitespace-pre-wrap">
                {item.description || "No description provided."}
              </p>

              <div className="mt-4 dark:text-white">
                <p>Type: {item.type}</p>
                <p>Size: {item.size}</p>
                <p>Color: {item.color}</p>
                <p>${item.price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center pb-6">
          <div className="max-w-xs w-full">
            <PrimaryButton
              type="link"
              text="View as buyer"
              href={`/items/${item.id}`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
