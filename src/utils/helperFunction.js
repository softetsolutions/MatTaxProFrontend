import { toast } from "react-toastify";


export const handleUnauthoriz = (navigate)=>{
    localStorage.removeItem("userToken");
    toast.error("PLs login again");
    navigate("/login");
}