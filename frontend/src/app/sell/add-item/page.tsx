"use client";

import { useRouter } from "next/navigation";
import ItemForm from "@/components/itemForm";
import NavMenu from "@/components/navMenu";

export default function AddItemPage() {
  const router = useRouter();

  return (
    <>
      <NavMenu />
      <main className="sm:ml-64 dark:bg-neutral-700">
        <h1 className="text-3xl sm:text-4xl text-center pt-8 dark:text-white">
          Add listing
        </h1>
        <ItemForm
          mode="create"
          submitLabel="Post Item to Swapeeee"
          onCancel={() => router.push("/sell")}
          onSuccess={() => router.push("/sell")}
        />
      </main>
    </>
  );
}
