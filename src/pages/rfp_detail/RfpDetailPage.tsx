import React, { useEffect, useState } from "react";
import RfpDetailLeft from "../../components/rfp_request/rfp_details/RfpDetailLeft";
// import RequestDetailRight from "../../components/requests/RequestDetailRight";
// import { ICapexRequestDetail } from "../../types/capexTypes";
import { useParams } from "react-router-dom";
import { getRfpByIdAsync } from "../../services/rfpService";
import PageLoader from "../../components/basic_components/PageLoader";
import RfpDetailRight from "../../components/rfp_request/rfp_details/RfpDetailRight";
import RfpApproveReject from "../../components/rfp_request/rfp_details/RfpApproveReject";


const RequestDetailPage: React.FC = () => {

    const { id } = useParams();
    const [rfpData, setRfpData] = useState<any>();
    const [updateRfpTrigger, setUpdateRfpTrigger] = useState(false)

    const getRequestDetailData = async () => {
        if (id) {
            console.log(id, "requestId")
            setUpdateRfpTrigger(false);
            const response = await getRfpByIdAsync(Number(id));
            console.log(response);
            setRfpData(response);
        }
    }


    useEffect(() => {
        getRequestDetailData();
    }, [updateRfpTrigger, id])
    return (
        <div className="desktop-wide:flex desktop-wide:justify-center">
            <div className="flex flex-col h-full desktop:flex-row desktop:justify-between desktop-wide:justify-center">
                {rfpData ? <><RfpDetailLeft requestData={rfpData} trigger={() => { getRequestDetailData(); }} />
                    {rfpData.isPublished ? <RfpDetailRight rfp={rfpData} trigger={() => { }} /> :
                        <RfpApproveReject rfpDetails={rfpData} trigger={() => { }} />}
                </> : <PageLoader />}
            </div>
        </div>
    )
}

export default RequestDetailPage;