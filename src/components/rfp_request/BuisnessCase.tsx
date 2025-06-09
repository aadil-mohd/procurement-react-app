import React, { useState } from "react";
import TextField from "../basic_components/TextField";

interface BusinessCaseBenefitsProps {
  setData: (field: string, value: any) => void;
}

const BusinessCaseBenefits: React.FC<BusinessCaseBenefitsProps> = ({
  setData,
}) => {
  const [purpose, setPurpose] = useState("");
  const [benefits, setBenefits] = useState("");
  const [estimatedSavings, setEstimatedSavings] = useState("");

  // Handle changes for project name, benefits, and business cases
  const handleChange = (field: string, value: string) => {
    // Update the respective state based on the field name
    if (field === "purpose") {
      setPurpose(value);
    } else if (field === "benefits") {
      setBenefits(value);
    } else if (field === "estimatedSavings") {
      setEstimatedSavings(value);
    }

    // Update the parent component with an object containing all the fields
    setData(field, value);
  };

  return (
    <div className="space-y-4">
      {/* Project Name Text Field */}
      <TextField
        value={purpose || ""}
        setValue={(e) => handleChange("purpose", e)}
        placeholder="Enter project purpose"
        type="text"
        title="Purpose"
        style=""
      />
      {/* <TextField
        id="projectName"
        field="projectName"
        value={requestData.projectName || ""} // Bind value from state
        setValue={(value) =>
          setRequestData((prev) => ({ ...prev, projectName: value }))
        } // Update only projectName
        placeholder="Enter project name"
        style=""
        type="text"
        width="w-full"
      /> */}

      {/* Benefits Text Area */}
      <TextField
        value={benefits}
        setValue={(e) => handleChange("benefits", e)}
        placeholder="Describe the benefits..."
        type="textarea"
        title="Benefits"
      />

      {/* Business Cases Text Area */}
      <TextField
        value={estimatedSavings}
        setValue={(e) => handleChange("estimatedSavings", e)}
        placeholder="Describe estimated savings or additional profits..."
        type="textarea"
        title="Additional Profits"
      />
    </div>
  );
};

export default BusinessCaseBenefits;
