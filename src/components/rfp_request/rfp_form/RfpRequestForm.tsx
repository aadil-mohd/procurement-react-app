import { Steps, Button } from "antd";
import { useEffect, useRef, useState } from "react";
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
import { fetchAndConvertToFile, getUserCredentials } from "../../../utils/common";
import { getAllCompaniesAsync } from "../../../services/companyService";


const defaultRfpState: IRfp = {
  id: 0,
  rfpTitle: "",
  rfpDescription: "",
  buyerName: "",
  buyer: [{ name: getUserCredentials().name, id: getUserCredentials().userId }],
  buyerOrganizationName: "",
  departmentId: getUserCredentials().departmentId ? getUserCredentials().departmentId : "0",
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
};

const { Step } = Steps;

function RfpRequestFormComponent() {
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  const [requestData, setRequestData] = useState<IRfp>(defaultRfpState);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [masterData, setMasterData] = useState<any>({ users: [], departments: [], categories: [], companies: [] });
  const [owners, setOwners] = useState<{ technical: any[], commercial: any[] }>({ technical: [], commercial: [] });
  const actionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setupRfpFormAsync();
  }, []);

  const setupRfpFormAsync = async () => {
    try {
      const users = await getAllUsersByFilterAsync();
      const departments = await getAllDepartmentsAsync();
      const categories = await getAllCategoriesAsync();
      const companies = await getAllCompaniesAsync();
      setMasterData({
        users: users, departments: departments.data, categories, companies
      })
      if (id && !isNaN(Number(id))) {
        try {
          const rfpRequest = await getRfpByIdAsync(Number(id));
          setRequestData({ ...rfpRequest, rfpDocuments: [] });
          const ownersTemp: any = { technical: [], commercial: [] };
          rfpRequest.rfpOwners.forEach((item: any) => {
            const user: any = users.find((u: any) => u.id == item.ownerId);
            if (user) {
              if (item.ownerType == 1) ownersTemp.technical.push(user);
              if (item.ownerType == 2) ownersTemp.commercial.push(user);
            }
          });
          setOwners(ownersTemp);
          const filesArray: any = [];
          for (let filedetail of rfpRequest.rfpDocumentsPath) {
            const file = await fetchAndConvertToFile(filedetail?.filePath);
            filesArray.push({ ...file, documentName: filedetail?.fileTitle });
          }
          setAttachments(filesArray);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    {
      title: "General Information",
      content: <GeneralInformation masterData={masterData} setRequestData={setRequestData} requestData={requestData} />,
    },
    {
      title: "RFP Details",
      content: <RfpDetails masterData={masterData} setRequestData={setRequestData} requestData={requestData} />,
    },
    {
      title: "Timeline & Ownership",
      content: <TimeLineOwnership masterData={masterData} setRequestData={setRequestData} requestData={requestData} owners={owners} setOwners={setOwners} />,
    },
    {
      title: "Attachments",
      content: <AddAttachment attachments={attachments} setAttachments={setAttachments} />,
    }
  ];

  const next = () => {
    setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (actionRef.current?.value == "next") {
      next();
      return;
    }
    try {
      const formData = new FormData();
      const formDataTemp: Record<string, any> = requestData;
      formDataTemp.bidValue = Number(requestData.bidValue);
      formDataTemp.estimatedContractValue = Number(requestData.estimatedContractValue);
      for (var key in formDataTemp) {
        if (formDataTemp.hasOwnProperty(key)) {
          const value = formDataTemp[key];
          if (value != null) {
            if (key === "rfpDocuments") {
              attachments.forEach((item: any) => {
                formData.append(key, item.document);
              });
            } else if (key === "rfpOwners") {
              let i = 0;
              owners.technical.forEach((item: any) => {
                formData.append(`rfpOwners[${i}].ownerType`, "1");
                formData.append(`rfpOwners[${i}].ownerId`, item.id);
                formData.append(`rfpOwners[${i}].rfpId`, formDataTemp.id);
                i++;
              });
              owners.commercial.forEach((item: any) => {
                formData.append(`rfpOwners[${i}].ownerType`, "2");
                formData.append(`rfpOwners[${i}].ownerId`, item.id);
                formData.append(`rfpOwners[${i}].rfpId`, formDataTemp.id);
                i++;
                console.log(item, i, "commercial")
              })
            } else if (key == "buyer") continue;
            else {
              formData.append(key, value);
            }
          }
        }
      }

      const isCreated = await createOrUpdateRfpAsync(formData);
      if (isCreated) navigate("/rfps");
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    setCurrent(0);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full h-full mx-auto p-6 bg-white shadow relative">
      <h1 className="text-2xl font-bold mb-6">Create RFP</h1>
      <div className="max-w-4xl mx-auto">
        <Steps current={current} size="small" className="mb-8 flex justify-center">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>

      <div className="p-6 mb-6">
        <p className="text-gray-700">{steps[current].content}</p>
      </div>

      <div className="absolute right-5 bottom-5 flex justify-end space-x-4">
        {current > 0 && (
          <Button onClick={prev} className="bg-gray-100">
            Previous
          </Button>
        )}
        {current < steps.length - 1 ? (
          <Button type="primary" htmlType="submit" onClick={() => {
            if (actionRef.current) actionRef.current.value = "next";
          }}>
            Next
          </Button>
        ) : (
          <Button type="primary" htmlType="submit" onClick={() => {
            if (actionRef.current) actionRef.current.value = "submit";
          }}>
            Submit
          </Button>
        )}
      </div>
      <input type="hidden" name="action" ref={actionRef} />
    </form>
  );
}

export default RfpRequestFormComponent;
