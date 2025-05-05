import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { toast } from "react-toastify";

export default function VerifyByGoogle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();

  const param = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/auth/google-login?code=${
            code
          }`,{
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });
        if (res.status !== 200) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error logging in");
        }
        res = await res.json();
        localStorage.setItem("userToken", res.data);
        toast.success("Wohha logged in successfully!");
        navigate("/dashboard");
      } catch (e) {
        setError(e.message);
        toast.error("Got some error while signup with the google");
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [param.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen  bg-white flex-col">
        <h1 className="text-gray-900 mb-3">
          Google Verification is in progress...
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
}
