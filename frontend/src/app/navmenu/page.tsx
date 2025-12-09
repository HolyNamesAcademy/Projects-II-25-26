"use client";

import { useState } from "react";

export default function NavMenu_SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Overlay backdrop - closes sidebar when clicked */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-white bg-opacity-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        type="button"
        className="text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M5 7h14M5 12h14M5 17h10"
          />
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform bg-white ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
          
          {/*href takes user to homepage*/}
          <a href="/" className="flex items-center ps-2.5 mb-5">
            {/* h-# corresponds to image size, specifically height */}
            <img
              src="https://sportshub2-uploads.vnn-prod.zone/files/sites/2879/2020/12/03002822/HolyNames_Logo.png"
              className="h-8 me-3"
              alt="HNA Cougars Logo"
            />
            <span className="self-center text-lg text-heading font-semibold whitespace-nowrap">
              HNA Swapeeee
            </span>
          </a>
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >

                {/*svg icon for "Home"*/}
                <svg 
                  className="w-6 h-6 text-gray-800 dark:text-white" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                  />
                </svg>

                <span className="ms-3">Home</span>
              </a>
            </li>


            {/*Search is an additional feature that can be implemented later
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <svg
                  className="w-4 h-4 transition duration-75 group-hover:text-fg-brand"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="m21 21-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Search</span>
              </a>
            </li>
            */}

            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <svg 
                  className="w-6 h-6 text-gray-800 dark:text-white" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24">
                  
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"/>
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Sell</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >


                {/*svg icon for "Favorites"*/}
                <svg 
                  className="w-6 h-6 text-gray-800 dark:text-white" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                  />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Favorites</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <svg 
                  className="w-6 h-6 text-gray-800 dark:text-white" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24">
                  <path 
                    stroke="currentColor" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"/>
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Cart</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Log In</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <svg 
                  className="w-6 h-6 text-gray-800 dark:text-white" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24">
                  
                  <path 
                    stroke="currentColor" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Register</span>
              </a>
            </li>

          </ul>
        </div>
      </aside>
    </>
  );
}
