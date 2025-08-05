import { Button, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import SettingsTable from '../settings_components/SettingsTable';
import SettingsFilterModal from '../settings_components/SettingsFilterModal';
import SettingsSortModal from '../settings_components/SettingsSortModal';
import { IFilterDto } from '../../../types/commonTypes';
import CreateButton from '../../buttons/CreateButton';
import Modal from '../../basic_components/Modal';
import { Modal as AntdModal } from 'antd';
import CreateUserForm from './CreateUserForm';
import ViewUserCard from './ViewUserCard';
import { deleteUserAsync, getAllUsersByFilterAsync, createOrUpdateUserAsync } from '../../../services/userService';
//import { formatDate, getUserCredentials, handleFile } from '../../../utils/common';
import { formatDate, getUserCredentials, getUserInitials } from '../../../utils/common';
import { User } from '../../../types/userTypes';
import { IRole } from '../../../types/roleTypes';
import { IDepartment } from '../../../types/departmentTypes';
import { getAllDepartmentsAsync } from '../../../services/departmentService';
import { getAllRolesFilterAsync } from '../../../services/roleService';
import dayjs from 'dayjs';

const columns = [
    { key: 'userWithLogo', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'roleName', label: 'Role' },
    { key: 'departmentName', label: 'Department' },
    { key: 'dateAdded', label: 'Date Added' },
    //{ key: 'updatedAt', label: 'Last Login' },
    { key: 'status', label: 'Status' }
];



const UserManagement: React.FC = () => {
    // Modal States
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [sortModalOpen, setSortModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [usersCount, setUsersCount] = useState<number>(1);
    const [confirmAction, setConfirmAction] = useState<{ type: "delete" | "block", user: User } | null>(null);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [trigger, setTrigger] = useState(false);

    const defaultFilterData = {
        fields: [{ columnName: "id", operator: "!=", value: getUserCredentials().userId }],
        pageNo: 1,
        pageSize: 10,
        sortColumn: "CreatedAt",
        sortOrder: "DESC",
    }

    const [filter, setFilter] = useState<IFilterDto>(defaultFilterData);

    async function setupUsers() {
        try {
            setTrigger(false);
            const users: any = await getAllUsersByFilterAsync(filter);
            const users_list: any[] = users.items.map((u: any) => {
                return {
                    ...u,
                    dateAdded: dayjs(u.createdAt).format("DD-MM-YYYY"),
                    place: u.place !== "undefined" ? u.place : "",
                    lastUpdated: formatDate(u.updatedAt),
                    photoUrl: u.photo,
                    status: u.isActive ? "Active" : "Inactive",
                    userWithLogo: (
                        <div className="flex items-center">
                            {u.photo ? (
                                <img
                                    src={u.photo}
                                    className="w-[25px] h-[25px]"
                                    style={{ borderRadius: "50%" }}
                                    alt="User"
                                />
                            ) : (
                                <div className="w-[25px] h-[25px] rounded-full bg-gray-300 text-xs font-medium flex items-center justify-center">
                                    {getUserInitials(u.name)}
                                </div>
                            )}
                            <p className="pl-[8px]">{u.name}</p>
                        </div>
                    )
                };
            });
            setUsers(users_list.filter((x) => x.roleName !== "Admin"));
            setUsersCount(users.length);


            //setup roles and departments
            const { data: alldepartments } = await getAllDepartmentsAsync();
            setDepartments(alldepartments.sort((a, b) => (a.departmentName ?? "").localeCompare(b.departmentName ?? "")));
            const { data: allroles } = await getAllRolesFilterAsync();
            setRoles(
                allroles.sort((a, b) =>
                    (a.roleName ?? "").toLowerCase().localeCompare((b.roleName ?? "").toLowerCase())
                )
            );
            console.log(allroles, "allroles");
        } catch (err) {
            console.log(err)
        }
    }


    const handleThreeDots = (type: "edit" | "delete" | "block", user: User) => {
        console.log(user)
        setSelectedUser(user)
        if (type === "edit") {
            setIsEditModalOpen(true);
        } else {
            setConfirmAction({ type, user });
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmAction = async () => {
        try {
            if (confirmAction?.type === "delete") {
                const response = await deleteUserAsync(confirmAction.user.id as number);
                if (response) {
                    setTrigger(true);
                }
            } else if (confirmAction?.type === "block") {
                // const formData = new FormData();
                // formData.append("id", confirmAction.user.id as string);
                // formData.append("isActive", (!confirmAction.user.isActive).toString());
                const formData = {};
                const response = await createOrUpdateUserAsync(formData)
                if (response) {
                    setTrigger(true);
                }
            }
            notification.success({
                message: `User ${confirmAction?.type == "delete" ? "deletion" : "action"} successfull`
            })

        } catch (error: any) {
            notification.error({
                message: `${confirmAction?.type} error`,
                description: error.message
            })
        }

        setIsConfirmModalOpen(false);
    };

    const handleRowClick = (user: User) => {
        setSelectedUser(user)
        setIsViewModalOpen(true);
    };

    useEffect(() => {
        setFilter({ ...filter, globalSearch: searchQuery })
    }, [searchQuery]);

    useEffect(() => {
        setupUsers();
    }, [trigger, filter])



    return (
        <div className="bg-bgBlue">
            {/* Header */}
            <div className="pr-8 py-6 border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold"></h2>
                <CreateButton name='Add user' onClick={() => setIsCreateModalOpen(true)} />
            </div>

            {/* Table Section */}
            <div className="px-8">
                <SettingsTable
                    title="Users"
                    columns={columns}
                    data={users}
                    onRowClick={handleRowClick}
                    filter={filter}
                    setFilter={setFilter}
                    setIsFilterModalOpen={setFilterModalOpen}
                    setIsSortModalOpen={setSortModalOpen}
                    totalCount={usersCount}
                    setSearchQuery={setSearchQuery}
                    dots
                    setEditOption={(user) => handleThreeDots("edit", user)}
                    setDeleteOption={(user) => handleThreeDots("delete", user)}
                    setBlockOption={(user) => handleThreeDots("block", user)}
                />
            </div>

            {/* Modals */}
            <Modal
                content={<CreateUserForm type='create' closeModal={() => setIsCreateModalOpen(false)} roles={roles} departments={departments} trigger={() => { setTrigger(true) }} />}
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                modalPosition="end"
                width="w-full md:w-2/6"
                CloseButton={false}

            />
            <Modal
                content={selectedUser && <CreateUserForm type='edit' user={selectedUser} closeModal={() => setIsEditModalOpen(false)} roles={roles} departments={departments} trigger={() => { setTrigger(true) }} />}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                modalPosition="end"
                width="w-full md:w-2/5"
                CloseButton={false}
            />
            <Modal
                content={<ViewUserCard userDetails={selectedUser} closeModal={() => setIsViewModalOpen(false)} trigger={() => { setTrigger(true) }} />}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                modalPosition="end"
                width="w-full md:w-2/5"
                CloseButton={false}
            />

            <AntdModal
                title={confirmAction?.type === "delete" ? "Confirm Delete" : selectedUser?.isActive ? "Confirm Block" : "Confirm unblock"}
                open={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>,
                    <Button key="confirm" type="primary" danger={confirmAction?.type === "delete"} onClick={() => handleConfirmAction()}>
                        {confirmAction?.type === "delete" ? "Delete" : selectedUser?.isActive ? "Block" : "Unblock"}
                    </Button>
                ]}
            >
                <p>Are you sure you want to {confirmAction?.type === "delete" ? "delete" : selectedUser?.isActive ? "block" : "unblock"} this user?</p>
            </AntdModal>

            {/* Filter & Sort Modals */}
            {filterModalOpen && (
                <SettingsFilterModal
                    defaultFilter={defaultFilterData}
                    roles={roles}
                    departments={departments}
                    filter={filter}
                    setFilter={setFilter}
                    setIsFilterModalOpen={setFilterModalOpen}
                    type="user"
                />
            )}
            {sortModalOpen && (
                <SettingsSortModal
                    filter={filter}
                    setFilter={setFilter}
                    setIsSettingsSortModalOpen={setSortModalOpen}
                    type='user'
                />
            )}
        </div>
    );
};

export default UserManagement;