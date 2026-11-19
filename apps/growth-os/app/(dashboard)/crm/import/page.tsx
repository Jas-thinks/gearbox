"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { Progress } from "@/components/ui/progress";
import { parseCSV } from "@/utils/csv";
import {
  detectColumnMappings,
  type CsvColumnMapping,
  type ImportResult,
} from "@/features/crm/services/csv-import.utils";
import { importLeadsFromCsv } from "@/features/crm/services/csv-import.service";
import {
  ArrowLeft, Upload, CheckCircle2, AlertCircle, FileText,
} from "lucide-react";

const LEAD_FIELDS = [
  { value: "", label: "— Skip —" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "website", label: "Website" },
  { value: "instagram_handle", label: "Instagram" },
  { value: "linkedin_url", label: "LinkedIn" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "country", label: "Country" },
  { value: "creator_type", label: "Creator Type" },
  { value: "business_name", label: "Business Name" },
  { value: "owned_equipment", label: "Owned Equipment (;-separated)" },
  { value: "interested_equipment", label: "Interested Equipment (;-separated)" },
  { value: "rental_frequency", label: "Rental Frequency" },
  { value: "notes", label: "Notes" },
  { value: "tags", label: "Tags (;-separated)" },
  { value: "lead_source", label: "Lead Source" },
];

type Step = "upload" | "map" | "preview" | "result";

export default function CsvImportPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [csvContent, setCsvContent] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [mappings, setMappings] = useState<CsvColumnMapping[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const rows = parseCSV(content);
      if (rows.length === 0) {
        toast.error("CSV file is empty or invalid.");
        return;
      }
      setCsvContent(content);
      setHeaders(Object.keys(rows[0]));
      setPreviewRows(rows.slice(0, 5));
      setMappings(detectColumnMappings(Object.keys(rows[0])));
      setStep("map");
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    startTransition(async () => {
      const importResult = await importLeadsFromCsv(csvContent, mappings);
      setResult(importResult);
      setStep("result");
      if (importResult.imported > 0) {
        toast.success(`Imported ${importResult.imported} leads.`);
      }
    });
  };

  const progressValue = step === "upload" ? 25 : step === "map" ? 50 : step === "preview" ? 75 : 100;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/crm"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <PageHeader title="Import Leads from CSV" description="Upload a CSV file to bulk import leads into your CRM" />
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={step === "upload" ? "text-foreground font-medium" : ""}>1. Upload</span>
          <span className={step === "map" ? "text-foreground font-medium" : ""}>2. Map Columns</span>
          <span className={step === "preview" ? "text-foreground font-medium" : ""}>3. Preview</span>
          <span className={step === "result" ? "text-foreground font-medium" : ""}>4. Results</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload CSV File</CardTitle>
            <CardDescription>
              Accepted format: CSV with headers in the first row. Max 5,000 rows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">Click to upload CSV</p>
              <p className="mt-1 text-xs text-muted-foreground">or drag and drop</p>
              <input type="file" accept=".csv" className="sr-only" onChange={handleFileUpload} />
            </label>
            <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground mb-1">Expected columns (any order):</p>
              <p className="text-xs text-muted-foreground">
                name, email, phone, website, instagram, linkedin, city, state, country,
                creator_type, business_name, owned_equipment, interested_equipment, tags, notes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Map Columns */}
      {step === "map" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Map Columns</CardTitle>
            <CardDescription>
              Match your CSV columns to CRM fields. Auto-detected where possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {headers.map((col) => {
                const mapping = mappings.find((m) => m.csvColumn === col);
                return (
                  <div key={col} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-mono text-foreground">{col}</span>
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <Select
                      value={mapping?.leadField ?? ""}
                      onValueChange={(val) => {
                        setMappings((prev) =>
                          prev.map((m) =>
                            m.csvColumn === col ? { ...m, leadField: val } : m
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="flex-1 text-sm">
                        <SelectValue placeholder="Select field…" />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_FIELDS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>

            {/* Preview table */}
            {previewRows.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-medium text-muted-foreground mb-2">Preview (first 5 rows)</p>
                <div className="overflow-x-auto rounded border border-border">
                  <table className="text-xs w-full">
                    <thead>
                      <tr className="bg-muted/30">
                        {headers.map((h) => (
                          <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i} className="border-t border-border">
                          {headers.map((h) => (
                            <td key={h} className="px-3 py-2 max-w-[150px] truncate">{row[h]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
              <Button onClick={handleImport} disabled={isPending}>
                {isPending ? "Importing…" : `Import ${previewRows.length > 0 ? "Leads" : ""}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Result */}
      {step === "result" && result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">{result.imported}</p>
                <p className="text-xs text-emerald-600 mt-1">Imported</p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{result.skipped}</p>
                <p className="text-xs text-amber-600 mt-1">Skipped / Duplicate</p>
              </div>
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
                <p className="text-2xl font-bold text-red-700">{result.errors.length}</p>
                <p className="text-xs text-red-600 mt-1">Errors</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-medium text-red-700 mb-2">Errors:</p>
                <ul className="space-y-1">
                  {result.errors.slice(0, 10).map((e, i) => (
                    <li key={i} className="text-xs text-red-600">Row {e.row}: {e.reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={() => router.push("/crm")} className="flex-1">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                View CRM
              </Button>
              <Button variant="outline" onClick={() => { setStep("upload"); setResult(null); }}>
                Import More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
