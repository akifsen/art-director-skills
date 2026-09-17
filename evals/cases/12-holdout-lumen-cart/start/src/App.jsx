import { STOPS } from "./stops.js";

export default function App() {
  return (
    <div>
      <h1>Lumen Cart</h1>
      <p>Bookmobile stop log. No theme is installed yet.</p>
      <p>{STOPS.length} stops exist in data. List, detail, and complete/skip are not built.</p>
    </div>
  );
}
