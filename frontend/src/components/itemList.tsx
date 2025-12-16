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
        <ul className="grid grid-cols-1 gap-8 list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={i} className="mb-2">
            <div className="flex items-center justify-center">
              <a href="#" aria-label="Tops">
                <img className="w-36 h-36 object-cover" src="/images/Tops.png" alt="Tops" />
                {item.name}
                <div>{item.size}</div>
                <div>${item.price}</div>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
