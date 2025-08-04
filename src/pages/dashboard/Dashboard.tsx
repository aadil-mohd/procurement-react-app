import { useEffect, useState, useCallback } from "react";
import Table from "../../components/basic_components/Table";
import BudgetCard from "../../components/dashboard/BudgetCard";
import NewRequestsCard from "../../components/dashboard/NewRequestsCard";
import StatusBar from "../../components/dashboard/StatusBar";
import TitleCard from "../../components/dashboard/TitleCard";
import { IFilterDto, statusDataProp } from "../../types/commonTypes";
import RequestCard from "../../components/dashboard/RequestCard";
import { TickIcon } from "../../utils/Icons";
import PageLoader from "../../components/basic_components/PageLoader";
import { notification } from "antd";
import { convertCurrencyLabel } from "../../utils/common";
import { rfp_column_labels } from "../../utils/constants";
import { getAllRfpsByFilterAsync } from "../../services/rfpService";

const defaultFilter: IFilterDto = {
  fields: [{
    columnName: "status",
    value: 5
  }],
  sortColumn: "CreatedAt",
  sortDirection: "DESC",
  pageNo: 1,
  pageSize: 10
}

function Dashboard() {
  const commonColumns = ['tenderNumber', 'rfpTitle', 'buyerName', 'estimatedContractValueLabel', 'status']

  const [requestStatus, setRequestStatus] = useState([0, 0, 0]);

  // State definitions
  const [dashboardData, setDashboardData] = useState({
    newRequests: [] as any[],
    // requestStatus: [0, 0, 0],
    rfpRequests: [] as any[],
    totalCount: 0,
  });

  const [budgetDetails, setBudgetDetails] = useState<any>({
    years: [],
    budgets: [],
    spend: [],
  });

  const [, setTrigger] = useState(false);

  //const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [_, setIsSortModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");


  const [filter, setFilter] = useState<IFilterDto>(defaultFilter);

  const [statusData, setStatusData] = useState<statusDataProp[]>([
    {
      icon: <TickIcon className="w-5 h-5" />,
      label: "Closed RFPs",
      value: 0,
      color: "bg-green-500/30",
      textColor: "text-green-900",
    },
    {
      icon: "!",
      label: "Open RFPs",
      value: 0,
      color: "bg-yellow-500/30",
      textColor: "text-yellow-900",
    }
  ]);


  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setTrigger(false);
      setShowLoader(true);
      const rfpResponse = await getAllRfpsByFilterAsync();
      const requests = rfpResponse.map((r: any) => ({ ...r, bidValueLabel: `${convertCurrencyLabel(r.rfpCurrency as string)}${r.bidValue?.toFixed(2)}` }));
      const statusCounts = [0, 0];
      const approvedRequests: any[] = [];

      // Process requests and count statuses
      requests.forEach((request: any) => {
        switch (request.isOpen) {
          case false:
            statusCounts[0]++;
            if (approvedRequests) {
              approvedRequests.push(request as any);
            }
            break;
          case true:
            statusCounts[1]++;
            break;
        }
      });

      // Update status data
      setStatusData([
        {
          icon: <TickIcon className="w-5 h-5" />,
          label: "Closed RFPs",
          value: statusCounts[0],
          color: "bg-green-500/30",
          textColor: "text-green-900",
        },
        {
          icon: "!",
          label: "Open RFPs",
          value: statusCounts[1],
          color: "bg-yellow-500/30",
          textColor: "text-yellow-900",
        }
      ]);

      // Process budget data
      const budgetsByYear = approvedRequests.reduce((acc: { [key: string]: number }, budget: any) => {
        const year = budget.createdAt.slice(0, 4);
        acc[year] = (acc[year] || 0) + budget.estimatedContractValue;
        return acc;
      }, {});

      const years = Object.keys(budgetsByYear).sort();
      const spendByYear = years.reduce((acc: { [key: string]: number }, year) => {
        acc[year] = approvedRequests
          .filter((m: any) => m.closingDate?.slice(0, 4) === year)
          .reduce((sum: number, m: any) => sum + (m.bidValue || 0), 0);
        return acc;
      }, {});

      setBudgetDetails({
        years,
        budgets: years.map(year => budgetsByYear[year]),
        spend: years.map(year => spendByYear[year])
      });

      setRequestStatus(statusCounts);

      // const statusOrder: Record<string, number> = {
      //   under_clarification: 1,
      //   pending: 2,
      //   approved: 3,
      //   rejected: 4
      // };

      // Update dashboard data
      setDashboardData({
        newRequests: [],
        // requestStatus: statusCounts,
        rfpRequests: approvedRequests,
        totalCount: statusCounts[0], // Total approved requests
      });
      console.log(approvedRequests,"approvedRequests---")
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      notification.error({
        message: error.message
      })
    } finally {
      setShowLoader(false);
    }
  }, []);



  // Fetch capex requests with filter
  const getRfpRequestFilter = useCallback(async (filterData = filter) => {
    try {
      const response: any[] = await getAllRfpsByFilterAsync(filterData);
      const filtered_requests = response.map(r => ({ ...r, estimatedContractValueLabel: `${convertCurrencyLabel(r.rfpCurrency as string)}${r.estimatedContractValue?.toFixed(2)}` }))
      setDashboardData(prev => ({
        ...prev,
        totalCount: 20,
        rfpRequests: filtered_requests
      }));
    } catch (error) {
      console.error("Error fetching filtered capex requests:", error);
    }
  }, []);

  // Effects
  useEffect(() => {
    console.log("reloaded")
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const updatedFilter = {
      ...filter,
      globalSearch: searchQuery
    };
    setFilter(updatedFilter);
  }, [searchQuery]);

  useEffect(() => {
    getRfpRequestFilter(filter);
  }, [filter]);


  return (
    <div className="flex flex-col justify-between h-full desktop:flex-row desktop-wide:justify-center">
      {(!showLoader) ? (<>
        <div className="w-full desktop:max-w-[61.5rem] desktop:min-w-[57.5rem] h-full overflow-y-auto">
          <div className="w-full px-[2rem] pt-[1.5rem]">
            <TitleCard trigger={() => setTrigger(true)} />
          </div>
          <div className="w-full px-[2rem] desktop:px-[2rem] pt-[1.25rem]">
            <StatusBar statuses={statusData} />
          </div>
          <div className="w-full px-[2rem] pt-[2rem]">
            <div className="flex flex-col desktop:flex-row justify-center desktop:justify-between items-center w-full h-full space-y-4 desktop:space-y-0 desktop:space-x-6">
              <BudgetCard budgetDetails={budgetDetails} />
              <RequestCard
                labels={['Closed', 'Open']}
                data={requestStatus}
                colors={['#0F9670', '#E79937']}
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center px-[2rem] pt-[2rem]">
            <Table filter={filter} setFilter={setFilter} title={"Published RFPs"} setIsSortModalOpen={setIsSortModalOpen} columns={commonColumns} items={dashboardData.rfpRequests} columnLabels={rfp_column_labels} setIsFilterModalOpen={() => { }} setSearchQuery={setSearchQuery} totalCount={20} type="rfps" rowNavigationPath="rfps" trigger={() => setTrigger(true)} />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="w-full h-full px-[2rem] pt-[2rem] desktop:p-0 desktop:max-w-[23.625rem]">
          <div className="">
            <NewRequestsCard requests={dashboardData.newRequests} trigger={() => setTrigger(true)} />
          </div>
        </div>

      </>) : <PageLoader />}
    </div>
  );
}

export default Dashboard;