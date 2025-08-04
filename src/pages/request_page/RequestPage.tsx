import { useEffect, useState } from "react";
import { Button, notification } from 'antd';
import { Modal as AntdModal } from 'antd';
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
import { createOrUpdateRfpAsync, deleteRfpByIdAsync, getAllRfpsByFilterAsync } from "../../services/rfpService";
import { convertCurrencyLabel, getUserCredentials } from "../../utils/common";
import CommonTitleCard from "../../components/basic_components/CommonTitleCard";
import { IRfp } from "../../types/rfpTypes";

const tempfilter = {
  fields: [],
  pageNo: 0,
  pageSize: 0,
  sortColumn: "CreatedAt",
  sortDirection: "DESC"
}

function RequestPage() {
  const commonColumns = ['tenderNumber', 'rfpTitle', 'buyerName', 'estimatedContractValueLabel', 'status']
  const [columns, setColumns] = useState(commonColumns);
  const [trigger, setTrigger] = useState(false);
  // const [hideDepartment,setHideDepartment]= useState(true);
  // const [hideStatus,setHideStatus]= useState(false);
  const [rfpRequests, setRfpRequests] = useState<any[]>([]);
  // const [filterModalOpen, setFilterModal] = useState<boolean>(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [tableName, setTableName] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [defaultFilter, setDefaultFilter] = useState<IFilterDto>(tempfilter)
  const [filter, setFilter] = useState<IFilterDto>(defaultFilter);
  const [showLoader] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("All RFPs");
  const [, setSelectedRfp] = useState<IRfp>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: "delete" | "block", rfp: IRfp } | null>(null);
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
      let capex_request_responese: any = await getAllRfpsByFilterAsync(filterDto)
      //setShowLoader(false);
      setTotalCount(0)
      let data: any = capex_request_responese.map((r: any) => ({ ...r, estimatedContractValueLabel: `${convertCurrencyLabel(r.rfpCurrency as string)}${r.estimatedContractValue?.toFixed(2)}` }));;
      setRfpRequests(data);
      setTrigger(false);
    } catch (err) {
      console.log(err)
    }
  };

  async function setupTab(tab: string) {
    if (statusFilter != tab) {
      let filterdata = filter;

      if (tab == "All RFPs") {
        setColumns(commonColumns);
        // setHideDepartment(true);
        // setHideStatus(false)
        filterdata = { ...filterdata, fields: [] }
      } else if (tab == "My RFPs") {
        setColumns(commonColumns);
        // setHideDepartment(false);
        // setHideStatus(false)
        filterdata = { ...filterdata, fields: [{ columnName: "CreatedBy", value: Number(getUserCredentials().userId) }] }
      } else if (tab == "Assigned") {
        setColumns(commonColumns);
        // setHideDepartment(false);
        // setHideStatus(false)
        filterdata = { ...filterdata, fields: [{ columnName: "assigned_rfps", value: true }] }
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

  const handleThreeDots = (type: "edit" | "delete" | "block", rfp: IRfp) => {
    console.log(rfp)
    setSelectedRfp(rfp)
    if (type === "edit") {
      navigate(`/rfps/edit-rfp/${rfp.id}`);
    } else {
      setConfirmAction({ type, rfp });
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction?.type === "delete") {
        console.log("here delete")
        const response = await deleteRfpByIdAsync(confirmAction.rfp.id as number);
        if (response) {
          setTrigger(true);
        }
      } else if (confirmAction?.type === "block") {
        // const formData = new FormData();
        // formData.append("id", confirmAction.user.id as string);
        // formData.append("isActive", (!confirmAction.user.isActive).toString());
        const formData = {
          id: confirmAction.rfp.id,
          status: "hold", // setting RFP status to "hold"
        };
        const response = await createOrUpdateRfpAsync(formData)
        if (response) {
          setTrigger(true);
        }
      }
      notification.success({
        message: `User ${confirmAction?.type == "delete" ? "deletion" : "action"} successfull`
      })

    } catch (error: any) {
      notification.error({
        message: `${confirmAction?.type} error`,
        description: error.message
      })
    }

    setIsConfirmModalOpen(false);
  };

  useEffect(() => {
    getRfpRequestFilter();
  }, [filter, trigger]);

  const tabs = ["All RFPs", "My RFPs", "Assigned","Draft RFPs"];

  return (
    <div className="desktop-wide:flex desktop-wide:justify-center">
      <div>
        <CommonTitleCard />
        <div className="pt-[24px] px-[32px] h-full">
          {!showLoader ? <>
            <div className="flex items-center justify-between">
              <div className="mb-2 text-xl font-bold">RFPs</div>
              <div>
                <CreateButton name="Create RFP" onClick={onCreateRequest} />

              </div>

            </div>
            <div className="pt-[24px] flex justify-start border-b ml-[10px] mb-[16px]">
              {tabs.map((tab, index) => (
                <div className="flex items-center h-[37px]" key={tab}>
                  <div
                    onClick={() => setupTab(tab)}
                    className={`relative h-full w-full text-sm text-start cursor-pointer font-semibold ${statusFilter === tab
                      ? "text-customBlue"
                      : "text-gray-500 hover:text-black"
                      }`}
                  >
                    {tab}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[3px] ${statusFilter === tab
                        ? "bg-customBlue"
                        : "bg-transparent group-hover:bg-customeBlue"
                        }`}
                    ></span>
                  </div>
                  {index !== tabs.length - 1 && (
                    <span className="mx-[12px] h-[37px] text-gray-400"></span>
                  )}
                </div>
              ))}
            </div>


            <div className="ml-[10px]">
              <Table filter={filter} setFilter={setFilter} title={tableName || "All requests"} setIsSortModalOpen={setIsSortModalOpen} columns={columns} items={rfpRequests || []} columnLabels={rfp_column_labels} setIsFilterModalOpen={() => { }} setSearchQuery={setSearchQuery} totalCount={totalCount} type="rfps" rowNavigationPath="rfps" trigger={() => setTrigger(true)} dots setEditOption={(user) => handleThreeDots("edit", user)}
                setDeleteOption={(user) => handleThreeDots("delete", user)} setBlockOption={(user) => handleThreeDots("block", user)} />
              {isSortModalOpen && <SortModal filter={filter} columns={rfp_sorting_fields} setFilter={setFilter} setIsSortModalOpen={setIsSortModalOpen} />}

              <AntdModal
                title={confirmAction?.type === "delete" ? "Confirm Delete" : "Confirm Block"}
                open={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                footer={[
                  <Button key="cancel" onClick={() => setIsConfirmModalOpen(false)}>
                    Cancel
                  </Button>,
                  <Button
                    key="confirm"
                    type="primary"
                    danger={confirmAction?.type === "delete"}
                    onClick={handleConfirmAction}
                  >
                    {confirmAction?.type === "delete" ? "Delete" : "Block"}
                  </Button>,
                ]}
              >
                <p>
                  Are you sure you want to{" "}
                  {confirmAction?.type === "delete" ? "delete" : "block"} this rfp?
                </p>
              </AntdModal>


            </div></> : <PageLoader />}
        </div>
      </div>
    </div>
  );
}

export default RequestPage;
