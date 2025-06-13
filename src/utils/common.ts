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

export const getUserCredentials = (): { userId: string, roleId: string, name: string, departmentId: string } => {
    const [userId, roleId, name, departmentId] = [Cookies.get("userId") as string, Cookies.get("roleId") as string, Cookies.get("name") as string, Cookies.get("departmentId") as string]
    return { userId, roleId, name, departmentId }
}
