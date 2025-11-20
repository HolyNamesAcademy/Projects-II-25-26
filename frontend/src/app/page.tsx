import Image from "next/image";
import PrimaryButton from "@/components/primaryButton";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center h-screen align-middle justify-center">
          <h1 className="text-5xl align-middle">
            Welcome to HNA Swapeeee!
          </h1>
          <PrimaryButton text="Shop All Items" href ="/shop" />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
