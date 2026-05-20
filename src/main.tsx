/**
 * @file main.tsx
 * @description Entry point utama aplikasi React. Melakukan inisialisasi dan rendering komponen root App ke DOM.
 */

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);