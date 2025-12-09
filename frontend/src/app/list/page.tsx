import PrimaryButton from "@/components/primaryButton";
import ItemList from "@/components/itemList";

const items = [
  { name: "Item 1", type: "A", size: "Large", image: "placeholder", price: 10 },
  { name: "Item 2", type: "B", size: "Medium", image: "placeholder", price: 20 },
  { name: "Item 3", type: "A", size: "Small", image: "placeholder", price: 15 },
  { name: "Item 4", type: "C", size: "Large", image: "placeholder", price: 25 },
  { name: "Item 5", type: "B", size: "Medium", image: "placeholder", price: 18 }
]

export default function List() {
  return (
    <div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">
          List
        </h1>

        <ItemList items={items} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
