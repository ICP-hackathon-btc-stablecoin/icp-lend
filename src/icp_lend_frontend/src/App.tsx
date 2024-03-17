import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import Layout from "./components/Layout";

import "./styles/globals.css";
// @ts-expect-error "import alias"
import { icp_lend_backend } from "declarations/icp_lend_backend";

export default function App() {
  console.log(icp_lend_backend);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
