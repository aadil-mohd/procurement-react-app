import { Button, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import SettingsTable from '../settings_components/SettingsTable';
import SettingsFilterModal from '../settings_components/SettingsFilterModal';
import SettingsSortModal from '../settings_components/SettingsSortModal';
import { IFilterDto } from '../../../types/commonTypes';
import CreateButton from '../../buttons/CreateButton';
import Modal from '../../basic_components/Modal';
import { Modal as AntdModal } from 'antd';
import ApprovalWorkflowForm from './ApprovalWorkflowForm';
//import { IFlow } from '../../../types/approvalTypes';
import { deleteWorkFlowAsync, getApprovalFlowById, getFlowsByfilterAsync } from '../../../services/flowService';
import { convertCurrencyLabel, formatDate } from '../../../utils/common';
//import { IFlowDetails } from '../../../types/capexTypes';
import ViewApprovalFlowCard from './ViewApprovalFlowCard';
//import { getAllUsersByFilterAsync } from '../../../services/userService';
import { IUserDetails } from '../../../types/userTypes';
import { IDepartment } from '../../../types/departmentTypes';
import { getAllDepartmentsAsync } from '../../../services/departmentService';

const columns = [
  { key: 'flowName', label: 'Flow Label' },
  { key: 'department', label: 'Department' },
  { key: 'expenditure', label: 'Expenditure' },
  { key: 'Budget', label: 'Budget range' },
];

const defaultFilterData = {
  fields: [],
  pageNo: 1,
  pageSize: 10,
  sortColumn: "CreatedAt",
  sortOrder: "DESC",
}

const ApprovalWorkflow: React.FC = () => {
  // Modal States
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<any | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<IUserDetails[] | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: "delete" | "block", workflow: any } | null>(null);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([])

  const [filter, setFilter] = useState<IFilterDto>(defaultFilterData);
  const expenditureTypes:any = {data:[]};

  const handleThreeDots = async (type: "edit" | "delete" | "block", workflow: any) => {
    if (type === "edit") {
      try {
        const flowData: any = await getApprovalFlowById(workflow.id);
        const users = {data:[]};

        if (users.data && flowData.flowUsers) {
          const usersDetails: IUserDetails[] = flowData.flowUsers.map((user:any) => {
            const foundUser = users.data.find((x:any) => x.id === user.userId);
            return foundUser || {
              profilePhoto: "",
              userName: "",
              name: "",
              email: "",
              phone: "",
              password: "",
              roleId: "",
              departmentId: "",
              department: "",
              gender: "",
              place: "",
              isActive: "",
              createdAt: "",
              createdBy: "",
              updatedAt: "",
              updatedBy: "",
              clientId: "",
            } as IUserDetails;
          });

          setSelectedFlow(flowData);
          setSelectedUserData(usersDetails);
        }
        setIsEditModalOpen(true);
      } catch (error: any) {
        notification.error({
          message: "View flow error",
          description: error.message,
        });
      }
    } else {
      setConfirmAction({ type, workflow });
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction?.type === "delete") {
      console.log("Deleting workflow:", confirmAction.workflow);
      try {
        const response = await deleteWorkFlowAsync(confirmAction.workflow.id);
        if (response) {
          notification.success({
            message: `${confirmAction.workflow.flowName} deleted succesfully`
          })
        }
        setTrigger(true);

      } catch (error: any) {
        console.log(error);
        notification.error(({
          message: "flow deletion error",
          description: error.message
        }))

      }

    } else if (confirmAction?.type === "block") {
      console.log("Blocking workflow:", confirmAction.workflow);
    }
    setIsConfirmModalOpen(false);
  };

  const setWorkflowsData = async () => {
    try {
      const response = await getFlowsByfilterAsync(filter);
      const workflows: any[] = response;
      const transformedWorkflows = workflows.map((flow) => ({
        id: flow.id,
        flowName: flow.flowName,
        department: flow.department || 'N/A',
        expenditure: flow.expenditureType,
        Budget: `${convertCurrencyLabel(flow?.currency ?? "")}${Number(flow.minAmount).toLocaleString()} - ${convertCurrencyLabel(flow?.currency ?? "")}${Number(flow.maxAmount).toLocaleString()}`,
        dateAdded: formatDate(flow.createdAt ?? ""),
      }));
      setWorkflows(transformedWorkflows);

      const { data: alldepartments } = await getAllDepartmentsAsync();
      setDepartments(alldepartments);

      setTrigger(false)
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
  };

  const handleRowClick = async (flow: any) => {
    try {
      const flowData: any = await getApprovalFlowById(flow.id);
      const users = {data:[]};

      if (users.data && flowData.flowUsers) {
        const usersDetails: IUserDetails[] = flowData.flowUsers.map((user:any) => {
          const foundUser = users.data.find((x:any) => x.id === user.userId);
          return foundUser || {
            profilePhoto: "",
            userName: "",
            name: "",
            email: "",
            phone: "",
            password: "",
            roleId: "",
            departmentId: "",
            department: "",
            gender: "",
            place: "",
            isActive: "",
            createdAt: "",
            createdBy: "",
            updatedAt: "",
            updatedBy: "",
            clientId: "",
          } as IUserDetails;
        });

        setSelectedFlow(flowData);
        setSelectedUserData(usersDetails);
      }
      setIsViewModalOpen(true);
    } catch (error: any) {
      notification.error({
        message: "View flow error",
        description: error.message,
      });
    }
  };

  const handleSearch = () => {
    setFilter(prev => ({ ...prev, globalSearch: searchQuery }))
  }

  useEffect(() => {
    handleSearch();
  }, [searchQuery])

  useEffect(() => {
    setWorkflowsData();
  }, [filter, trigger]);

  return (
    <div className="bg-bgBlue">
      {/* Header */}
      <div className="pr-8 py-6 border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold"></h2>
        <CreateButton name='Add workflow' onClick={() => setIsCreateModalOpen(true)} />
      </div>

      {/* Table Section
      <div className="px-8">
        <SettingsTable
          title="Workflow"
          onRowClick={handleRowClick}
          columns={columns}
          data={workflows}
          filter={filter}
          setFilter={setFilter}
          setIsFilterModalOpen={setFilterModalOpen}
          setIsSortModalOpen={setSortModalOpen}
          totalCount={workflows.length}
          setSearchQuery={setSearchQuery}
          dots
          setEditOption={(workflow) => handleThreeDots("edit", workflow)}
          setDeleteOption={(workflow) => handleThreeDots("delete", workflow)}
        />
      </div> */}

      {/* Modals */}
      <ApprovalWorkflowForm
            type='create'
            closeModal={() => setIsCreateModalOpen(false)}
            trigger={() => { setTrigger(true) }}
          />

          
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
          selectedFlow &&
          <ApprovalWorkflowForm
            type='edit'
            initialData={selectedFlow}
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
        content={<ViewApprovalFlowCard userDetails={selectedUserData} flowDetails={selectedFlow} closeModal={() => setIsViewModalOpen(false)} trigger={() => { setTrigger(true) }} />}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        modalPosition="end"
        width="w-full md:w-2/5"
        CloseButton={false}
      />

      <AntdModal
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
      </AntdModal>

      {/* Filter & Sort Modals */}
      {filterModalOpen && (
        <SettingsFilterModal
          defaultFilter={defaultFilterData}
          expenditureTypes={expenditureTypes || []}
          departments={departments}
          filter={filter}
          setFilter={setFilter}
          setIsFilterModalOpen={setFilterModalOpen}
          type="workflow"
        />
      )}
      {/* Sort Modal */}
      {sortModalOpen && (
        <SettingsSortModal
          filter={filter}
          setFilter={setFilter}
          setIsSettingsSortModalOpen={setSortModalOpen}
          type='workflow'
        />
      )}
    </div>
  );
};

export default ApprovalWorkflow;