"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ItemForm from "@/components/itemForm";
import NavMenu from "@/components/navMenu";
import PrimaryButton from "@/components/primaryButton";
import { api, type Item, handleApiError } from "@/lib/api";

export default function SellerItemEdit() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const id =
    typeof idParam === "string"
      ? Number.parseInt(idParam, 10)
      : Array.isArray(idParam)
        ? Number.parseInt(idParam[0], 10)
        : NaN;

  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setError("Invalid item");
      return;
    }
    setError(null);
    setForbidden(false);
    try {
      const [data, me] = await Promise.all([
        api.items.getById(id),
        api.auth.me(),
      ]);
      if (
        data.userId != null &&
        me.id != null &&
        Number(data.userId) !== Number(me.id)
      ) {
        setForbidden(true);
        setItem(null);
        return;
      }
      setItem(data);
    } catch (e) {
      setError(handleApiError(e));
      setItem(null);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!Number.isFinite(id)) {
    return (
      <>
        <NavMenu />
        <section className="min-h-screen sm:ml-64 dark:bg-neutral-700 px-4 py-16">
          <p className="text-red-500 text-center" role="alert">
            Invalid item
          </p>
        </section>
      </>
    );
  }

  if (forbidden) {
    return (
      <>
        <NavMenu />
        <section className="min-h-screen sm:ml-64 dark:bg-neutral-700 px-4 py-16 flex flex-col items-center gap-4">
          <p className="text-center dark:text-white" role="alert">
            You can only edit your own listings.
          </p>
          <PrimaryButton
            type="link"
            text="View as buyer"
            href={`/items/${id}`}
          />
        </section>
      </>
    );
  }

  if (error && !item) {
    return (
      <>
        <NavMenu />
        <section className="min-h-screen sm:ml-64 dark:bg-neutral-700 px-4 py-16">
          <p className="text-red-500 text-center" role="alert">
            {error}
          </p>
        </section>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <NavMenu />
        <section className="min-h-screen sm:ml-64 dark:bg-neutral-700 px-4 py-16">
          <p className="text-center dark:text-white">Loading…</p>
        </section>
      </>
    );
  }

  return (
    <>
      <NavMenu />
      <main className="sm:ml-64 dark:bg-neutral-700">
        <h1 className="text-3xl sm:text-4xl text-center pt-8 dark:text-white">
          Edit listing
        </h1>
        <ItemForm
          mode="edit"
          itemId={id}
          initialItem={item}
          submitLabel="Save changes"
          onSuccess={() => router.push("/sell")}
          onCancel={() => router.push("/sell")}
        />
        <div className="w-full flex justify-center pb-8">
          <div className="max-w-xs w-full">
            <PrimaryButton
              type="link"
              text="View as buyer"
              href={`/items/${item.id}`}
            />
          </div>
        </div>
      </main>
    </>
  );
}
