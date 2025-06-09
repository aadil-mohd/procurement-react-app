import { Button, notification } from 'antd';
import React, { useEffect, useState } from 'react';
// import SettingsTable from '../settings_components/SettingsTable';
// import SettingsFilterModal from '../settings_components/SettingsFilterModal';
// import SettingsSortModal from '../settings_components/SettingsSortModal';
import { IFilterDto } from '../../../types/commonTypes';
import CreateButton from '../../buttons/CreateButton';
import Modal from '../../basic_components/Modal';
// import { Modal as AntdModal } from 'antd';
import ApprovalWorkflowForm from './ApprovalWorkflowForm';
//import { IFlow } from '../../../types/approvalTypes';
import { getApprovalFlowAsync } from '../../../services/flowService';
//import { IFlowDetails } from '../../../types/capexTypes';
import ViewApprovalFlowCard from './ViewApprovalFlowCard';
//import { getAllUsersByFilterAsync } from '../../../services/userService';
import { IUserDetails } from '../../../types/userTypes';
import ViewApprovalFlow from './ViewApprovalFlowCard';
import { getAllUsersByFilterAsync } from '../../../services/userService';

const defaultFilterData = {
  fields: [],
  pageNo: 1,
  pageSize: 10,
  sortColumn: "CreatedAt",
  sortOrder: "DESC",
}

const ApprovalWorkflow: React.FC = () => {
  const [trigger, setTrigger] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [usersData, setUsersData] = useState<IUserDetails[] | null>(null);
  const [workflow, setWorkflow] = useState<any>();
  const [viewType, seViewType] = useState<"view" | "edit" | "create">("view");

  const [filter, setFilter] = useState<IFilterDto>(defaultFilterData);


  const setWorkflowsData = async () => {
    try {
      try {
        const response = await getApprovalFlowAsync();
        console.log(response, "response")
        setWorkflow(response);
      } catch (err) {
        seViewType("create");
      }
      let users = await getAllUsersByFilterAsync();
      setUsersData(users);
      setTrigger(false)
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };


  useEffect(() => {
    setWorkflowsData();
  }, [filter, trigger]);

  return (
    <div className="bg-bgBlue">
      {/* Header */}
      <div className="pr-8 py-6 border-gray-200 flex justify-between items-center">

      </div>


      {viewType == "view" ? <ViewApprovalFlow flowDetails={workflow as any} usersData={usersData || []}
        closeModal={() => setIsCreateModalOpen(false)}
        trigger={() => { }}
      />
        :
        <ApprovalWorkflowForm
          type={viewType as any}
          closeModal={() => setIsCreateModalOpen(false)}
          trigger={() => { setTrigger(true) }}
          initialData={workflow}
        />
      }

      <Modal
        content={
          <ApprovalWorkflowForm
            type='create'
            closeModal={() => setIsCreateModalOpen(false)}
            trigger={() => { setTrigger(true) }}
          />
        }
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        modalPosition="end"
        width="w-full md:w-2/6"
        CloseButton={false}
      />

      <Modal
        content={
          workflow &&
          <ApprovalWorkflowForm
            type='edit'
            initialData={workflow}
            closeModal={() => setIsEditModalOpen(false)}
            trigger={() => { setTrigger(true) }}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        modalPosition="end"
        width="w-full md:w-2/5"
        CloseButton={false}
      />

      <Modal
        content={<ViewApprovalFlowCard flowDetails={workflow} closeModal={() => setIsViewModalOpen(false)} trigger={() => { setTrigger(true) }} usersData={usersData || []} />}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        modalPosition="end"
        width="w-full md:w-2/5"
        CloseButton={false}
      />

      {/* <AntdModal
        title={`Confirm ${confirmAction?.type === "delete" ? "Delete" : "Block"}`}
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsConfirmModalOpen(false)}
          >
            Cancel
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger={confirmAction?.type === "delete"}
            onClick={handleConfirmAction}
          >
            {confirmAction?.type === "delete" ? "Delete" : "Block"}
          </Button>
        ]}
      >
        <p>Are you sure you want to {confirmAction?.type} this workflow?</p>
      </AntdModal> */}
    </div>
  );
};

export default ApprovalWorkflow;