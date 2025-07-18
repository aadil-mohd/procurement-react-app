export const currencies = [
    { label: "$", value: "USD" },
    { label: "€", value: "EUR" },
    { label: "£", value: "GBP" },
    { label: "₹", value: "INR" },
]

export const defaultFilter = {
    fields: [],
    pageNo: 0,
    pageSize: 0,
    sortColumn: "CreatedAt",
    sortDirection: "DESC"
}


// rfp column labels for table
export const rfp_column_labels = {
    tenderNumber: 'ID',
    rfpTitle: 'RFP Title',
    buyerName: 'Buyer',
    estimatedContractValueLabel: 'Estd. Con Value',
    status: 'Status',
};

export const costSummuryColumnLabels = {
    categoryName: "Category",
    estimatedAmount: "Amount",
    description: "Description"
}
export const costSummuryColumns = ["categoryName", "estimatedAmount", "description"]

export const quotesColumnLabels = {
    vendorName: "Vendor name",
    amount: "Amount",
    attachmentComponent: "Attachment"
}
export const quotesColumns = ["vendorName", "amount", "attachmentComponent"]


export const project_column_labels = {
    projectId: 'ID',
    projectName: 'Project Name',
    departmentName: 'Department',
    approvedBudgetLabel: 'Approved Budget',
    status: 'Status',
};
// for sorting table
export const rfp_sorting_fields = {
    tenderNumber: 'ID',
    rfpTitle: 'RFP Title',
    buyerName: 'Buyer',
    bidValue: 'Bid Value',
    isOpen: 'Status',
}

export const project_sorting_fields = {
    projectId: 'ID',
    projectName: 'Project Name',
    approvedBudget: 'Approved Budget',
    status: 'Status',
}

export const projectStatuses = [
    { label: "Completed", value: "completed" },
    { label: "On hold", value: "on_hold" },
    { label: "Not started", value: "not_started" },
    { label: "In progress", value: "in_progress" },

]

export const milestoneStatuses = [
    { label: "Completed", value: "completed" },
    { label: "Delayed", value: "delayed" },
    { label: "On track", value: "on_track" },
]

export const rfpStatuses = [
    { label: "pending", value: 0 },
    { label: "approved", value: 1 },
    { label: "rejected", value: 2 },
    { label: "under clarification", value: 3 },
    { label: "under approval", value: 4 },
    { label: "published", value: 5 },
    { label: "closed", value: 6 },
    
]
