import ItemListToggle from "@/components/itemListToggle";
import NavMenu from "@/components/navMenu";
import PrimaryButton from "@/components/primaryButton";

interface Item {
  id: number;
  name: string;
  price: number;
  size: string;
  type: string;
  color: string;
  favorite: boolean;
  image: string;
  description: string;
}

const items = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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

export default function List() {
  return (
    <div>
      <NavMenu />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:ml-64">
        <h1 className="text-5xl align-middle text-center">Sell</h1>

        <PrimaryButton text="Add New Item" type="link" href="/sell/add-item" />

        <ItemListToggle items={items} UpdateFavorite={UpdateFavorite} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
