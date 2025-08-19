import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
// import SettingsTable from '../settings_components/SettingsTable';
// import SettingsFilterModal from '../settings_components/SettingsFilterModal';
// import SettingsSortModal from '../settings_components/SettingsSortModal';
// import { Modal as AntdModal } from 'antd';
import ApprovalWorkflowForm from './ApprovalWorkflowForm';
//import { IFlow } from '../../../types/approvalTypes';
import { getApprovalFlowAsync } from '../../../services/flowService';
//import { IFlowDetails } from '../../../types/capexTypes';
//import { getAllUsersByFilterAsync } from '../../../services/userService';
import { IUserDetails } from '../../../types/userTypes';
import ViewApprovalFlow from './ViewApprovalFlowCard';
import { getAllUsersByFilterAsync } from '../../../services/userService';

const tabs = ["Vendor Approvalflow", "RFP Approvalflow"];

const ApprovalWorkflow: React.FC = () => {
  const [trigger, setTrigger] = useState(false);
  const [, setIsCreateModalOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [usersData, setUsersData] = useState<IUserDetails[] | null>(null);
  const [workflow, setWorkflow] = useState<any>();
  const [viewType, seViewType] = useState<"view" | "edit" | "create" | "no-access">("view");
  const [statusFilter, setStatusFilter] = useState<string>("Vendor Approvalflow");

  const setWorkflowsData = async () => {
    try {
      try {
        const response = await getApprovalFlowAsync(statusFilter == "Vendor Approvalflow" ? "vendor" : "rfp");
        console.log(response, "response-approv")
        setWorkflow(response);
      } catch (err: any) {
        console.log(err)
        if (err.status && err.status == 403) {
          seViewType("no-access");
          return;
        }
        else seViewType("create");
      }
      let users: any = await getAllUsersByFilterAsync();
      setUsersData(users.items);
      setTrigger(false)
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  async function setupTab(tab: string) {
    if (statusFilter != tab) {
      setStatusFilter(tab);
      seViewType("view")
    }
  }


  useEffect(() => {
    setWorkflowsData();
    setWorkflow(undefined);
  }, [statusFilter, trigger]);

  return (
    <div className="bg-bgBlue">
      {/* Header */}


      <div className="pt-[24px] flex justify-start mb-[16px] ml-[20px] border-b">
        {tabs.map((tab, index) => (
          <div className="flex items-center h-[37px]" key={tab}>
            <div
              onClick={() => setupTab(tab)}
              className={`relative h-full w-full text-sm text-start cursor-pointer font-semibold ${statusFilter === tab
                ? "text-customBlue"
                : "text-gray-500 hover:text-black"
                }`}
            >
              {tab}
              <span
                className={`absolute bottom-0 left-0 w-full h-[3px] ${statusFilter === tab
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

      {viewType == "view" ? <ViewApprovalFlow label={statusFilter} seViewType={seViewType as any} flowDetails={workflow as any} usersData={usersData || []}
        closeModal={() => setIsCreateModalOpen(false)}
        trigger={() => { }}
      />
        : viewType == "no-access" ? <p className='px-4 py-3 text-sm'>You don't have access to view</p> :
          <ApprovalWorkflowForm
            flowType={statusFilter == "Vendor Approvalflow" ? "vendor" : "rfp"}
            seViewType={seViewType as any}
            type={viewType as any}
            closeModal={() => setIsCreateModalOpen(false)}
            trigger={() => { setTrigger(true) }}
            initialData={workflow}
          />
      }
    </div>
  );
};

export default ApprovalWorkflow;