import { useState } from "react";
import type { FieldType, FormField, FormData } from "../types/form";
import { createForm } from "../services/formService";

const fieldTypes: FieldType[] = [
  "text",
  "email",
  "tel",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
];

const CreateForm = () => {
  // =========================
  // FORM STATES
  // =========================

  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");

  const [fields, setFields] = useState<FormField[]>([]);

  // =========================
  // FIELD STATES
  // =========================

  const [fieldType, setFieldType] =
    useState<FieldType>("text");

  const [fieldLabel, setFieldLabel] = useState("");

  const [fieldName, setFieldName] = useState("");

  const [placeholder, setPlaceholder] = useState("");

  const [required, setRequired] = useState(false);

  const [options, setOptions] = useState<string[]>([]);

  const [optionInput, setOptionInput] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // ADD OPTION
  // =========================

  const addOption = () => {
    const value = optionInput.trim();

    if (!value) {
      return;
    }

    if (options.includes(value)) {
      alert("This option already exists.");
      return;
    }

    setOptions((prev) => [...prev, value]);

    setOptionInput("");
  };

  // =========================
  // REMOVE OPTION
  // =========================

  const removeOption = (index: number) => {
    setOptions((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================
  // ADD FIELD
  // =========================

  const addField = () => {
    if (!fieldLabel.trim()) {
      alert("Field label is required.");
      return;
    }

    if (!fieldName.trim()) {
      alert("Field name is required.");
      return;
    }

    // Check duplicate field name

    const duplicate = fields.some(
      (field) =>
        field.name.toLowerCase() ===
        fieldName.trim().toLowerCase()
    );

    if (duplicate) {
      alert("A field with this name already exists.");
      return;
    }

    // Select / Radio / Checkbox options validation

    if (
      ["select", "radio", "checkbox"].includes(fieldType) &&
      options.length === 0
    ) {
      alert("Please add at least one option.");
      return;
    }

    const newField: FormField = {
      name: fieldName.trim(),
      label: fieldLabel.trim(),
      type: fieldType,
      placeholder: placeholder.trim(),
      required,
      order: fields.length + 1,
      ...(options.length > 0
        ? {
            options: [...options],
          }
        : {}),
    };

    setFields((prev) => [
      ...prev,
      newField,
    ]);

    // Reset field builder

    setFieldType("text");

    setFieldLabel("");

    setFieldName("");

    setPlaceholder("");

    setRequired(false);

    setOptions([]);

    setOptionInput("");
  };

  // =========================
  // REMOVE FIELD
  // =========================

  const removeField = (index: number) => {
    setFields((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((field, index) => ({
          ...field,
          order: index + 1,
        }))
    );
  };

  // =========================
  // SAVE FORM
  // =========================

  const handleSubmit = async () => {
    if (!formName.trim()) {
      alert("Form name is required.");
      return;
    }

    if (!formTitle.trim()) {
      alert("Form title is required.");
      return;
    }

    if (fields.length === 0) {
      alert("Please add at least one field.");
      return;
    }

    const formData: FormData = {
      name: formName.trim(),

      title: formTitle.trim(),

      fields,

      status: "active",
    };

    try {
      setLoading(true);

      const response =
        await createForm(formData);

      console.log(
        "Created Form:",
        response
      );

      alert(
        "Form created successfully!"
      );

      // Reset form

      setFormName("");

      setFormTitle("");

      setFields([]);
    } catch (error) {
      console.error(
        "Create Form Error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create form"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
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
              Create Form
            </h1>

            <p>
              Build a dynamic form
              for your website widget.
            </p>

          </div>

        </div>

        {/* =========================
            MAIN CARD
        ========================= */}

        <div className="card">

          {/* =========================
              FORM INFORMATION
          ========================= */}

          <div className="form-section">

            <div className="section-title">

              <h2>
                Form Information
              </h2>

              <p>
                Configure the basic
                details of your form.
              </p>

            </div>

            <div className="form-grid">

              {/* FORM NAME */}

              <div className="form-group">

                <label>
                  Form Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={formName}
                  onChange={(e) =>
                    setFormName(
                      e.target.value
                    )
                  }
                  placeholder="Contact Form"
                />

              </div>

              {/* FORM TITLE */}

              <div className="form-group">

                <label>
                  Form Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={formTitle}
                  onChange={(e) =>
                    setFormTitle(
                      e.target.value
                    )
                  }
                  placeholder="Get In Touch"
                />

              </div>

            </div>

          </div>

          {/* =========================
              FIELD BUILDER
          ========================= */}

          <div className="field-builder">

            <div className="section-title">

              <h2>
                Add Field
              </h2>

              <p>
                Configure a field and
                add it to your form.
              </p>

            </div>

            <div className="form-grid">

              {/* FIELD TYPE */}

              <div className="form-group">

                <label>
                  Field Type
                </label>

                <select
                  className="form-control"
                  value={fieldType}
                  onChange={(e) =>
                    setFieldType(
                      e.target.value as FieldType
                    )
                  }
                >

                  {fieldTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* LABEL */}

              <div className="form-group">

                <label>
                  Field Label
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={fieldLabel}
                  onChange={(e) =>
                    setFieldLabel(
                      e.target.value
                    )
                  }
                  placeholder="Your Name"
                />

              </div>

              {/* FIELD NAME */}

              <div className="form-group">

                <label>
                  Field Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={fieldName}
                  onChange={(e) =>
                    setFieldName(
                      e.target.value
                    )
                  }
                  placeholder="name"
                />

              </div>

              {/* PLACEHOLDER */}

              <div className="form-group">

                <label>
                  Placeholder
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={placeholder}
                  onChange={(e) =>
                    setPlaceholder(
                      e.target.value
                    )
                  }
                  placeholder="Enter your name"
                />

              </div>

            </div>

            {/* REQUIRED */}

            <div
              style={{
                marginTop: "18px",
              }}
            >

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  cursor: "pointer",
                  color: "#cbd5e1",
                  fontSize: "13px",
                }}
              >

                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) =>
                    setRequired(
                      e.target.checked
                    )
                  }
                />

                Required Field

              </label>

            </div>

            {/* =========================
                OPTIONS
            ========================= */}

            {[
              "select",
              "radio",
              "checkbox",
            ].includes(fieldType) && (

              <div
                style={{
                  marginTop: "22px",
                  padding: "18px",
                  background: "#0c1220",
                  border: "1px solid #232d41",
                  borderRadius: "12px",
                }}
              >

                <div
                  className="section-title"
                >

                  <h2>
                    Field Options
                  </h2>

                  <p>
                    Add options for
                    this field.
                  </p>

                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >

                  <input
                    type="text"
                    className="form-control"
                    value={optionInput}
                    onChange={(e) =>
                      setOptionInput(
                        e.target.value
                      )
                    }
                    placeholder="Enter option"
                    onKeyDown={(e) => {

                      if (
                        e.key === "Enter"
                      ) {

                        e.preventDefault();

                        addOption();

                      }

                    }}
                  />

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addOption}
                  >
                    Add
                  </button>

                </div>

                {options.length > 0 && (

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "14px",
                    }}
                  >

                    {options.map(
                      (
                        option,
                        index
                      ) => (

                        <div
                          key={`${option}-${index}`}
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: "7px",
                            padding:
                              "7px 10px",
                            borderRadius:
                              "7px",
                            background:
                              "#1a2233",
                            color:
                              "#cbd5e1",
                            fontSize:
                              "12px",
                          }}
                        >

                          {option}

                          <button
                            type="button"
                            onClick={() =>
                              removeOption(
                                index
                              )
                            }
                            style={{
                              border: "none",
                              background:
                                "transparent",
                              color:
                                "#f87171",
                              cursor:
                                "pointer",
                              fontSize:
                                "14px",
                            }}
                          >
                            ×
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

            {/* ADD FIELD BUTTON */}

            <div
              style={{
                marginTop: "20px",
              }}
            >

              <button
                type="button"
                className="btn btn-secondary"
                onClick={addField}
              >
                + Add Field
              </button>

            </div>

          </div>

          {/* =========================
              CURRENT FIELDS
          ========================= */}

          <div className="field-builder">

            <div className="section-title">

              <h2>
                Form Fields
              </h2>

              <p>
                Fields currently added
                to this form.
              </p>

            </div>

            {fields.length === 0 ? (

              <div className="empty-state">

                <div className="empty-state-icon">
                  ✦
                </div>

                <p>
                  No fields added yet.
                </p>

                <span>
                  Add your first field
                  above.
                </span>

              </div>

            ) : (

              fields.map(
                (
                  field,
                  index
                ) => (

                  <div
                    className="field-card"
                    key={`${field.name}-${index}`}
                  >

                    <div className="field-card-header">

                      <div className="field-card-title">

                        <div className="field-number">
                          {index + 1}
                        </div>

                        <div>

                          <strong>
                            {field.label}
                          </strong>

                          <div className="field-meta">

                            <span className="badge badge-type">
                              {field.type}
                            </span>

                            {field.required && (

                              <span className="badge badge-required">
                                Required
                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() =>
                          removeField(
                            index
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                    <div
                      style={{
                        color: "#718096",
                        fontSize: "12px",
                        lineHeight: "1.7",
                      }}
                    >

                      <div>
                        Field name:{" "}
                        <span
                          style={{
                            color:
                              "#a5b4fc",
                          }}
                        >
                          {field.name}
                        </span>
                      </div>

                      {field.placeholder && (

                        <div>
                          Placeholder:{" "}
                          {field.placeholder}
                        </div>

                      )}

                      {field.options &&
                        field.options.length >
                          0 && (

                          <div>
                            Options:{" "}
                            {field.options.join(
                              ", "
                            )}
                          </div>

                        )}

                    </div>

                  </div>

                )
              )

            )}

          </div>

          {/* =========================
              FOOTER
          ========================= */}

          <div className="form-footer">

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Save Form"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateForm;