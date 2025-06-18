import React, { useState } from "react";
import SelectField from "../../../basic_components/SelectField";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { notification, Spin } from "antd";
import { IStep } from "../../../../types/approvalflowTypes";

interface IApproverResponse {
  capexRequestId: string;
  status: "approved" | "rejected" | "under_clarification";
  comments: string;
  clarificationUserId?: string;
  clarification?: string;
}

interface IOwnerDetails {
  ownerName: string;
  ownerId: string;
  ownerEmail: string;
}

const CurrentStep: React.FC<{ step: IStep; trigger: () => void }> = ({
  step,
  trigger
}) => {
  const { requestId } = useParams();
  const currentUserId = Cookies.get("userId") || "";
  const [selectedAction, setSelectedAction] = useState<"approved" | "rejected" | "under_clarification">("approved");
  const [approveComment, setApproveComment] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const [showLoaderOnButton, setShowLoaderOnButton] = useState<boolean>(false);
  const [clarificationRequest, setClarificationRequest] = useState({
    clarificationRequest: "",
    clarificationUserId: "",
    clarificationUserEmail: "",
    clarificationUserName: "",
  });
  const [errors, setErrors] = useState({
    approveComment: "",
    rejectComment: "",
    clarificationRequest: "",
    clarificationUser: ""
  });

  const handleActionClick = (action: "approved" | "rejected" | "under_clarification") => {
    setSelectedAction(action);
  };

  const handleSubmit = async () => {
    if (!requestId || !selectedAction) {
      console.error("Missing required data");
      return;
    }

    const newErrors = { approveComment: "", rejectComment: "", clarificationRequest: "", clarificationUser: "" };
    let hasError = false;

    // if (selectedAction === "approved" && !approveComment.trim()) {
    //   newErrors.approveComment = "Comments are required for approval.";
    //   hasError = true;
    // }

    if (selectedAction === "rejected" && !rejectComment.trim()) {
      newErrors.rejectComment = "Comments are required for rejection.";
      hasError = true;
    }

    if (selectedAction === "under_clarification") {
      if (!clarificationRequest.clarificationUserId) {
        newErrors.clarificationUser = "Please select a user for clarification.";
        hasError = true;
      }
      if (!clarificationRequest.clarificationRequest.trim()) {
        newErrors.clarificationRequest = "Clarification request is required.";
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (hasError) return;

    let responseBody: IApproverResponse = {
      capexRequestId: requestId,
      status: selectedAction,
      comments: "", // Default empty comment
    };

    if (selectedAction === "approved") {
      responseBody.comments = approveComment;
    } else if (selectedAction === "rejected") {
      responseBody.comments = rejectComment;
    } else if (selectedAction === "under_clarification") {
      responseBody.clarificationUserId = clarificationRequest.clarificationUserId;
      responseBody.clarification = clarificationRequest.clarificationRequest;
    }

    // try {
    //   setShowLoaderOnButton(true);
    //   const response = await postApproverResponse(responseBody);
    //   if (response) {
    //     setShowLoaderOnButton(false);
    //     trigger();
    //     notification.success({
    //       message:"Response submitted successfully"
    //     })
    //   }
    // } catch (error: any) {
    //   notification.error({
    //     message: "Response error",
    //     description: error.message
    //   });
    // } finally {
    //   setShowLoaderOnButton(false);
    // }
  };

  return (
    <>
      {step?.approverId.toString() === currentUserId && (
        <div className="mb-4 bg-[#EBEEF480] p-4 rounded-lg">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-4">
            {step.status === "pending" && (
              <>
                <button
                  type="button"
                  disabled={showLoaderOnButton}
                  className={`px-4 py-1.5 text-sm rounded ${selectedAction === "approved" ? "text-white bg-[#0F9670]" : "bg-[#0F96701A]"}`}
                  onClick={() => handleActionClick("approved")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={showLoaderOnButton}
                  className={`px-4 py-1.5 text-sm rounded hover:bg-red-00 ${selectedAction === "rejected" ? "text-white bg-[#DB5A63]" : "bg-[#DB5A631A]"}`}
                  onClick={() => handleActionClick("rejected")}
                >
                  Reject
                </button>
              </>
            )}
            {/* <button
              type="button"
              disabled={showLoaderOnButton}
              className={`px-4 py-1.5 text-sm rounded ${selectedAction === "under_clarification" ? "text-white bg-[#E79937]" : "bg-[#E799371A]"}`}
              onClick={() => handleActionClick("under_clarification")}
            >
              Send for clarification
            </button> */}
          </div>

          {/* Conditional Form Fields */}
          {/* {selectedAction === "under_clarification" && (
            <div className="rounded-lg mb-3">
              <div className="mb-3">
                <label htmlFor="clarification-request" className="text-sm text-gray-500">
                  Clarification from
                </label>
                <SelectField
                  id="owner"
                  label=""
                  style="w-full"
                  value={clarificationRequest?.clarificationUserEmail || "Select a user"}
                  options={(ownerDetails || []).map((x) => ({
                    label: (
                      <div>
                        <span className="text-md font-medium">{x.ownerName}</span>
                        <br />
                        <span className="text-sm text-gray-500">{x.ownerEmail}</span>
                      </div>
                    ),
                    value: JSON.stringify([x.ownerId, x.ownerEmail, x.ownerName]),
                  }))}
                  onChange={(selectedValue) => {
                    const [clarificationUserId, clarificationUserEmail, clarificationUserName] = JSON.parse(selectedValue);
                    setClarificationRequest({
                      clarificationUserId,
                      clarificationUserEmail,
                      clarificationUserName,
                      clarificationRequest: "",
                    });
                  }}
                />
                {errors.clarificationUser && <p className="text-red-500 text-xs mb-1">{errors.clarificationUser}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="clarification-request" className="text-sm text-gray-500">
                  Clarification request
                </label>
                <textarea
                  id="clarification-request"
                  value={clarificationRequest.clarificationRequest}
                  onChange={(e) => setClarificationRequest({ ...clarificationRequest, clarificationRequest: e.target.value })}
                  className="w-full border border-gray-200 rounded p-3 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your clarification request"
                />
                {errors.clarificationRequest && <p className="text-red-500 text-xs mb-1">{errors.clarificationRequest}</p>}
              </div>
            </div>
          )} */}

          {selectedAction === "approved" && (
            <div className="mb-2">
              <label htmlFor="approve-comment" className="text-sm text-gray-500">
                Comments
              </label>
              <textarea
                id="approve-comment"
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                className="w-full border border-gray-200 rounded p-3 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your comments for approval"
              />
              {errors.approveComment && <p className="text-red-500 text-xs mb-1">{errors.approveComment}</p>}
            </div>
          )}

          {selectedAction === "rejected" && (
            <div className="mb-2">
              <label htmlFor="reject-comment" className="text-sm text-gray-500">
                Comments
              </label>
              <textarea
                id="reject-comment"
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                className="w-full border border-gray-200 rounded p-3 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your comments for rejection"
              />
              {errors.rejectComment && <p className="text-red-500 text-xs mt-1">{errors.rejectComment}</p>}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              disabled={showLoaderOnButton}
              onClick={handleSubmit}
              className={`px-4 py-1.5 bg-blue-500 ${showLoaderOnButton ? "bg-gray-200" : "hover:bg-blue-600"} text-white text-sm rounded`}
            >
              {showLoaderOnButton ? <Spin /> : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrentStep;
