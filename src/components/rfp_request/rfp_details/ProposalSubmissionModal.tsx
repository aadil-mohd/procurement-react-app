import React, { useEffect, useState } from "react";
import { KeyValueGrid } from "./RfpDetailLeft";
import { DocumentIconByExtension, GeneralDetailIcon, TickIcon } from "../../../utils/Icons";
import { getAllProposalDocuments, updateProposalStatusAsync } from "../../../services/rfpService";
import { documentTypeConst } from "../../../utils/constants";
import { getUserCredentials } from "../../../utils/common";

type ProposalSubmissionModalProps = {
  rfp: any;
  trigger: () => void
  proposal?: any
};

const ProposalSubmissionModal: React.FC<ProposalSubmissionModalProps> = ({ rfp, trigger, proposal }) => {
  const [attachments, setAttachments] = useState<any[]>([]);
  const [ownerIn, setOwnerIn] = useState<{ technical: boolean, commercial: boolean }>({
    technical: false, commercial: false
  })

  const handleSubmit = async (e: React.FormEvent, type: "Approved" | "Rejected") => {
    e.preventDefault();

    await updateProposalStatusAsync(proposal?.id ?? 0, type);
    trigger();
  };


  const setupProposalModal = async () => {
    try {
      const response = await getAllProposalDocuments(proposal.rfpId, proposal.id);
      setAttachments(response);

      const tempOwnerIn = {
        technical: false, commercial: false
      };

      (rfp?.rfpOwners as any[])?.forEach(ow => {
        if (ow.ownerId.toString() == getUserCredentials().userId && ow.ownerType == documentTypeConst.technical) tempOwnerIn.technical = true;
        else if (ow.ownerId.toString() == getUserCredentials().userId && ow.ownerType == documentTypeConst.commercial) tempOwnerIn.commercial = true;
      })
      setOwnerIn(tempOwnerIn);
    } catch (err) {

    }
  }


  useEffect(() => {
    setupProposalModal();
  }, [proposal])

  return (
    <div className="w-full h-full flex flex-col relative" >
      {/* Left Section */}
      <form
        onSubmit={() => { }}
        className="flex flex-col w-full h-full bg-white rounded overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-rounded scrollbar-track-blue-100"
      >
        <div className="bg-white w-full pt-3 pl-3 mb-[8px]">
          <div>
            <span className="font-bold text-[22px] leading-[33.8px] mb-[8px] block">{proposal?.vendorName}</span>
            <span className="mb-[4px] block" style={{ color: "gray", fontSize: "14px" }}>Malappuuram, Kerala</span>
            <span style={{ padding: "4px 8px", border: "1px solid #A8AEBA", borderRadius: "20px", fontSize: "14px", backgroundColor: "#EBEEF4" }}>ID: {proposal?.vendorCode}</span>
          </div>
        </div>
        <div className="p-4 rounded">
          <div className="mb-2">
            <KeyValueGrid className="mb-[16px]"
              data={[
                { label: "Bid Amount", value: proposal?.bidAmount ?? 0 },
                { label: "Bid Validity", value: `${proposal?.bidValidity ?? 0} days` },
              ]}
            />
            <KeyValueGrid className="mb-[16px]"
              data={[
                { label: "Tax Included", value: proposal?.isTaxIncluded ? "Yes" : "No" },
                { label: "Included Delivery/Logistics", value: proposal?.isShippingIncluded ? "Yes" : "No" },
              ]}
            />
            {/* Payment Terms */}
            <div className="mb-[16px]" style={{ width: "504px" }}>
              <span className="mb-[4px]" style={{ color: "gray", fontSize: "12px" }}>Payment Terms</span>
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{proposal?.paymentTerms}</p>
            </div>

            {/* Description */}
            <div className="mb-[16px]" style={{ width: "504px" }}>
              <span className="mb-[4px]" style={{ color: "gray", fontSize: "12px" }}>Escalation Clause / Price Revisions</span>
              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{proposal?.escalationTerms}</p>
            </div>

            {ownerIn.technical &&<>
              <span className="font-bold text-[16px] mb-[17.5px] flex"><GeneralDetailIcon className="size-5" /><span className="pl-[8px]">Technical Documents</span></span>
              <div className="flex flex-col mb-[16px]">
                {attachments.map((doc) => doc.documentTypeId == documentTypeConst.technical ? <a className="text-[13px] flex" href={doc?.filePath} download={doc?.fileTitle}><DocumentIconByExtension filePath={doc?.filePath} className="w-5 h-5" /><p className="pl-[4px]" style={{ color: "blue", textDecoration: "underline" }}>{doc?.fileTitle}</p></a> : <></>)}
              </div></>}
            {ownerIn.commercial && <>
              <span className="font-bold text-[16px] mb-[17.5px] flex"><GeneralDetailIcon className="size-5" /><span className="pl-[8px]">Commercial Documents</span></span>
              <div className="flex flex-col mb-[16px]">
                {attachments.map((doc) => doc.documentTypeId == documentTypeConst.commercial ? <a className="text-[13px] flex" href={doc?.filePath} download={doc?.fileTitle}><DocumentIconByExtension filePath={doc?.filePath} className="w-5 h-5" /><p className="pl-[4px]" style={{ color: "blue", textDecoration: "underline" }}>{doc?.fileTitle}</p></a> : <></>)}
              </div>
            </>}
          </div>
        </div>

        <div className="w-full flex flex-col items-center space-y-1">
          {proposal?.isTechnicalTeamApproved && <div className="w-10/12 p-4 flex text-sm rounded-lg bg-[#EDF4FD]"><TickIcon className="w-5 h-5" />Technical team Approved</div>}
          {proposal?.isCommercialTeamApproved && <div className="w-10/12 p-4 flex text-sm rounded-lg bg-[#EDF4FD]"><TickIcon className="w-5 h-5" />Commercial team Approved</div>}
        </div>
        {proposal?.status != "Approved" && proposal?.status != "Rejected" && <div className="w-full flex justify-start pl-4 py-2 space-x-2 absolute bottom-0">
          <button
            onClick={(e) => handleSubmit(e, "Approved")}
            type="submit"
            // disabled={showLoaderOnButton || budgetLoader ? true : false}
            className={`h-[36px] bg-blue-500 hover:bg-blue-400 text-sm py-1 px-2 text-white rounded`}
          >
            Approve
          </button>
          <button
            onClick={(e) => handleSubmit(e, "Rejected")}
            type="submit"
            // disabled={showLoaderOnButton || budgetLoader ? true : false}
            className={`h-[36px] bg-red-500 hover:bg-red-400 text-sm py-1 px-2 text-white rounded`}
          >
            Reject
          </button>
        </div>}
      </form>
    </div>
  );
}

export default ProposalSubmissionModal;
