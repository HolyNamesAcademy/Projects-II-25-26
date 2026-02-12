import ItemListToggle from "@/components/itemListToggle";
import NavMenu from "@/components/navMenu";

interface Item {
  name: string;
  type: string;
  size: string;
  image: string;
  price: number;
  favorite: boolean;
}

const items = [
  {
    name: "Item 1",
    type: "Tops",
    size: "Large",
    image: "placeholder",
    price: 10,
    favorite: true,
  },
  {
    name: "Item 2",
    type: "Bottoms",
    size: "Medium",
    image: "placeholder",
    price: 20,
    favorite: false,
  },
  {
    name: "Item 3",
    type: "Tops",
    size: "Small",
    image: "placeholder",
    price: 15,
    favorite: true,
  },
  {
    name: "Item 4",
    type: "Dresses",
    size: "Large",
    image: "placeholder",
    price: 25,
    favorite: false,
  },
  {
    name: "Item 5",
    type: "Shoes",
    size: "Medium",
    image: "placeholder",
    price: 18,
    favorite: true,
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

        <ItemListToggle items={items} UpdateFavorite={UpdateFavorite} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
