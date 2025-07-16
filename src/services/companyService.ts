import axios from "axios";
import { getUserToken } from "../utils/common";
import { Urls } from "./ApiConfig";


export const getAllCompaniesAsync = async (data:any = {nameFilter: ""}) => {
    try {
        let response = await axios.post(`${Urls.defaultUrl}/api/Company/GetAllCompanyAsync`,data, {
            headers: {
                Authorization: `Bearer ${getUserToken()}`
            }
        })
        return response.data;

    }catch (err: any) {
        throw err.response.data;
    }
}