import React, { SetStateAction, useEffect, useState } from "react";
import TextField from "../../basic_components/TextField";
import { formatDate } from "../../../utils/common";
import { IRfp } from "../../../types/rfpTypes";
import PeoplePicker from "../../basic_components/PeoplePicker";

interface TimeLineOwnershipProps {
  requestData: any
  setRequestData: React.Dispatch<SetStateAction<any>>;
  masterData: any,
  owners:any, 
  setOwners:React.Dispatch<SetStateAction<any>>;
}

const TimeLineOwnership: React.FC<TimeLineOwnershipProps> = ({
  requestData,
  setRequestData,
  masterData,
  owners, setOwners
}) => {

  useEffect(()=>{
    console.log(owners)
  },[owners])
  return (
    <div className="p-2 w-[484px]">
      <div className="flex justify-between w-full mb-4">
        {/* Start Date */}
        <div className="mb-2 w-full md:flex-1 pr-2">
          <label className="block text-sm font-medium mb-2">
            Express Interest LastDate <span className="text-red-500">*</span>
          </label>
          <TextField
            id="expressInterestLastDate"
            value={formatDate(requestData.expressInterestLastDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({ ...prev, expressInterestLastDate: value }))
            }
            placeholder="Enter intrest last date"
            type="date"
            width="w-full"
          //disablePrevDates={type == "create" ? true : false}
          />
        </div>

        {/* End Date */}
        <div className="mb-2 w-full md:flex-1 pl-2">
          <label className="block text-sm font-medium mb-2">
            Response Due Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="responseDueDate"
            value={formatDate(requestData.responseDueDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({ ...prev, responseDueDate: value }))
            }
            placeholder="Enter response due date"
            type="date"
            width="w-full"
          //disablePrevDates={type == "create" ? true : false}
          />
        </div>
      </div>
      <div className="flex justify-between w-full mb-4">
        {/* Start Date */}
        <div className="mb-2 w-full md:flex-1 pr-2">
          <label className="block text-sm font-medium mb-2">
            Buyer Reply End Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="buyerReplyEndDate"
            value={formatDate(requestData.buyerReplyEndDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({ ...prev, buyerReplyEndDate: value }))
            }
            placeholder="Enter replay end date"
            type="date"
            width="w-full"
          //disablePrevDates={type == "create" ? true : false}
          />
        </div>

        {/* End Date */}
        <div className="mb-2 w-full md:flex-1 pl-2">
          <label className="block text-sm font-medium mb-2">
            Clarification End Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="clarificationDate"
            value={formatDate(requestData.clarificationDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({ ...prev, clarificationDate: value }))
            }
            placeholder="Enter clarification end date"
            type="date"
            width="w-full"
          //disablePrevDates={type == "create" ? true : false}
          />
        </div>
      </div>

      <div className="flex justify-between w-full mb-4">
        {/* Start Date */}
        <div className="mb-2 w-full md:flex-1 pr-2">
          <label className="block text-sm font-medium mb-2">
            Closing Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="closingDate"
            value={formatDate(requestData.closingDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({ ...prev, closingDate: value }))
            }
            placeholder="Enter closing date"
            type="date"
            width="w-full"
          //disablePrevDates={type == "create" ? true : false}
          />
        </div>

        {/* Closing time */}
        <div className="mb-2 w-full md:flex-1 pl-2">
          <label className="block text-sm font-medium mb-2">
            Closing Time <span className="text-red-500">*</span>
          </label>
          <TextField
            id="closingTime"
            value={requestData.closingTime ?? ""}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({ ...prev, closingTime: value }))
            }
            placeholder="Enter Closing Time like 21:00"
            type="text"
            width="w-full"
          //disablePrevDates={type == "create" ? true : false}
          />
        </div>
      </div>

      {/* Technical Owners */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Technical Owners</label>
        <PeoplePicker setValue={(value: any) => setOwners((prev: IRfp) => ({ ...prev, technical: value} ))} users={masterData.users} value={owners.technical} placeholder="search.." />
      </div>

      {/* Commercial Owners */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Commercial Owners</label>
        <PeoplePicker setValue={(value: any) => setOwners((prev: IRfp) => ({ ...prev, commercial: value }))} users={masterData.users} value={owners.commercial} placeholder="search.." />
      </div>
    </div>
  );
};

export default TimeLineOwnership;
