import React, { SetStateAction, useEffect } from "react";
import TextField from "../../basic_components/TextField";
import { formatDate } from "../../../utils/common";
import { IRfp } from "../../../types/rfpTypes";
import PeoplePicker from "../../basic_components/PeoplePicker";

interface TimeLineOwnershipProps {
  requestData: any;
  setRequestData: React.Dispatch<SetStateAction<any>>;
  masterData: any;
  owners: any;
  setOwners: React.Dispatch<SetStateAction<any>>;
}

const TimeLineOwnership: React.FC<TimeLineOwnershipProps> = ({
  requestData,
  setRequestData,
  masterData,
  owners,
  setOwners,
}) => {
  useEffect(() => {
    console.log(owners);
  }, [owners]);

  return (
    <div className="p-4 w-full">
      {/* Grid for Dates and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Express Interest LastDate */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Express Interest LastDate <span className="text-red-500">*</span>
          </label>
          <TextField
            id="expressInterestLastDate"
            value={formatDate(requestData.expressInterestLastDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({
                ...prev,
                expressInterestLastDate: value,
              }))
            }
            placeholder="Enter interest last date"
            type="date"
            width="w-full"
          />
        </div>

        {/* Response Due Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Response Due Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="responseDueDate"
            value={formatDate(requestData.responseDueDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({
                ...prev,
                responseDueDate: value,
              }))
            }
            placeholder="Enter response due date"
            type="date"
            width="w-full"
          />
        </div>

        {/* Buyer Reply End Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Buyer Reply End Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="buyerReplyEndDate"
            value={formatDate(requestData.buyerReplyEndDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({
                ...prev,
                buyerReplyEndDate: value,
              }))
            }
            placeholder="Enter reply end date"
            type="date"
            width="w-full"
          />
        </div>

        {/* Clarification End Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Clarification End Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="clarificationDate"
            value={formatDate(requestData.clarificationDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({
                ...prev,
                clarificationDate: value,
              }))
            }
            placeholder="Enter clarification end date"
            type="date"
            width="w-full"
          />
        </div>

        {/* Closing Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Closing Date <span className="text-red-500">*</span>
          </label>
          <TextField
            id="closingDate"
            value={formatDate(requestData.closingDate ?? "")}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({
                ...prev,
                closingDate: value,
              }))
            }
            placeholder="Enter closing date"
            type="date"
            width="w-full"
          />
        </div>

        {/* Closing Time */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Closing Time <span className="text-red-500">*</span>
          </label>
          <TextField
            id="closingTime"
            value={requestData.closingTime ?? ""}
            setValue={(value: string) =>
              setRequestData((prev: IRfp) => ({
                ...prev,
                closingTime: value,
              }))
            }
            placeholder="Enter Closing Time like 21:00"
            type="text"
            width="w-full"
          />
        </div>
      </div>

      {/* Owners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Technical Owners */}
        <div>
          <label className="block text-sm font-medium mb-2">Technical Owners</label>
          <PeoplePicker
            setValue={(value: any) =>
              setOwners((prev: IRfp) => ({ ...prev, technical: value }))
            }
            users={masterData.users}
            value={owners.technical}
            placeholder="search.."
          />
        </div>

        {/* Commercial Owners */}
        <div>
          <label className="block text-sm font-medium mb-2">Commercial Owners</label>
          <PeoplePicker
            setValue={(value: any) =>
              setOwners((prev: IRfp) => ({ ...prev, commercial: value }))
            }
            users={masterData.users}
            value={owners.commercial}
            placeholder="search.."
          />
        </div>
      </div>
    </div>
  );
};

export default TimeLineOwnership;
