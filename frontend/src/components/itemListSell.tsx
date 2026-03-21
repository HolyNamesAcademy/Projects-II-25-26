"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ItemImage from "@/components/itemImage";
import SecondaryButton from "@/components/secondaryButton";
import { type Item } from "@/lib/api";

export default function ItemListSell({ items }: { items: Item[] }) {
  return (
    <div className="dark:bg-gray-900">
      <ul className="grid grid-cols-1 md:grid-cols-5 gap-8 list-none p-0 m-0">
        {items.map((item, i) => (
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
              <div className="w-full flex justify-center pb-6">
                <div className="max-w-xs w-full">
                  <SecondaryButton
                    type="link"
                    text="Update Item"
                    href={`/sell/${item.id}`}
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
