"use client";
import PrimaryButton from "@/components/primaryButton";
import { useState } from "react";
import TextInput from "@/components/textInput";
import Image from "next/image";
import {
  api,
  ITEM_SIZES,
  ITEM_TYPES,
  ITEM_COLORS,
  handleApiError,
} from "@/lib/api";

function CreateItem() {
  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState<(typeof ITEM_SIZES)[number]>(ITEM_SIZES[2]);
  const [type, setType] = useState<(typeof ITEM_TYPES)[number]>(ITEM_TYPES[0]);
  const [color, setColor] = useState<(typeof ITEM_COLORS)[number]>(
    ITEM_COLORS[0]
  );
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  {
    /*image uploader*/
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  {
    /*image remover*/
  }
  function removePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
  }

  const handleSubmit = async () => {
    setSubmitError(null);
    const priceNum = Number.parseInt(price, 10);
    if (!itemName.trim()) {
      setSubmitError("Please enter an item name.");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setSubmitError("Please enter a valid price.");
      return;
    }

    try {
      await api.items.create({
        name: itemName.trim(),
        price: priceNum,
        size,
        type,
        color,
        image: previewUrl || "",
        description: description.trim(),
      });
    } catch (e) {
      setSubmitError(handleApiError(e));
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-between mx-4 py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            {/*image preview*/}
            {previewUrl ? (
              <Image
                className="w-full rounded-lg object-cover"
                src={previewUrl}
                alt="Item preview"
                width={200}
                height={200}
                unoptimized
              />
            ) : (
              <div
                className="w-full rounded-lg object-cover bg-gray-200 dark:bg-gray-700"
                style={{ width: "100%", height: "200px" }}
              />
            )}
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {previewUrl && (
                <button
                  type="button"
                  onClick={removePreview}
                  className="ms-2 text-sm text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            {/* Display contact, size, and price*/}
            <div className="mt-4">
              <TextInput
                label="Item Name"
                type="text"
                value={itemName}
                onChange={(e) =>
                  setItemName((e.target as HTMLInputElement).value)
                }
                placeholder="i.e. White Knit Sweater"
              />

              <TextInput
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice((e.target as HTMLInputElement).value)}
                placeholder="$"
              />

              <label className="block mt-4 text-sm font-medium dark:text-white">
                Size
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
                  value={size}
                  onChange={(e) =>
                    setSize(e.target.value as (typeof ITEM_SIZES)[number])
                  }
                >
                  {ITEM_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mt-4 text-sm font-medium dark:text-white">
                Type
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as (typeof ITEM_TYPES)[number])
                  }
                >
                  {ITEM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mt-4 text-sm font-medium dark:text-white">
                Color
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2"
                  value={color}
                  onChange={(e) =>
                    setColor(e.target.value as (typeof ITEM_COLORS)[number])
                  }
                >
                  {ITEM_COLORS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <TextInput
                label="Description"
                type="text"
                value={description}
                onChange={(e) =>
                  setDescription((e.target as HTMLInputElement).value)
                }
                placeholder="Brand, material, quality..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg px-4 mx-auto 2xl:px-0 mt-12">
        {submitError && (
          <p className="text-red-500 text-sm mb-4" role="alert">
            {submitError}
          </p>
        )}
        <PrimaryButton
          text="Post Item to Swapeeee"
          type="button"
          onClick={handleSubmit}
        />
      </div>
    </section>
  );
}

export default CreateItem;
