import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const param = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/auth/verify/${param.token}`
        );
        if (res.status !== 200) {
          throw new Error(
            "Got some Error in verifying email! Please try again"
          );
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [param.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen  bg-white flex-col">
        <h1 className="text-gray-900 mb-3">Email Verification is in progress...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  min-h-screen bg-white text-gray-900 flex-col">
      {!error ? <div>Email Verified </div> : <div>{error}</div>}

      <button
        onClick={() => { navigate("/")}}
        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer"
      >
        Go to Home
      </button>
    </div>
  );
}

export default VerifyEmail;
