// ApprovalWorkflow.tsx
import React, { useEffect, useState } from 'react';
// import { getApprovalFlowById } from '../../services/flowService';
// import { getAllUsersByFilterAsync } from '../../services/userService';
// import { ApprovalStep } from '../../types/approvalTypes';
// import { handleFile } from '../../utils/common';
// import userPhoto from "../../../assets/profile_photo/userPhoto.png"
// import { IStep } from '../../../types/approvalflowTypes';
import { getRpfApprovalFlowsByIdAsync, getVendorApprovalFlowsByVendorIdAsync } from '../../../services/flowService';
import { getUserCredentials } from '../../../utils/common';
import StepIndicator from './rfp_approve-reject_right_component/StepIndicator';
import StepCard from './rfp_approve-reject_right_component/StepCard';


interface IRfpDetailRight {
    rfpDetails: any
    trigger: () => void
}


// const tempflows: IStep[] = [{
//     id: 0,
//     photo: userPhoto,
//     approvalRequestId: 0,
//     approverId: 1,
//     approverRole: "admin",
//     approverEmail: "admin@123",
//     approverName: "Akkib",
//     current: true,
//     stepOrder: 1,
//     status: "pending",
//     actionDate: "2025-05-01",
//     comments: ""
// },
// {
//     id: 0,
//     photo: userPhoto,
//     approvalRequestId: 0,
//     approverId: 1,
//     approverRole: "admin",
//     approverEmail: "admin@123",
//     approverName: "Akkib",
//     current: false,
//     stepOrder: 2,
//     status: "pending",
//     actionDate: "2025-05-01",
//     comments: ""
// }, {
//     id: 0,
//     approvalRequestId: 0,
//     photo: userPhoto,
//     approverRole: "admin",
//     approverName: "Akkib",
//     approverId: 1,
//     approverEmail: "admin@123",
//     stepOrder: 3,
//     current: false,
//     status: "pending",
//     actionDate: "2025-05-01",
//     comments: ""
// }, {
//     id: 0,
//     approvalRequestId: 0,
//     photo: userPhoto,
//     approverRole: "admin",
//     approverEmail: "admin@123",
//     approverName: "Akkib",
//     approverId: 1,
//     stepOrder: 4,
//     current: false,
//     status: "pending",
//     actionDate: "2025-05-01",
//     comments: ""
// }]

const RfpApproveReject: React.FC<IRfpDetailRight> = ({ rfpDetails, trigger }) => {
    const [stepsList, setStepsList] = useState<any[]>([])

    const setupRfpApproveReject = async () => {
        const response: any[] = await getRpfApprovalFlowsByIdAsync(rfpDetails?.id);
        const formatedSteps = response.map((item: any, i) => ({ ...item, current: (item.status == 0 && getUserCredentials().userId == item.approverId && (i == 0 || response[i - 1].status == 1)), status: item.status == 0 ? "pending" : item.status == 1 ? "approved" : "rejected" }));
        setStepsList(formatedSteps);
    }

    useEffect(() => {
        setupRfpApproveReject()
        trigger && trigger()
    }, [rfpDetails])

    return (
        <div className="w-full space-y-2 desktop:max-w-[790px] mx-auto rounded-lg h-full px-6 max-h-[900px] overflow-y-auto scrollbar">
            <StepIndicator steps={stepsList} />

            <div className="w-full">
                {stepsList.map((step, index) => {
                    // Find the index of the current step

                    // Find the latest step with currentUser that comes after stepCurrent
                    let currentIndex = -1;
                    for (let i = 0; i < stepsList.length; i++) {
                        if (stepsList[i].current) {
                            currentIndex = i;
                        }
                    }

                    // Show all steps up to (and including) the currentIndex in StepCard
                    if (index <= currentIndex) {
                        return (
                            <StepCard
                                key={index}
                                step={step || []}
                                trigger={() => {
                                    setupRfpApproveReject();
                                }}
                            />
                        );
                    }

                    // Show future steps in a plain div
                    return (
                        <div key={index} className="text-gray-500 mb-4 bg-white px-2 py-2 rounded-md flex-col items-center justify-center">
                            {step.approverRole} <p className='text-xs'>{step.approverName} | {step.approverEmail}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RfpApproveReject;