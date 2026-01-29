'use client';

import { useState } from 'react';
import Image from "next/image";
import PrimaryButton from "@/components/primaryButton";
import NavMenu from "@/components/navMenu";

function ItemInfo({ contact, size, cost }: {contact: string, size: string, cost: string}) {
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
              <div onClick={handleFavoriteClick} style={{ cursor: 'pointer', fontSize: '24px' }}>{isFavorite ? "❤️" : "♡"}</div>

              {/*buy button
              <a
                href="#"
                title="Buy"
                className="flex items-center justify-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                role="button"
              >
                <svg
                  className="w-5 h-5 -ms-2 me-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width = "24"
                  height = "24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width = "2"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Buy
              </a>
              */}
            </div>

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            {/* underlined header */}
            <h1><u>Description:</u></h1>
            <p >
              John + Jenn <br />
              100% cotton <br />
              Like-new quality <br />
            </p>

            {/* Display contact, size, and cost*/}
            <div className="mt-4">
              <p>Contact: {contact}</p>
              <p>Size: {size}</p>
              <p>${cost}</p>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full flex justify-center pb-6">
        <div className="max-w-xs w-full">
          <PrimaryButton
            type = "link"
            text= "Buy"
            href="/viewitem"
          />
        </div>
      </div>

      </section>
    </>
  );
}

export default ItemInfo;
