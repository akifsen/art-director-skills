import { TICKETS } from "./jobs.js";

export default function App() {
  return (
    <div>
      <h1>Tide Bindery</h1>
      <p>Internal tickets. No theme is installed yet.</p>
      <p>{TICKETS.length} tickets exist in data. List, detail, and hold form are not built.</p>
    </div>
  );
}
