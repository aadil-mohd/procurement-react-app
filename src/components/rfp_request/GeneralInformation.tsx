import React, { SetStateAction } from "react";
import TextField from "../basic_components/TextField";

interface CostSummaryProps {
  requestData: any
  setRequestData: React.Dispatch<SetStateAction<any>>;
}

const GeneralInformation: React.FC<CostSummaryProps> = ({ requestData, setRequestData }) => {
  return (
    <div className="p-2">
      {/* Project Name */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">RFP Title</label>
        <TextField
          id="rfpTitle"
          field="rfpTitle"
          value={requestData.rfpTitle || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev:any) => ({ ...prev, projectName: value }))
          } // Update only projectName
          placeholder="Enter RFP Title"
          style=""
          type="text"
          width="w-full"
        />
      </div>

      {/* Project Description */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">RFP Description</label>
        <TextField
          id="rfpDescription"
          field="rfpDescription"
          value={requestData.rfpDescription || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev:any) => ({ ...prev, rfpDescription: value }))
          } // Update only projectDescription
          placeholder="Enter RFP description"
          style=""
          type="textarea"
          width="w-full"
        />
      </div>

      {/* Buyer Organization */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">RFP Description</label>
        <TextField
          id="buyerOrganizationName"
          field="buyerOrganizationName"
          value={requestData.buyerOrganizationName || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev:any) => ({ ...prev, buyerOrganizationName: value }))
          } // Update only projectDescription
          placeholder="Buyer Organization Name"
          style=""
          type="text"
          width="w-full"
        />
      </div>

      {/* Buyer Organization */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">RFP Description</label>
        <TextField
          id="buyerOrganizationName"
          field="buyerOrganizationName"
          value={requestData.buyerOrganizationName || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev:any) => ({ ...prev, buyerOrganizationName: value }))
          } // Update only projectDescription
          placeholder="Buyer Organization Name"
          style=""
          type="text"
          width="w-full"
        />
      </div>

      {/* Buyer Organization */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-2">RFP Description</label>
        <TextField
          id="buyerOrganizationName"
          field="buyerOrganizationName"
          value={requestData.buyerOrganizationName || ""} // Bind value from state
          setValue={(value) =>
            setRequestData((prev:any) => ({ ...prev, buyerOrganizationName: value }))
          } // Update only projectDescription
          placeholder="Buyer Organization Name"
          style=""
          type="text"
          width="w-full"
        />
      </div>
    </div>
  );
};

export default GeneralInformation;
