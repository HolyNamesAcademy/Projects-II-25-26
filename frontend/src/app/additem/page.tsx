 'use client';
import PrimaryButton from "@/components/primaryButton";
import { useState } from "react";
import TextInput from "@/components/textInput";

function CreateItem() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [size, setSize] = useState("");
  const [cost, setCost] = useState("");


  {/*image uploader*/}
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  {/*image remover*/}
  function removePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl(null);
  }

  return (
  <section className="min-h-screen flex flex-col justify-between mx-4 py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">

            {/*image preview*/}
            {previewUrl ? (
              <img
                className="w-full dark:hidden rounded-lg object-cover"
                src={previewUrl}
                alt="preview"
              />
            ) : (
              <img
                className="w-full dark:hidden rounded-lg object-cover"
                width={200}
                height={200}
              />
            )}
            <div className="mt-2">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {previewUrl && (
                <button type="button" onClick={removePreview} className="ms-2 text-sm text-red-600">Remove</button>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">

            <TextInput
              label="Item Name"
              type="text"
              value={itemName}
              onChange={(e) => setItemName((e.target as HTMLInputElement).value)}
              placeholder = "i.e. White Knit Sweater"
            />

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            <TextInput
              label = "Description"
              type = "text"
              value={description}
              onChange={(e) => setDescription((e.target as HTMLInputElement).value)}
              placeholder="Brand, material, quality..."
            />

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            {/* Display contact, size, and cost*/}
            <div className="mt-4">
              <TextInput 
                label="Contact" 
                type = "text"
                value={contact} 
                onChange={(e) => setContact((e.target as HTMLInputElement).value)} 
                placeholder = "Holly Academy '26"
              />
              
              <TextInput 
                label="Size" 
                type = "text"
                value={size} 
                onChange={(e) => setSize((e.target as HTMLInputElement).value)} 
                placeholder = "XS, S, M, L, XL..."
              />
              
              <TextInput 
                label="Price" 
                type="number" 
                value={cost} 
                onChange={(e) => setCost((e.target as HTMLInputElement).value)} 
                placeholder = "$"
              />
  
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-screen-lg px-4 mx-auto 2xl:px-0 mt-12">
        <PrimaryButton text="Post Item to Swapeeee" type="button" />
      </div>

    </section>
  );
}


export default CreateItem;