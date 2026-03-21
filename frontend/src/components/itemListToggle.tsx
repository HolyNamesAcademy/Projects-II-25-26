"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Item } from "@/lib/api";
import SecondaryButton from "@/components/secondaryButton";

function listImageSrc(image: string): string {
  if (!image?.trim()) return "/images/Tops.png";
  if (image.startsWith("/")) return image;
  if (/^https?:\/\//i.test(image)) return image;
  return "/images/Tops.png";
}

export default function ItemListToggle({
  items,
  UpdateFavorite,
  showFavoritesButton = false,
  showAddToCartButton = false,
}: {
  items: Item[];
  UpdateFavorite: (item: Item) => Promise<void>;
  showFavoritesButton?: boolean;
  showAddToCartButton?: boolean;
}) {
  const [displayedItems, setDisplayedItems] = useState(items);

  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  const handleFavoriteClick = async (item: Item, index: number) => {
    const nextFavorite = !item.favorite;
    const updatedItems = displayedItems.map((it, idx) =>
      idx === index ? { ...it, favorite: nextFavorite } : it
    );
    setDisplayedItems(updatedItems);
    await UpdateFavorite({ ...item, favorite: nextFavorite });
  };

  return (
    <div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0 m-0">
        {displayedItems.map((item, i) => (
          <li key={item.id} className="mb-2">
            <div className="flex flex-col items-center justify-center dark:text-white">
              <Link
                href={`/items/${item.id}`}
                className="text-center"
                aria-label={item.name}
              >
                <Image
                  className="w-60 h-60 object-cover"
                  src={listImageSrc(item.image)}
                  alt={item.name}
                  width={240}
                  height={240}
                  unoptimized={listImageSrc(item.image).startsWith("http")}
                />
                <div className="mt-2 font-medium">{item.name}</div>
                <div>{item.size}</div>
                <div>${item.price}</div>
              </Link>
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
              <div className="w-full flex justify-center pb-6">
                <div className="max-w-xs w-full">
                  <SecondaryButton
                    type="button"
                    text="Contact Seller"
                    onClick={() => {
                      window.alert("Contact Seller clicked");
                    }}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
