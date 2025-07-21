import React, { useEffect, useState } from "react";
// import RequestDetailRight from "../../components/requests/RequestDetailRight";
// import { ICapexRequestDetail } from "../../types/capexTypes";
import { useParams } from "react-router-dom";
import PageLoader from "../../components/basic_components/PageLoader";
import VendorDetailLeft from "../../components/vendors/vendor_details/VendorDetailLeft";
import VendorDetailRight from "../../components/vendors/vendor_details/VendorDetailRight";
import { getVendorsDetailsByIdAsync } from "../../services/vendorService";
import { Vendor } from "../../types/vendorTypes";
import CommonTitleCard from "../../components/basic_components/CommonTitleCard";

const VendorDetailPage: React.FC = () => {

    const { id } = useParams();

    const [vendorData, setVendorData] = useState<Vendor>({
        id: Number(id) || 0,
        createdAt: "2025-05-02",
        createdBy: 0,
        updatedAt: "2025-05-02",
        updatedBy: 0,
        firstName: "Ajith", // string
        lastName: "K",  // string
        userName: "ajith",  // string
        password: "xasxasxwwdssa",  // string
        vendorEmail: "ajith@gmail.com", // string
        businessGrade: "A+",
        commercialRegNo: "DTFD-767dsg",
        organisationName: "Ajith PVT", // string
        mobile: "+91 9876543210", // string
        phone: "+91 9876543210", // string
        isTermsAndConditionsAccepted: false, // boolean
        wayNo: "YTd6dsdgy",
        countryId: 0, // number | null
        countryName: "US",     // object (you can define structure separately)
        buildingNo: "B23",
        relatedToStakeholders: false,
        stateId: 0,   // number | null
        stateName: "SAUD",       // object
        principleActivities: "asdsadsad, asdassd, asdasdsa, dasasddfsdsdds, sdfsdfsd",
        cityId: 0,    // number | null
        cityName: "CGAV",        // object
        address: "GSVG, GDbcdb, djcbhcbsjcb, sjbhsjcs",       // string | null
        postalCode: "233223",    // string | null
        fax: "343434",           // string | null
        website: "aufait.in",       // string | null
        organisationLegalStructure: "sadsadasdsa",
        otherOrganisationLegalStructure: "ajgajsd", // string | null
        status: 1,
        isActive: true, // boolean
        vendorCode: "VD-0001", // string | null
        bankName: "HDFC",
        bankBranch: "Branch",
        ifscCode: "HDFC0001234",
        accountNumber: "90765654563278",
        accountBeneficiaryName: "Ajith k",
        majorClients: "Microsoft, AWS, Rocka",
        awardsAndRecognitions: `ISO 9001 Certified, 
Excellence in Supply Chain 2022`,
        experienceYear: 8,
        specializations: `Precision Components, 
Embedded Systems`,

        vendorCategories: [
            { id: 0, categoryName: "IT & Networking, Office Supplies" },
            { id: 0, categoryName: "Electronics" },
        ],
        usersDetails: [
            {
                name: "Akkib",
                email: "akkib@gmail.com",
                phone: "+91 9871267812",
                divissionName: "DGD",
                divissionId: 0
            }
        ],
        vendorDivissions: [
            {
                id: 0,
                divisionName: "DGD",
                location: "calicut"
            },
            {
                id: 0,
                divisionName: "TDG",
                location: "Palakkad"
            },
        ],
        vendorDocuments: [
            {
                id: 0,
                filePath: "",
                fileTitle: ""
            }
        ]
    }
    );

    const getVendorDetailData = async () => {
        if (id) {
            console.log(id, "requestId")
            const response = await getVendorsDetailsByIdAsync(Number(id));
            setVendorData((prev)=>({...prev,...response}));
            // setRfpData(response);
        }
    }


    useEffect(() => {
        getVendorDetailData();
    }, [id])

    return (
        <div className="desktop-wide:flex desktop-wide:justify-center">
            <div>
                <CommonTitleCard/>
                <div className="flex flex-col h-full desktop:flex-row desktop:justify-between desktop-wide:justify-center">
                {true ? <>
                    <VendorDetailLeft vendorDetails={vendorData} />
                    <VendorDetailRight vendorDetails={vendorData as any} trigger={() => { }} /></> : <PageLoader />}
            </div>
            </div>
            
        </div>
    )
}

export default VendorDetailPage;