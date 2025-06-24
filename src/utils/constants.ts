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
    rfpTitle: 'Request Name',
    buyerName: 'Buyer',
    bidValueLabel: 'Bid Value',
    isOpen: 'Status',
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
export const capex_sorting_fields = {
    capexId: 'ID',
    projectName: 'Request Name',
    expenditureTypeId: 'Expenditure Type',
    estimatedBudget: 'Estimated Budget',
    requestingDepartmentId: 'Department',
    status: 'Status',
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
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
    { label: "Draft", value: "draft" },
]
