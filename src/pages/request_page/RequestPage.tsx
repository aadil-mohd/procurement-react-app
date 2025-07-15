import { useEffect, useState } from "react";
import Table from "../../components/basic_components/Table";
import { IFilterDto } from "../../types/commonTypes";
// import Cookies from "js-cookie";
import SortModal from "../../components/basic_components/SortModal";
import { rfp_column_labels, rfp_sorting_fields } from "../../utils/constants";
import "./requestPage.css";
import CreateButton from "../../components/buttons/CreateButton";
import PageLoader from "../../components/basic_components/PageLoader";
// import { convertCurrencyLabel } from "../../utils/common";
import { useNavigate } from "react-router-dom";
import { getAllRfpsByFilterAsync } from "../../services/rfpService";
import { convertCurrencyLabel, getUserCredentials } from "../../utils/common";

const tempfilter = {
  fields: [],
  pageNo: 0,
  pageSize: 0,
  sortColumn: "CreatedAt",
  sortDirection: "DESC"
}

function RequestPage() {
  const commonColumns=['tenderNumber', 'rfpTitle', 'buyerName', 'estimatedContractValueLabel', 'isOpen']
  const [columns,setColumns] = useState(commonColumns);
  const [trigger, setTrigger] = useState(false);
  // const [hideDepartment,setHideDepartment]= useState(true);
  // const [hideStatus,setHideStatus]= useState(false);
  const [rfpRequests, setRfpRequests] = useState<any[]>([]);
  // const [filterModalOpen, setFilterModal] = useState<boolean>(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableName, setTableName] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [defaultFilter,setDefaultFilter] = useState<IFilterDto>(tempfilter)
  const [filter, setFilter] = useState<IFilterDto>(defaultFilter);
  const [showLoader] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("All requests");
  const navigate = useNavigate();

  // const requestStatuses = [
  //   { label: "Approved", value: "approved" },
  //   { label: "Rejected", value: "rejected" },
  //   { label: "Pending", value: "pending" },
  //   { label: "Under clarification", value: "under_clarification" },
  // ]

  // const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  // useEffect(() => {
  //   if (isModalOpen) {
  //     document.body.classList.add("modal-open"); // Disable background scrolling
  //   }
  //   return () => {
  //     document.body.classList.remove("modal-open"); // Cleanup when modal closes
  //   };
  // }, [isModalOpen]);

  const onCreateRequest = () => {
    navigate("/rfps/create-rfp")
  }

  const getRfpRequestFilter = async (filterDto: IFilterDto = filter) => {
    try {
      //setShowLoader(true);
      let capex_request_responese:any = await getAllRfpsByFilterAsync(filterDto)
      //setShowLoader(false);
      setTotalCount(0)
      let data:any = capex_request_responese.map((r:any)=>({...r,estimatedContractValueLabel:`${convertCurrencyLabel(r.rfpCurrency as string)}${r.estimatedContractValue?.toFixed(2)}`}));;
      setRfpRequests(data);
      setTrigger(false);
    } catch (err) {
      console.log(err)
    }
  };

  async function setupTab(tab: string) {
    if (statusFilter != tab) {
      let filterdata = filter;

      if (tab == "All requests") {
        setColumns(commonColumns);
        // setHideDepartment(true);
        // setHideStatus(false)
        filterdata = { ...filterdata, fields: [] }
      } else if (tab == "My requests") {
        setColumns(commonColumns);
        // setHideDepartment(false);
        // setHideStatus(false)
        filterdata = { ...filterdata, fields: [{ columnName: "CreatedBy", value: Number(getUserCredentials().userId) }] }
      } else if (tab == "Assigned") {
        setColumns(commonColumns);
        // setHideDepartment(false);
        // setHideStatus(false)
        // filterdata = { ...filterdata, fields: [{ columnName: "status", operator: "!=", value: "draft" }, { columnName: "assigned_capex", value: true }] }
      } else {
        return;
        //setColumns(columns.filter(x=>x!="capexId"));
        // setHideDepartment(false);
        // setHideStatus(true)
        filterdata = { ...filterdata, fields: [{ columnName: "status", operator: "=", value: "draft" }, { columnName: "CreatedBy", value: Number(getUserCredentials().userId) }] }
      }
      setDefaultFilter(filterdata);
      setTableName(tab);
      setFilter(filterdata);
      getRfpRequestFilter(filterdata);
      setStatusFilter(tab);
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchQuery])

  const handleSearch = async () => {
    const updatedFilter = {
      ...filter,
      globalSearch: searchQuery
    };
    await getRfpRequestFilter(updatedFilter);
    console.log(searchQuery, "searchquery after fetch")
  };

  useEffect(() => {
    getRfpRequestFilter();
  }, [filter, trigger]);

  const tabs = ["All requests", "My requests", "Draft requests"];

  return (
    <div className="desktop-wide:flex desktop-wide:justify-center">
      <div className="pt-[24px] px-[32px] h-full">
        {!showLoader ? <>
          <div className="flex items-center justify-between">
            <div className="mb-2 text-xl font-bold">Requests</div>
            <div>
              <CreateButton name="Create RFP" onClick={onCreateRequest} />
              
            </div>

          </div>
          <div className="pt-[24px] flex justify-start mb-[16px]">
            {tabs.map((tab, index) => (
              <div className="flex items-center h-[37px]" key={tab}>
                <div
                  onClick={() => setupTab(tab)}
                  className={`relative h-full w-full text-sm text-start cursor-pointer ${statusFilter === tab
                    ? "text-customBlue"
                    : "text-black hover:text-customBlue"
                    }`}
                >
                  {tab}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[3px] rounded-t-[10px] ${statusFilter === tab
                      ? "bg-customBlue"
                      : "bg-transparent group-hover:bg-customBlue"
                      }`}
                  ></span>
                </div>
                {index !== tabs.length - 1 && (
                  <span className="mx-[12px] h-[37px] text-gray-400">|</span>
                )}
              </div>
            ))}
          </div>


          <div className="ml-[10px]">
            <Table filter={filter} setFilter={setFilter} title={tableName || "All requests"} setIsSortModalOpen={setIsSortModalOpen} columns={columns} items={rfpRequests || []} columnLabels={rfp_column_labels} setIsFilterModalOpen={()=>{}} setSearchQuery={setSearchQuery} totalCount={totalCount} type="rfps" rowNavigationPath="rfps" trigger={() => setTrigger(true)} />
            {isSortModalOpen && <SortModal filter={filter} columns={rfp_sorting_fields} setFilter={setFilter} setIsSortModalOpen={setIsSortModalOpen} />}
          </div></> : <PageLoader />}
      </div>
    </div>
  );
}

export default RequestPage;
