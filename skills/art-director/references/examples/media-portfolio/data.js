export const studio = {
  name: "Rail Still",
  email: "desk@railstill.example",
  line: "Catalog stills of architectural lighting. One fixture per frame."
};

export const works = [
  {
    id: "linear-40",
    title: "Linear 40",
    place: "Ferry cabin",
    year: "2026",
    note: "48V ceiling channel. Cool daylight, empty cabin, no retouch of the room.",
    src: new URL("./stills/linear40.png", import.meta.url).href,
    ratio: "16 / 9",
    featured: true
  },
  {
    id: "dock-flood",
    title: "Dock flood",
    place: "Municipal yard",
    year: "2026",
    note: "Pole-mounted flood at blue hour. Wet concrete kept in the crop.",
    src: new URL("./stills/dock-flood.png", import.meta.url).href,
    ratio: "4 / 3"
  },
  {
    id: "task-arm",
    title: "Task arm",
    place: "Drafting table",
    year: "2026",
    note: "Close crop on the joints. The table stays oak; the paper stays paper.",
    src: new URL("./stills/task-arm.png", import.meta.url).href,
    ratio: "3 / 4"
  }
];
