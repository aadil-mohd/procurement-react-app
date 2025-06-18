import axios from "axios"
import { Urls } from "./ApiConfig";
import { getUserToken } from "../utils/common";
//import { IFlowDetails } from "../types/capexTypes";

  

export const getApprovalFlowAsync= async (): Promise<any> => {
    try{
        let response = await axios.get(`${Urls.defaultUrl}/api/Approvals/flow`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
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
        console.log(body,"body==")
        let response = await axios.post(`${Urls.defaultUrl}/api/Approvals/CreateApprovalFlowAsync`,body,{
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

export const getVendorApprovalFlowsByVendorIdAsync = async (id:string)=>{
    try{
        let response = await axios.get(`${Urls.defaultUrl}/api/Approvals/ApproveStepByVendorIdAsync?vendorId=${id}`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data;
        
    }
}



