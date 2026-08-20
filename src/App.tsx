import { useState } from "react";

import CreateForm from "./pages/CreateForm";
import Forms from "./pages/Forms";
import Enquiries from "./pages/Enquiries";

type Page =
  | "forms"
  | "create"
  | "enquiries";

function App() {

  const [page, setPage] =
    useState<Page>("forms");

  return (
    <>
      <nav className="admin-nav">

        <div className="logo">
          Form<span>Widget</span>
        </div>

        <div className="nav-actions">

          <button
            className={`btn ${
              page === "forms"
                ? "btn-primary"
                : "btn-secondary"
            }`}
            onClick={() =>
              setPage("forms")
            }
          >
            Forms
          </button>

          <button
            className={`btn ${
              page === "enquiries"
                ? "btn-primary"
                : "btn-secondary"
            }`}
            onClick={() =>
              setPage("enquiries")
            }
          >
            Enquiries
          </button>

          <button
            className={`btn ${
              page === "create"
                ? "btn-primary"
                : "btn-secondary"
            }`}
            onClick={() =>
              setPage("create")
            }
          >
            + Create Form
          </button>

        </div>

      </nav>

      {page === "forms" && (
        <Forms />
      )}

      {page === "create" && (
        <CreateForm />
      )}

      {page === "enquiries" && (
        <Enquiries />
      )}
    </>
  );
}

export default App;