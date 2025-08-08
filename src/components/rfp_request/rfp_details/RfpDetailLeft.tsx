import React, { useEffect, useState } from "react";
import { DocumentIconByExtension, GeneralDetailIcon } from "../../../utils/Icons";
import { convertCurrencyLabel, getUserCredentials } from "../../../utils/common";
import ShowStatus from "../../buttons/ShowStatus";
import dayjs from "dayjs";
import userPhoto from "../../../assets/profile_photo/userPhoto.png"
import { getAllUsersByFilterAsync } from "../../../services/userService";
import { publishRfpAsync } from "../../../services/rfpService";
import { useNavigate, useParams } from "react-router-dom";
import { PenIcon } from "lucide-react";

interface RfpDetailLeftProp {
    masterData: any;
    requestData: any | undefined
    trigger: () => void
}


const CommonCard = ({ data, className }: { data: Record<string, any>, className?: string }) => {
    return (
        <div
            className={`border border-lightblue p-4 flex text-sm rounded-lg bg-[#EDF4FD] ${className}`}
        >
            {Object.keys(data).map((k) => (
                <div key={k} className="pr-[55px] group relative">
                    <p className="mb-1 text-gray-500">{k}</p>
                    <span className="block truncate">{data[k]}</span>

                    {/* Tooltip on Hover */}
                    {data[k] && data[k]?.length > 16 && <div className="absolute left-0 top-full hidden group-hover:flex bg-[#EDF4FD] shadow-md p-2 rounded w-max max-w-[300px] z-10 border border-gray-300">
                        {data[k]}
                    </div>}
                </div>
            ))}
        </div>
    )
}

type KeyValueProps = {
    data: {
        label: string;
        value: React.ReactNode;
    }[];
    className: string;
};

export const KeyValueGrid: React.FC<KeyValueProps> = ({ data, className }) => {
    return (
        <div className={`grid grid-cols-2 gap-y-[16px] ${className}`}>
            {data.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                    <span className="text-[12px] text-gray-500 mb-[4px]">{item.label}</span>
                    <span className="text-[14px] text-gray-900">{item.value}</span>
                </div>
            ))}
        </div>
    );
};

type UserBadge = {
    name: string;
    avatarUrl: string;
};

type UserBadgesProps = {
    title: string;
    users: UserBadge[];
};

export const UserBadges: React.FC<UserBadgesProps> = ({ title, users }) => {
    return (
        <div className="flex flex-col mb-[16px]">
            <span className="text-[14px] text-gray-500 mb-[8px]">{title}</span>
            <div className="flex items-center gap-[8px]">
                {users.map((user, idx) => (
                    <div
                        key={idx}
                        className="flex items-center bg-[#EBEEF4] rounded-full py-1 px-1"
                    >
                        <img
                            src={user.avatarUrl || userPhoto}
                            alt={user.name}
                            className="w-[24px] h-[24px] rounded-full mr-[8px]"
                        />
                        <span className="text-[14px] text-gray-800">{user.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RfpDetailLeft: React.FC<RfpDetailLeftProp> = ({ masterData, requestData, trigger }: RfpDetailLeftProp) => {
    const [rfpDocuments, setRfpDocuments] = useState<any[]>([]);
    const [owners, setOwners] = useState<{ technical: any[], commercial: any[] }>({ technical: [], commercial: [] })
    const navigate = useNavigate();
    const { id } = useParams();

    const setupOwners = async () => {
        try {
            if (requestData) {
                const users: any = await getAllUsersByFilterAsync();
                const tempOwners: { technical: any[], commercial: any[] } = { technical: [], commercial: [] }
                requestData?.rfpOwners.forEach((ow: any) => {
                    const userExist: any = users.items.find((u: any) => u.id == ow.ownerId);
                    if (userExist) {
                        switch (ow.ownerType) {
                            case 1: {
                                tempOwners.technical.push({
                                    name: userExist.name,
                                    avatarUrl: userExist?.photo ?? userPhoto,
                                });
                                break; // Add break to prevent fallthrough
                            }
                            case 2: {
                                tempOwners.commercial.push({
                                    name: userExist.name,
                                    avatarUrl: userExist?.photo ?? userPhoto,
                                });
                                break; // Add break to prevent fallthrough
                            }
                            default: {
                                // No action needed, or handle default case if necessary
                            }
                        }
                    }

                })
                setOwners(tempOwners)
            }
        } catch (err) { }
    }

    const setDocuments = async () => {
        try {
            if (requestData) {
                const documents_to_display = requestData.rfpGeneralDocuments.map((d: any) =>
                    ({ ...d, attachmentComponent: <a className="text-[13px] flex items-end" href={d.filePath} download={d.fileTitle}><DocumentIconByExtension className="w-[25px] h-[25px]" filePath={d.filePath} /><p className="pl-[4px]" style={{ color: "blue", textDecoration: "underline" }}>{d.fileTitle}</p></a> })
                )
                setRfpDocuments(documents_to_display);
            }
        } catch (err) { }
    }

    const onEditRequest = async () => {
        try {
            navigate(`/rfps/edit-rfp/${id}`)
        } catch (error) {

        }
    }

    useEffect(() => {
        setupOwners();
        setDocuments();
    }, [requestData])

    return (
        <div className="h-full flex items-center bg-white flex-col px-10 pt-6 border-r border-gray-200 relative">
            {requestData && <>
                {/* Project Name,ID */}
                <div className="mb-[16px]" style={{ width: "504px" }}>
                    <div className="flex justify-between items-center">
                        <>
                            <span className="font-bold text-[22px] leading-[33.8px] mb-[8px] block">{requestData.rfpTitle}</span>
                            <div>
                                <span onClick={onEditRequest}><PenIcon className="text-gray-500" size={"1.2rem"}/></span>
                            </div>
                        </>
                    </div>
                    <span style={{ padding: "4px 8px", border: "1px solid #A8AEBA", borderRadius: "20px", fontSize: "14px", backgroundColor: "#EBEEF4" }}>ID: {requestData?.tenderNumber || "-"}</span>
                </div>
                {/* Description */}
                <div className="mb-[24px]" style={{ width: "504px" }}>
                    <span className="mb-[4px]" style={{ color: "gray", fontSize: "14px" }}>Description</span>
                    <p style={{ fontSize: "14px" }}>{requestData.rfpDescription}</p>
                </div>
                {/* General Details */}
                <div className="h-full" style={{ width: "504px" }}>
                    <span className="font-bold text-[16px] mb-[17.5px] flex"><GeneralDetailIcon className="size-5" /><span className="pl-[8px]">General Details</span></span>
                    <div className="mb-[24px]" style={{ width: "504px" }}>
                        <span className="mb-[4px]" style={{ color: "gray", fontSize: "14px" }}>Published Categories</span>
                        {masterData?.categories?.length > 0 && requestData?.rfpCategories?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {requestData?.rfpCategories?.map((item: any) => {
                                    const category = masterData?.categories?.find(
                                        (c: any) => c.id === item.categoryId
                                    );
                                    return (
                                        <div key={item.categoryId} className={"py-1 px-2 text-xs border rounded-full flex justify-center bg-blue-100 text-blue-700 border-blue-500"}>{category?.name || 'Unknown'}</div>                    
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <CommonCard data={{
                        // "Category": requestData?.categoryName ?? "-" as string,
                        "Purchase\u00A0Requisition\u00A0ID": requestData?.purchaseRequisitionId as string,
                        "RFP Status": <ShowStatus type="rfps" status={requestData?.status} />
                    }} className="mb-[16px]" />
                    <KeyValueGrid className="mb-[16px]"
                        data={[
                            { label: "Closed / Open", value: requestData?.isOpen ? "Open" : "Closed" },
                            { label: "Serial / Parallel", value: requestData?.isSerial ? "Serial" : "Parallel" },
                        ]}
                    />
                    <KeyValueGrid className="mb-[16px]"
                        data={[
                            { label: "Estimated Contract Value", value: `${convertCurrencyLabel(requestData?.rfpCurrency)}${requestData?.estimatedContractValue}` },
                            { label: "Contract Value Hidden From Vendor", value: requestData?.hideContractValueFromVendor ? "Yes" : "No" },
                        ]}
                    />
                    <KeyValueGrid className="mb-[16px]"
                        data={[
                            { label: "Bid Value", value: `${convertCurrencyLabel(requestData?.rfpCurrency)}${requestData?.bidValue}` },
                            { label: "Tender Fee", value: `${convertCurrencyLabel(requestData?.rfpCurrency)}${requestData?.tenderFee}` },
                        ]}
                    />
                </div>

                {/* Rfp Details */}
                <div className="h-full" style={{ width: "504px" }}>
                    <span className="font-bold text-[16px] mb-[17.5px] flex"><GeneralDetailIcon className="size-5" /><span className="pl-[8px]">Rfp Details</span></span>
                    <CommonCard data={{
                        "Buyer Name": requestData?.buyerName as string,
                        "Department": requestData?.departmentName ?? "-" as string,
                        "Organization": requestData?.buyerOrganizationName as string
                    }} className="mb-[16px]" />
                    <KeyValueGrid className="mb-[16px]"
                        data={[
                            { label: "Express Interest Last Date", value: dayjs(requestData?.expressInterestLastDate).format("DD-MM-YYYY") },
                            { label: "Clarification Date", value: dayjs(requestData?.clarificationDate).format("DD-MM-YYYY") },
                        ]}
                    />
                    <KeyValueGrid className="mb-[16px]"
                        data={[
                            { label: "Closing Date", value: dayjs(requestData?.closingDate).format("DD-MM-YYYY") },
                            { label: "Closing Time", value: dayjs(requestData?.closingDate).format("hh:mm A") },
                        ]}
                    />
                </div>

                {/* Ownership Details */}
                <div className="h-full" style={{ width: "504px" }}>
                    <span className="font-bold text-[16px] mb-[17.5px] flex"><GeneralDetailIcon className="size-5" /><span className="pl-[8px]">Ownership</span></span>
                    <UserBadges title="Technical Owners" users={owners.technical} />
                    <UserBadges title="Commercial Owners" users={owners.commercial} />
                    <div className="text-[14px] mb-[8px]" style={{ color: "gray" }}>Supporting documents</div>
                    {rfpDocuments.length > 0 ? <div className="flex flex-col mb-[16px]">{rfpDocuments.map(d => d.attachmentComponent)}</div> : <div className="text-xs mb-[16px]">No documents found</div>}
                </div>
            </>}
            {requestData?.status == 1 && getUserCredentials().userId == requestData?.createdBy.toString() && !requestData?.isPublished && <div className="w-[504px] flex justify-end sticky bottom-2 right-0">
                <button className="bg-customBlue h-[36px] hover:bg-blue-400 text-sm text-white rounded px-1 py-1  w-[200px]" onClick={() => {
                    (async () => {
                        await publishRfpAsync(requestData?.id)
                        trigger();
                    })();
                }}>Publish now</button>
            </div>}
        </div>
    )
}

export default RfpDetailLeft;
