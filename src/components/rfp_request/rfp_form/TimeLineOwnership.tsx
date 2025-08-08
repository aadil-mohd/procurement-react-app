import React, { SetStateAction, useEffect } from "react";
import { IRfp } from "../../../types/rfpTypes";
import PeoplePicker from "../../basic_components/PeoplePicker";
import 'react-datepicker/dist/react-datepicker.css';
import DateTimePicker from "../../basic_components/date_time_picker/DateTimePicker";
import { DatePicker } from "antd";
import dayjs from "dayjs";

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
    <div className="p-6 border-t">
      {/* Left Title + Right Form */}
      <div className="flex items-start gap-4">
        {/* Section Label */}
        <div className="w-[300px]">
          <h2 className="text-lg font-semibold">Timeline & Ownership</h2>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="flex flex-col items-start w-full max-w-[400px]">
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-1">
                Express Interest LastDate <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={requestData.expressInterestLastDate ? dayjs(requestData.expressInterestLastDate) : null}
                id="expressInterestLastDate"
                className="w-full h-[41px]"
                onChange={(value) =>
                  setRequestData((prev: IRfp) => ({
                    ...prev,
                    expressInterestLastDate: value ? value.toISOString() : null,
                  }))
                }
              />
            </div>

            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-1">
                Clarification End Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={requestData.clarificationDate ? dayjs(requestData.clarificationDate) : null}
                id="clarificationDate"
                className="w-full h-[41px]"
                onChange={(value) =>
                  setRequestData((prev: IRfp) => ({
                    ...prev,
                    clarificationDate: value ? value.toISOString() : null,
                  }))
                }
              />
            </div>

            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-1">
                Publish Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={requestData.publishDate ? dayjs(requestData.publishDate) : null}
                id="buyerReplyEndDate"
                className="w-full h-[41px]"
                onChange={(value) =>
                  setRequestData((prev: IRfp) => ({
                    ...prev,
                    publishDate: value ? value.toISOString() : null,
                  }))
                }
              />
            </div>

            <div className="w-full mb-4">
              <DateTimePicker
                required={true}
                label="Closing Time & Date"
                value={requestData.closingDate || null}
                setValue={(val) =>
                  setRequestData((prev: any) => ({
                    ...prev,
                    closingDate: val,
                  }))
                }
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-start w-full max-w-[400px]">
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-1">Technical Owners</label>
              <PeoplePicker
                setValue={(value: any) =>
                  setOwners((prev: IRfp) => ({ ...prev, technical: value }))
                }
                users={masterData?.users}
                value={owners.technical}
                placeholder="search.."
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-1">Commercial Owners</label>
              <PeoplePicker
                setValue={(value: any) =>
                  setOwners((prev: IRfp) => ({ ...prev, commercial: value }))
                }
                users={masterData?.users}
                value={owners.commercial}
                placeholder="search.."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLineOwnership;
