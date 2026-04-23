"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type Item } from "@/lib/api";
import ItemImage from "@/components/itemImage";
import SecondaryButton from "@/components/secondaryButton";

export default function ItemListBuy({
  items,
  updateItems,
}: {
  items: Item[];
  updateItems: () => Promise<void>;
}) {
  const handleFavoriteClick = async (item: Item, index: number) => {
    const nextFavorite = !item.favorite;
    if (nextFavorite) {
      await api.items.favorites.add(item.id);
    } else {
      await api.items.favorites.remove(item.id);
    }
    await updateItems();
  };

  return (
    <div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={item.id} className="mb-2">
            <div className="flex flex-col items-center justify-center dark:text-white">
              <Link
                href={`/items/${item.id}`}
                className="text-center"
                aria-label={item.name}
              >
                <ItemImage
                  className="w-60 h-60 object-cover"
                  image={item.image}
                  alt={item.name}
                  width={240}
                  height={240}
                  variant="card"
                />
                <div className="mt-1 flex justify-center font-medium">
                  {item.name}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10">
                    {item.size}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10">
                    ${item.price}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10">
                    {item.type}
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleFavoriteClick(item, i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleFavoriteClick(item, i);
                    }}
                    style={{ cursor: "pointer", fontSize: "24px" }}
                  >
                    {item.favorite ? "❤️" : "♡"}
                  </div>
                </div>
              </Link>
              <div className="w-full flex justify-center pb-6">
                <SecondaryButton
                  type="button"
                  text="Contact Seller"
                  onClick={() => {
                    window.alert("Contact Seller clicked");
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
