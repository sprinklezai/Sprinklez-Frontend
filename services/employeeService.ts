const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export interface EmployeeMetadata {
  available: boolean;
  originalFileName: string | null;
  storedFileName: string | null;
  uploadedAt: string | null;
  uploadedBy: string | null;
  employeeCount: number;
  worksheetName: string | null;
  headerRowNumber: number | null;
  columns: string[];
  archivedFileName: string | null;
}

export interface NamedValue {
  name: string;
  value: number;
}

export interface EmployeeRecord {
  employeeNumber: string;
  assignmentNumber: string;
  employeeName: string;
  assignmentStatus: string;
  employeeType: string;
  legalEmployer: string;
  country: string;
  brand: string;
  department: string;
  designation: string;
  location: string;
  gender: string;
  nationality: string;
  ageText: string;
  serviceDuration: string;
  hireDate: string;
  hireStatus: string;
}

export interface EmployeeAnalysisResponse {
  success: boolean;

  metadata: EmployeeMetadata;

  kpis: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    countries: number;
    brands: number;
    locations: number;
    nationalities: number;
    departments: number;
    averageServiceYears: number;
  };

  employeesByBrand: NamedValue[];
  employeesByCountry: NamedValue[];
  employeesByDepartment: NamedValue[];
  genderDistribution: NamedValue[];
  nationalityDistribution: NamedValue[];
  serviceDistribution: NamedValue[];

  filters: {
    countries: string[];
    brands: string[];
    departments: string[];
    locations: string[];
    genders: string[];
    nationalities: string[];
  };

  employees: EmployeeRecord[];
}

interface EmployeeUploadResponse {
  success: boolean;
  message: string;
  metadata: EmployeeMetadata;
}

function getToken(): string {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    ""
  );
}

async function readJsonResponse<T>(
  response: Response
): Promise<T> {
  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      `Server returned an invalid response with status ${response.status}.`
    );
  }

  if (!response.ok) {
    const errorData = data as {
      error?: string;
      message?: string;
    };

    throw new Error(
      errorData.error ||
        errorData.message ||
        "The request failed."
    );
  }

  return data as T;
}

export async function getEmployeeAnalysis(): Promise<EmployeeAnalysisResponse> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/api/employees/analysis`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  return readJsonResponse<EmployeeAnalysisResponse>(
    response
  );
}

export async function uploadEmployeeFile(
  file: File
): Promise<EmployeeUploadResponse> {
  const token = getToken();

  const formData = new FormData();

  formData.append(
    "employeeFile",
    file
  );

  const response = await fetch(
    `${API_BASE_URL}/api/employees/upload`,
    {
      method: "POST",
      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body: formData,
    }
  );

  return readJsonResponse<EmployeeUploadResponse>(
    response
  );
}