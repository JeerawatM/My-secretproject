import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
])

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />
);
