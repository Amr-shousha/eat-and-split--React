import { use, useState } from "react";
import "../App.css";

// why i used bill input as text not a number
//option
export default function App() {
  const [friends, setFriends] = useState([
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Omar",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
    {
      id: 49976,
      name: "Ahmed",
      image: "https://i.pravatar.cc/48?u=49976",
      balance: -10,
    },
  ]);

  const [selected, setSelected] = useState(null);

  const [toggel, setToggel] = useState(true);
  function handelToggel() {
    setToggel((cur) => !cur);
  }
  function handelSelection(friend) {
    setSelected((cur) => (cur?.id === friend.id ? null : friend));
    setToggel(false);
  }
  function handelSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelected(null);
  }
  return (
    <>
      {" "}
      <h1 id="title">Eat & Split</h1>
      <div className="app-container">
        {" "}
        <div className="sidebar">
          <FrindesList
            friends={friends}
            selected={selected}
            onSelection={handelSelection}
          ></FrindesList>

          {toggel && (
            <FormAddFriend
              setFriends={setFriends}
              setToggel={setToggel}
            ></FormAddFriend>
          )}

          <Button onClick={handelToggel}>
            {" "}
            {toggel ? "close" : "add friend"}
          </Button>
        </div>
        {selected && (
          <FormSplitBill
            selected={selected}
            onSplit={handelSplitBill}
          ></FormSplitBill>
        )}{" "}
      </div>
    </>
  );
}

function FrindesList({ friends, onSelection, selected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selected={selected}
          onSelection={onSelection}
        ></Friend>
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selected }) {
  const isSelected = friend.id === selected?.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      {
        <>
          <img src={friend.image} alt="" />
          <h3>{friend.name}</h3>{" "}
          {friend.balance < 0 && (
            <p className="red">
              you owe {Math.abs(friend.balance)}$ to your friend{" "}
              {friend.name}{" "}
            </p>
          )}
          {friend.balance > 0 && (
            <p className="green">
              {friend.name} owes you {Math.abs(friend.balance)}$
            </p>
          )}
          {friend.balance === 0 && (
            <p>you and your friend {friend.name} are even </p>
          )}
          {/* to recieve data from this specific friend  */}
          <Button onClick={() => onSelection(friend)}>
            {" "}
            {isSelected ? "Close" : "Select"}
          </Button>
        </>
      }
    </li>
  );
}

function FormAddFriend({ setFriends, setToggel }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handelSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      balance: 0,
      name,
      image: `${image}?u=${id}`,
    };
    console.log(newFriend);
    setFriends((cur) => [...cur, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
    console.log(newFriend);
    setToggel(false);
  }
  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>🐶 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label> Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button> submit</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {" "}
      {children}
    </button>
  );
}

function FormSplitBill({ selected, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPAying, setWhoIsPAying] = useState("user");
  function onSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplit(whoIsPAying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={onSubmit}>
      <h2>split with {selected.name}</h2>
      <label>💰bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>your expenses</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>{selected.name} expenses</label>
      <input type="text" disabled value={paidByFriend} />

      <label> who is paying </label>
      <select
        value={whoIsPAying}
        onChange={(e) => setWhoIsPAying(e.target.value)}
      >
        <option value="user"> me</option>
        <option value="friend">friend</option>
      </select>

      <Button> split bill</Button>
    </form>
  );
}
