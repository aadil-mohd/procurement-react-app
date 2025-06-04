import axios from "axios";
import { Urls } from "./ApiConfig";
import { getUserToken } from "../utils/common";
import { IDepartment } from "../types/departmentTypes";
import { IFilterDto } from "../types/commonTypes";

export const getAllDepartmentsAsync=async(filterData:IFilterDto = {fields:[]}):Promise<{data:IDepartment[]; count:number}>=>{
    try{
        let response = await axios.post(`${Urls.defaultUrl}/api/departments/filter`,filterData,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data
    }
}

export const createDepartmentAsync = async(data:IDepartment) : Promise<IDepartment>=>{
    try{
        const response = await axios.post(`${Urls.defaultUrl}/api/departments`,data,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data
    }
}


export const updateDepartmentAsync = async(id:string,department:IDepartment):Promise<boolean>=>{
    try{
        let response = await axios.put(`${Urls.defaultUrl}/api/departments/${id}`,department,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
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
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data
    }
}