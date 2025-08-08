import { Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import AddAttachment from "./AddAttachment";
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
import CommonTitleCard from "../../basic_components/CommonTitleCard";
import RfpAttachments from "./RfpAttachments";
import { getAllDocumentTypesAsync } from "../../../services/commonService";

type RfpType = 'create' | 'edit';

interface RfpRequestFormProps {
  type?: RfpType; // optional, will default to 'create'
}


const defaultRfpState: IRfp = {
  id: 0,
  rfpTitle: "",
  rfpDescription: "",
  buyerName: getUserCredentials().name,
  buyer: [{ name: getUserCredentials().name, id: getUserCredentials().userId }],
  buyerOrganizationName: "",
  departmentId: Number(getUserCredentials().departmentId || "0"),
  isOpen: true,
  isSerial: false,
  rfpCurrency: "USD",
  bidValue: undefined,
  hideContractValueFromVendor: false,
  estimatedContractValue: undefined,
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
  rfpOwners: [],
  rfpCategories: []
};

function RfpRequestFormComponent({ type = 'create' }: RfpRequestFormProps) {

  const navigate = useNavigate();
  const { id } = useParams();
  const [requestData, setRequestData] = useState<IRfp>(defaultRfpState);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [masterData, setMasterData] = useState<any>({ users: [], departments: [], categories: [], companies: [], documentTypes: [] });
  const [owners, setOwners] = useState<{ technical: any[], commercial: any[] }>({ technical: [], commercial: [] });

  useEffect(() => {
    setupRfpFormAsync();
  }, []);

  const setupRfpFormAsync = async () => {
    try {
      const users = await getAllUsersByFilterAsync();
      const departments = await getAllDepartmentsAsync();
      const categories = await getAllCategoriesAsync();
      const companies = await getAllCompaniesAsync();
      const documentTypes = await getAllDocumentTypesAsync();
      setMasterData({
        users: (users as any)?.items, departments: departments.data, categories, companies, documentTypes
      })
      if (id && !isNaN(Number(id))) {
        try {
          const rfpRequest = await getRfpByIdAsync(Number(id));
          setRequestData({ ...rfpRequest, buyer: [{ name: getUserCredentials().name, id: getUserCredentials().userId }], rfpDocuments: [] });

          const ownersTemp: any = { technical: [], commercial: [] };
          rfpRequest.rfpOwners.forEach((item: any) => {
            const user: any = (users as any)?.items.find((u: any) => u.id == item.ownerId);
            if (user) {
              if (item.ownerType == 1) ownersTemp.technical.push(user);
              if (item.ownerType == 2) ownersTemp.commercial.push(user);
            }
          });
          setOwners(ownersTemp);
          // ✅ Load previously uploaded files
          const filesArray: any = [];
          for (let fileDetail of rfpRequest.rfpGeneralDocuments || []) {
            const { document, documentName } = await fetchAndConvertToFile(
              fileDetail?.filePath,
              fileDetail?.fileTitle // ✅ This is the original name stored in DB
            );

            filesArray.push({
              name: documentName,
              type: fileDetail?.documentTypeId,
              attachment: document,
              previewPath: fileDetail?.filePath,
            });
          }

          setAttachments(filesArray);
          console.log(requestData, "RequestData")
          console.log(ownersTemp, "ownersTemp")
          console.log(attachments, "attachements")
          return;
        } catch (err) {
          console.error(err);
        }
      } else {
        setRequestData((prev) => ({
          ...prev, buyerOrganizationName: companies?.find(
            (x: any) =>
              x?.id.toString() === getUserCredentials().companyId
          )?.companyName
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // const steps = [
  //   {
  //     title: "General Information",
  //     content: <GeneralInformation masterData={masterData} setRequestData={setRequestData} requestData={requestData} />,
  //   },
  //   {
  //     title: "RFP Details",
  //     content: <RfpDetails masterData={masterData} setRequestData={setRequestData} requestData={requestData} />,
  //   },
  //   {
  //     title: "Timeline & Ownership",
  //     content: <TimeLineOwnership masterData={masterData} setRequestData={setRequestData} requestData={requestData} owners={owners} setOwners={setOwners} />,
  //   },
  //   {
  //     title: "Attachments",
  //     content: <><AddAttachment id={"technical-doc1"} label="Technical documents" attachments={technicalAttachments} setAttachments={setTechnicalAttachments} type="technical" requestData={requestData.rfpTechnicalDocuments
  //     } />
  //       <AddAttachment id={"general_doc1"} label="General documents" attachments={attachments} setAttachments={setAttachments} type="general" requestData={requestData.rfpGeneralDocuments} /></>,
  //   }
  // ];

  // const next = () => {
  //   setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  // };

  // const prev = () => {
  //   setCurrent((prev) => Math.max(prev - 1, 0));
  // };
  useEffect(() => {
    console.log(requestData, "reg")
  }, [requestData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (actionRef.current?.value == "next") {
    //   next();
    //   return;
    // }
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
              let i = 0;
              // technicalAttachments.forEach((item) => {
              //   formData.append(`rfpDocuments[${i}].Document`, item.document);
              //   formData.append(`rfpDocuments[${i}].DocumentType`, "Technical");
              //   i++;
              // })
              console.log(attachments);
              attachments.forEach((item: any) => {
                formData.append(`rfpDocuments[${i}].Document`, item.attachment);
                formData.append(`rfpDocuments[${i}].DocumentTypeId`, item.type);
                i++;
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
            else if (key === "rfpCategories") {
              let i = 0;
              requestData.rfpCategories.forEach((item: any) => {
                formData.append(`rfpCategories[${i}].categoryId`, item.categoryId);
                formData.append(`rfpCategories[${i}].rfpId`, formDataTemp.id);
                i++;
              });
            }
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

  return (
    <div>
      <CommonTitleCard />
      <form onSubmit={handleSubmit} className="w-full h-full mx-auto p-6 bg-white shadow relative">
        <h1 className="text-2xl font-bold mb-6">{type == "create" ? "Create" : "Edit"} RFP</h1>
        {/* <div className="max-w-4xl mx-auto">
        <Steps current={current} size="small" className="mb-8 flex justify-center">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div> */}

        <div className="p-6 mb-6">
          {/* <p className="text-gray-700">{steps[current].content}</p> */}
          <GeneralInformation masterData={masterData} setRequestData={setRequestData} requestData={requestData} />
          <RfpDetails masterData={masterData} setRequestData={setRequestData} requestData={requestData} />
          <TimeLineOwnership masterData={masterData} setRequestData={setRequestData} requestData={requestData} owners={owners} setOwners={setOwners} />
          {/* <div className="w-full border-t"><AddAttachment id={"technical-doc1"} label="Technical documents" attachments={technicalAttachments} setAttachments={setTechnicalAttachments} type="technical" requestData={requestData.rfpTechnicalDocuments
          } />
            <AddAttachment id={"general_doc1"} label="General documents" attachments={attachments} setAttachments={setAttachments} type="general" requestData={requestData.rfpGeneralDocuments} /></div> */}
          <RfpAttachments attachments={attachments} setAttachments={setAttachments} setAttachmentsToDelete={() => { }} documentTypes={masterData.documentTypes} />
        </div>

        <div className="fixed right-5 bottom-5 flex justify-end space-x-4">
          <Button onClick={() => { }} className="bg-gray-100">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Send for Approval
          </Button>
        </div>
      </form>
    </div>

  );
}

export default RfpRequestFormComponent;
