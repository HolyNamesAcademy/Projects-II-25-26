"use client";

import { useState, useRef, useEffect } from "react";
import PrimaryButton from "@/components/primaryButton";

export default function CategoryFilter() {
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    function measure() {
      if (!isDropdownOpen) return;
      const containerRect = containerRef.current?.getBoundingClientRect();
      const buttonRect = buttonRef.current?.getBoundingClientRect();
      if (containerRect && buttonRect) {
        setDropdownLeft(buttonRect.left - containerRect.left);
        setDropdownWidth(buttonRect.width);
      }
      // Measure dropdown height after it renders
      requestAnimationFrame(() => {
        const h = dropdownRef.current?.offsetHeight || 0;
        setDropdownHeight(h);
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isDropdownOpen]);
  return (
    <form
      className="max-w-4xl mx-auto my-4"
      style={{ marginBottom: isDropdownOpen ? dropdownHeight : undefined }}
    >
      <div
        ref={containerRef}
        className="relative flex shadow-xs rounded-lg -space-x-0.5"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <label
          htmlFor="search-dropdown"
          className="block mb-2.5 text-sm font-medium text-heading sr-only"
        >
          Your Email
        </label>
        <button
          ref={buttonRef}
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-controls="dropdown"
          className="relative inline-flex items-center shrink-0 z-10 text-body bg-neutral-secondary-medium box-border border-2 border-gray-300 hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-0 font-medium leading-5 rounded-l-lg text-sm px-4 py-2.5 focus:outline-none"
        >
          <svg
            className="w-4 h-4 me-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"
            />
          </svg>
          All categories
          <svg
            className="w-4 h-4 ms-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </button>
        <div
          id="dropdown"
          ref={dropdownRef}
          style={{ left: dropdownLeft, top: "100%", width: dropdownWidth }}
          className={`z-10 ${isDropdownOpen ? "block" : "hidden"} absolute bg-neutral-primary-medium border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg`}
        >
          <ul
            className="p-2 text-sm text-body font-medium"
            aria-labelledby="dropdown-button"
          >
            <li>
              <a
                href="#"
                className="block p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md focus:outline-none focus:bg-neutral-tertiary-medium focus:text-heading"
              >
                Tops
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md focus:outline-none focus:bg-neutral-tertiary-medium focus:text-heading"
              >
                Bottoms
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md focus:outline-none focus:bg-neutral-tertiary-medium focus:text-heading"
              >
                Dresses
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-md focus:outline-none focus:bg-neutral-tertiary-medium focus:text-heading"
              >
                Shoes
              </a>
            </li>
          </ul>
        </div>
        <input
          type="text"
          id="search-dropdown"
          className="relative pl-3 pr-50 py-2.5 bg-neutral-secondary-medium border-2 border-gray-300 text-heading text-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full placeholder:text-body"
          placeholder="Search for items"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
        />
        <button
          type="button"
          onMouseDown={() => setIsSearchPressed(true)}
          onMouseUp={() => setIsSearchPressed(false)}
          onMouseLeave={() => setIsSearchPressed(false)}
          onTouchStart={() => setIsSearchPressed(true)}
          onTouchEnd={() => setIsSearchPressed(false)}
          style={{ backgroundColor: isSearchPressed ? "#e5e7eb" : undefined }}
          className="inline-flex items-center text-black bg-brand hover:bg-brand-strong active:bg-neutral-tertiary-medium active:text-heading box-border border-2 border-gray-300 focus:ring-0 shadow-xs font-medium leading-5 rounded-r-lg text-sm px-4 py-2.5 focus:outline-none"
        >
          <svg
            className="w-4 h-4 me-1.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="2"
              d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          Search
        </button>
      </div>
    </form>
  );
}
