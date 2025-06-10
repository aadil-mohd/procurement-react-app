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