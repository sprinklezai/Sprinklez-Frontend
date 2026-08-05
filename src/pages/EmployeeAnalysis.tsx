import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  Globe2,
  MapPin,
  Upload,
  UserRoundCheck,
  Users,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
  ComponentType,
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  getEmployeeAnalysis,
  uploadEmployeeFile,
} from "../services/employeeService";

import type {
  EmployeeAnalysisResponse,
  EmployeeRecord,
} from "../services/employeeService";

interface KpiCardProps {
  label: string;
  value: string | number;
  caption: string;
  icon: ComponentType<{
    size?: number;
  }>;
}

function KpiCard({
  label,
  value,
  caption,
  icon: Icon,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {caption}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#0F6B52]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  values,
}: {
  title: string;
  values: Array<{
    name: string;
    value: number;
  }>;
}) {
  const maximum = Math.max(
    ...values.map(
      (item) => item.value
    ),
    1
  );

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-900">
        {title}
      </h2>

      <div className="mt-5 space-y-4">
        {values.length === 0 ? (
          <p className="text-sm text-slate-400">
            No data available.
          </p>
        ) : (
          values
            .slice(0, 10)
            .map((item) => {
              const width =
                (item.value / maximum) *
                100;

              return (
                <div key={item.name}>
                  <div className="flex justify-between gap-3">
                    <span className="truncate text-sm font-medium text-slate-600">
                      {item.name}
                    </span>

                    <span className="text-sm font-bold text-slate-900">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#0F6B52]"
                      style={{
                        width: `${Math.max(
                          width,
                          4
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

function formatDateTime(
  value: string | null | undefined
): string {
  if (!value) {
    return "No file uploaded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-AE",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

function EmployeeAnalysis() {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [analysis, setAnalysis] =
    useState<EmployeeAnalysisResponse | null>(
      null
    );

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function loadEmployeeAnalysis() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getEmployeeAnalysis();

      setAnalysis(response);
    } catch (requestError) {
      console.error(
        "Employee analysis loading error:",
        requestError
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load employee analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEmployeeAnalysis();
  }, []);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ||
      null;

    setSelectedFile(file);
    setError("");
    setSuccess("");
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError(
        "Please select an XLS or XLSX file."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const response =
        await uploadEmployeeFile(
          selectedFile
        );

      setSuccess(response.message);
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value =
          "";
      }

      await loadEmployeeAnalysis();
    } catch (uploadError) {
      console.error(
        "Employee upload error:",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Employee file upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  const metadata =
    analysis?.metadata;

  const kpis =
    analysis?.kpis;

  const isBusy =
    loading || uploading;

  return (
    <DashboardLayout>
      <section className="relative">
        <div
          className={
            isBusy
              ? "pointer-events-none select-none blur-sm"
              : ""
          }
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                Workforce Analytics
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Employee Analysis
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                F&amp;B workforce demographics and organisation overview.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:max-w-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">
                    Employee Master File
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Upload XLS or XLSX, maximum 15 MB
                  </p>
                </div>

                <div
                  className={[
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
                    metadata?.available
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  {metadata?.available ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <XCircle size={15} />
                  )}

                  {metadata?.available
                    ? "File available"
                    : "No file uploaded"}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-3 text-sm font-semibold text-[#0F6B52]">
                  <FileSpreadsheet size={19} />

                  <span className="truncate">
                    {selectedFile
                      ? selectedFile.name
                      : "Choose employee file"}
                  </span>

                  <input
                    ref={inputRef}
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    void handleUpload();
                  }}
                  disabled={
                    !selectedFile ||
                    uploading
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0F6B52] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0B5743] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Upload size={18} />

                  Upload and Refresh
                </button>
              </div>

              {success && (
                <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {success}
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              )}

              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Current file
                  </p>

                  <p className="mt-1 truncate font-medium text-slate-700">
                    {metadata?.originalFileName ||
                      "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Last updated
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {formatDateTime(
                      metadata?.uploadedAt
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Employees loaded
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {metadata?.employeeCount ??
                      0}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Uploaded by
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {metadata?.uploadedBy ||
                      "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Total Employees"
              value={
                kpis?.totalEmployees ??
                0
              }
              caption="All employee records"
              icon={Users}
            />

            <KpiCard
              label="Active Employees"
              value={
                kpis?.activeEmployees ??
                0
              }
              caption={`Inactive: ${
                kpis?.inactiveEmployees ??
                0
              }`}
              icon={UserRoundCheck}
            />

            <KpiCard
              label="Brands"
              value={
                kpis?.brands ?? 0
              }
              caption="F&B brand coverage"
              icon={Building2}
            />

            <KpiCard
              label="Countries"
              value={
                kpis?.countries ?? 0
              }
              caption="Workforce presence"
              icon={Globe2}
            />

            <KpiCard
              label="Locations"
              value={
                kpis?.locations ?? 0
              }
              caption="Stores and offices"
              icon={MapPin}
            />

            <KpiCard
              label="Departments"
              value={
                kpis?.departments ??
                0
              }
              caption="Organisation functions"
              icon={BriefcaseBusiness}
            />

            <KpiCard
              label="Nationalities"
              value={
                kpis?.nationalities ??
                0
              }
              caption="Workforce diversity"
              icon={Globe2}
            />

            <KpiCard
              label="Average Service"
              value={`${
                kpis?.averageServiceYears ??
                0
              } yrs`}
              caption="Average employee tenure"
              icon={Clock3}
            />
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            <SummaryCard
              title="Employees by Brand"
              values={
                analysis?.employeesByBrand ||
                []
              }
            />

            <SummaryCard
              title="Employees by Country"
              values={
                analysis?.employeesByCountry ||
                []
              }
            />

            <SummaryCard
              title="Employees by Department"
              values={
                analysis?.employeesByDepartment ||
                []
              }
            />

            <SummaryCard
              title="Gender Distribution"
              values={
                analysis?.genderDistribution ||
                []
              }
            />

            <SummaryCard
              title="Top Nationalities"
              values={
                analysis?.nationalityDistribution ||
                []
              }
            />

            <SummaryCard
              title="Length of Service"
              values={
                analysis?.serviceDistribution ||
                []
              }
            />
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Employee Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {analysis?.employees.length ??
                0} employee records loaded.
            </p>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-3">
                      Employee
                    </th>

                    <th className="px-3 py-3">
                      Brand
                    </th>

                    <th className="px-3 py-3">
                      Designation
                    </th>

                    <th className="px-3 py-3">
                      Department
                    </th>

                    <th className="px-3 py-3">
                      Location
                    </th>

                    <th className="px-3 py-3">
                      Country
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(analysis?.employees || [])
                    .slice(0, 25)
                    .map((employee: EmployeeRecord) => (
                      <tr
                        key={`${employee.employeeNumber}-${employee.assignmentNumber}`}
                        className="border-b border-slate-100"
                      >
                        <td className="px-3 py-4">
                          <p className="font-semibold text-slate-800">
                            {employee.employeeName ||
                              "Not specified"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {employee.employeeNumber ||
                              "No employee number"}
                          </p>
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                          {employee.brand ||
                            "Not specified"}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                          {employee.designation ||
                            "Not specified"}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                          {employee.department ||
                            "Not specified"}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                          {employee.location ||
                            "Not specified"}
                        </td>

                        <td className="px-3 py-4 text-slate-600">
                          {employee.country ||
                            "Not specified"}
                        </td>
                      </tr>
                    ))}

                  {(analysis?.employees.length ??
                    0) === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-12 text-center text-slate-400"
                      >
                        Upload the employee Excel file to view employee records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {isBusy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-[#0F6B52]" />

              <h2 className="mt-4 font-bold text-slate-900">
                {uploading
                  ? "Uploading Employee File..."
                  : "Loading Employee Analysis..."}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Please wait while the workforce information is processed.
              </p>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default EmployeeAnalysis;