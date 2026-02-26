"use client";
import PrimaryButton from "@/components/primaryButton";
import { useState } from "react";
import TextInput from "@/components/textInput";
import Image from "next/image";
import { api } from "@/lib/api";

function CreateItem() {
  const [_imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");

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
    console.log("Item Name:", itemName);
    console.log("Price:", price);
    console.log("Size:", size);
    console.log("Type:", type);
    console.log("Color:", color);
    console.log("Image File:", _imageFile);
    console.log("Description:", description);

    const item = await api.items.create({
      name: itemName,
      price: parseInt(price),
      size,
      type,
      color,
      description,
      image: previewUrl || "",
    });

    console.log("Created item:", item);
  };

  return (
    <section className="min-h-screen flex flex-col justify-between mx-4 py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            {/*image preview*/}
            {previewUrl ? (
              <Image
                className="w-full dark:hidden rounded-lg object-cover"
                src={previewUrl}
                alt="Item preview"
                width={200}
                height={200}
                unoptimized
              />
            ) : (
              <div
                className="w-full dark:hidden rounded-lg object-cover bg-gray-200 dark:bg-gray-700"
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

              <TextInput
                label="Size"
                type="text"
                value={size}
                onChange={(e) => setSize((e.target as HTMLInputElement).value)}
                placeholder="XS, S, M, L, XL..."
              />

              <TextInput
                label="Type"
                type="text"
                value={type}
                onChange={(e) => setType((e.target as HTMLInputElement).value)}
                placeholder="Sweater, Jacket, Pants..."
              />

              <TextInput
                label="Color"
                type="text"
                value={color}
                onChange={(e) => setColor((e.target as HTMLInputElement).value)}
                placeholder="White, Black, Red..."
              />

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
