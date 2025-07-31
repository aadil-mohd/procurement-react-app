import { Button, notification } from 'antd';
import React, { useEffect, useState } from 'react';

import CreateButton from '../../buttons/CreateButton';
import Modal from '../../basic_components/Modal';
import { Modal as AntdModal } from 'antd';
import CreateCategoryForm from './CreateCategoryForm';
import { deleteCategoryAsync, getAllCategoriesAsync } from '../../../services/categoryService';
import { ICategory } from '../../../types/categoryTypes';
import SettingsTable from '../settings_components/SettingsTable';

const columns = [
  { key: 'name', label: 'Category Name' },
  { key: 'description', label: 'Description' }
];

const CategoryManagment: React.FC = () => {
  const [, setSortModalOpen] = useState(false);
  const [, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [confirmAction, setConfirmAction] = useState<{ type: "delete", category: ICategory } | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const handleThreeDots = (type: "edit" | "delete", category: ICategory) => {
    setSelectedCategory(category);
    if (type === "edit") {
      setIsEditModalOpen(true);
    } else {
      setConfirmAction({ type, category });
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction?.type === "delete") {
        await deleteCategoryAsync(confirmAction.category.id);
        notification.success({ message: "Category deleted successfully" });
        setupCategories();
        setIsConfirmModalOpen(false);
      }
    } catch (err: any) {
      setIsConfirmModalOpen(false);
      notification.error({
        message: "Failed to delete this category",
        description: err.message
      });
    }
  };

  const setupCategories = async () => {
    try {
      const response = await getAllCategoriesAsync();
      console.log(response)
      setCategories(response || []);
    } catch (err: any) {
      notification.error({
        message: "Error fetching categories",
        description: err.message
      });
    }
  };

  useEffect(() => {
    setupCategories();
  }, []);

  return (
    <div className="bg-bgBlue">
      <div className="pr-8 py-6 border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold"></h2>
        <CreateButton name='Add Category' onClick={() => setIsCreateModalOpen(true)} />
      </div>

      <div className="px-8">
        <SettingsTable
          title="Categories"
          columns={columns}
          data={categories}
          setIsSortModalOpen={setSortModalOpen}
          totalCount={categories.length}
          setSearchQuery={setSearchQuery}
          dots
          setEditOption={(category) => handleThreeDots("edit", category)}
          setDeleteOption={(category) => handleThreeDots("delete", category)}
          setFilter={()=>{}}
        />
      </div>

      <Modal
        content={<CreateCategoryForm type='create' category={{ id: 0, name: '', description: '', clientId: 0, createdAt: '', createdBy: 0, updatedAt: '', updatedBy: 0, isdeleted: false, deletedBy: 0, tenantId: 0, companyId: 0, branchId: 0 }} closeModal={() => setIsCreateModalOpen(false)} trigger={setupCategories} />}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        modalPosition="end"
        width="w-full md:w-2/6"
        CloseButton={false}
      />

      <Modal
        content={selectedCategory && <CreateCategoryForm type='edit' category={selectedCategory} closeModal={() => setIsEditModalOpen(false)} trigger={setupCategories} />}
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
        <p>Are you sure you want to delete this category?</p>
      </AntdModal>
    </div>
  );
};

export default CategoryManagment;
