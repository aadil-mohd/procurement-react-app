import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import ApprovalWorkflowForm from './ApprovalWorkflowForm';
import { getApprovalFlowAsync } from '../../../services/flowService';
import { IUserDetails } from '../../../types/userTypes';
import ViewApprovalFlow from './ViewApprovalFlowCard';
import { getAllUsersByFilterAsync } from '../../../services/userService';

const tabs = [
  { label: "Vendor Approvalflow", type: "vendor", flowType: 1 },
  { label: "RFP Approvalflow", type: "rfp", flowType: 2 },
  { label: "RFP Proposal", type: "rfpproposal", flowType: 3 },
  { label: "RFP Award", type: "rfpaward", flowType: 4 },
];

const ApprovalWorkflow: React.FC = () => {
  const [trigger, setTrigger] = useState(false);
  const [, setIsCreateModalOpen] = useState(false);
  const [usersData, setUsersData] = useState<IUserDetails[] | null>(null);
  const [workflow, setWorkflow] = useState<any>();
  const [viewType, seViewType] = useState<"view" | "edit" | "create" | "no-access">("view");
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const setWorkflowsData = async () => {
    try {
      try {
        const response = await getApprovalFlowAsync(activeTab.type);
        console.log(response, "response-approv");
        setWorkflow(response);
      } catch (err: any) {
        console.log(err);
        if (err.status && err.status === 403) {
          seViewType("no-access");
          return;
        } else {
          seViewType("create");
        }
      }

      let users: any = await getAllUsersByFilterAsync();
      setUsersData(users.items);
      setTrigger(false);
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    setWorkflowsData();
    setWorkflow(undefined);
  }, [activeTab, trigger]);

  return (
    <div className="bg-bgBlue">
      {/* Header */}
      <div className="pt-[24px] flex justify-start mb-[16px] ml-[20px] border-b">
        {tabs.map((tab, index) => (
          <div className="flex items-center h-[37px]" key={tab.label}>
            <div
              onClick={() => {
                setActiveTab(tab);
                seViewType("view");
              }}
              className={`relative h-full w-full text-sm text-start cursor-pointer font-semibold ${
                activeTab.label === tab.label
                  ? "text-customBlue"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}
              <span
                className={`absolute bottom-0 left-0 w-full h-[3px] ${
                  activeTab.label === tab.label
                    ? "bg-customBlue"
                    : "bg-transparent group-hover:bg-customeBlue"
                }`}
              ></span>
            </div>
            {index !== tabs.length - 1 && (
              <span className="mx-[12px] h-[37px] text-gray-400"></span>
            )}
          </div>
        ))}
      </div>

      {viewType === "view" ? (
        <ViewApprovalFlow
          label={activeTab.label}
          seViewType={seViewType as any}
          flowDetails={workflow as any}
          usersData={usersData || []}
          closeModal={() => setIsCreateModalOpen(false)}
          trigger={() => {}}
        />
      ) : viewType === "no-access" ? (
        <p className="px-4 py-3 text-sm">You don't have access to view</p>
      ) : (
        <ApprovalWorkflowForm
          flowType={activeTab.flowType}
          seViewType={seViewType as any}
          type={viewType as any}
          closeModal={() => setIsCreateModalOpen(false)}
          trigger={() => {
            setTrigger(true);
          }}
          initialData={workflow}
        />
      )}
    </div>
  );
};

export default ApprovalWorkflow;
