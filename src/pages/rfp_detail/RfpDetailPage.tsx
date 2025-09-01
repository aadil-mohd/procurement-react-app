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
        <div className="desktop-wide:flex desktop-wide:justify-center relative">
            <div>
                <CommonTitleCard />
                <div className="flex flex-col h-full desktop:flex-row desktop:justify-between desktop-wide:justify-center">
                    {rfpData ? <><RfpDetailLeft masterData={masterData} requestData={rfpData} trigger={() => { getRequestDetailData(); }} />
                        {(rfpData.status == 5 || rfpData?.status == 6 || rfpData.status == 9 ) ? <RfpDetailRight rfp={rfpData} trigger={() => { getRequestDetailData(); }} /> :
                            rfpData.status == 8 ? <RfpProposalApproveReject rfpDetails={rfpData} trigger={() => { getRequestDetailData(); }} /> :(rfpData.status == 9 || rfpData.status == 10) ? <RfpAwardflow rfpDetails={rfpData} trigger={() => { getRequestDetailData(); }}/> :<RfpApproveReject rfpDetails={rfpData} trigger={() => { getRequestDetailData(); }} />}
                    </> : <PageLoader />}
                </div>
            </div>

            {(rfpData?.status == 1 || rfpData?.status == 5 || rfpData?.status == 9) && getUserCredentials().userId == rfpData?.createdBy.toString() &&
                <div className="mt-10">
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
                    }} className="fixed right-0 bottom-0 py-3 px-3 flex justify-end space-x-4 bg-white w-full border-t">

                        <Button type="primary" htmlType="submit">
                            {rfpData?.status == 1 ? "Publish now" : rfpData?.status == 9 ? "Create DP" : "Sent for Open proposals"}
                        </Button>
                    </form>
                </div>
            }
        </div >
    )
}

export default RequestDetailPage;