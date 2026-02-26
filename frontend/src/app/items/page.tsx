import ItemListToggle from "@/components/itemListToggle";
import NavMenu from "@/components/navMenu";
import CategoryFilter from "@/components/categoryFilter";

interface Item {
  name: string;
  price: number;
  size: string;
  type: string;
  color: string;
  image: string;
  favorite: boolean;
}

const items = [
  {
    name: "Item 1",
    price: 10,
    size: "Large",
    type: "Tops",
    color: "Red",
    image: "placeholder",
    favorite: true,
  },
  {
    name: "Item 2",
    price: 20,
    size: "Medium",
    type: "Bottoms",
    color: "Blue",
    image: "placeholder",
    favorite: false,
  },
  {
    name: "Item 3",
    price: 15,
    size: "Small",
    type: "Tops",
    color: "Green",
    image: "placeholder",
    favorite: true,
  },
  {
    name: "Item 4",
    price: 25,
    size: "Large",
    type: "Dresses",
    color: "Yellow",
    image: "placeholder",
    favorite: false,
  },
  {
    name: "Item 5",
    price: 18,
    size: "Medium",
    type: "Shoes",
    color: "Black",
    image: "placeholder",
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
        <h1 className="text-5xl align-middle text-center">Shop by Category</h1>

        {/*Add category filter component here*/}
        <CategoryFilter />

        <ItemListToggle items={items} UpdateFavorite={UpdateFavorite} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Empty Footer */}
      </footer>
    </div>
  );
}
