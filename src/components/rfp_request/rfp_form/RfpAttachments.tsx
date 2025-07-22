import React, { useEffect, useState } from "react";
import { TableCloseIcon } from "../../../utils/Icons";
import { Select } from "antd";

interface QuotesRecommendationProps {
    currency: string;
    quotes: any[]
    setQuotes: React.Dispatch<React.SetStateAction<any[]>>;
    setQuotesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
}

interface TableRow {
    attachment: File | null;
    type: string
}

const RfpAttachments: React.FC<QuotesRecommendationProps> = ({
    currency,
    quotes,
    setQuotes,
    setQuotesToDelete
}) => {
    const [tableData, setTableData] = useState<any[]>([]);

    const [isAdding, setIsAdding] = useState(false);
    const [newRow, setNewRow] = useState<any>({
        vendorName: "",
        currency: currency,
        amount: "",
        attachment: null
    });
    const [errors, setErrors] = useState({
        type: false,
        attachment: false,
    });



    const syncToParent = (updatedData: any[]) => {
        setTableData(updatedData);
        setQuotes(updatedData)
    };

    const validateRow = (): boolean => {
        const hasErrors = {
            type: !newRow.type,
            attachment: !newRow.attachment,
        };
        setErrors(hasErrors);
        return !Object.values(hasErrors).some((error) => error);
    };

    const confirmNewRow = () => {
        if (validateRow()) {
            const updatedData = [...tableData, { ...newRow }];
            syncToParent(updatedData);
            setNewRow({ type: 0, attachment: null });
            setIsAdding(false);
        }
    };

    const deleteTableRow = (index: number) => {
        const updatedData = tableData.filter((_, i) => i !== index);
        if (tableData[index].id) setQuotesToDelete(x => ([...x, tableData[index].id as string]))
        syncToParent(updatedData);
    };

    const updateNewRowData = (field: keyof TableRow, value: string | File | null) => {
        setNewRow((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        setTableData(quotes);
    }, [quotes])

    return (
        <div className="p-6 border-t">
            <div className="flex items-start gap-4">
                {/* Left Section */}
                <div className="w-[280px]">
                    <h2 className="text-lg font-semibold">Attachments</h2>
                </div>

                {/* Right Section */}
                <div className="flex-1">
                    <div className="w-full rounded-md relative">
                        <div className="overflow-x-auto">
                            <table className="w-full border rounded table-auto text-sm text-left">
                                <thead className="border-b border-gray-300">
                                    <tr>
                                        <th className="px-4 py-3 text-gray-600 font-medium max-w-[196px] desktop:min-w-[196px]">Attachment</th>
                                        <th className="px-4 py-3 text-gray-600 font-medium max-w-[136px] desktop:min-w-[136px]">Type</th>
                                        <th className="px-4 py-3 text-gray-600 font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row: any, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 hover:bg-gray-50 group relative"
                                            style={{ height: "48px" }}
                                        >
                                            <td className="px-4 py-2 w-full">
                                                {row.attachment ? (
                                                    <a
                                                        className="text-blue-500 underline cursor-pointer"
                                                        href={
                                                            row.attachment instanceof File
                                                                ? URL.createObjectURL(row.attachment) // Create a temporary URL for a newly uploaded file
                                                                : row.attachment // Use existing URL if already saved
                                                        }
                                                        download={row.attachment instanceof File ? row.attachment.name : row.attachment.name}
                                                    >
                                                        {row.attachment.name}
                                                    </a>
                                                ) : (
                                                    "No file"
                                                )}
                                            </td>
                                            <td className="px-4 py-2 w-full">{row.type}</td>

                                            <td className="absolute right-3 top-3 hidden group-hover:block">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteTableRow(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <TableCloseIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Row for adding a new entry */}
                                    {isAdding && (
                                        <tr className="border-b border-gray-200" style={{ height: "48px" }}>
                                            <td className="px-2 py-2 max-w-[196px]">
                                                <input
                                                    type="file"
                                                    onChange={(e) =>
                                                        updateNewRowData("attachment", e.target.files?.[0] || null)
                                                    }
                                                    className={`w-full px-2 py-1 ${errors.attachment ? "border-red-500" : "border-gray-300"
                                                        }`}
                                                />
                                                {errors.attachment && (
                                                    <p className="text-red-500 text-xs">Attachment is required</p>
                                                )}
                                            </td>
                                            <td className="px-2 py-2 max-w-[136px]">
                                                <Select value={"Financial"} className="w-full" options={[
                                                    { label: "Finacial", value: 1 }
                                                ]} onChange={(value) => updateNewRowData("type", value)}>

                                                </Select>
                                                {errors.type && (
                                                    <p className="text-red-500 text-xs">Vendor name should be alphabets</p>
                                                )}
                                            </td>
                                            <td className="px-2 py-2">
                                                <button
                                                    type="button"
                                                    onClick={confirmNewRow}
                                                    className="text-green-500 hover:text-green-600"
                                                >
                                                    ✔️
                                                </button>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Row with Add button */}
                                    {!isAdding && (
                                        <tr className="border-b border-gray-200" style={{ height: "48px" }}>
                                            <td colSpan={4} className="text-start pl-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAdding(true)}
                                                    className="text-blue-500 text-sm font-medium hover:underline"
                                                >
                                                    + Add
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RfpAttachments;
