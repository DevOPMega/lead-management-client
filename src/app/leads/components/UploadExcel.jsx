import React, { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Upload,
  FileSpreadsheet,
  Loader2
} from "lucide-react";

import Axios from "../../../lib/axios";
import { toast } from "sonner";

export default function ImportLeadsDialog() {
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);


  const handleUpload = async () => {

    if (!file) {
      toast("Select a excel file");

      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("excelFile", file);

      const res = await Axios.post(
        "/leads/upload-excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(res.data);

      if (res.data.success) {
        toast.success(`Data inserted:`, res.data.inserted)
      }

      setFile(null);

      setOpen(false);

    } catch (error) {

      toast("File not uploaded successfully");

    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 border-slate-200 text-slate-600"
        >
          <Upload className="h-3.5 w-3.5" />
          Import
        </Button>

      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl">

        <DialogHeader>

          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Leads
          </DialogTitle>

          <DialogDescription>
            Upload Excel or CSV file to import leads.
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-4 py-4">

          <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition">

            <FileSpreadsheet className="h-8 w-8 mb-3 text-slate-500"/>

            <span className="text-sm font-medium">
              Click to choose file
            </span>

            <span className="text-xs text-slate-500 mt-1">
              .xlsx, .xls, .csv
            </span>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e)=>
                setFile(e.target.files[0])
              }
            />

          </label>

          {file && (
            <div className="rounded-lg border p-3 text-sm bg-slate-50">
              Selected: <strong>{file.name}</strong>
            </div>
          )}

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4"/>
                Upload File
              </>
            )}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}