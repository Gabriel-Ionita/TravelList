import { useState } from "react";
// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Charger", quantity: 1, packed: true },
// ];

/*
  const x = [1, 2, 3, 4, 5].map((num) => num * 2);
  console.log(x); // [2,4,6,8,10]
  const y = [1, 2, 3, 4, 5].map((num) => num % 2 === 0);
  console.log(y); // [false, true, false, true, false]
  const a = [1, 2, 3, 4, 5].filter((num) => num % 2 === 0);
  console.log(a); // [2,4]
  const b = [1, 2, 3, 4, 5].filter((num) => num % 2 !== 0);
  console.log(b); // [1,3,5]
  const c = [1, 2, 3, 4, 5].reduce((acc, num) => acc + num);
  console.log(c); // 15 (1+2+3+4+5)
  const d = [1, 2, 3, 4, 5].reduce((acc, num) => acc + num, 10);
  console.log(d); // 25 (10+1+2+3+4+5)
  const z = [1, 2, 3, 4, 5].reduce((acc, num) => acc + num, 0);
  console.log(z); // 15
  const w = [1, 2, 3, 4, 5].reduce((acc, num) => {
    if (num % 2 === 0) {
      acc.push(num);
    }
    return acc;
  }, []);
  console.log(w); // [2,4]
*/

export default function App() {
  const [items, setItems] = useState([]); //state for the items

  function handleAddItem(item) {
    setItems((items) => [...items, item]); // add new items array to the state
  }

  function handleRemoveItem(id) {
    setItems((items) => items.filter((item) => item.id !== id)); // remove item from the list if id is not equal to the id of the item
  }

  function handleToggleItem(id) {
    setItems(
      (items) =>
        items.map(
          (
            item //item is the current item in the array
          ) => (item.id === id ? { ...item, packed: !item.packed } : item)
        ) // toggle the packed status of the item
    );
  }

  function handleClearList() {
    setItems([]);
  }

  return (
    <div className="App">
      <Logo />
      <Form onAddItems={handleAddItem} onClearItems={handleClearList} />
      <PackingList
        items={items}
        onRemoveItem={handleRemoveItem}
        onToggleItem={handleToggleItem}
        onClearItems={handleClearList}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 🎒</h1>;
}

function Form({ onAddItems, onClearItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault(); // cancel default behavior of the form

    if (!description) return; // don't add empty items

    const newItem = { id: Date.now(), description, quantity, packed: false };

    onAddItems(newItem);

    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))} // convert to number
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)} //target.value is a string by default
      />
      <button>Add</button>
      <button type="button" onClick={onClearItems}>
        Clear list
      </button>
    </form>
  );
}

function PackingList({ items, onRemoveItem, onToggleItem, onClearItems }) {
  const [sortBy, setSortBy] = useState("input");
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "input") return a.id - b.id;
    if (sortBy === "description")
      return a.description.localeCompare(b.description);
    if (sortBy === "packed") return a.packed - b.packed;
    return 0;
  });

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            onRemoveItem={onRemoveItem}
            onToggleItem={onToggleItem}
            onClearItems={onClearItems}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed</option>
        </select>
        <button
          type="button"
          onClick={onClearItems}
          style={{ marginLeft: "10px" }}
        >
          Clear list
        </button>
      </div>
    </div>
  );
}
function Item({ item, onRemoveItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button className="Xbtn" onClick={() => onRemoveItem(item.id)}>
        ❌
      </button>
    </li>
  );
}

function Stats({ items }) {
  if (items.length === 0) {
    return (
      <p className="stats">Start adding some items to your packing list 🛄</p>
    );
  }
  const numItems = items.length;
  const numPackedItems = items.filter((item) => item.packed).length;
  const packedPercentage = Math.round((numPackedItems / numItems) * 100);

  return (
    <footer className="stats">
      {packedPercentage === 100
        ? "You're all set for your trip!✈"
        : `💼 You have ${numItems} items on your list, and you already packed
      ${numPackedItems} (${packedPercentage || 0}%)`}
    </footer>
  );
}
