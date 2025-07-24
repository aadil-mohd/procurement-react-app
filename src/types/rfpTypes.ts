export interface IRfp {
    id?: number
    rfpTitle?: string
    rfpDescription?: string
    buyerName?: string
    buyer?: any
    buyerOrganizationName?: string
    departmentId?: number
    isOpen?: false
    isSerial?: false
    rfpCurrency?: string
    bidValue?: number
    hideContractValueFromVendor?: false
    estimatedContractValue?: number
    isTenderFeeApplicable?: false
    tenderFee?: number
    categoryId?: number
    purchaseRequisitionId?: string
    expressInterestLastDate?: string
    responseDueDate?: string
    buyerReplyEndDate?: string
    clarificationDate?: string
    closingDate?: string
    closingTime?: string
    rfpDocuments: any[]
    rfpTechnicalDocuments?:any[]
    rfpGeneralDocuments?:any[]
    rfpOwners: any[],
    rfpCategories:any[]
}