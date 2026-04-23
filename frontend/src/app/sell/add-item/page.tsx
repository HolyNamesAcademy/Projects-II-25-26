"use client";

import { useRouter } from "next/navigation";
import ItemForm from "@/components/itemForm";

export default function AddItemPage() {
  const router = useRouter();

  return (
    <ItemForm
      mode="create"
      submitLabel="Post Item to Swapeeee"
      onCancel={() => router.push("/sell")}
    />
  );
}
