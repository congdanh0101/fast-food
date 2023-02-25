import { useState } from "react";

function App() {
  const [info, setInfo] = useState({
    name: "ABC",
    age: 18,
    gender: "male",
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    setInfo((prev) => {
      const a = 5;
      const b = 12;

      return {
        ...prev,
        address: "HCM",
        sum: a * b,
      };
    });
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>{JSON.stringify(info)}</h1>
      <button onClick={handleUpdate}>update</button>
    </div>
  );
}

export default App;
