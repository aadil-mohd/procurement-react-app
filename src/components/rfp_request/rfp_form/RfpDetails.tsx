import React, { SetStateAction } from "react";
import SelectField from "../../basic_components/SelectField";
import { currencies, currenciesWithLabel } from "../../../utils/constants";
import { convertCurrencyLabel, convertCurrencyWithLabel } from "../../../utils/common";
import TextField from "../../basic_components/TextField";

interface RfpDetailsProps {
  requestData: any;
  setRequestData: React.Dispatch<SetStateAction<any>>;
  masterData: any;
}

const RfpDetails: React.FC<RfpDetailsProps> = ({
  requestData,
  setRequestData,
}) => {
  const yesNoOptions: { label: string; value: any }[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  return (
    <div className="p-6">
      {/* Left Title + Right Form */}
      <div className="flex items-start gap-4">
        {/* Section Label */}
        <div className="w-[300px]">
          <h2 className="text-lg font-semibold">RFP Details</h2>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="flex flex-col items-start w-full max-w-[400px]">
            {/* Serial or Parallel */}
            <div className="w-full mb-8">
              <label className="block text-sm font-medium mb-2">Serial or Parallel</label>
              <div className="flex space-x-4">
                {[{ title: 'Serial', value: true }, { title: 'Parallel', value: false }].map((option, i) => (
                  <label key={i} className="flex items-center">
                    <input
                      type="radio"
                      name="isSerial"
                      checked={requestData.isSerial === option.value}
                      onChange={() =>
                        setRequestData((prev: any) => ({
                          ...prev,
                          isSerial: option.value,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">{option.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                RFP Currency <span className="text-red-500">*</span>
              </label>
              <SelectField
                id="rfpCurrency"
                label=""
                style="w-full"
                value={
                  convertCurrencyWithLabel(
                    currenciesWithLabel.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD"
                  ) as string
                }
                options={(currenciesWithLabel || []).map((x) => ({
                  label: <span className="text-md font-medium">{x.label}</span>,
                  value: x.value,
                }))}
                onChange={(selectedValue) =>
                  setRequestData((prev: any) => ({
                    ...prev,
                    rfpCurrency: selectedValue,
                  }))
                }
              />
            </div>

            {/* Tender Fee */}
            {requestData?.isTenderFeeApplicable && <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Tender Fee <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="border border-gray-300 rounded px-3 py-2 h-[34px] flex items-center bg-white text-sm">
                  {convertCurrencyLabel(
                    currencies.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD"
                  )}
                </div>
                <div className="ml-2 flex-1">
                  <TextField
                    required={true}
                    style=""
                    id="tenderFee"
                    field="tenderFee"
                    value={requestData.tenderFee ?? ""}
                    setValue={(value) =>
                      setRequestData((prev: any) => ({
                        ...prev,
                        tenderFee: value,
                      }))
                    }
                    placeholder="Enter amount"
                    type="number"
                  />
                </div>
              </div>
            </div>}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-start w-full max-w-[400px]">
            {/* Bid Amount */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Bid Amount <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="border border-gray-300 rounded px-3 py-2 h-[34px] flex items-center bg-white text-sm">
                  {convertCurrencyLabel(
                    currencies.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD"
                  )}
                </div>
                <div className="ml-2 flex-1">
                  <TextField
                    required={true}
                    style=""
                    id="bidValue"
                    field="bidValue"
                    value={requestData.bidValue ?? ""}
                    setValue={(value) =>
                      setRequestData((prev: any) => ({
                        ...prev,
                        bidValue: value,
                      }))
                    }
                    placeholder="Enter amount"
                    type="number"
                  />
                </div>
              </div>
            </div>

            {/* Estimated Contract Value */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Estimated Contract Value <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="border border-gray-300 rounded px-3 py-2 h-[34px] flex items-center bg-white text-sm">
                  {convertCurrencyLabel(
                    currencies.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD"
                  )}
                </div>
                <div className="ml-2 flex-1">
                  <TextField
                    required={true}
                    style=""
                    id="estimatedContractValue"
                    field="estimatedContractValue"
                    value={requestData.estimatedContractValue ?? ""}
                    setValue={(value) =>
                      setRequestData((prev: any) => ({
                        ...prev,
                        estimatedContractValue: value,
                      }))
                    }
                    placeholder="Enter amount"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-start w-full max-w-[400px]">
            {/* Hide Contract Value From Vendor */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Hide Contract Value From Vendor <span className="text-red-500">*</span>
              </label>
              <SelectField
                id="hideContractValueFromVendor"
                label=""
                style="w-full"
                value={
                  yesNoOptions.find((x) => x.value === requestData?.hideContractValueFromVendor)
                    ?.label as string
                }
                options={yesNoOptions.map((x) => ({
                  label: x.label,
                  value: x.value,
                }))}
                onChange={(selectedValue) =>
                  setRequestData((prev: any) => ({
                    ...prev,
                    hideContractValueFromVendor: selectedValue,
                  }))
                }
              />
            </div>

            {/* Is Tender Fee Applicable */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-2">
                Is Tender Fee Applicable <span className="text-red-500">*</span>
              </label>
              <SelectField
                id="isTenderFeeApplicable"
                label=""
                style="w-full"
                value={
                  yesNoOptions.find((x) => x.value === requestData?.isTenderFeeApplicable)
                    ?.label as string
                }
                options={yesNoOptions.map((x) => ({
                  label: <span className="text-md font-medium">{x.label}</span>,
                  value: x.value,
                }))}
                onChange={(selectedValue) =>
                  setRequestData((prev: any) => ({
                    ...prev,
                    isTenderFeeApplicable: selectedValue,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfpDetails;
