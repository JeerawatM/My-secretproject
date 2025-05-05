import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <RouterProvider router={router} />
);
