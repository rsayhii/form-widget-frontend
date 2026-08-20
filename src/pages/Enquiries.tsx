import { useEffect, useMemo, useState } from "react";

import {
  getAllEnquiries,
} from "../services/enquiryService";

import type {
  Enquiry,
} from "../services/enquiryService";

const Enquiries = () => {
  const [enquiries, setEnquiries] =
    useState<Enquiry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedForm, setSelectedForm] =
    useState("all");

  const [selectedEnquiry, setSelectedEnquiry] =
    useState<Enquiry | null>(null);

  // ==========================================
  // LOAD ENQUIRIES
  // ==========================================

  const loadEnquiries = async () => {
    try {
      setLoading(true);

      const data =
        await getAllEnquiries();

      setEnquiries(data);
    } catch (error) {
      console.error(
        "Enquiries Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load enquiries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  // ==========================================
  // UNIQUE FORMS
  // ==========================================

  const forms = useMemo(() => {
    const map = new Map<
      string,
      Enquiry["formId"]
    >();

    enquiries.forEach((enquiry) => {
      if (
        enquiry.formId &&
        typeof enquiry.formId === "object"
      ) {
        map.set(
          enquiry.formId._id,
          enquiry.formId
        );
      }
    });

    return Array.from(map.values());
  }, [enquiries]);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredEnquiries =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return enquiries.filter(
        (enquiry) => {

          // Form filter
          if (
            selectedForm !== "all" &&
            enquiry.formId?._id !==
              selectedForm
          ) {
            return false;
          }

          // Search
          if (!query) {
            return true;
          }

          const formName =
            enquiry.formId?.name ||
            "";

          const formTitle =
            enquiry.formId?.title ||
            "";

          const dataText =
            Object.values(
              enquiry.data || {}
            )
              .map((value) =>
                Array.isArray(value)
                  ? value.join(" ")
                  : String(value ?? "")
              )
              .join(" ");

          const searchable =
            `
              ${formName}
              ${formTitle}
              ${dataText}
            `.toLowerCase();

          return searchable.includes(
            query
          );
        }
      );
    }, [
      enquiries,
      search,
      selectedForm,
    ]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // GET FIRST VALUE
  // ==========================================

  const getPreviewValue = (
    enquiry: Enquiry
  ) => {
    const entries =
      Object.entries(
        enquiry.data || {}
      );

    if (entries.length === 0) {
      return "No data";
    }

    const [
      ,
      value,
    ] = entries[0];

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return String(value ?? "-");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="app-container">
        <div className="page-wrapper">

          <div className="page-header">
            <div>
              <h1>Enquiries</h1>

              <p>
                Manage all submissions
                received through your
                widgets.
              </p>
            </div>
          </div>

          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                ◌
              </div>

              <p>
                Loading enquiries...
              </p>

            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="app-container">

      <div className="page-wrapper">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="page-header">

          <div>

            <h1>
              Enquiries
            </h1>

            <p>
              Manage all submissions
              received through your
              widgets.
            </p>

          </div>

          <div
            className="enquiry-count"
          >
            <span>
              Total
            </span>

            <strong>
              {enquiries.length}
            </strong>
          </div>

        </div>

        {/* ==================================
            FILTER BAR
        ================================== */}

        <div className="filter-card">

          <div className="search-wrapper">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              className="search-input"
              placeholder="Search enquiries..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <select
            className="filter-select"
            value={selectedForm}
            onChange={(e) =>
              setSelectedForm(
                e.target.value
              )
            }
          >

            <option value="all">
              All Forms
            </option>

            {forms.map((form) => (
              <option
                key={form._id}
                value={form._id}
              >
                {form.name}
              </option>
            ))}

          </select>

          <button
            className="btn btn-secondary"
            onClick={loadEnquiries}
          >
            ↻ Refresh
          </button>

        </div>

        {/* ==================================
            TABLE
        ================================== */}

        {filteredEnquiries.length ===
        0 ? (

          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                ◈
              </div>

              <h3>
                No enquiries found
              </h3>

              <p>
                {enquiries.length === 0
                  ? "Your submitted enquiries will appear here."
                  : "Try changing your search or filter."}
              </p>

            </div>

          </div>

        ) : (

          <div className="enquiries-table-card">

            <div className="table-header">

              <div>
                Showing{" "}
                <strong>
                  {filteredEnquiries.length}
                </strong>{" "}
                enquiries
              </div>

            </div>

            <div className="table-scroll">

              <table className="enquiries-table">

                <thead>

                  <tr>

                    <th>
                      Form
                    </th>

                    <th>
                      Submission
                    </th>

                    <th>
                      Preview
                    </th>

                    <th>
                      Source
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredEnquiries.map(
                    (enquiry) => (

                      <tr
                        key={
                          enquiry._id
                        }
                      >

                        {/* FORM */}

                        <td>

                          <div className="table-form">

                            <div className="table-form-icon">
                              ◈
                            </div>

                            <div>

                              <strong>
                                {enquiry
                                  .formId
                                  ?.name ||
                                  "Unknown Form"}
                              </strong>

                              <span>
                                {enquiry
                                  .formId
                                  ?.title ||
                                  ""}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* SUBMISSION ID */}

                        <td>

                          <span className="submission-id">
                            #
                            {enquiry._id.slice(
                              -8
                            )}
                          </span>

                        </td>

                        {/* PREVIEW */}

                        <td>

                          <span className="preview-value">
                            {getPreviewValue(
                              enquiry
                            )}
                          </span>

                        </td>

                        {/* SOURCE */}

                        <td>

                          <span
                            className="source-url"
                            title={
                              enquiry.sourceUrl ||
                              ""
                            }
                          >
                            {enquiry.sourceUrl
                              ? new URL(
                                  enquiry.sourceUrl
                                ).hostname
                              : "-"}
                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          <span className="date-value">
                            {formatDate(
                              enquiry.createdAt
                            )}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() =>
                              setSelectedEnquiry(
                                enquiry
                              )
                            }
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

      {/* ====================================
          VIEW MODAL
      ==================================== */}

      {selectedEnquiry && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedEnquiry(
              null
            )
          }
        >

          <div
            className="enquiry-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Enquiry Details
                </h2>

                <p>
                  #
                  {selectedEnquiry._id}
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedEnquiry(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="modal-body">

              <div className="detail-section">

                <span className="detail-label">
                  FORM
                </span>

                <strong>
                  {
                    selectedEnquiry
                      .formId
                      ?.name
                  }
                </strong>

              </div>

              <div className="detail-section">

                <span className="detail-label">
                  SUBMITTED
                </span>

                <strong>
                  {formatDate(
                    selectedEnquiry.createdAt
                  )}
                </strong>

              </div>

              <div className="detail-section">

                <span className="detail-label">
                  SOURCE WEBSITE
                </span>

                <strong className="break-text">
                  {
                    selectedEnquiry.sourceUrl ||
                    "-"
                  }
                </strong>

              </div>

              <div className="submitted-data">

                <div className="detail-label">
                  SUBMITTED DATA
                </div>

                {Object.entries(
                  selectedEnquiry.data ||
                    {}
                ).map(
                  (
                    [
                      key,
                      value,
                    ]
                  ) => (

                    <div
                      className="data-row"
                      key={key}
                    >

                      <span>
                        {key}
                      </span>

                      <strong>

                        {Array.isArray(
                          value
                        )
                          ? value.join(
                              ", "
                            )
                          : String(
                              value ??
                                "-"
                            )}

                      </strong>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Enquiries;