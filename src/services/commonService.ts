import axios from "axios";
import { getUserToken } from "../utils/common";
import { Urls } from "./ApiConfig";


export const getAllCountryCodes = async () => {
    try {
        let response = await axios.get(`${Urls.defaultUrl}/api/Common/GetAllCountry`, {
            headers: {
                Authorization: `Bearer ${getUserToken()}`
            }
        })
        return response.data;

    }catch (err: any) {
        throw err.response.data;
    }
}

export const getAllDocumentTypesAsync = async () => {
    try {
        let response = await axios.get(`${Urls.defaultUrl}/api/Common/GetAllDocumentTypeAsync`, {
            headers: {
                Authorization: `Bearer ${getUserToken()}`
            }
        })
        return response.data;

    }catch (err: any) {
        throw err.response.data;
    }
}