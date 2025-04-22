import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const param = useParams();
  console.log("param", param);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = fetch(
          `${import.meta.env.VITE_BASE_URL}/verify/${param.token}`
        );
        if (res.status !== 200) {
          throw new Error(
            "Got some Error in verifying email! Please try again"
          );
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  min-h-screen bg-white text-gray-900">
      {!error ? <div>Email Verified</div> : <div>{error}</div>}
    </div>
  );
}

export default VerifyEmail;
