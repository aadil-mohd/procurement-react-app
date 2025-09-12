import CreateButton from "../buttons/CreateButton";
import { useNavigate } from "react-router-dom";
import { getUserCredentials } from "../../utils/common";
import { useEffect } from "react";

const TitleCard = ({ trigger }: { trigger: () => void }) => {
    const navigate = useNavigate();
    const onCreateRequest = () => {
        navigate("/rfps/create-rfp")
    }


    useEffect(()=>{
        trigger && trigger();
    },[])


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white text-lg font-semibold">👋</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Hello, <span className="text-blue-600">{getUserCredentials().name}</span>!
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">Welcome back, let's get things done today</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm text-gray-500">Ready to create?</p>
                        <p className="text-xs text-gray-400">Start a new RFP request</p>
                    </div>
                    <CreateButton name="Create RFP" onClick={onCreateRequest} />
                </div>
            </div>
        </div>
    )

}

export default TitleCard