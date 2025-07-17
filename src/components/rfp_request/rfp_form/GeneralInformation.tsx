import React, { SetStateAction } from "react";
import TextField from "../../basic_components/TextField";
import SelectField from "../../basic_components/SelectField";
import PeoplePicker from "../../basic_components/PeoplePicker";
import { getUserCredentials } from "../../../utils/common";

interface GeneralInformationProps {
  requestData: any;
  setRequestData: React.Dispatch<SetStateAction<any>>;
  masterData: any;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({
  requestData,
  setRequestData,
  masterData,
}) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1 */}
        {/* Column 1 */}
        <div className="flex justify-center">
          <div className="flex flex-col items-start w-full max-w-[400px]">
            {/* RFP Title */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                RFP Title <span className="text-red-500">*</span>
              </label>
              <TextField
                id="rfpTitle"
                field="rfpTitle"
                value={requestData.rfpTitle || ""}
                setValue={(value) =>
                  setRequestData((prev: any) => ({ ...prev, rfpTitle: value }))
                }
                placeholder="Enter RFP Title"
                style=""
                type="text"
                width="w-full"
              />
            </div>

            {/* Category */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <SelectField
                id="categoryId"
                label=""
                style="w-full"
                value={
                  masterData?.categories?.find(
                    (x: any) => x?.id === requestData?.categoryId
                  )?.name || "Select Category"
                }
                options={(masterData?.categories || []).map((x: any) => ({
                  label: <span className="text-md font-medium">{x.name}</span>,
                  value: x.id,
                }))}
                onChange={(selectedValue) => {
                  setRequestData((prev: any) => ({
                    ...prev,
                    categoryId: selectedValue,
                  }));
                }}
              />
            </div>

            {/* Buyer (Moved under Category) */}
            <div className="w-full mb-4">
              <PeoplePicker
                users={masterData?.users}
                setValue={(val) => {
                  setRequestData((prev: any) => ({
                    ...prev,
                    buyer: val,
                    buyerName: val.length ? val[0].name : "",
                  }));
                }}
                value={requestData?.buyer || []}
                label="Buyer"
                height={"41px"}
              />
            </div>
          </div>
        </div>


        {/* Column 2 */}
        <div className="flex justify-center">
          <div className="flex flex-col items-start w-full max-w-[400px]">
            {/* Organization */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Organization <span className="text-red-500">*</span>
              </label>
              <SelectField
                id="organizationId"
                label=""
                style="w-full"
                value={
                  masterData?.companies?.find(
                    (x: any) =>
                      x?.companyName === requestData?.buyerOrganizationName
                  )?.companyName ||
                  masterData?.companies?.find(
                    (x: any) =>
                      x?.id.toString() === getUserCredentials().companyId
                  )?.companyName
                }
                options={(masterData?.companies || []).map((x: any) => ({
                  label: (
                    <span className="text-md font-medium">{x.companyName}</span>
                  ),
                  value: x.id,
                }))}
                onChange={(selectedValue) => {
                  setRequestData((prev: any) => ({
                    ...prev,
                    buyerOrganizationName: selectedValue,
                  }));
                }}
              />
            </div>

            {/* Buyer Department */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Buyer Department <span className="text-red-500">*</span>
              </label>
              <SelectField
                id="departmentId"
                label=""
                style="w-full"
                value={
                  masterData?.departments?.find(
                    (x: any) => x?.id.toString() === requestData?.departmentId
                  )?.departmentName || "Buyer department"
                }
                options={(masterData?.departments || []).map((x: any) => ({
                  label: (
                    <span className="text-md font-medium">{x.departmentName}</span>
                  ),
                  value: x.id,
                }))}
                onChange={(selectedValue) => {
                  setRequestData((prev: any) => ({
                    ...prev,
                    departmentId: selectedValue.toString(),
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex justify-center">
          <div className="flex flex-col items-start w-full max-w-[400px]">
            {/* Purchase Requisition ID */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Purchase Requisition ID
              </label>
              <TextField
                id="purchaseRequisitionId"
                field="purchaseRequisitionId"
                value={requestData.purchaseRequisitionId || ""}
                setValue={(value) =>
                  setRequestData((prev: any) => ({
                    ...prev,
                    purchaseRequisitionId: value,
                  }))
                }
                placeholder="Purchase Requisition ID"
                style=""
                type="text"
                width="w-full"
              />
            </div>

            {/* RFP Description */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                RFP Description <span className="text-red-500">*</span>
              </label>
              <TextField
                id="rfpDescription"
                field="rfpDescription"
                value={requestData.rfpDescription || ""}
                setValue={(value) =>
                  setRequestData((prev: any) => ({
                    ...prev,
                    rfpDescription: value,
                  }))
                }
                placeholder="Enter RFP description"
                style="min-h-[50px]"
                type="textarea"
                width="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;
