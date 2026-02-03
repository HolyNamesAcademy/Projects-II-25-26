"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Item {
  name: string;
  type: string;
  size: string;
  image: string;
  price: number;
  favorite: boolean;
}

export default function ItemList({
  items,
  UpdateFavorite,
  RemoveItem,
}: {
  items: Item[];
  UpdateFavorite: (item: Item) => Promise<void>;
  RemoveItem?: (item: Item) => Promise<void>;
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
    <div>
      <ul className="grid grid-cols-1 gap-8 list-none p-0 m-0">
        {displayedItems.map((item, i) => (
          <li key={i} className="mb-2">
            <div className="flex items-center justify-center">
              <a href="#" aria-label="Tops">
                <Image
                  className="w-36 h-36 object-cover"
                  src="/images/Tops.png"
                  alt="Tops"
                  width={144}
                  height={144}
                />
                {item.name}
                <div>{item.size}</div>
                <div>${item.price}</div>
                <div
                  onClick={() => handleFavoriteClick(item)}
                  style={{ cursor: "pointer", fontSize: "24px" }}
                >
                  {item.favorite ? "❤️" : "♡"}
                </div>
                {RemoveItem && (
                  <button
                    onClick={() => handleRemoveClick(item)}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
