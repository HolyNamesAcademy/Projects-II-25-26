import PrimaryButton from "@/components/primaryButton";
import ItemList from "@/components/itemList";

interface Item {
  name: string;
  type: string;
  size: string;
  image: string;
  price: number;
  favorite: boolean;
}

let items = [
  { name: "Item 1", type: "Tops", size: "Large", image: "placeholder", price: 10, favorite: true },
  { name: "Item 2", type: "Bottoms", size: "Medium", image: "placeholder", price: 20, favorite: false },
  { name: "Item 3", type: "Tops", size: "Small", image: "placeholder", price: 15, favorite: true },
  { name: "Item 4", type: "Dresses", size: "Large", image: "placeholder", price: 25, favorite: false },
  { name: "Item 5", type: "Shoes", size: "Medium", image: "placeholder", price: 18, favorite: true }
]

const UpdateFavorite = async (item: Item) => {
  "use server";
  console.log("Favorite clicked for:", item.name, "New status:", item.favorite);
}

const Delete = async (item: Item) => {
  "use server";
  items = items.filter(i => i !== item);
  console.log("Delete clicked for:", item.name);
}

export default function Cart() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center pt-[32px]">
        <h1 className="text-5xl align-middle text-center">
          Cart
        </h1>

        {/*TODO: make "add to cart" button???*/}
        <ItemList items={items} UpdateFavorite={UpdateFavorite} RemoveItem={Delete} />

        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {items.filter(item => !item).map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 border rounded">
              <span>{item.name}</span>
              <button 
                onClick={() => Delete(item)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      {/* empty footer */}
      </footer>
    </div>
  );
}

