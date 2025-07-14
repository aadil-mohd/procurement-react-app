import React from "react";
import CompletedStep from "./CompletedStep";
import CurrentStep from "./CurrentStep";
import userPhoto from "../../../../assets/profile_photo/userPhoto.png"
import { IStep } from "../../../../types/approvalflowTypes";



const StepCard: React.FC<{ step: IStep, trigger: () => void }> = ({ step, trigger }) => {
    console.log(step)
    return (
        <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-centergap-2">
                    <div className="flex items-center space-x-2 p-1">
                        <div className="font-semibold text-[18px]">{step.approverRole}</div>
                        <div className="flex items-center justify-center bg-[#EBEEF4] rounded-2xl space-x-2 p-1">
                            <div className="w-[20px] h-[20px] rounded-full bg-red-300"><img className="w-full h-full z-2 rounded-full object-cover" src={step.photo || userPhoto} alt="imag" /></div>
                            <div className="text-black font-semibold text-[13px]">{step.approverName}</div>
                            <span className="text-gray-400 text-[13px]">|</span>
                            <div className="text-[13px]">{step.approverEmail}</div>
                        </div>
                    </div>
                </div>
            </div>
            {step.current && step.status == "pending" && <CurrentStep step={step} trigger={trigger} />}
            {(step.status == "rejected" || step.status == "approved" || step.status == "initiated") && <CompletedStep step={step} />}
            {/* {step. && <ClarificationStep step={step} trigger={trigger} requestData={requestData} setUpdateRequestTrigger={setUpdateRequestTrigger}/>} */}
        </div>
    )
};


export default StepCard