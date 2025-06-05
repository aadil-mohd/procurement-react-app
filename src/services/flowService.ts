import axios from "axios"
import { IFilterDto } from "../types/commonTypes";
import { Urls } from "./ApiConfig";
import { getUserToken } from "../utils/common";
//import { IFlowDetails } from "../types/capexTypes";

  

export const getFlowsByfilterAsync= async (filter : IFilterDto ): Promise<any[]> => {
    try{
        let response = await axios.post(`${Urls.defaultUrl}/api/ApprovalFlows/filter`,filter,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data.data;
    }catch(err:any){
        throw err.response.data
    }
}

export const getApprovalFlowById = async (id:string)=>{
    try{
        let response = await axios.get(`${Urls.defaultUrl}/api/ApprovalFlows/${id}`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data;
        
    }
}

export const createWorkFlowAsync= async (body:any ) => {
    try{
        let response = await axios.post(`${Urls.defaultUrl}/api/ApprovalFlows`,body,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data
    }catch(err:any){
        throw err.response.data
    }
}

export const editWorkFlowAsync= async (body:any,id:string ) => {
    try{
        let response = await axios.put(`${Urls.defaultUrl}/api/ApprovalFlows/${id}`,body,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data
    }catch(err:any){
        throw err.response.data
    }
}

export const deleteWorkFlowAsync= async (id:string ) => {
    try{
        let response = await axios.delete(`${Urls.defaultUrl}/api/ApprovalFlows/${id}`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data
    }catch(err:any){
        throw err.response.data
    }
}




