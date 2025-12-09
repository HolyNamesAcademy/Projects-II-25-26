interface Item {
  name:string;
  type: string; 
  size: string;
  image: string;
  price: number;
}

export default function ItemList({ items }: { items: Item[] }) {
  return (
    <div>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="mb-2">
            {item.image}, {item.name}, {item.type}, {item.size}, ${item.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
