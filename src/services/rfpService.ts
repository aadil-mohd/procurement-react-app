import axios from "axios"
import { Urls } from "./ApiConfig"
import { getUserToken } from "../utils/common"
import { IFilterDto } from "../types/commonTypes"

export const createOrUpdateRfpAsync = async(data:any)=>{
    try{
        const response = await axios.post(`${Urls.defaultUrl}/api/Rfps`,data,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const getRfpByIdAsync = async(id:number)=>{
    try{
        const response = await axios.get(`${Urls.defaultUrl}/api/Rfps/${id}`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err){
        console.log(err);
    }
}

export const getAllRfpsByFilterAsync = async(filterDto:IFilterDto)=>{
    try{
        const response = await axios.post(`${Urls.defaultUrl}/api/Rfps/filter`,filterDto,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        })
        return response.data;
    }catch(err){
        console.log(err);
    }
}