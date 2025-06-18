import React, { useEffect, useState } from "react";
// import RequestDetailRight from "../../components/requests/RequestDetailRight";
// import { ICapexRequestDetail } from "../../types/capexTypes";
import { useParams } from "react-router-dom";
import { getRfpByIdAsync } from "../../services/rfpService";
import PageLoader from "../../components/basic_components/PageLoader";
import VendorDetailLeft from "../../components/vendors/vendor_details/VendorDetailLeft";
import VendorDetailRight from "../../components/vendors/vendor_details/VendorDetailRight";
import { getVendorsDetailsByIdAsync } from "../../services/vendorService";


const VendorDetailPage: React.FC = () => {

    const { id } = useParams();
    const [vendorData, setVendorData] = useState<any>(null);

    const getVendorDetailData = async () => {
        if (id) {
            console.log(id,"requestId")
            const response = await getVendorsDetailsByIdAsync(Number(id));
            setVendorData(response);
            // setRfpData(response);
        }
    }


    useEffect(() => {
        getVendorDetailData();
    }, [id])

    return (
        <div className="desktop-wide:flex desktop-wide:justify-center">
            <div className="flex flex-col h-full desktop:flex-row desktop:justify-between desktop-wide:justify-center">
                {true ? <>
                {/* <VendorDetailLeft requestData={vendorData} /> */}
                    <VendorDetailRight vendorDetails={vendorData as any} trigger={()=>{}}/></> : <PageLoader />}
            </div>
        </div>
    )
}

export default VendorDetailPage;