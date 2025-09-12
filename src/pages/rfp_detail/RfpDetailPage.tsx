import React, { useEffect, useState } from "react";
import RfpDetailLeft from "../../components/rfp_request/rfp_details/RfpDetailLeft";
import { Button, notification } from "antd";
// import RequestDetailRight from "../../components/requests/RequestDetailRight";
// import { ICapexRequestDetail } from "../../types/capexTypes";
import { useNavigate, useParams } from "react-router-dom";
import { getRfpByIdAsync, openRfpProposalsAsync, publishRfpAsync } from "../../services/rfpService";
import PageLoader from "../../components/basic_components/PageLoader";
import RfpDetailRight from "../../components/rfp_request/rfp_details/RfpDetailRight";
import RfpApproveReject from "../../components/rfp_request/rfp_details/RfpApproveReject";
import CommonTitleCard from "../../components/basic_components/CommonTitleCard";
import { getAllCategoriesAsync } from "../../services/categoryService";
import { getUserCredentials } from "../../utils/common";
import RfpProposalApproveReject from "../../components/rfp_request/rfp_details/RfpProposalApproveReject";
import RfpAwardflow from "../../components/rfp_request/rfp_details/RfpAwardflow";


const RequestDetailPage: React.FC = () => {

    const { id } = useParams();
    const [rfpData, setRfpData] = useState<any>();
    const [masterData, setMasterData] = useState<{ categories: any[] }>({ categories: [] });
    const navigate = useNavigate();

    const getRequestDetailData = async () => {
        if (id) {
            console.log(id, "requestId")
            const response = await getRfpByIdAsync(Number(id));
            console.log(response);
            setRfpData(response);
            const categoriesResponse = await getAllCategoriesAsync();
            setMasterData(prev => ({ ...prev, categories: categoriesResponse }));
        }
    }


    useEffect(() => {
        getRequestDetailData();
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <CommonTitleCard />
                
                {/* Main Content */}
                <div className="mt-6 space-y-6">
                    {rfpData ? (
                        <>
                            {/* Approval Flow Section - Top */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                {(rfpData.status == 5 || rfpData?.status == 6 || rfpData.status == 9 ) ? 
                                    <RfpDetailRight rfp={rfpData} trigger={() => { getRequestDetailData(); }} /> :
                                    rfpData.status == 8 ? 
                                        <RfpProposalApproveReject rfpDetails={rfpData} trigger={() => { getRequestDetailData(); }} /> :
                                        (rfpData.status == 9 || rfpData.status == 10) ? 
                                            <RfpAwardflow rfpDetails={rfpData} trigger={() => { getRequestDetailData(); }}/> :
                                            <RfpApproveReject rfpDetails={rfpData} trigger={() => { getRequestDetailData(); }} />
                                }
                            </div>

                            {/* RFP Details Section */}
                            <RfpDetailLeft 
                                masterData={masterData} 
                                requestData={rfpData} 
                                trigger={() => { getRequestDetailData(); }} 
                            />
                        </>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-8">
                            <PageLoader />
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {(rfpData?.status == 1 || rfpData?.status == 5 || rfpData?.status == 9) && getUserCredentials().userId == rfpData?.createdBy.toString() && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md z-50">
                        <div className="max-w-4xl mx-auto px-4 py-3">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                (async () => {
                                    if (rfpData?.status == 1) {
                                        await publishRfpAsync(rfpData?.id);
                                        notification.success({
                                            message: "RFP published successfully"
                                        })
                                    }
                                    else if (rfpData?.status == 9) {
                                        navigate(`/rfps/${id}/decision-form`);
                                    } else {
                                        await openRfpProposalsAsync(rfpData?.id);
                                        notification.success({
                                            message: "RFP sent for open proposal"
                                        })
                                    }
                                    getRequestDetailData();
                                })();
                            }} className="flex justify-end">
                                <Button 
                                    type="primary" 
                                    htmlType="submit"
                                    className="px-6 py-2 text-sm font-medium"
                                >
                                    {rfpData?.status == 1 ? "Publish now" : rfpData?.status == 9 ? "Create DP" : "Sent for Open proposals"}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RequestDetailPage;