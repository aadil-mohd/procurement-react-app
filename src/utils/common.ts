import { currencies } from "./constants";

export const getUserToken = (): string => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYXVmYWl0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsInRlbmFudElkIjoiMSIsImNvbXBhbnlJZCI6IjEiLCJicmFuY2hJZCI6IjEiLCJleHAiOjE3NDc5MTUwMzQsImlzcyI6IlByb2N1cm1lbnRNYW5hZ2VtZW50U3lzdGVtIiwiYXVkIjoiUHJvY3VybWVudFVzZXJzIn0.5o50jsFJN_OUh2t8n-5grQq2EJapaa-dDNzIDvq_jTY";
    return token ? token : "";
}

export const convertCurrencyLabel = (currencyType: string) => {
    const type = currencies.find(x => x.value === currencyType);
    return type?.label;
  }
  