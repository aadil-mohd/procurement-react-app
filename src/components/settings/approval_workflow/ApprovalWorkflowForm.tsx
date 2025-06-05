import React, {  useState, useEffect } from 'react';
import TextField from '../../basic_components/TextField';
// import SelectField from '../../basic_components/SelectField';
import { IFilterDto, IModalProps } from '../../../types/commonTypes';
import ApproverSearchDropdown from './ApproverSearchDropdown';
import { IUserDetails } from '../../../types/userTypes';
import { notification } from 'antd';
import { createWorkFlowAsync, editWorkFlowAsync } from '../../../services/flowService';
import { Loader2 } from 'lucide-react';

interface ApprovalflowUsers {
    priority: number;
    userId: string;
}

interface ApprovalFlowData {
    flowName: string;
    expendituretypeId: string;
    departmentId: string;
    budgetedType: boolean;
    minAmount: string;
    maxAmount: string;
    currency: string;
    approvalflowUsers: ApprovalflowUsers[];
}

interface FormErrors {
    flowName?: string;
    expendituretypeId?: string;
    departmentId?: string;
    minAmount?: string;
    maxAmount?: string;
    approvalflowUsers?: string[];
}

interface IApprovalWorkflowForm extends IModalProps {
    type?: "edit" | "create";
    initialData?: any;
    onSubmit?: (data: ApprovalFlowData) => void;
}

const defaultFilter = {
    fields: [],
    pageNo: 1,
    pageSize: 10,
    sortColumn: "CreatedAt",
    sortOrder: "DESC"
}

