import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectRouteComp({children, routeName}){
    const navigate = useNavigate()

    useEffect(()=>{
        const token = localStorage.getItem("userToken");
        if(!token ) {
            navigate("/login");
            return;
        }

        try{
            const decode = jwtDecode(token);
            if(!decode.allowedRoutes.includes(routeName)){
                navigate("/login");
            }
        }catch(e){
            console.error("Got error",e);
            navigate("/login");
        }

    },[navigate])

    const token = localStorage.getItem("userToken")
    if(!token) return null

    const decode = jwtDecode(token)
    if(!decode.allowedRoutes.includes(routeName)) return null;

    return children;
}

export default ProtectRouteComp;