import { useContext, useEffect, useState, useCallback } from "react";
import Table from "../../components/basic_components/Table";
import BudgetCard from "../../components/dashboard/BudgetCard";
import NewRequestsCard from "../../components/dashboard/NewRequestsCard";
import StatusBar from "../../components/dashboard/StatusBar";
import TitleCard from "../../components/dashboard/TitleCard";
import { IFilterDto, statusDataProp } from "../../types/commonTypes";
import SortModal from "../../components/basic_components/SortModal";
import RequestCard from "../../components/dashboard/RequestCard";
import { CrossIcon, TickIcon } from "../../utils/Icons";
import PageLoader from "../../components/basic_components/PageLoader";
import { notification } from "antd";
import { convertCurrencyLabel } from "../../utils/common";
import { rfp_column_labels } from "../../utils/constants";

const defaultFilter: IFilterDto = {
  fields: [{
    columnName: "Status",
    value: "approved"
  }],
  sortColumn: "CreatedAt",
  sortDirection: "DESC",
  pageNo: 1,
  pageSize: 10
}

function Dashboard() {
  const commonColumns = ['tenderNumber', 'rfpTitle', 'buyerName', 'bidValue', 'isOpen']

  const [requestStatus, setRequestStatus] = useState([0, 0, 0]);

  // State definitions
  const [dashboardData, setDashboardData] = useState({
    newRequests: [] as any[],
    // requestStatus: [0, 0, 0],
    capexRequests: [] as any[],
    totalCount: 0,
  });

  const [budgetDetails, setBudgetDetails] = useState<any>({
    years: [],
    budgets: [],
    spend: [],
  });

  const [trigger, setTrigger] = useState(false);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");


  const [filter, setFilter] = useState<IFilterDto>(defaultFilter);

  const [statusData, setStatusData] = useState<statusDataProp[]>([
    {
      icon: <TickIcon className="w-5 h-5" />,
      label: "Approved requests",
      value: 0,
      color: "bg-green-500/30",
      textColor: "text-green-900",
    },
    {
      icon: <CrossIcon className="w-5 h-5" />,
      label: "Rejected requests",
      value: 0,
      color: "bg-red-500/30",
      textColor: "text-red-900",
    },
    {
      icon: "!",
      label: "Pending requests",
      value: 0,
      color: "bg-yellow-500/30",
      textColor: "text-yellow-900",
    }
  ]);

  // Memoized function to enrich request data with department and expenditure type
  // const enrichRequestData = useCallback((request: ICapexRequest) => ({
  //   ...request,
  //   expenditureType: expenditureTypes?.find(e => e.id === request.expenditureTypeId)?.expenditureType,
  //   departmentName: departments?.find(d => d.id === request.requestingDepartmentId)?.departmentName
  // }), [departments, expenditureTypes]);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setTrigger(false);
      setShowLoader(true);
      const [capexResponse, budgetsResponse, completedMilestonesResponse, assignedResponse] = [[], [], [], []];


      const requests = capexResponse.map((r: any) => ({ ...r, estimatedBudgetLabel: `${convertCurrencyLabel(r.currency as string)}${r.estimatedBudget?.toFixed(2)}` }));
      const statusCounts = [0, 0, 0];
      const approvedRequests: any[] = [];

      // Process requests and count statuses
      requests.forEach(request => {
        switch (request.status) {
          case "approved":
            statusCounts[0]++;
            if (approvedRequests.length < 10) {
              approvedRequests.push(request as any);
            }
            break;
          case "rejected":
            statusCounts[1]++;
            break;
          case "pending":
            statusCounts[2]++;
            break;
        }
      });

      // Update status data
      setStatusData([]);

      // Process budget data
      const budgetsByYear = budgetsResponse.reduce((acc: { [key: string]: number }, budget: any) => {
        const year = budget.createdAt.slice(0, 4);
        acc[year] = (acc[year] || 0) + budget.amount;
        return acc;
      }, {});

      const years = Object.keys(budgetsByYear).sort();
      const spendByYear = years.reduce((acc: { [key: string]: number }, year) => {
        acc[year] = completedMilestonesResponse
          .filter((m: any) => m.completedDate?.slice(0, 4) === year)
          .reduce((sum: number, m: any) => sum + (m.spend || 0), 0);
        return acc;
      }, {});

      setBudgetDetails({
        years,
        budgets: years.map(year => budgetsByYear[year]),
        spend: years.map(year => spendByYear[year])
      });

      setRequestStatus(statusCounts);

      const statusOrder: Record<string, number> = {
        under_clarification: 1,
        pending: 2,
        approved: 3,
        rejected: 4
      };

      // Update dashboard data
      setDashboardData({
        newRequests: assignedResponse.sort((a: any, b: any) => {
          const statusA = statusOrder[a.status ?? "rejected"]; // Default to lowest priority
          const statusB = statusOrder[b.status ?? "rejected"];
          return statusA - statusB;
        }),
        // requestStatus: statusCounts,
        capexRequests: approvedRequests,
        totalCount: statusCounts[0], // Total approved requests
      });

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
  const getCapexRequestFilter = useCallback(async (filterData = filter) => {
    try {
      const response: any[] = []
      const filtered_requests = response.map(r => ({ ...r, estimatedBudgetLabel: `${convertCurrencyLabel(r.currency as string)}${r.estimatedBudget?.toFixed(2)}` }))
      setDashboardData(prev => ({
        ...prev,
        totalCount: 20,
        capexRequests: filtered_requests
      }));
    } catch (error) {
      console.error("Error fetching filtered capex requests:", error);
    }
  }, []);

  // Effects
  useEffect(() => {
    console.log("reloaded")
    fetchDashboardData();
  }, [fetchDashboardData, trigger]);

  useEffect(() => {
    const updatedFilter = {
      ...filter,
      globalSearch: searchQuery
    };
    setFilter(updatedFilter);
  }, [searchQuery]);

  useEffect(() => {
    getCapexRequestFilter(filter);
  }, [filter, getCapexRequestFilter]);

  return (
    <div className="flex flex-col justify-between h-full desktop:flex-row desktop-wide:justify-center">
      {(!showLoader) ? (<>
        <div className="w-full desktop:max-w-[61.5rem] desktop:min-w-[57.5rem] h-full">
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
                labels={['Approved', 'Rejected', 'Pending']}
                data={requestStatus}
                colors={['#0F9670', '#DB5A63', '#E79937']}
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center px-[2rem] pt-[2rem]">
            <Table filter={filter} setFilter={setFilter} title={"Closed RFPs"} setIsSortModalOpen={setIsSortModalOpen} columns={commonColumns} items={[]} columnLabels={rfp_column_labels} setIsFilterModalOpen={() => { }} setSearchQuery={setSearchQuery} totalCount={20} type="rfps" rowNavigationPath="rfps" trigger={() => setTrigger(true)} />
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