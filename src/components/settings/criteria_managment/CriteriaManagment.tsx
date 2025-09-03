import { Button, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import CreateButton from '../../buttons/CreateButton';
import Modal from '../../basic_components/Modal';
import { Modal as AntdModal } from 'antd';
import SettingsTable from '../settings_components/SettingsTable';
import { IFilterDto } from '../../../types/commonTypes';
import { defaultFilter } from '../../../utils/constants';
import SettingsSortModal from '../settings_components/SettingsSortModal';
import { deleteCriteriaAsync, getAllCriteriasAsync } from '../../../services/commonService';
import CriteriaManagmentForm from './CriteriaManagmentForm';

const columns = [
  { key: 'criteriaName', label: 'Criteria Name' }
];

const CriteriaManagment: React.FC = () => {
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [searchQuery, ] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<any>();
  const [confirmAction, setConfirmAction] = useState<{ type: "delete", criteria: any } | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState<IFilterDto>(defaultFilter);

  const handleThreeDots = (type: "edit" | "delete", criteria: any) => {
    setSelectedCriteria(criteria);
    if (type === "edit") {
      setIsEditModalOpen(true);
    } else {
      setConfirmAction({ type, criteria });
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction?.type === "delete") {
        await deleteCriteriaAsync(confirmAction.criteria.id);
        notification.success({ message: "criteria deleted successfully" });
        setupCriterias();
        setIsConfirmModalOpen(false);
      }
    } catch (err: any) {
      setIsConfirmModalOpen(false);
      notification.error({
        message: "Failed to delete this criteria",
        description: err.message
      });
    }
  };

  const setupCriterias = async (filterData: IFilterDto = defaultFilter) => {
    try {
      const response = await getAllCriteriasAsync();
      console.log(filterData,response)
      setCategories(response || []);
    } catch (err: any) {
      notification.error({
        message: "Error fetching categories",
        description: err.message
      });
    }
  };

  useEffect(() => {
    setupCriterias({ ...filter, globalSearch: searchQuery });
  }, [searchQuery,filter]);


  return (
    <div className="bg-bgBlue">
      <div className="pr-8 py-6 border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold"></h2>
        <CreateButton name='Add criteria' onClick={() => setIsCreateModalOpen(true)} />
      </div>

      <div className="px-8">
        <SettingsTable
          title="Criterias"
          columns={columns}
          data={categories}
          //setIsSortModalOpen={setSortModalOpen}
          totalCount={categories.length}
          //setSearchQuery={setSearchQuery}
          dots
          setEditOption={(criteria) => handleThreeDots("edit", criteria)}
          setDeleteOption={(criteria) => handleThreeDots("delete", criteria)}
          setFilter={() => { }}
        />
      </div>
      {sortModalOpen && <SettingsSortModal filter={filter} setFilter={setFilter} setIsSettingsSortModalOpen={setSortModalOpen} type="department"/>}

      <Modal
        content={<CriteriaManagmentForm type='create' criteria={{ id: 0, name: '', description: '', clientId: 0, createdAt: '', createdBy: 0, updatedAt: '', updatedBy: 0, isdeleted: false, deletedBy: 0, tenantId: 0, companyId: 0, branchId: 0 }} closeModal={() => setIsCreateModalOpen(false)} trigger={setupCriterias} />}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        modalPosition="end"
        width="w-full md:w-2/6"
        CloseButton={false}
      />

      <Modal
        content={selectedCriteria && <CriteriaManagmentForm type='edit' criteria={selectedCriteria} closeModal={() => setIsEditModalOpen(false)} trigger={setupCriterias} />}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        modalPosition="end"
        width="w-full md:w-2/5"
        CloseButton={false}
      />

      <AntdModal
        title="Confirm Delete"
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>,
          <Button key="confirm" type="primary" danger onClick={handleConfirmAction}>
            Delete
          </Button>
        ]}
      >
        <p>Are you sure you want to delete this Criteria?</p>
      </AntdModal>
    </div>
  );
};

export default CriteriaManagment;
