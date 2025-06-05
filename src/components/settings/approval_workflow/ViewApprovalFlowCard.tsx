import React from 'react';
import userPhoto from '../../../assets/profile_photo/userPhoto.png';
// import { message } from 'antd';
import { convertCurrencyLabel } from '../../../utils/common';
import { IUserDetails } from '../../../types/userTypes';

interface ViewApprovalFlowProps {
    flowDetails: any | null;
    userDetails: IUserDetails[] | null;
    closeModal: () => void;
    trigger: () => void;
}

const ViewApprovalFlow: React.FC<ViewApprovalFlowProps> = ({
    userDetails,
    flowDetails,
    closeModal,
}) => {
    // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // const handleDelete = async () => {
    //     if (!flowDetails?.id) return;
    //     try {
    //         message.success('Approval flow deleted successfully');
    //         setIsConfirmModalOpen(false);
    //         trigger();
    //         closeModal();
    //     } catch (error) {
    //         message.error('An error occurred while deleting the approval flow');
    //     }
    // };

    if (!flowDetails) return null;

    return (
        <div className="w-full bg-white flex flex-col h-full ">
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Order processing flow</h2>
            </div>

            <div className="px-4 py-3 flex-1 overflow-y-auto scrollbar">
                <div className="grid grid-cols-2 gap-y-3 mb-6 bg-[#EDF4FD] items-center justify-center border p-4 rounded-md">
                    <div className='gap-y-1'>
                        <p className="text-xs text-gray-500 mb-1">Expenditure type</p>
                        <p className="text-sm text-gray-900">{flowDetails.expenditureType}</p>
                    </div>
                    <div className='gap-y-1'>
                        <p className="text-xs text-gray-500 mb-1">Department</p>
                        <p className="text-sm text-gray-900">{flowDetails.department}</p>
                    </div>
                    {/* <div className='gap-y-1'>
                        <p className="text-xs text-gray-500 mb-1">Budgeted type</p>
                        <p className="text-xs text-gray-900">
                            <span className="px-2 py-0.5 bg-gray-200 border-1 rounded-full text-gray-700">
                                {flowDetails.budgetedType ? 'Budgeted' : 'Non-budgeted'}
                            </span>
                        </p>
                    </div> */}
                    <div className=''>
                        <p className="text-xs text-gray-500 mb-1">Amount range</p>
                        <p className="text-sm text-gray-900">
                            {`${convertCurrencyLabel(flowDetails.currency)}${flowDetails.minAmount} - ${convertCurrencyLabel(flowDetails.currency)}${flowDetails.maxAmount}`}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Approval Workflow</h3>
                    <div className="space-y-6">
                        {userDetails && userDetails.map((user, index) => (
                            <div key={index} className="relative">
                                <div className="text-xs text-gray-500 mb-1 shadow-lg p-4">
                                    <p className='mb-1'>Approver {index + 1}</p>
                                    <div className="flex items-center p-3 border-2 border-[#1A73E866] bg-blue-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3" > {user.profilePhoto ? <img
                                            src={""}
                                            alt="user Photo"
                                            className="w-full h-full z-2 rounded-full object-cover"
                                        /> : <img
                                            src={userPhoto}
                                            alt="user Photo"
                                            className="w-full h-full z-2 rounded-full object-cover"
                                        />}</div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user.name} 
                                            </p>
                                            <p className="text-xs text-black">
                                                {user.role} | <span>{user.department}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {userDetails && index < userDetails.length - 1 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 h-8 flex items-center justify-center">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="text-gray-400"
                                        >
                                            <path
                                                d="M12 4L12 20M12 20L6 14M12 20L18 14"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t mt-auto p-4">
                <div className="flex gap-2">
                    {/* <button
                        onClick={trigger}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                        Edit
                    </button> */}
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewApprovalFlow;