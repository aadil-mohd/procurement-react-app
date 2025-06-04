import axios from "axios";
import { Urls } from "./ApiConfig";
//import { getUserToken } from "../utils/common";
import { IDepartment } from "../types/departmentTypes";
import { IFilterDto } from "../types/commonTypes";
const tk = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYXVmYWl0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsInRlbmFudElkIjoiMSIsImNvbXBhbnlJZCI6IjEiLCJicmFuY2hJZCI6IjEiLCJQZXJtaXNzaW9uIjpbIkNhbkNyZWF0ZUNhdGVnb3J5IiwiQ2FuRWRpdENhdGVnb3J5IiwiQ2FuRGVsZXRlQ2F0ZWdvcnkiLCJDYW5WaWV3Q2F0ZWdvcnkiLCJDYW5DcmVhdGVVc2VyIl0sImV4cCI6MTc0OTAzNzczNiwiaXNzIjoiUHJvY3VybWVudE1hbmFnZW1lbnRTeXN0ZW0iLCJhdWQiOiJQcm9jdXJtZW50VXNlcnMifQ.E8T9U5xi8El67kQaVtxy67C5IeYac55CdqqkJZM74_E";
export const getAllDepartmentsAsync=async(filterData:IFilterDto = {fields:[]}):Promise<{data:IDepartment[]; count:number}>=>{
    try{
        let response = await axios.post(`${Urls.defaultUrl}/api/Department/GetAllDepartmentAsync`,filterData,{
            headers:{
                //Authorization:`Bearer ${getUserToken()}`
                Authorization:tk
            }
        })
        return {data:response.data,count:response.data.length};
    }catch(err:any){
        throw err.response.data
    }
}

export const createDepartmentAsync = async(data:IDepartment) : Promise<IDepartment>=>{
    try{
        const response = await axios.post(`${Urls.defaultUrl}/api/Department`,{id:0,...data},{
            headers:{
                //Authorization:`Bearer ${getUserToken()}`
                Authorization:tk
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data
    }
}


export const updateDepartmentAsync = async(id:string,department:IDepartment):Promise<boolean>=>{
    try{
        const response = await axios.post(`${Urls.defaultUrl}/api/Department`,{...department,id:id},{
            headers:{
                //Authorization:`Bearer ${getUserToken()}`
                Authorization:tk
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data
    }
}

export const deleteDepartmentAsync = async(id:string)=>{
    try{
        const response = await axios.delete(`${Urls.defaultUrl}/api/departments/${id}`,{
            headers:{
                //Authorization:`Bearer ${getUserToken()}`
                Authorization:tk
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data
    }
}