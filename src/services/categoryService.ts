import axios from "axios"
import { Urls } from "./ApiConfig"
import { getUserToken } from "../utils/common";

export const getAllCategoriesAsync = async()=>{
    try{
        let response = await axios.get(`${Urls.defaultUrl}/api/Category`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        });
        return response.data;
    }catch(err){

    }
}

export const deleteCategoryAsync = async(id:any)=>{
    try{
        let response = await axios.delete(`${Urls.defaultUrl}/api/Category/${id}`,{
            headers:{
                Authorization:`Bearer ${getUserToken()}`
            }
        });
        return response.data;
    }catch(err){

    }
}

export const createOrUpdateCategoryAsync = async (categoryData: any) => {
  try {
    const response = await axios.post(`${Urls.defaultUrl}/api/Category`, categoryData, {
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};