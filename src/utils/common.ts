import { currencies } from "./constants";

export const getUserToken = (): string => {
    let token = localStorage.getItem("auth_token");
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

export const fetchAndConvertToFile = async (fileUrl: string): Promise<{ document: File, documentName: string }> => {
    console.log(fileUrl,"fileUrl")
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || `downloaded-${Date.now()}`;
    console.log(fileName, "fileName")
    const file = new File([blob], fileName, { type: blob.type });
    return { document: file, documentName: fileName };
};


