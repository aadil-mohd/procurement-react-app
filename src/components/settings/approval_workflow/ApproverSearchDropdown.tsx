import { Loader2 } from "lucide-react";
import { useState } from "react";
import { IUserDetails } from "../../../types/userTypes";
import userPhoto from '../../../assets/profile_photo/userPhoto.png';


// Approver entry in your form data
export interface IFormApprover {
    userId: string;
    // add any other properties if needed
}

interface ApprovalflowUsers {
    priority: number;
    userId: string;
}

interface ApprovalFlowData {
    flowName: string;
    expendituretypeId: string;
    departmentId: string;
    budgetedType: boolean;
    minAmount: string;
    maxAmount: string;
    currency: string;
    approvalflowUsers: ApprovalflowUsers[];

}

interface ApproverSearchDropdownProps {
    index: number;
    currentValue: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    approvers: IUserDetails[];
    isLoading: boolean;
    setApproverSelected: React.Dispatch<React.SetStateAction<boolean>>;
    formData: ApprovalFlowData;
    setFormData: React.Dispatch<React.SetStateAction<ApprovalFlowData>>;
}

const ApproverSearchDropdown: React.FC<ApproverSearchDropdownProps> = ({
    index,
    currentValue,
    setSearchQuery,
    approvers,
    isLoading,
    setApproverSelected,
    formData,
    setFormData,
}) => {
    // Find the currently selected approver from the provided approvers list.
    const currentApprover = approvers.find((a) => a.id === currentValue);
    // Using index to control open/close state of the dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);

    const filteredApprovers = approvers.filter(
        (user) => !formData.approvalflowUsers.some((approver) => approver.userId === user.id)
    );

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDropdownOpen(isDropdownOpen === index ? null : index);
    };

    const updateApprover = (index: number, userId: string) => {
        setFormData((prev: ApprovalFlowData) => ({
            ...prev,
            approvalflowUsers: prev.approvalflowUsers.map((approver, i) =>
                i === index ? { ...approver, userId } : approver
            ),
        }));
        setIsDropdownOpen(null);
        setSearchQuery("");
    };

    const handleApproverSelect = (userId: string) => {
        updateApprover(index, userId);
        setSearchQuery("");
        setApproverSelected(true);
        setIsDropdownOpen(null);
    };

    return (
        <div className="relative w-full">
            <div
                className="w-full p-2 border rounded-md cursor-pointer bg-white flex justify-between items-center"
                onClick={handleDropdownClick}
            >
                <div className="text-sm">
                    {currentApprover ? (
                        <>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3">
                                    {currentApprover.profilePhoto ? (
                                        <img
                                            src={""}
                                            alt="user Photo"
                                            className="w-full h-full z-2 rounded-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={userPhoto}
                                            alt="user Photo"
                                            className="w-full h-full z-2 rounded-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-col">
                                    <div className="font-medium text-sm">{currentApprover.name}</div>
                                    {/* <div className="font-medium text-gray-500 text-xs">{currentApprover.email}</div> */}
                                    <div className="mt-1 text-xs text-gray-500">
                                        <div>
                                            {currentApprover.role} | <span>{currentApprover.department}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </>
                    ) : (
                        "Select Approver"
                    )}
                </div>

                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isDropdownOpen === index && (
                <div
                    className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg text-xs"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full p-2 border-b text-xs focus:outline-none"
                            placeholder="Search approvers..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isLoading && (
                            <div className="absolute right-2 top-2">
                                <Loader2 />
                            </div>
                        )}
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {filteredApprovers.length > 0 ? (
                            filteredApprovers.map((approver) => (
                                <div
                                    key={approver.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleApproverSelect(approver.id)}
                                >
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3">
                                            {approver.profilePhoto ? (
                                                <img
                                                    src={""}
                                                    alt="user Photo"
                                                    className="w-full h-full z-2 rounded-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={userPhoto}
                                                    alt="user Photo"
                                                    className="w-full h-full z-2 rounded-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-col">
                                            <div className="font-medium text-sm">{approver.name}</div>
                                            {/* <div className="font-medium text-gray-500 text-xs">{currentApprover.email}</div> */}
                                            <div className="mt-1 text-xs text-gray-500">
                                                <div>
                                                    {approver.role} | <span>{approver.department}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <div className="p-2 text-gray-500 text-center">No approvers found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproverSearchDropdown;
