import React, { SetStateAction } from "react";
import SelectField from "../../basic_components/SelectField";
import { currencies } from "../../../utils/constants";
import { convertCurrencyLabel } from "../../../utils/common";
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
  const yesNoOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  return (
    <div className="p-2 w-full">
      <div className="grid grid-cols-2 gap-x-6 gap-y-6">

        {/* Closed or Open */}
        <div>
          <label className="block text-sm font-medium mb-2">Closed or Open</label>
          <div className="flex space-x-4">
            {[{ title: 'Open', value: true }, { title: 'Closed', value: false }].map((option, i) => (
              <label key={i} className="flex items-center">
                <input
                  type="radio"
                  name="isOpen"
                  checked={requestData.isOpen === option.value}
                  onChange={() =>
                    setRequestData((prev: any) => ({
                      ...prev,
                      isOpen: option.value,
                    }))
                  }
                  className="mr-2"
                />
                <span className="text-sm">{option.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Serial or Parallel */}
        <div>
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
        <div>
          <label className="block text-sm font-medium mb-2">
            Currency <span className="text-red-500">*</span>
          </label>
          <SelectField
            id="rfpCurrency"
            label=""
            style="w-full"
            value={
              convertCurrencyLabel(
                currencies.find((x) => x.value === requestData?.rfpCurrency)?.value || "USD"
              ) as string
            }
            options={(currencies || []).map((x) => ({
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

        {/* Bid Amount */}
        <div>
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

        {/* Hide Contract Value From Vendor */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hide Contract Value From Vendor <span className="text-red-500">*</span>
          </label>
          <SelectField
            id="hideContractValueFromVendor"
            label=""
            style="w-full"
            value={yesNoOptions.find((x) => x.value === requestData?.hideContractValueFromVendor)?.label}
            options={yesNoOptions.map((x) => ({
              label: <span className="text-md font-medium">{x.label}</span>,
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

        {/* Estimated Contract Value */}
        <div>
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

        {/* Is Tender Fee Applicable */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Is Tender Fee Applicable <span className="text-red-500">*</span>
          </label>
          <SelectField
            id="isTenderFeeApplicable"
            label=""
            style="w-full"
            value={yesNoOptions.find((x) => x.value === requestData?.isTenderFeeApplicable)?.label}
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

        {/* Tender Fee */}
        <div>
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
        </div>

      </div>
    </div>
  );
};

export default RfpDetails;
