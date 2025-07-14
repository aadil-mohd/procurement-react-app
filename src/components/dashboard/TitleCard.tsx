import CreateButton from "../buttons/CreateButton";
import { useNavigate } from "react-router-dom";
import { getUserCredentials } from "../../utils/common";
import { useEffect } from "react";
// import RequestForm from "../requests/RequestForm";
// import { capexContext } from "../../routes/Route";

const TitleCard = ({ trigger }: { trigger: () => void }) => {
    // const { userInfo } = useContext(capexContext);
    const navigate = useNavigate();
    const onCreateRequest = () => {
        navigate("/rfps/create-rfp")
    }

    // useEffect(() => {
    //     if (isModalOpen) {
    //         document.body.classList.add("modal-open"); // Disable background scrolling
    //     }
    //     return () => {
    //         document.body.classList.remove("modal-open"); // Cleanup when modal closes
    //     };
    // }, [isModalOpen]);

    useEffect(()=>{
        trigger && trigger();
    },[])


    return (
        <div className="w-full h-full flex justify-between items-center">
            <div className="flex flex-col">
                <p className="text-[26px] flex justify-start items-center">
                    Hello,&nbsp;<span className="text-[26px] font-semibold">{getUserCredentials().name}</span>!!
                </p>
                <span className="text-gray-400 text-[14px]">Welcome, Let's get back to work.</span>
            </div>
            <div>
                <CreateButton name="Create request" onClick={onCreateRequest} />
                
            </div>
        </div>

    )

}

export default TitleCard