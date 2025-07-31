import React, { SetStateAction } from "react";
import TextField from "../../basic_components/TextField";
import SelectField from "../../basic_components/SelectField";
import PeoplePicker from "../../basic_components/PeoplePicker";
import { Select } from "antd";


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
    <div className="p-6">
      {/* Left label + Form side by side */}
      <div className="flex items-start gap-4">
        {/* Section Label */}
        <div className="w-[300px]">
          <h2 className="text-lg font-semibold">General Information</h2>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="flex flex-col items-start w-full max-w-[400px]">
            {/* RFP Title */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                RFP Title <span className="text-red-500">*</span>
              </label>
              <TextField
                required={true}
                id="rfpTitle"
                field="rfpTitle"
                value={requestData?.rfpTitle || ""}
                setValue={(value) =>
                  setRequestData((prev: any) => ({ ...prev, rfpTitle: value }))
                }
                placeholder="Enter RFP Title"
                style=""
                type="text"
                width="w-full"
              />
            </div>

            {/* RFP Description */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                RFP Description
              </label>
              <TextField
                id="rfpDescription"
                field="rfpDescription"
                value={requestData?.rfpDescription || ""}
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

            {/* Category */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
                <Select
                  className="h-[41px]"
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Select category"
                  value={requestData?.rfpCategories?.map((item: any) => (item.categoryId))}
                  // defaultValue={[]}
                  onChange={(selectedValue) => {
                    setRequestData((prev: any) => ({
                      ...prev,
                      rfpCategories: selectedValue?.map((item: string) => ({ categoryId: Number(item), rfpId: 0 })),
                    }));
                  }}
                  options={(masterData?.categories || []).map((x: any) => ({
                    label: <span className="text-md font-medium">{x.name}</span>,
                    value: x.id,
                  }))}
                />
            </div>

            {/* Purchase Requisition ID */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Purchase Requisition ID
              </label>
              <TextField
                id="purchaseRequisitionId"
                field="purchaseRequisitionId"
                value={requestData?.purchaseRequisitionId || ""}
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

          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-start w-full max-w-[400px]">

            {/* Organization */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Organization
              </label>
              <TextField
                id="organizationId"
                field="organizationId"
                value={requestData?.buyerOrganizationName || ""}
                setValue={(value) =>
                  setRequestData((prev: any) => ({
                    ...prev,
                    buyerOrganizationName: value,
                  }))
                }
                disabled
                placeholder="Purchase Requisition ID"
                style=""
                type="text"
                width="w-full"
              />
            </div>

            {/* Organization */}
            {/* <div className="w-full mb-4">
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
            </div> */}

            {/* Buyer Department */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Buyer Department <span className="text-red-500">*</span>
              </label>
              <SelectField
                search={false}
                id="departmentId"
                label=""
                style="w-full"
                value={
                  masterData?.departments?.find(
                    (x: any) => Number(x?.id) == Number(requestData?.departmentId)
                  )?.departmentName || "Buyer department"
                }
                options={(masterData?.departments)?.map((x: any) => ({
                  label: (
                    <span className="text-md font-medium">{x.departmentName}</span>
                  ),
                  value: x.id,
                }))}
                onChange={(selectedValue) => {
                  const newDeptId = Number(selectedValue);
                  const isDeptChanged = requestData?.departmentId !== newDeptId;

                  setRequestData((prev: any) => ({
                    ...prev,
                    departmentId: newDeptId,
                    ...(isDeptChanged ? { buyer: [], buyerName: "" } : {}),
                  }));
                }}
              />
            </div>

            {/* Buyer */}
            <div className="w-full mb-4">
              <PeoplePicker
                users={masterData?.users}
                setValue={(val) => { setRequestData((prev: any) => ({ ...prev, buyer: val.length ? [val[val.length - 1]] : [], buyerName: val.length ? val[val.length - 1].name : "" })) }}
                value={requestData && requestData?.buyer ? requestData?.buyer : []}
                label="Buyer"
                height={"41px"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformation;
