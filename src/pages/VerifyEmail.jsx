import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VerifyEmail (){
    const [loading, setLoading] = useState(false);

    const param = useParams();
    console.log("param", param);

    useEffect(()=>{

        async function fetchData(){
            const res = fetch(`${import.meta.env.VITE_BASE_URL}/verify/${param.token}`);
        }
        fetchData()
    },[]);

    return(
        <div className="flex min-h-screen bg-white text-gray-900">
           {loading ?  <div>Verifying Email</div> : <div>Email Verified</div>}
        </div>
    )

}

export default VerifyEmail;