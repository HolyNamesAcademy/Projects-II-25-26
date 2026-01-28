import Image from "next/image";
import PrimaryButton from "@/components/primaryButton";
import NavMenu from "@/components/navMenu";

export default function Home() {
  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center h-screen align-middle justify-center">
        <h1 className="text-5xl align-middle text-center">
          Welcome to HNA <span className="font-swapeeee">Swapeeee</span>!
        </h1>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <a href="#" aria-label="Tops">
              <Image
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Tops.png"
                alt="Tops"
                width={144}
                height={144}
              />
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a href="#" aria-label="Dresses">
              <Image
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Dresses.png"
                alt="Dresses"
                width={144}
                height={144}
              />
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a href="#" aria-label="Bottoms">
              <Image
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Bottoms.png"
                alt="Bottoms"
                width={144}
                height={144}
              />
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a href="#" aria-label="Shoes">
              <Image
                className="rounded-full w-36 h-36 object-cover"
                src="/images/Shoes.png"
                alt="Shoes"
                width={144}
                height={144}
              />
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <PrimaryButton type="link" text="Shop All Items" href="/list" />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
