import React, { useEffect, useState } from "react";
import { ICapexRequestDetail, IQuotes } from "../../types/capexTypes";
import { DocumentIcon, GeneralDetailIcon } from "../../utils/Icons";
import ViewTable from "../basic_components/ViewTable";
import { getAllCapexDocumentsAsync, getAllQuotesAsync } from "../../services/capexService";
import { convertCurrencyLabel, handleFile } from "../../utils/common";
import { costSummuryColumnLabels, costSummuryColumns, quotesColumnLabels, quotesColumns } from "../../utils/constants";

interface RequestDetailLeftProp {
    requestData: ICapexRequestDetail | undefined
}

interface ICapexDocument {
    id: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    clientId: string;
    capexrequestId: string,
    documentName: string,
    document: string
    attachmentComponent: JSX.Element;
}

const CommonCard = ({ data, className }: { data: Record<string, string>, className?: string }) => {
    return (
        <div
            className={`border border-lightblue p-4 flex justify-between text-sm rounded-lg bg-[#EDF4FD] ${className}`}
        >
            {Object.keys(data).map((k) => (
                <div key={k} className="w-36 group relative">
                    <p className="mb-1 text-gray-500">{k}</p>
                    <span className="block truncate">{data[k]}</span>

                    {/* Tooltip on Hover */}
                    {data[k].length > 16 && <div className="absolute left-0 top-full hidden group-hover:flex bg-[#EDF4FD] shadow-md p-2 rounded w-max max-w-[300px] z-10 border border-gray-300">
                        {data[k]}
                    </div>}
                </div>
            ))}
        </div>
    )
}

const RequestDetailLeft: React.FC<RequestDetailLeftProp> = ({ requestData }: RequestDetailLeftProp) => {
    const [capexquotes, setQuotes] = useState<IQuotes[]>([])
    const [capexDocuments, setCapexDocuments] = useState<ICapexDocument[]>([]);

    const setupQuotes = async () => {
        try {
            if (requestData) {
                const quotes = await getAllQuotesAsync(requestData.id as string);
                const quotes_to_display = quotes.map((q: any) => {
                    const file = handleFile(q.attachment, q.attachmentName);
                    return ({ ...q, attachmentComponent: <a href={file.url} style={{ color: "blue", textDecoration: "underline" }} download={file.fileName}>{file.fileName}</a> })
                })
                setQuotes(quotes_to_display);
            }
        } catch (err) { }
    }

    const setDocuments = async () => {
        try {
            if (requestData) {
                const documents = await getAllCapexDocumentsAsync(requestData.id as string);
                const documents_to_display = documents.map(d => {
                    const file = handleFile(d.document, d.documentName.split('.')[0]);
                    return ({ ...d, attachmentComponent: <a className="text-[13px] flex" href={file.url} download={file.fileName}><DocumentIcon className="size-4" /><p className="pl-[4px]" style={{ color: "blue", textDecoration: "underline" }}>{file.fileName}</p></a> })
                })
                setCapexDocuments(documents_to_display);
            }
        } catch (err) { }
    }

    useEffect(() => {
        setupQuotes();
        setDocuments();
    }, [requestData])

    return (
        <div className="h-full flex items-center bg-white flex-col px-10 pt-6 border-r border-gray-200">
            {requestData && <>
                {/* Project Name,ID */}
                <div className="mb-[16px]" style={{ width: "504px" }}>
                    <span className="font-bold text-[22px] leading-[33.8px] mb-[8px] block">{requestData.projectName}</span>
                    <span style={{ padding: "4px 8px", border: "1px solid #A8AEBA", borderRadius: "20px", fontSize: "14px", backgroundColor: "#EBEEF4" }}>ID: {requestData.capexId}</span>
                </div>
                {/* Description */}
                <div className="mb-[24px]" style={{ width: "504px" }}>
                    <span className="mb-[4px]" style={{ color: "gray", fontSize: "14px" }}>Description</span>
                    <p style={{ fontSize: "14px" }}>{requestData.projectDescription}</p>
                </div>
                {/* General Details */}
                <div className="h-full" style={{ width: "504px" }}>
                    <span className="font-bold text-[16px] mb-[17.5px] flex"><GeneralDetailIcon className="size-5" /><span className="pl-[8px]">General Details</span></span>
                    <CommonCard data={{
                        "Expenditure type": requestData?.expenditureType as string,
                        "Requesting department": requestData.requestingDepartment as string,
                        "Estimated budget": `${convertCurrencyLabel(requestData.currency)}${requestData.estimatedBudget.toFixed(2)}` as string
                    }} className="mb-[16px]" />
                    {/* Cost Summury */}
                    <div className="mb-[4px]" style={{ color: "gray", fontSize: "14px" }}>Cost&nbsp;Summary</div>
                    <ViewTable columnLabels={costSummuryColumnLabels} columns={costSummuryColumns} items={requestData.capexCostSummuries.map(item => ({
                        ...item,
                        estimatedAmount: `${convertCurrencyLabel(requestData.currency)}${item.estimatedAmount.toFixed(2)}`
                    }))}

                    />
                    {/* Purpose */}
                    <div className="mt-[16px] mb-[4px] text-[14px]" style={{ color: "gray" }}>Purpose</div>
                    <p className="text-[14px] mb-[16px]">{requestData.purpose ? requestData.purpose : "No data"}</p>
                    {/* Benifits */}
                    <div className="mb-[4px] text-[14px]" style={{ color: "gray" }}>Benifits</div>
                    <p className="text-[14px] mb-[16px]">{requestData.benefits ? requestData.benefits : "No data"}</p>
                    {/* Owner Details */}
                    <CommonCard data={{
                        "Owner name": requestData.ownerName as string,
                        "Owner email": requestData.ownerEmail as string,
                        "Approval level required": requestData.approvalLevelRequired as string
                    }} className="mb-[14px]" />
                    {/* Quotes and recommendations */}
                    <span className="font-bold text-[16px] mb-[17.5px] flex"><GeneralDetailIcon className="size-5" /><span className="pl-[8px]">Quotes&nbsp;and&nbsp;recommendations</span></span>
                    <div className="text-[14px] mb-[4px]" style={{ color: "gray" }}>Quotes</div>
                    <ViewTable columnLabels={quotesColumnLabels} columns={quotesColumns} items={capexquotes.map(item => ({
                        ...item,
                        amount: `${convertCurrencyLabel(requestData.currency)}${item.amount.toFixed(2)}`
                    }))} />

                    <div className="mt-[16px] mb-[4px] text-[14px]" style={{ color: "gray" }}>Estimated savings/Additional profits</div>
                    <p className="text-[14px] mb-[16px]">{requestData.estimatedSavings ? requestData.estimatedSavings : "No data"}</p>

                    <div className="text-[14px] mb-[4px]" style={{ color: "gray" }}>Supporting documents</div>
                    {capexDocuments.length > 0 ? <div className="flex flex-col">{capexDocuments.map(d => d.attachmentComponent)}</div> : <div className="text-xs">No documents found</div>}
                </div>
            </>}
        </div>
    )
}

export default RequestDetailLeft;