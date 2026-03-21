"use client";

import { useState } from "react";
import Image from "next/image";
import PrimaryButton from "@/components/primaryButton";
import NavMenu from "@/components/navMenu";

function ItemInfo({
  name,
  price,
  size,
  type,
  color,
  image,
  description,
}: {
  name: string;
  price: number;
  size: string;
  type: string;
  color: string;
  image: string;
  description: string;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <NavMenu />
      <section className="min-h-screen flex flex-col justify-between mx dark:hidden-4 py-8 bg-white md:py-16 dark:bg-gray-900 antialiased sm:ml-64">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid dark:hidden lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <Image
                className="w-full dark:hidden rounded-lg object-cover"
                src="/images/white-sweater.jpg"
                alt="white knit sweater picture"
                width={200}
                height={200}
              />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                White Knit Sweater
              </h1>

              <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
                <div
                  onClick={handleFavoriteClick}
                  style={{ cursor: "pointer", fontSize: "24px" }}
                >
                  {isFavorite ? "❤️" : "♡"}
                </div>
              </div>

              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

              {/* underlined header */}
              <h1>
                <u>Description:</u>
              </h1>
              <p>
                John + Jenn <br />
                100% cotton <br />
                Like-new quality <br />
              </p>

              {/* Display contact, size, and price*/}
              <div className="mt-4">
                <p>Type: {type}</p>
                <p>Size: {size}</p>
                <p>Color: {color}</p>
                <p>${price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center pb-6">
          <div className="max-w-xs w-full">
            <PrimaryButton type="button" text="Contact Seller" onClick={() => {window.alert("Contact Seller clicked");}} />
          </div>
        </div>
      </section>
    </>
  );
}

export default ItemInfo;
