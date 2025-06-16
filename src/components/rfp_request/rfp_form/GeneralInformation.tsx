import React, { SetStateAction } from "react";
import TextField from "../../basic_components/TextField";
import SelectField from "../../basic_components/SelectField";

interface GeneralInformationProps {
  requestData: any
  setRequestData: React.Dispatch<SetStateAction<any>>;
  masterData:any
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ requestData, setRequestData,masterData }) => {
  return (
    <div className="p-2 w-[484px]">
      {/* RFP Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">RFP Title</label>
        <TextField
          id="rfpTitle"
          field="rfpTitle"
          value={requestData.rfpTitle || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev: any) => ({ ...prev, rfpTitle: value }))
          } // Update only projectName
          placeholder="Enter RFP Title"
          style=""
          type="text"
          width="w-full"
        />
      </div>

      {/* RFP Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">RFP Description</label>
        <TextField
          id="rfpDescription"
          field="rfpDescription"
          value={requestData.rfpDescription || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev: any) => ({ ...prev, rfpDescription: value }))
          } // Update only projectDescription
          placeholder="Enter RFP description"
          style=""
          type="textarea"
          width="w-full"
        />
      </div>

      {/* Buyer Organization */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Buyer Organization</label>
        <TextField
          id="buyerOrganizationName"
          field="buyerOrganizationName"
          value={requestData.buyerOrganizationName || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev: any) => ({ ...prev, buyerOrganizationName: value }))
          } // Update only projectDescription
          placeholder="Buyer Organization Name"
          style=""
          type="text"
          width="w-full"
        />
      </div>

      {/* Buyer Name
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">
          Buyer <span className="text-red-500">*</span>
        </label>
        <SelectField
          id="buyerName"
          label=""
          style="w-full"
          //disabled={!requestData?.requestingDepartmentId} // simplified check
          value={usersList?.find(x => x.name === requestData.ownerId)?.ownerEmail || "Select an owner"}

          options={(usersList || []).map(x => ({
            label: (
              <div>
                <span className="text-md font-medium">{x.name}</span><br />
                <span className="text-sm text-gray-500">{x.email}</span>
              </div>
            ), // Combine name and email into one string with a line break
            value: JSON.stringify([x.id, x.email, x.email]) // Store multiple values as a stringified array
          }))
            .filter(option => option.label && option.value)}

          onChange={(selectedValue) => {
            const [ownerId, ownerEmail, ownerName] = JSON.parse(selectedValue); // parse the stringified array
            setRequestData((prev) => ({
              ...prev,
              ownerId,
              ownerEmail,
              ownerName
            }));
          }}
        />
      </div> */}

      {/* Buyer Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Buyer</label>
        <TextField
          id="buyerName"
          field="buyerName"
          value={requestData.buyerName || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev: any) => ({ ...prev, buyerName: value }))
          } // Update only projectDescription
          placeholder="Buyer"
          style=""
          type="text"
          width="w-full"
        />
      </div>

      {/* Buyer Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Buyer Department<span className="text-red-500">*</span>
        </label>
        <SelectField
          id="departmentId"
          label=""
          style="w-full"
          //disabled={!requestData?.requestingDepartmentId} // simplified check
          value={masterData?.departments?.find((x:any) => x?.id === requestData?.departmentId)?.departmentName || "Buyer department"}

          options={(masterData?.departments || []).map((x:any) => ({
            label: (
              <div>
                <span className="text-md font-medium">{x.departmentName}</span><br />
                {/* <span className="text-sm text-gray-500">{x.email}</span> */}
              </div>
            ), // Combine name and email into one string with a line break
            value: x.id // Store multiple values as a stringified array
          }))}

          onChange={(selectedValue) => {
            setRequestData((prev:any) => ({
              ...prev,
              departmentId:selectedValue
            }));
          }}
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Category<span className="text-red-500">*</span>
        </label>
        <SelectField
          id="categoryId"
          label=""
          style="w-full"
          //disabled={!requestData?.requestingDepartmentId} // simplified check
          value={masterData?.categories?.find((x:any) => x?.id === requestData?.categoryId)?.name || "Select Category"}

          options={(masterData?.categories || []).map((x:any) => ({
            label: (
              <div>
                <span className="text-md font-medium">{x.name}</span><br />
                {/* <span className="text-sm text-gray-500">{x.email}</span> */}
              </div>
            ), // Combine name and email into one string with a line break
            value: x.id // Store multiple values as a stringified array
          }))}

          onChange={(selectedValue) => {
            setRequestData((prev:any) => ({
              ...prev,
              categoryId:selectedValue
            }));
          }}
        />
      </div>

      {/* Purchase Requisition ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Purchase Requisition ID</label>
        <TextField
          id="purchaseRequisitionId"
          field="purchaseRequisitionId"
          value={requestData.purchaseRequisitionId || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev: any) => ({ ...prev, purchaseRequisitionId: value }))
          } // Update only projectDescription
          placeholder="Purchase Requisition ID"
          style=""
          type="text"
          width="w-full"
        />
      </div>
    </div>
  );
};

export default GeneralInformation;
