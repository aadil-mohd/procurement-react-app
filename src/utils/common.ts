import { currencies } from "./constants";
import Cookies from "js-cookie";

export const getUserToken = (): string => {
    let token = Cookies.get("token");
    return token ? token : "";
}

export const convertCurrencyLabel = (currencyType: string) => {
    const type = currencies.find(x => x.value === currencyType);
    return type?.label;
}

export function vendorStatusConverter(code: 0 | 1 | 2): string {
    switch (code) {
        case 0:
            return "pending";
        case 1:
            return "approved";
        case 2:
            return "rejected";
        default:
            return "unknown"; // fallback for unexpected codes
    }
}

export const formatDate = (date: string): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Handle invalid dates

    // Format the date to "yyyy-MM-dd"
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const parseJwt = (token: string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const convertToAmPm = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);

    // Options for formatting time to 12-hour format with AM/PM
    const options: any = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    return date.toLocaleTimeString([], options);
};

export const getUserCredentials = (): { userId: string, roleId: string, name: string, departmentId: string ,companyId:string} => {
    const [userId, roleId, name, departmentId,companyId] = [Cookies.get("userId") as string, Cookies.get("roleId") as string, Cookies.get("name") as string, Cookies.get("departmentId") as string, Cookies.get("companyId") as string]
    return { userId, roleId, name, departmentId ,companyId}
}


export const fetchAndConvertToFile = async (fileUrl: string): Promise<{ document: File, documentName: string }> => {
    console.log(fileUrl, "fileUrl")
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || `downloaded-${Date.now()}`;
    console.log(fileName, "fileName")
    const file = new File([blob], fileName, { type: blob.type });
    return { document: file, documentName: fileName };
};


