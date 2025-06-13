import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BriefCase, CostSumm, PaperClip, QuotesIcon, TableCloseIcon } from "../../utils/Icons";
import AddAttachment from "./AddAttachment";
import GeneralInformation from "./GeneralInformation";
import { getAllUsersByFilterAsync } from "../../services/userService";
import { getAllDepartmentsAsync } from "../../services/departmentService";
import { IRfp } from "../../types/rfpTypes";
import RfpDetails from "./RfpDetails";
import { getAllCategoriesAsync } from "../../services/categoryService";
import TimeLineOwnership from "./TimeLineOwnership";
import { createOrUpdateRfpAsync, getRfpByIdAsync } from "../../services/rfpService";
import { fetchAndConvertToFile } from "../../utils/common";

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

function RfpRequestFormComponent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [requestData, setRequestData] = useState<IRfp>(defaultRfpState);
  const [tabs, setTabs] = useState(
    [
      { tab: "General Information", isOpen: true },
      { tab: "RFP Details", isOpen: false },
      { tab: "Timeline & Ownership", isOpen: false },
      { tab: "Attachments", isOpen: false }
    ]
  )

  const [attachments, setAttachments] = useState<any[]>([]);

  const [masterData, setMasterData] = useState<any>({ users: [], departments: [], categories: [] });
  const [owners, setOwners] = useState<{ technical: any[], commercial: any[] }>({ technical: [], commercial: [] })
  const [activeSections, setActiveSections] = useState<string>("General Information");
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
          setRequestData({...rfpRequest,rfpDocuments:[]});
          console.log(rfpRequest);
          const ownersTemp:any = { technical: [], commercial: [] }
          rfpRequest.rfpOwners.forEach((item: any) => {
            const user:any = users.find((u: any) => u.id == item.ownerId);
            console.log(user);
            if (user) {
              if (item.ownerType == 1) ownersTemp.technical.push(user);
              if (item.ownerType == 2) ownersTemp.commercial.push(user);
            }
          });
          setOwners(ownersTemp)
          const filesArray:any = []
          for(let filedetail of rfpRequest.rfpDocumentsPath){
            const file = await fetchAndConvertToFile(filedetail?.filePath);
            console.log(file)
            filesArray.push({...file,documentName:filedetail?.fileTitle});
          }
          setAttachments(filesArray);
        } catch (err) {

        }
      }
    } catch (err) {

    }
  }

  useEffect(() => {
    setupRfpFormAsync();
  }, [])

  useEffect(() => {
    renderDynamicContent("General Information");
  }, [activeSections])

  const handleSectionToggle = (section: string) => {
    const tempTabs = tabs.map(t => t.tab == section ? { ...t, isOpen: true } : { ...t, isOpen: false });
    setTabs(tempTabs);
    setActiveSections(section);
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
              console.log(attachments,"attachments")
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

      createOrUpdateRfpAsync(formData);
    } catch (err) {

    }
  };

  const handleCancel = () => {
    setRequestData(defaultRfpState);
    // setActiveSections([]);
    navigate("/"); // Redirect to another page, e.g., home page
  };

  const icons: any = {
    "Attachments": <PaperClip className="w-4 h-4 stroke-customBlue" />,
    "Attachments-dark": <PaperClip className="w-4 h-4 stroke-customBlue stroke-white" />,
    "RFP Details": <CostSumm className="w-4 h-4 stroke-customBlue" />,
    "RFP Details-dark": <CostSumm className="w-4 h-4 stroke-customBlue stroke-white" />,
    "Timeline & Ownership": <BriefCase className="w-4 h-4 stroke-customBlue" />,
    "Timeline & Ownership-dark": <BriefCase className="w-4 h-4 stroke-customBlue stroke-white" />,
    "General Information": <QuotesIcon className="w-4 h-4 stroke-customBlue" />,
    "General Information-dark": <QuotesIcon className="w-4 h-4 stroke-customBlue stroke-white" />,
  };

  const renderDynamicContent = (section: string) => {
    switch (section) {
      case "General Information":
        return (
          <GeneralInformation masterData={masterData} setRequestData={setRequestData} requestData={requestData} />
        );
      case "Attachments":
        return (
          <AddAttachment
            attachments={attachments} setAttachments={setAttachments}
          />
        );
      case "Timeline & Ownership":
        return (
          <TimeLineOwnership
            masterData={masterData} setRequestData={setRequestData} requestData={requestData}
            owners={owners} setOwners={setOwners}
          />
        );
      case "RFP Details":
        return (
          <RfpDetails
            masterData={masterData} setRequestData={setRequestData} requestData={requestData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {/* Right Section: Toggle buttons */}
      <div
        className="w-full md:w-1/5 h-full flex flex-col justify-start items-start p-8"
        style={{ backgroundColor: "#F4F5F7" }}
      >
        {/* <p className="text-sm font-bold mb-4">Options</p> */}
        <div className="flex flex-col space-y-5 w-full">
          {tabs.map((doc, index) => (
            <button
              key={index}
              className={`w-full pl-4 py-2 flex items-center text-left text-sm font-medium rounded border ${doc.isOpen ? "bg-customBlue text-white" : "bg-white text-black"} ${!doc.isOpen && "hover:bg-blue-100"}`}
              onClick={() => handleSectionToggle(doc.tab)}
            >
              {/* Icon */}
              <span className="mr-2">{icons[doc.isOpen ? (doc.tab + "-dark") : doc.tab]}</span>

              {/* Text */}
              {doc.tab}
            </button>
          ))}
        </div>
      </div>
      {/* Left Section */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full md:w-4/5 h-full bg-white rounded overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-rounded scrollbar-track-blue-100"
      >
        <div className="mt-6 p-3 rounded">
          <p className="text-xl font-bold mb-4">Create Request</p>
          {/* Dynamically Added Sections */}
          <div className="mt-6 p-3 rounded shadow relative">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-sm">{activeSections}</p>
              {/* <button
                className="cursor-pointer p-1"
                onClick={(e) => {
                  e.preventDefault();
                }} // Show warning on close
              >
                <TableCloseIcon className="w-5 h-5 text-gray-500 hover:text-red-500" />
              </button> */}
            </div>
            {renderDynamicContent(activeSections)}
          </div>


          {/* Cancel and Save Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-start">
            <button
              type="submit"
              className="bg-blue-500 text-md text-white rounded px-4 py-2 shadow hover:bg-blue-400"
            >
              Save
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                handleCancel
              }}
              className="bg-white text-black text-md border mt-3 sm:mt-0 sm:ml-3 border-gray-300 rounded px-4 py-2 shadow hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RfpRequestFormComponent;