const ApprovalWorkflowForm: React.FC<IApprovalWorkflowForm> = ({
    type = "create",
    initialData,
    trigger,
    closeModal
}) => {
    const [formData, setFormData] = useState<ApprovalFlowData>({
        flowName: initialData?.flowName || "",
        expendituretypeId: initialData?.expendituretypeId || "",
        departmentId: initialData?.departmentId || "",
        budgetedType: true,
        currency: initialData?.currency || "USD",
        minAmount: initialData?.minAmount.toString() || "",
        maxAmount: initialData?.maxAmount.toString() || "",
        approvalflowUsers: initialData?.flowUsers || []
    });
    const [errors, setErrors] = useState<FormErrors>({});
    // const { expenditureTypes, departments } : { expenditureTypes:any[], departments:any[] } = { expenditureTypes:[], departments:[] };

    const [isLoading, setIsLoading] = useState(false);
    const [isButtonLoading, setIsButtonnLoading] = useState(false);
    const [approversList, setApproversList] = useState<IUserDetails[]>();
    const [searchQuery, setSearchQuery] = useState("");
    const [approverSelected, setApproverSelected] = useState(true);


    useEffect(() => {
        handleSearch()
    }, [searchQuery])

    const handleSearch = async () => {
        const updatedFilter = {
            ...defaultFilter,
            globalSearch: searchQuery
        };
        await getApproversFilter(updatedFilter);
    };

    const getApproversFilter = async (filterDto: IFilterDto = defaultFilter) => {
        try {
            setIsLoading(true);
            let approvers = {data:[]};;
            setApproversList(approvers.data);
            // setTrigger(false);
        } catch (err: any) {
            notification.error({
                message: "error fetching users",
                description: err.message
            })
        } finally {
            setIsLoading(false);
        }
    };


    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.flowName.trim()) {
            newErrors.flowName = "Flow name is required";
        }
        if (!formData.expendituretypeId) {
            newErrors.expendituretypeId = "Expenditure type is required";
        }
        if (!formData.departmentId) {
            newErrors.departmentId = "Department is required";
        }
        if (!formData.minAmount || !formData.maxAmount) {
            newErrors.minAmount = "Budget range is required";
        }
        if (formData.minAmount && formData.maxAmount &&
            Number(formData.minAmount) > Number(formData.maxAmount)) {
            newErrors.minAmount = "Minimum amount cannot be greater than maximum amount";
        }
        if (!formData.approvalflowUsers || formData.approvalflowUsers.length == 0) {
            newErrors.approvalflowUsers = ["At least one approver is required"];
        }

        formData.approvalflowUsers.forEach(u => { if (!u.userId) newErrors.approvalflowUsers = ["At least one approver is required"]; })

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                if (formData.approvalflowUsers.length == 0) return;
                setIsButtonnLoading(true);
                if (type == "create") {
                    console.log(formData)
                    let response = await createWorkFlowAsync(formData)
                    console.log(response)
                    if (response) {
                        notification.success({
                            message: "workflow created successfully",
                        })
                    }
                } else {
                    if (initialData) {
                        let response = await editWorkFlowAsync(formData, initialData.id)
                        console.log(response)
                        notification.success({
                            message: "workflow updated successfully"
                        })
                    }
                }
                trigger();
                closeModal();

            } catch (error: any) {
                console.log(error);
                notification.error({
                    message: `Workflow not ${type == "create" ? "created" : "updated"}`,
                    description: error.message
                })

            } finally {
                setIsButtonnLoading(false);
            }
        }
    };

    const addApprover = () => {

        setApproverSelected(false);
        setFormData(prev => ({
            ...prev,
            approvalflowUsers: [
                ...prev.approvalflowUsers,
                {
                    priority: prev.approvalflowUsers.length + 1,
                    userId: ""
                }
            ]
        }));
    };

    const removeApprover = (index: number) => {
        setApproverSelected(true)
        setFormData(prev => ({
            ...prev,
            approvalflowUsers: prev.approvalflowUsers
                .filter((_, i) => i !== index)
                .map((approver, i) => ({
                    ...approver,
                    priority: i + 1
                }))
        }));
    };

    // const handleAmountChange = (value: string, field: 'minAmount' | 'maxAmount') => {
    //     // Only allow numbers and decimal point
    //     const sanitizedValue = value.replace(/[^\d.]/g, '');
    //     // Ensure only one decimal point
    //     const parts = sanitizedValue.split('.');
    //     const formattedValue = parts.length > 2 ? `${parts[0]}.${parts[1]}` : sanitizedValue;

    //     setFormData(prev => ({ ...prev, [field]: formattedValue }));
    //     // Clear related errors
    //     setErrors(prev => ({ ...prev, [field]: undefined }));
    // };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded">
            {/* Fixed Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b">
                <p className="text-xl font-bold">
                    {type === "create" ? "Add new flow" : "Edit flow"}
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {/* Flow Name */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Flow name <span className="text-red-500">*</span>
                    </label>
                    <TextField
                        id="flowName"
                        field="Flow Name"
                        value={formData.flowName}
                        setValue={(value) => {
                            setFormData(prev => ({ ...prev, flowName: value }));
                            setErrors(prev => ({ ...prev, flowName: undefined }));
                        }}
                        placeholder="Enter flow name"
                        style=""
                        type="text"
                        width="w-full"
                    />
                    {errors.flowName && (
                        <p className="text-red-500 text-xs mt-1">{errors.flowName}</p>
                    )}
                </div>

                {/* Expenditure Type
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Expenditure type <span className="text-red-500">*</span>
                    </label>
                    {expenditureTypes && (
                        <SelectField
                            id="expendituretypeId"
                            label=""
                            style="w-full h-10"
                            value={expenditureTypes?.find(t => t.id === formData.expendituretypeId)?.expenditureType || "Select expenditure type"}
                            options={expenditureTypes?.map(t => ({
                                label: t.expenditureType || "",
                                value: t.id || ""
                            }))}
                            onChange={(value) => {
                                setFormData(prev => ({ ...prev, expendituretypeId: value }));
                                setErrors(prev => ({ ...prev, expendituretypeId: undefined }));
                            }}
                            onClick={() => setErrors(prev => ({ ...prev, expendituretypeId: undefined }))}
                        />
                    )}
                    {errors.expendituretypeId && (
                        <p className="text-red-500 text-xs mt-1">{errors.expendituretypeId}</p>
                    )}
                </div> */}

                {/* Department
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Department <span className="text-red-500">*</span>
                    </label>
                    {departments && (
                        <SelectField
                            id="departmentId"
                            label=""
                            style="w-full h-10"
                            value={departments.find(d => d.id === formData.departmentId)?.departmentName || "Select department"}
                            options={departments.map(d => ({
                                label: d.departmentName || "",
                                value: d.id || ""
                            }))}
                            onChange={(value) => {
                                setFormData(prev => ({ ...prev, departmentId: value }));
                                setErrors(prev => ({ ...prev, departmentId: undefined }));
                            }}
                            onClick={() => setErrors(prev => ({ ...prev, departmentId: undefined }))}
                        />
                    )}
                    {errors.departmentId && (
                        <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>
                    )}
                </div> */}

                {/* Budgeted Toggle */}
                <div>
                    {/* <div className="flex items-center justify-start">
                        <label className="block text-sm font-medium mr-2">Budgeted</label>
                        <button
                            disabled
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, budgetedType: !prev.budgetedType }))}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${formData.budgetedType ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.budgetedType ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div> */}
                </div>

                {/* Budget Range 
                <div>
                    <label className="block text-sm font-medium mb-2">Budget Range</label>
                    <div className="flex gap-2 items-center">
                        <div className="">
                            <div className="relative bg-white border border-gray-300 rounded px-3 py-2 cursor-default text-sm flex items-center justify-between h-[34px]">
                                <span>{"USD"}</span>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="m6 9 6 6 6-6" />
                  </svg> 
                            </div>
                        </div>
                        <TextField
                            id="minAmount"
                            field="Budget From"
                            value={formData.minAmount}
                            setValue={(value) => handleAmountChange(value, 'minAmount')}
                            placeholder="From"
                            style=""
                            type="number"
                            width="w-full"
                        />
                        <span className="text-sm">To</span>
                        <TextField
                            id="maxAmount"
                            field="Budget To"
                            value={formData.maxAmount}
                            setValue={(value) => handleAmountChange(value, 'maxAmount')}
                            placeholder="To"
                            style=""
                            type="number"
                            width="w-full"
                        />
                    </div>
                    {errors.minAmount && (
                        <p className="text-red-500 text-xs mt-1">{errors.minAmount}</p>
                    )}
                </div> */}

                {/* Approval Workflow */}
                <div className="space-y-2">
                    <label className="block text-[16px] font-semibold">Approval Hierarchy</label>
                    {errors.approvalflowUsers && (
                        <p className="text-red-500 text-xs mt-1">{errors.approvalflowUsers}</p>
                    )}
                    <div className="space-y-8">
                        {formData.approvalflowUsers.map((approver, index) => (
                            <div key={index} className="relative">
                                <div className="shadow-lg rounded-lg bg-white p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm text-gray-600">Approver {index + 1}</p>
                                        <button
                                            type="button"
                                            onClick={() => removeApprover(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    {approversList && <ApproverSearchDropdown setApproverSelected={setApproverSelected} formData={formData} isLoading={isLoading} setFormData={setFormData} approvers={approversList} setSearchQuery={setSearchQuery} index={index} currentValue={approver.userId} />}
                                </div>

                                {(approverSelected ? (index < formData.approvalflowUsers.length) : (index < formData.approvalflowUsers.length - 1)) && (
                                    <div className="absolute left-1/2 -translate-x-1/2 h-8 flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                            <path
                                                d="M12 4L12 20M12 20L6 14M12 20L18 14"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}

                        {approverSelected && <button
                            type="button"
                            onClick={addApprover}
                            className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto hover:bg-blue-600 transition-colors shadow-lg"
                        >
                            <span className="text-md text-center">+</span>
                        </button>}
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 border-t bg-white p-4 mt-auto">
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-sm text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {isButtonLoading ? <Loader2 /> : type === "edit" ? "Update" : "Submit"}
                    </button>
                    <button
                        type="button"
                        onClick={() => closeModal()}
                        className="px-4 py-2 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ApprovalWorkflowForm;