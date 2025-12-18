import PrimaryButton from "@/components/primaryButton";
import ItemList from "@/components/itemList";

const items = [
  { name: "Item 1", type: "Tops", size: "Large", image: "placeholder", price: 10 },
  { name: "Item 2", type: "Bottoms", size: "Medium", image: "placeholder", price: 20 },
  { name: "Item 3", type: "Tops", size: "Small", image: "placeholder", price: 15 },
  { name: "Item 4", type: "Dresses", size: "Large", image: "placeholder", price: 25 },
  { name: "Item 5", type: "Shoes", size: "Medium", image: "placeholder", price: 18 }
]

export default function List() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-5xl align-middle text-center">
          All Items
        </h1>

        <ItemList items={items} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}