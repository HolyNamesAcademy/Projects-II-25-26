import PrimaryButton from "@/components/primaryButton";
import ItemList from "@/components/itemList";
import NavMenu from "@/components/navMenu";

interface Item {
  name: string;
  price: number;
  size: string;
  type: string;
  color: string;
  favorite: boolean;
  image: string;
  description: string;
}

let items = [
  {
    name: "Item 1",
    price: 10,
    size: "Large",
    type: "Tops",
    color: "",
    favorite: true,
    image: "placeholder",
    description: "",
  },
  {
    name: "Item 2",
    price: 20,
    size: "Medium",
    type: "Bottoms",
    color: "",
    favorite: false,
    image: "placeholder",
    description: "",
  },
  {
    name: "Item 3",
    price: 15,
    size: "Small",
    type: "Tops",
    color: "",
    favorite: true,
    image: "placeholder",
    description: "",
  },
  {
    name: "Item 4",
    price: 25,
    size: "Large",
    type: "Dresses",
    color: "",
    favorite: false,
    image: "placeholder",
    description: "",
  },
  {
    name: "Item 5",
    price: 18,
    size: "Medium",
    type: "Shoes",
    color: "",
    favorite: true,
    image: "placeholder",
    description: "",
  },
];

const UpdateFavorite = async (item: Item) => {
  "use server";
  console.log("Favorite clicked for:", item.name, "New status:", item.favorite);
};

const Delete = async (item: Item) => {
  "use server";
  items = items.filter((i) => i !== item);
  console.log("Delete clicked for:", item.name);
};

export default function Cart() {
  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center pt-[32px] sm:ml-64 dark:bg-gray-900">
        <h1 className="text-5xl align-middle text-center dark:text-white">Cart</h1>

        {/*TODO: make "add to cart" button???*/}
        <ItemList
          items={items}
          UpdateFavorite={UpdateFavorite}
          RemoveItem={Delete}
        />

        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {items
            .filter((item) => !item)
            .map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 border rounded dark:border-gray-600 dark:text-white"
              >
                <span className="dark:text-white">{item.name}</span>
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
