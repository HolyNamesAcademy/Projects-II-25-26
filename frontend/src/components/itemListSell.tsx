"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ItemImage from "@/components/itemImage";
import PrimaryButton from "@/components/primaryButton";

interface Item {
  id: number;
  name: string;
  price: number;
  size: string;
  type: string;
  color: string;
  favorite: boolean;
  image: string;
  description: string;
}

export default function ItemListSell({
  items,
  UpdateFavorite,
  RemoveItem,
  showFavoritesButton = false,
  showAddToCartButton = false,
}: {
  items: Item[];
  UpdateFavorite: (item: Item) => Promise<void>;
  RemoveItem?: (item: Item) => Promise<void>;
  showFavoritesButton?: boolean;
  showAddToCartButton?: boolean;
}) {
  const [displayedItems, setDisplayedItems] = useState(items);

  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  const handleFavoriteClick = async (item: Item) => {
    // Optimistically remove the item from display
    setDisplayedItems(displayedItems.filter((i) => i.name !== item.name));

    // Call the server action to persist the change
    item.favorite = !item.favorite;
    await UpdateFavorite(item);
  };

  const handleRemoveClick = async (item: Item) => {
    // Optimistically remove the item from display
    setDisplayedItems(displayedItems.filter((i) => i.name !== item.name));

    // Call the server action to persist the change
    if (RemoveItem) {
      await RemoveItem(item);
    }
  };

  return (
    <div className="dark:bg-gray-900">
      <ul className="grid grid-cols-1 gap-8 list-none p-0 m-0">
        {displayedItems.map((item, i) => (
          <li key={item.id ?? i} className="mb-2">
            <div className="flex flex-col items-center justify-center dark:text-white">
              <Link
                href={`/items/${item.id}`}
                className="text-center"
                aria-label={item.name}
              >
                <ItemImage
                  className="w-36 h-36 object-cover"
                  image={item.image}
                  alt={item.name}
                  width={144}
                  height={144}
                  variant="card"
                />
                <div className="mt-1">{item.name}</div>
                <div>{item.size}</div>
                <div>${item.price}</div>
              </Link>
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleFavoriteClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleFavoriteClick(item);
                }}
                style={{ cursor: "pointer", fontSize: "24px" }}
              >
                {item.favorite ? "❤️" : "♡"}
              </div>
              <div className="w-full flex justify-center pb-6">
                <div className="max-w-xs w-full">
                  <PrimaryButton
                    type="link"
                    text="Buy Now"
                    href={`/items/${item.id}`}
                  />
                </div>
              </div>

              {RemoveItem && (
                <button
                  type="button"
                  onClick={() => handleRemoveClick(item)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
