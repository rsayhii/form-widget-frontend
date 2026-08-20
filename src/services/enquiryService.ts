export interface EnquiryForm {
  _id: string;
  name: string;
  title: string;
}

export interface Enquiry {
  _id: string;
  formId: EnquiryForm;
  data: Record<string, unknown>;
  sourceUrl?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL =
  "http://localhost:5000/api/enquiries";

export const getAllEnquiries =
  async (): Promise<Enquiry[]> => {
    const response = await fetch(API_URL);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to fetch enquiries"
      );
    }

    return result.enquiries || [];
  };