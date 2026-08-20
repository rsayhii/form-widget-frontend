import type { FormData } from "../types/form";

const API_URL = "https://form-widget-backend.onrender.com/api/forms";

// CREATE FORM
export const createForm = async (formData: FormData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create form");
  }

  return data;
};

// GET ALL FORMS
export const getAllForms = async () => {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch forms");
  }

  return data;
};

// GET SINGLE FORM
export const getFormById = async (formId: string) => {
  const response = await fetch(`${API_URL}/${formId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch form");
  }

  return data;
};

// DELETE FORM
export const deleteForm = async (formId: string) => {
  const response = await fetch(`${API_URL}/${formId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete form");
  }

  return data;
};