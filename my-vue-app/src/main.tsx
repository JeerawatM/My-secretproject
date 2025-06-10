import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import ReactDOM from "react-dom/client";
import App from "./App";
import Uxui from "./components/uxui";
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/uxui",
    element: <Uxui />,
  },
])

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />
);
