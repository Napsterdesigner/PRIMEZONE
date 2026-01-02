
import { Member } from './types';

export const TEAM: Member[] = [
  { id: "u1", name: "ALEX FENIAS", role: "Funnel Builder", img: "https://i.postimg.cc/XZQw9gr3/ALEX.png" },
  { id: "u2", name: "ARCENIO HUMBERTO", role: "Copywriter", img: "https://i.postimg.cc/0Mj7nJSk/ARCENIO.png" },
  { id: "u3", name: "SCHNAYDER NANGY", role: "VSL Creator", img: "https://i.postimg.cc/r0s5jt45/NAPSTER.png" },
  { id: "u4", name: "ARTUR NAKARAPA", role: "Ads Maker", img: "https://i.postimg.cc/PpJ1y8Dd/ARTUR.png" },
  { id: "u5", name: "AGAPITO SUMBANE", role: "Offers Miner", img: "https://i.postimg.cc/Xv5QPMRt/AGAPITO.png" }
];

export const ACCESS_KEYS: Record<string, string> = {
  "PRETOSOLTO": "u1",
  "BADWOLF": "u2",
  "NAPSTER": "u3",
  "NAKA": "u4",
  "OTIPJAN": "u5",
  "PRIME": "admin"
};
