import React from 'react';
import userPhoto from '../../../assets/profile_photo/userPhoto.png';


interface ViewApprovalFlowProps {
    usersData: any[]
    flowDetails: any | null;
    closeModal: () => void;
    trigger: () => void;
}

const ViewApprovalFlow: React.FC<ViewApprovalFlowProps> = ({
    usersData,
    flowDetails,
}) => {
    if (!flowDetails) return null;

    return (
        <div className="w-full bg-white flex flex-col h-full ">
            <div className="px-4 py-3 flex-1 overflow-y-auto scrollbar">
                <div className="mb-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Approval Workflow</h3>
                    <div className="space-y-6">
                        {flowDetails && flowDetails.steps.map((s: any, index: number) => {
                            let user = usersData.find(u => u.email == s.
                                defaultApproverEmail
                            );
                            return user ? (

                                <div key={index} className="relative">
                                    <div className="text-xs text-gray-500 mb-1 shadow-lg p-4">
                                        <p className='mb-1'>Approver {index + 1}</p>
                                        <div className="flex items-center p-3 border-2 border-[#1A73E866] bg-blue-50 rounded-lg">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3" > <img
                                                src={user.photo || userPhoto}
                                                alt="user Photo"
                                                className="w-full h-full z-2 rounded-full object-cover"
                                            /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-black">
                                                    {user.roleName} | <span>{user.departmentName}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : <></>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewApprovalFlow;