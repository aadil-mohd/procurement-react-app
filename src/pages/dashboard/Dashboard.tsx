import { useEffect, useState, useCallback } from "react";
import Table from "../../components/basic_components/Table";
import BudgetCard from "../../components/dashboard/BudgetCard";
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

  const [requestStatus, setRequestStatus] = useState([5, 12, 8]);

  // State definitions
  const [dashboardData, setDashboardData] = useState({
    newRequests: [] as any[],
    // requestStatus: [0, 0, 0],
    rfpRequests: [] as any[],
    totalCount: 0,
  });

  const [budgetDetails, setBudgetDetails] = useState<any>({
    years: ['2020', '2021', '2022', '2023', '2024'],
    budgets: [12000, 15000, 18000, 22000, 25000],
    spend: [10000, 13000, 16000, 19000, 21000],
  });

  const [, setTrigger] = useState(false);
  const [, setIsSortModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");


  const [filter, setFilter] = useState<IFilterDto>(defaultFilter);

  const [statusData, setStatusData] = useState<statusDataProp[]>([
    {
      icon: <TickIcon className="w-5 h-5" />,
      label: "Closed RFPs",
      value: 5,
      color: "bg-green-500/30",
      textColor: "text-green-900",
    },
    {
      icon: "!",
      label: "Open RFPs",
      value: 12,
      color: "bg-blue-500/30",
      textColor: "text-blue-900"
    },
    {
      icon: "!",
      label: "Under Approval",
      value: 8,
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
      const statusCounts = [0, 0, 0];
      const approvedRequests: any[] = [];

      // Process requests and count statuses
      requests.forEach((request: any) => {
        switch (request.status) {
          case 6:
            statusCounts[0]++;
            if (approvedRequests) {
              approvedRequests.push(request as any);
            }
            break;
          case 5:
            statusCounts[1]++;
            break;
          default:
            statusCounts[2]++;
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
          color: "bg-blue-500/30",
          textColor: "text-blue-900"
        },
        {
          icon: "!",
          label: "Under Approval",
          value: statusCounts[2],
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

      // Update status data with actual values
      setStatusData([
        {
          icon: <TickIcon className="w-5 h-5" />,
          label: "Closed RFPs",
          value: statusCounts[0] || 0,
          color: "bg-green-500/30",
          textColor: "text-green-900",
        },
        {
          icon: "!",
          label: "Open RFPs",
          value: statusCounts[1] || 0,
          color: "bg-blue-500/30",
          textColor: "text-blue-900"
        },
        {
          icon: "!",
          label: "Under Approval",
          value: statusCounts[2] || 0,
          color: "bg-yellow-500/30",
          textColor: "text-yellow-900",
        }
      ]);

      // Update dashboard data
      setDashboardData({
        newRequests: [],
        rfpRequests: approvedRequests,
        totalCount: statusCounts.reduce((a, b) => a + b, 0), // Total all requests
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
    <div className="min-h-screen bg-gray-50">
      {showLoader ? (
        <PageLoader />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <TitleCard trigger={() => setTrigger(true)} />
          </div>

          {/* Main Dashboard Layout */}
          <div className="space-y-8">
            {/* Status Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatusBar statuses={statusData || []} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <BudgetCard budgetDetails={budgetDetails} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <RequestCard
                  labels={['Closed', 'Open', 'Under Approval']}
                  data={requestStatus || [0, 0, 0]}
                  colors={['#10B981', '#3B82F6', '#F59E0B']}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* RFPs Table - Takes 3/4 width */}
              <div className="xl:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <Table 
                    filter={filter} 
                    setFilter={setFilter} 
                    title={"Published RFPs"} 
                    setIsSortModalOpen={setIsSortModalOpen} 
                    columns={commonColumns} 
                    items={dashboardData.rfpRequests || []} 
                    columnLabels={rfp_column_labels} 
                    setIsFilterModalOpen={() => { }} 
                    setSearchQuery={setSearchQuery} 
                    totalCount={20} 
                    type="rfps" 
                    rowNavigationPath="rfps" 
                    trigger={() => setTrigger(true)} 
                  />
                </div>
              </div>

              {/* Right Sidebar - Takes 1/4 width */}
              <div className="xl:col-span-1">
                <div className="space-y-6">
                  {/* Quick Stats Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-semibold">📊</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-700">Total RFPs</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">{requestStatus.reduce((a, b) => a + b, 0)}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-700">Completed</span>
                        </div>
                        <span className="text-xl font-bold text-green-600">{requestStatus[0] || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-700">In Progress</span>
                        </div>
                        <span className="text-xl font-bold text-orange-600">{requestStatus[2] || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-semibold">🔄</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">New RFP created</p>
                          <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">RFP approved</p>
                          <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">RFP under review</p>
                          <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-semibold">⚡</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm font-medium">
                        <span className="mr-2">📝</span>
                        Create New RFP
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                        <span className="mr-2">📊</span>
                        View Reports
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
                        <span className="mr-2">⚙️</span>
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;