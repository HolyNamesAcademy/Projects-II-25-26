"use client";

import { useState } from "react";
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
}: {
  items: Item[];
  UpdateFavorite: (item: Item) => Promise<void>;
}) {
  const [displayedItems, setDisplayedItems] = useState(items);

  const handleFavoriteClick = async (item: Item) => {
    // Optimistically remove the item from display
    setDisplayedItems(displayedItems.filter((i) => i.name !== item.name));

    // Call the server action to persist the change
    item.favorite = !item.favorite;
    await UpdateFavorite(item);
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
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
