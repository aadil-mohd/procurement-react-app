import React, { useEffect, useState } from "react";
import RfpDetailLeft from "../../components/rfp_request/rfp_details/RfpDetailLeft";
// import RequestDetailRight from "../../components/requests/RequestDetailRight";
// import { ICapexRequestDetail } from "../../types/capexTypes";
import { useParams } from "react-router-dom";
import { getRfpByIdAsync } from "../../services/rfpService";
import PageLoader from "../../components/basic_components/PageLoader";
import RfpDetailRight from "../../components/rfp_request/rfp_details/RfpDetailRight";
import RfpApproveReject from "../../components/rfp_request/rfp_details/RfpApproveReject";
import CommonTitleCard from "../../components/basic_components/CommonTitleCard";
import { getAllCategoriesAsync } from "../../services/categoryService";


const RequestDetailPage: React.FC = () => {

    const { id } = useParams();
    const [rfpData, setRfpData] = useState<any>();
    const [updateRfpTrigger, setUpdateRfpTrigger] = useState(false);
    const [masterData, setMasterData] = useState<{ categories: any[] }>({ categories: [] });

    const getRequestDetailData = async () => {
        if (id) {
            console.log(id, "requestId")
            setUpdateRfpTrigger(false);
            const response = await getRfpByIdAsync(Number(id));
            console.log(response);
            setRfpData(response);
            const categoriesResponse = await getAllCategoriesAsync();
            setMasterData(prev => ({ ...prev, categories: categoriesResponse }));
        }
    }


    useEffect(() => {
        getRequestDetailData();
    }, [updateRfpTrigger, id])
    return (
        <div className="desktop-wide:flex desktop-wide:justify-center">
            <div>
                <CommonTitleCard />
                <div className="flex flex-col h-full desktop:flex-row desktop:justify-between desktop-wide:justify-center">
                    {rfpData ? <><RfpDetailLeft masterData={masterData} requestData={rfpData} trigger={() => { getRequestDetailData(); }} />
                        {rfpData.isPublished ? <RfpDetailRight rfp={rfpData} trigger={() => { getRequestDetailData(); }} /> :
                            <RfpApproveReject rfpDetails={rfpData} trigger={() => { getRequestDetailData(); }} />}
                    </> : <PageLoader />}
                </div>
            </div>

        </div>
    )
}

export default RequestDetailPage;