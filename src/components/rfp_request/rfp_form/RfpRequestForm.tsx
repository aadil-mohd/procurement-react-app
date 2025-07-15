import { Steps, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddAttachment from "./AddAttachment";
import GeneralInformation from "./GeneralInformation";
import { getAllUsersByFilterAsync } from "../../../services/userService";
import { getAllDepartmentsAsync } from "../../../services/departmentService";
import { IRfp } from "../../../types/rfpTypes";
import RfpDetails from "./RfpDetails";
import { getAllCategoriesAsync } from "../../../services/categoryService";
import TimeLineOwnership from "./TimeLineOwnership";
import { createOrUpdateRfpAsync, getRfpByIdAsync } from "../../../services/rfpService";
import { fetchAndConvertToFile } from "../../../utils/common";

const defaultRfpState: IRfp = {
  id: 0,
  rfpTitle: "",
  rfpDescription: "",
  buyerName: "",
  buyerOrganizationName: "",
  departmentId: "",
  isOpen: false,
  isSerial: false,
  rfpCurrency: "USD",
  bidValue: 0,
  hideContractValueFromVendor: false,
  estimatedContractValue: 0,
  isTenderFeeApplicable: false,
  tenderFee: 0,
  categoryId: 0,
  purchaseRequisitionId: "",
  expressInterestLastDate: "",
  responseDueDate: "",
  buyerReplyEndDate: "",
  clarificationDate: "",
  closingDate: "",
  closingTime: "",
  rfpDocuments: [],
  rfpOwners: []
}



const { Step } = Steps;



function RfpRequestFormComponent() {
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  const [requestData, setRequestData] = useState<IRfp>(defaultRfpState);

  const [attachments, setAttachments] = useState<any[]>([]);

  const [masterData, setMasterData] = useState<any>({ users: [], departments: [], categories: [] });
  const [owners, setOwners] = useState<{ technical: any[], commercial: any[] }>({ technical: [], commercial: [] })
  const setupRfpFormAsync = async () => {
    try {
      const users = await getAllUsersByFilterAsync();
      const departments = await getAllDepartmentsAsync();
      const categories = await getAllCategoriesAsync()
      setMasterData({
        users: users, departments: departments.data, categories
      })
      if (id && !isNaN(Number(id))) {
        try {
          console.log(id)
          const rfpRequest = await getRfpByIdAsync(Number(id));
          setRequestData({ ...rfpRequest, rfpDocuments: [] });
          console.log(rfpRequest);
          const ownersTemp: any = { technical: [], commercial: [] }
          rfpRequest.rfpOwners.forEach((item: any) => {
            const user: any = users.find((u: any) => u.id == item.ownerId);
            console.log(user);
            if (user) {
              if (item.ownerType == 1) ownersTemp.technical.push(user);
              if (item.ownerType == 2) ownersTemp.commercial.push(user);
            }
          });
          setOwners(ownersTemp)
          const filesArray: any = []
          for (let filedetail of rfpRequest.rfpDocumentsPath) {
            const file = await fetchAndConvertToFile(filedetail?.filePath);
            console.log(file)
            filesArray.push({ ...file, documentName: filedetail?.fileTitle });
          }
          setAttachments(filesArray);
        } catch (err) {

        }
      }
    } catch (err) {

    }
  }

  const steps = [
    {
      title: "General Information",
      content: <GeneralInformation masterData={masterData} setRequestData={setRequestData} requestData={requestData} />,
    },
    {
      title: "RFP Details",
      content: <RfpDetails
        masterData={masterData} setRequestData={setRequestData} requestData={requestData}
      />,
    },
    {
      title: "Timeline & Ownership",
      content: <TimeLineOwnership
        masterData={masterData} setRequestData={setRequestData} requestData={requestData}
        owners={owners} setOwners={setOwners}
      />,
    },
    {
      title: "Attachments",
      content: <AddAttachment
        attachments={attachments} setAttachments={setAttachments}
      />,
    }
  ];

  useEffect(() => {
    setupRfpFormAsync();
  }, [])


  const next = () => {
    setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Request Data:", requestData);
      console.log("attachments:", attachments);
      const formData = new FormData();
      const formDataTemp: Record<string, any> = requestData
      formDataTemp.bidValue = Number(requestData.bidValue);
      formDataTemp.estimatedContractValue = Number(requestData.estimatedContractValue);
      for (var key in formDataTemp) {
        if (formDataTemp.hasOwnProperty(key)) {
          const value = formDataTemp[key];
          if (value != null) {
            if (key == "rfpDocuments") {
              console.log(attachments, "attachments")
              attachments.forEach((item: any) => {
                formData.append(key, item.document);
              })
            } else if (key == "rfpOwners") {
              let i = 0;
              owners.technical.forEach((item: any) => {
                formData.append(`rfpOwners[${i}].ownerType`, "1");
                formData.append(`rfpOwners[${i}].ownerId`, item.id);
                formData.append(`rfpOwners[${i}].rfpId`, formDataTemp.id);
                i++;
                console.log(item, i, "technical")
              })
              owners.commercial.forEach((item: any) => {
                formData.append(`rfpOwners[${i}].ownerType`, "2");
                formData.append(`rfpOwners[${i}].ownerId`, item.id);
                formData.append(`rfpOwners[${i}].rfpId`, formDataTemp.id);
                i++;
                console.log(item, i, "commercial")
              })
            }
            else {
              formData.append(key, value);
            }
          }
        }
      }

      await createOrUpdateRfpAsync(formData);
      navigate("/rfps");
    } catch (err) {

    }
  };


  useEffect(() => {
    setCurrent(0);
  }, [])

  return (
    <div className="w-full mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Vendor Registration</h1>
      <div className="max-w-4xl">
        <Steps current={current} size="small" className="mb-8">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>

      <div className="rounded-lg p-6 min-h-[200px] mb-6">
        <p className="text-gray-700">{steps[current].content}</p>
      </div>

      <div className="flex justify-end space-x-4">
        {current > 0 && (
          <Button onClick={prev} className="bg-gray-100">
            Previous
          </Button>
        )}
        {current < steps.length - 1 ? (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        ) : (
          <Button type="primary" onClick={(e) => handleSubmit(e)}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default RfpRequestFormComponent;
