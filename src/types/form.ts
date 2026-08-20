export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: string[];
}

export interface FormData {
  name: string;
  title: string;
  fields: FormField[];
  status: "active" | "inactive";
}

export interface FormItem extends FormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}