import axios from "axios";
import { Urls } from "./ApiConfig";
import { getUserToken } from "../utils/common";

export const getAllVendorsAsync = async (data: any) => {
    try {
        const response = await axios.post(`${Urls.defaultUrl}/api/Vendor/GetAllVendors`, data, {
            headers: {
                Authorization: `Bearer ${getUserToken()}`
            }
        })
        return response.data;
    } catch (err) {

    }
}

export const getVendorsDetailsByIdAsync = async (id:number) => {
    try {
        const response = await axios.get(`${Urls.defaultUrl}/api/Vendor/${id}`, {
            headers: {
                Authorization: `Bearer ${getUserToken()}`
            }
        })
        return response.data;
    } catch (err) {

    }
}