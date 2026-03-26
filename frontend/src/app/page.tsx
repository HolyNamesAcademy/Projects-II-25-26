import PrimaryButton from "@/components/primaryButton";
import NavMenu from "@/components/navMenu";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center h-screen align-middle justify-center sm:ml-64 dark:bg-gray-900">
        <h1 className="text-5xl align-middle text-center dark:text-white">
          Welcome to HNA <span className="font-swapeeee">Swapeeee!</span>
        </h1>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <Link href="/items?type=TOPS" aria-label="Tops">
              <img
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Tops.png"
                alt="Tops"
              />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/items?type=DRESSES" aria-label="Dresses">
              <img
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Dresses.png"
                alt="Dresses"
              />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/items?type=BOTTOMS" aria-label="Bottoms">
              <img
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Bottoms.png"
                alt="Bottoms"
              />
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/items?type=SHOES" aria-label="Shoes">
              <img
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Shoes.png"
                alt="Shoes"
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <PrimaryButton type="link" text="Shop All Items" href="/items" />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
