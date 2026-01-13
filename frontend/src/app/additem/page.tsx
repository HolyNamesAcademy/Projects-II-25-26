 'use client';
import PrimaryButton from "@/components/primaryButton";
import { useState } from "react";
import TextInput from "@/components/textInput";

function CreateItem() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  {/*TODO: Determine if previewUrl is necessary. if not, delete all code corresponding to previewUrl */}
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [size, setSize] = useState("");
  const [cost, setCost] = useState("");

  
  {/*TODO: the following 2 functions are for uploading images, try to understand them. Ask if they are correct. */}
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

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

            {/* Image preview / uploader for seller */}
            {previewUrl ? (
              <img
                className="w-full dark:hidden rounded-lg object-cover"
                src={previewUrl}
                alt="preview"
              />
            ) : (
              <img
                className="w-full dark:hidden rounded-lg object-cover"
                src="/images/whiteknitsweater-demo.png"
                alt="white knit sweater picture"
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

            {/*TODO: change item header to be textbox for seller*/}
            <TextInput
              label="Item Name"
              type="text"
              value={itemName}
              onChange={(e) => setItemName((e.target as HTMLInputElement).value)}
              className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white mb-2"
            />

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            {/* underlined header */}
            {/*TODO: change <p> text to be editable textbox for seller*/}
            <h1><u>Description:</u></h1>
            <TextInput
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
              placeholder="Describe your item here (brand, material, quality, ...)"
              className="mb-2"
            />

            {/* Display contact, size, and cost*/}
            {/*TODO: change Contact, Size, and $ to be editable textbox for seller*/}
            <div className="mt-4">
              <TextInput label="Contact" value={contact} onChange={(e) => setContact((e.target as HTMLInputElement).value)} />
              <TextInput label="Size" value={size} onChange={(e) => setSize((e.target as HTMLInputElement).value)} />
              <TextInput label="Price" type="number" value={cost} onChange={(e) => setCost((e.target as HTMLInputElement).value)} />
            </div>

          </div>
        </div>
      </div>

      <PrimaryButton 
              text="Buy" 
              href="/additem" 
            />

    </section>
  );
}

export default CreateItem;