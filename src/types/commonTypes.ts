import { JSX } from "react"

export interface ColumnData{
    columnName:string,
    operator?:string | undefined
    value:string | number | Date | null | undefined | boolean
}

export interface IFilterDto{
    fields:ColumnData[]
    sortOrder?:string | undefined
    sortColumn?:string | undefined
    pageNo?:number
    pageSize?:number
    globalSearch?:string
}

export interface statusDataProp {
    icon: JSX.Element | string,
    label: string,
    value: number,
    color: string,
    textColor: string,
}

export interface IModalProps{
    closeModal: () => void;
    trigger: ()=>void
}

export interface SuccessResponse{
    status:boolean,
    message:string
}

export interface ErrorResponse{
    statusCode:number
    status:boolean,
    message:string
}

export interface INotificationItem {
    id: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    clientId: string;
    capexRequestId: string;
    projectName: string;
    expenditureType: string;
    departmentName: string;
    currency: string;
    estimatedBudget: number;
    status: string;
    priority: string;
    isRead: boolean;
    isArchived: boolean;
  }

  export interface ICountryCode {
    id: string;
    countryName: string,
    code: string;
    countryCode: string;
    currency: string;
    currencyLabel: string;
}



