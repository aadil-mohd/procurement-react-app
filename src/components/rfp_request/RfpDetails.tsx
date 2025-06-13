import React, { SetStateAction } from "react";
import SelectField from "../basic_components/SelectField";
import { currencies } from "../../utils/constants";
import { convertCurrencyLabel } from "../../utils/common";
import TextField from "../basic_components/TextField";
import PeoplePicker from "../basic_components/PeoplePicker";

interface RfpDetailsProps {
  requestData: any
  setRequestData: React.Dispatch<SetStateAction<any>>;
  masterData: any
}

const RfpDetails: React.FC<RfpDetailsProps> = ({
  requestData,
  setRequestData,
  masterData
}) => {


  return (
    <div className="p-2 w-[484px]">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Closed or Open</label>
        <div className="flex space-x-4">
          {[{ title: 'Open', value: true }, { title: 'Closed', value: false }].map((option, i) => (
            <label key={i} className="flex items-center">
              <input
                type="radio"
                name="isOpen"
                value={requestData.isOpen}
                checked={requestData.isOpen === option.value}
                onChange={(e) => setRequestData((prev: any) => ({ ...prev, isOpen: option.value }))}
                className="mr-2"
              />
              <span className="text-sm">{option.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Serial or Parallel</label>
        <div className="flex space-x-4">
          {[{ title: 'Serial', value: true }, { title: 'Parallel', value: false }].map((option, i) => (
            <label key={i} className="flex items-center">
              <input
                type="radio"
                name="isSerial"
                value={requestData.isSerial}
                checked={requestData.isSerial === option.value}
                onChange={(e) => setRequestData((prev: any) => ({ ...prev, isSerial: option.value }))}
                className="mr-2"
              />
              <span className="text-sm">{option.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Currency Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Currency<span className="text-red-500">*</span>
        </label>
        <SelectField
          id="rfpCurrency"
          label=""
          style="w-full"
          //disabled={!requestData?.requestingDepartmentId} // simplified check
          value={convertCurrencyLabel(currencies?.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD") as string}

          options={(currencies || []).map((x) => ({
            label: (
              <div>
                <span className="text-md font-medium">{x.label}</span><br />
                {/* <span className="text-sm text-gray-500">{x.email}</span> */}
              </div>
            ), // Combine name and email into one string with a line break
            value: x.value // Store multiple values as a stringified array
          }))}

          onChange={(selectedValue) => {
            setRequestData((prev: any) => ({
              ...prev,
              rfpCurrency: selectedValue
            }));
          }}
        />
      </div>

      {/* Currency Dropdown */}
      <div className="mb-4">
        {/* Currency Dropdown */}
        <label className="block text-sm font-medium mb-2">
          Bid Amount <span className="text-red-500">*</span>
        </label>
        <div className="flex mb-2">
          <div className="">
            <div className="relative bg-white border border-gray-300 rounded px-3 py-2 cursor-default text-sm flex items-center justify-between h-[34px]">
              <span>{convertCurrencyLabel(currencies?.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD") as string}</span>
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="m6 9 6 6 6-6" />
                  </svg> */}
            </div>
            {/* {errors.currency && <p className="text-red-500 text-xs">{errors.currency}</p>} */}
          </div>

          <div className="ml-2 flex-1">
            <div className="">
              <TextField
                id="bidValue"
                // onFocus={() => {
                //   setErrors((prev) => ({ ...prev, estimatedBudget: "" }));
                // }}
                field="bidValue"
                value={requestData.bidValue ?? ""} // Use nullish coalescing instead of logical OR
                setValue={(value) => setRequestData((prev: any) => ({
                  ...prev,
                  bidValue: value
                }))}
                placeholder="Enter amount"
                type="number"
                style=""
              //disabled={!requestData.requestingDepartmentId || !requestData.expenditureTypeId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* HideContractValueFromVendor */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Hide Contract Value From Vendor<span className="text-red-500">*</span>
        </label>
        <SelectField
          id="hideContractValueFromVendor"
          label=""
          style="w-full"
          //disabled={!requestData?.requestingDepartmentId} // simplified check
          value={[{ label: "Yes", value: true }, { label: "No", value: false }].find(x => x.value == requestData?.hideContractValueFromVendor)?.label as any}

          options={([{ label: "Yes", value: true }, { label: "No", value: false }] as any).map((x: any) => ({
            label: (
              <div>
                <span className="text-md font-medium">{x.label}</span><br />
                {/* <span className="text-sm text-gray-500">{x.email}</span> */}
              </div>
            ), // Combine name and email into one string with a line break
            value: x.value // Store multiple values as a stringified array
          }))}

          onChange={(selectedValue) => {
            setRequestData((prev: any) => ({
              ...prev,
              hideContractValueFromVendor: selectedValue
            }));
          }}
        />
      </div>

      {/* Currency Dropdown */}
      <div className="mb-4">
        {/* Currency Dropdown */}
        <label className="block text-sm font-medium mb-2">
          Estimated Contract Value <span className="text-red-500">*</span>
        </label>
        <div className="flex mb-2">
          <div className="">
            <div className="relative bg-white border border-gray-300 rounded px-3 py-2 cursor-default text-sm flex items-center justify-between h-[34px]">
              <span>{convertCurrencyLabel(currencies?.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD") as string}</span>
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="m6 9 6 6 6-6" />
                  </svg> */}
            </div>
            {/* {errors.currency && <p className="text-red-500 text-xs">{errors.currency}</p>} */}
          </div>

          <div className="ml-2 flex-1">
            <div className="">
              <TextField
                id="estimatedContractValue"
                // onFocus={() => {
                //   setErrors((prev) => ({ ...prev, estimatedBudget: "" }));
                // }}
                field="estimatedContractValue"
                value={requestData.estimatedContractValue ?? ""} // Use nullish coalescing instead of logical OR
                setValue={(value) => setRequestData((prev: any) => ({
                  ...prev,
                  estimatedContractValue: value
                }))}
                placeholder="Enter amount"
                type="number"
                style=""
              //disabled={!requestData.requestingDepartmentId || !requestData.expenditureTypeId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* IsTenderFeeApplicable */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Is Tender Fee Applicable<span className="text-red-500">*</span>
        </label>
        <SelectField
          id="isTenderFeeApplicable"
          label=""
          style="w-full"
          //disabled={!requestData?.requestingDepartmentId} // simplified check
          value={[{ label: "Yes", value: true }, { label: "No", value: false }].find(x => x.value == requestData?.isTenderFeeApplicable)?.label as any}

          options={([{ label: "Yes", value: true }, { label: "No", value: false }] as any).map((x: any) => ({
            label: (
              <div>
                <span className="text-md font-medium">{x.label}</span><br />
                {/* <span className="text-sm text-gray-500">{x.email}</span> */}
              </div>
            ), // Combine name and email into one string with a line break
            value: x.value // Store multiple values as a stringified array
          }))}

          onChange={(selectedValue) => {
            setRequestData((prev: any) => ({
              ...prev,
              isTenderFeeApplicable: selectedValue
            }));
          }}
        />
      </div>

      {/* Currency Dropdown */}
      <div className="mb-4">
        {/* Currency Dropdown */}
        <label className="block text-sm font-medium mb-2">
          Estimated Contract Value <span className="text-red-500">*</span>
        </label>
        <div className="flex mb-2">
          <div className="">
            <div className="relative bg-white border border-gray-300 rounded px-3 py-2 cursor-default text-sm flex items-center justify-between h-[34px]">
              <span>{convertCurrencyLabel(currencies?.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD") as string}</span>
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="m6 9 6 6 6-6" />
                  </svg> */}
            </div>
            {/* {errors.currency && <p className="text-red-500 text-xs">{errors.currency}</p>} */}
          </div>

          {/* Tender Fee */}
          <div className="ml-2 flex-1">
            <div className="">
              <TextField
                id="tenderFee"
                // onFocus={() => {
                //   setErrors((prev) => ({ ...prev, estimatedBudget: "" }));
                // }}
                field="tenderFee"
                value={requestData.tenderFee ?? ""} // Use nullish coalescing instead of logical OR
                setValue={(value) => setRequestData((prev: any) => ({
                  ...prev,
                  tenderFee: value
                }))}
                placeholder="Enter amount"
                type="number"
                style=""
              //disabled={!requestData.requestingDepartmentId || !requestData.expenditureTypeId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfpDetails;
