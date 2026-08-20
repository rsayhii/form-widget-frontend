import { useEffect, useState } from "react";
import {
  getAllForms,
  deleteForm,
} from "../services/formService";

import type { FormItem } from "../types/form";

const Forms = () => {

  const [forms, setForms] =
    useState<FormItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);


    const [scriptForm, setScriptForm] =
  useState<FormItem | null>(null);

const [copied, setCopied] =
  useState(false);

  // =========================
  // LOAD FORMS
  // =========================

  const loadForms = async () => {

    try {

      setLoading(true);

      const response =
        await getAllForms();

      setForms(
        response.forms || []
      );

    } catch (error) {

      console.error(
        "Load Forms Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load forms"
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // DELETE FORM
  // =========================

  const handleDelete = async (
    formId: string
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this form?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(formId);

      await deleteForm(formId);

      setForms((prev) =>
        prev.filter(
          (form) =>
            form._id !== formId
        )
      );

      alert(
        "Form deleted successfully."
      );

    } catch (error) {

      console.error(
        "Delete Form Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete form"
      );

    } finally {

      setDeletingId(null);

    }
  };

  // =========================
  // LOAD ON PAGE OPEN
  // =========================

  useEffect(() => {

    loadForms();

  }, []);

  const getEmbedScript = (
  formId: string
) => {
  return `<script
  src="https://form-widget-backend.onrender.com/widget.js"
  data-form-id="${formId}">
</script>`;
};
const copyScript = async () => {
  if (!scriptForm) {
    return;
  }

  const script =
    getEmbedScript(
      scriptForm._id
    );

  await navigator.clipboard.writeText(
    script
  );

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};

  // =========================
  // LOADING UI
  // =========================

  if (loading) {

    return (
      <div className="app-container">

        <div className="page-wrapper">

          <div className="page-header">

            <div>

              <h1>
                Forms
              </h1>

              <p>
                Manage your website
                form widgets.
              </p>

            </div>

          </div>

          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                ◌
              </div>

              <p>
                Loading forms...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (

    <div className="app-container">

      <div className="page-wrapper">

        {/* =========================
            HEADER
        ========================= */}

        <div className="page-header">

          <div>

            <h1>
              Forms
            </h1>

            <p>
              Create and manage
              your website widgets.
            </p>

          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              console.log(
                "Navigate to Create Form"
              )
            }
          >
            + Create Form
          </button>

        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {forms.length === 0 ? (

          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                ✦
              </div>

              <h3>
                No forms yet
              </h3>

              <p
                style={{
                  marginTop: "8px",
                }}
              >
                Create your first form
                to get started.
              </p>

            </div>

          </div>

        ) : (

          /* =========================
             FORMS GRID
          ========================= */

          <div className="forms-grid">

            {forms.map(
              (form) => (

                <div
                  className="form-list-card"
                  key={form._id}
                >

                  {/* TOP */}

                  <div className="form-card-top">

                    <div className="form-card-icon">
                      ◈
                    </div>

                    <span
                      className={`status ${
                        form.status ===
                        "active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {form.status}
                    </span>

                  </div>

                  {/* NAME */}

                  <h3>
                    {form.name}
                  </h3>

                  {/* TITLE */}

                  <p className="form-list-card-description">
                    {form.title}
                  </p>

                  {/* INFO */}

                  <div className="form-info">

                    <div className="info-item">

                      <span>
                        Fields
                      </span>

                      <strong>
                        {form.fields.length}
                      </strong>

                    </div>

                    <div className="info-item">

                      <span>
                        Form ID
                      </span>

                      <strong
                        title={form._id}
                      >
                        {form._id.slice(
                          -8
                        )}
                      </strong>

                    </div>

                    <div className="info-item">

                      <span>
                        Created
                      </span>

                      <strong>
                        {new Date(
                          form.createdAt
                        ).toLocaleDateString()}
                      </strong>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="form-actions">

                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={() =>
                        console.log(
                          "View:",
                          form._id
                        )
                      }
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={() =>
                        console.log(
                          "Edit:",
                          form._id
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      disabled={
                        deletingId ===
                        form._id
                      }
                      onClick={() =>
                        handleDelete(
                          form._id
                        )
                      }
                    >
                      {deletingId ===
                      form._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                    <button
  type="button"
  className="btn btn-primary btn-small"
  onClick={() => {
    setScriptForm(form);
    setCopied(false);
  }}
>
  Get Script
</button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>
{scriptForm && (
  <div
    className="modal-overlay"
    onClick={() =>
      setScriptForm(null)
    }
  >
    <div
      className="script-modal"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <div className="modal-header">

        <div>

          <h2>
            Embed Your Form
          </h2>

          <p>
            {scriptForm.name}
          </p>

        </div>

        <button
          className="modal-close"
          onClick={() =>
            setScriptForm(null)
          }
        >
          ×
        </button>

      </div>

      <div className="script-modal-body">

        <div className="script-info">

          <div className="script-info-icon">
            &lt;/&gt;
          </div>

          <div>

            <strong>
              Add this script to your website
            </strong>

            <p>
              Paste this code before the
              closing &lt;/body&gt; tag.
            </p>

          </div>

        </div>

        <div className="script-code-wrapper">

          <pre className="script-code">
            <code>
              {getEmbedScript(
                scriptForm._id
              )}
            </code>
          </pre>

        </div>

        <button
          className="btn btn-primary script-copy-btn"
          onClick={copyScript}
        >
          {copied
            ? "✓ Copied!"
            : "Copy Script"}
        </button>

        <div className="script-form-id">

          <span>
            Form ID
          </span>

          <code>
            {scriptForm._id}
          </code>

        </div>

      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default Forms;