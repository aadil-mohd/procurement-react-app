import React, { useState } from "react";
import { TableCloseIcon } from "../../utils/Icons";
import TextField from "../basic_components/TextField";
import FileUpload from "../basic_components/FileUpload";

interface QuotesRecommendationProps {
  setData: (field: string, value: any) => void;
}

interface TableRow {
  vendorName: string;
  amount: number;
  attachment: File | null;
}

const QuotesRecommendation: React.FC<QuotesRecommendationProps> = ({
  setData,
}) => {
  const [tableData, setTableData] = useState<TableRow[]>([
    { vendorName: "", amount: 0, attachment: null },
  ]);

  // Synchronize table data with the parent
  const syncToParent = (updatedData: TableRow[]) => {
    setTableData(updatedData);
    setData("quotesRecommendation", updatedData);
  };

  // Add a new row
  const addTableRow = () => {
    const updatedData = [...tableData, { vendorName: "", amount: 0, attachment: null }];
    syncToParent(updatedData);
  };

  // Delete a specific row
  const deleteTableRow = (index: number) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    syncToParent(updatedData);
  };

  // Update a specific cell in the table
  const updateTableData = <K extends keyof TableRow>(
    index: number,
    field: K,
    value: string | File | null
  ) => {
    const updatedData = [...tableData];

    if (field === "amount") {
      // Ensure the input is a valid number
      const numericValue = value === "" ? 0 : Number(value);
      if (!isNaN(numericValue)) {
        updatedData[index][field] = numericValue as TableRow[K];
      }
    } else {
      updatedData[index][field] = value as TableRow[K];
    }

    syncToParent(updatedData);
  };

  return (
    <div>
      <table className="w-full">
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} className="relative">
              {/* Vendor Name */}
              <td className="border px-4 py-2">
                <TextField
                  id={`vendorName-${index}`}
                  setValue={(value: string) =>
                    updateTableData(index, "vendorName", value)
                  }
                  placeholder="Enter Name"
                  field="vendorName"
                  title="Vendor Name"
                  type="text"
                  style="w-full"
                  width="w-full"
                  value={row.vendorName}
                />
              </td>

              {/* Amount */}
              <td className="border px-4 py-2">
                <TextField
                  id={`amount-${index}`}
                  setValue={(value: string) =>
                    updateTableData(index, "amount", value)
                  }
                  field="amount"
                  title="Amount"
                  type="number"
                  style="w-full"
                  width="w-full"
                  value={row.amount.toString()}
                />
              </td>

              {/* Attachment */}
              <td className="border px-4 py-2">
                <FileUpload
                  label="Attachment"
                  id={`attachment-${index}`}
                  onFilesChange={(files) =>
                    updateTableData(index, "attachment", files?.[0] || null)
                  }
                  acceptedFileTypes=".pdf,.docx,.jpg,.png"
                  multiple={false}
                />
              </td>

              {/* Actions */}
              <td className="border px-4 py-2 relative">
                <TableCloseIcon
                  onClick={() => deleteTableRow(index)}
                  className="h-4 w-4 cursor-pointer absolute bottom-1 stroke-red-600 right-1 hover:stroke-red-400"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          type="button"
          onClick={addTableRow}
          className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded hover:bg-blue-400"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuotesRecommendation;
