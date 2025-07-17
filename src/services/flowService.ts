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
        let response = await axios.get(`${Urls.defaultUrl}/api/Approvals/ApprovelStepsByVendorIdAsync?vendorId=${id}`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data;
        
    }
}

export const getRpfApprovalFlowsByIdAsync = async (id:string)=>{
    try{
        let response = await axios.get(`${Urls.defaultUrl}/api/Approvals/ApprovelStepsByRfpIdAsync?rfpId=${id}`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data;
        
    }
}

export const getUserPendingApprovalsAsync = async ()=>{
    try{
        let response = await axios.get(`${Urls.defaultUrl}/api/Approvals/GetUserPendingApprovals`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err:any){
        throw err.response.data;
        
    }
}

export const approveVendorAsync= async (data:{stepId:number,approverEmail:string,comments:string,criteriasCheckChanges:any[],vendorId:number} ) => {
    try{
        let response = await axios.post(`${Urls.defaultUrl}/api/Approvals/ApproveStep/${data.stepId}?vendorId=${data.vendorId}&comments=${data.comments?? null}`,data.criteriasCheckChanges,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data
    }catch(err:any){
        throw err.response.data
    }
}

export const rejectVendorAsync= async (data:{stepId:number,approverEmail:string,comments:string,criteriasCheckChanges:any[],vendorId:number} ) => {
    try{
        let response = await axios.post(`${Urls.defaultUrl}/api/Approvals/RejectStep/${data.stepId}?vendorId=${data.vendorId}&comments=${data.comments ?? null}`,data.criteriasCheckChanges,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data
    }catch(err:any){
        throw err.response.data
    }
}



