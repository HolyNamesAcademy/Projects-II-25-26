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

export default function ItemListToggle({
  items,
  UpdateFavorite,
}: {
  items: Item[];
  UpdateFavorite: (item: Item) => Promise<void>;
}) {
  const [displayedItems, setDisplayedItems] = useState(items);

  const handleFavoriteClick = async (item: Item, index: number) => {
    // Optimistically update the item's favorite status
    const updatedItems = [...displayedItems];
    updatedItems[index].favorite = !updatedItems[index].favorite;
    setDisplayedItems(updatedItems);

    // Call the server action to persist the change
    await UpdateFavorite(updatedItems[index]);
  };

  return (
    <div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0 m-0">
        {displayedItems.map((item, i) => (
          <li key={i} className="mb-2">
            <div className="flex items-center justify-center">
              <a href="#" aria-label="Tops">
                <Image
                  className="w-60 h-60 object-cover"
                  src="/images/Tops.png"
                  alt="Tops"
                  width={240}
                  height={240}
                />
                {item.name}
                <div>{item.size}</div>
                <div>${item.price}</div>
                <div
                  onClick={() => handleFavoriteClick(item, i)}
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
