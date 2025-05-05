import { toast } from "react-toastify";
import { csvToJson } from "../../utils/helperFunction";
import { useState } from "react";

export default function UploadCsv({ closeUploadModalCsvOpen }) {
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [mapingList, setMapingList] = useState({
    created_at: "",
    transactionDetail: "",
    accountNo: "",
    sortCode: "",
    balance: "",
    moneyIn: "",
    moneyOut: "",
    moneyInAndMoneyOut: "",
  });

  function getSelectedField(index) {
    return (
      Object.entries(mapingList).find(
        ([, mappedIndex]) => mappedIndex === `${index}`
      )?.[0] || ""
    );
  }

  // Handle mapping assignment
  function handleMappingList(e, index) {
    const selectedField = e.target.value;

    // Clear previous mapping if the field was already assigned to another index
    const updatedMapping = Object.fromEntries(
      Object.entries(mapingList).map(([key, val]) => [
        key,
        key === selectedField ? `${index}` : val === `${index}` ? "" : val,
      ])
    );

    setMapingList(updatedMapping);
  }

  function handleFileChange(e) {
    try {
      setLoading(true);
      const file = e.target.files[0];
      setFile(file);
      const reader = new FileReader();

      reader.onload = (event) => {
        const csvText = event.target.result;
        const json = csvToJson(csvText);
        setJsonData(json);
      };

      if (file) {
        reader.readAsText(file);
      }
    } catch (e) {
      console.error("Error reading file:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadTransactionViaCsv() {
    // created_at &&  moneyIn && moneyOut || created_at && moneyInAndMoneyOut

    if (
      !((Boolean(mapingList["created_at"]) &&
        Boolean(mapingList["moneyIn"]) &&
        Boolean(mapingList["moneyOut"])) ||
      (Boolean(mapingList["created_at"]) &&
      Boolean(mapingList["moneyInAndMoneyOut"])))
    ){
      return
    }
      try {
        setLoading(true);

        let formData = new FormData();
        formData.append("mapping", JSON.stringify(mapingList));
        formData.append("file", file);

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/transaction/import`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (response.ok) {
          setFile(null);
          setJsonData([]);
          setMapingList({
            created_at: "",
            transactionDetail: "",
            accountNo: "",
            sortCode: "",
            balance: "",
            moneyIn: "",
            moneyOut: "",
            moneyInAndMoneyOut: "",
          });
          toast.success("Csv imported successfully");
        } else {
          throw new Error("Please try again");
        }
      } catch (e) {
        console.error("error", e);
        toast.error("Got some error", e);
      } finally {
        setLoading(false);
      }
  }

  //transaction/import

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200 transition-all animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Upload Transactions from CSV
          </h3>
          <button
            onClick={closeUploadModalCsvOpen}
            className="text-gray-500 hover:cursor-pointer hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {jsonData.length === 0 && (
          <div className="flex-1 border-l pl-6">
            <h4 className="font-medium text-gray-700 mb-3 text-center">
              Upload Receipt
            </h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-64 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-16 h-16 mb-4 text-blue-500 flex items-center justify-center rounded-full bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Drag & Drop files here
              </p>
              <p className="text-xs text-gray-500 mb-4">or</p>
              <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv"
                  multiple
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported format: CSV
              </p>
            </div>
          </div>
        )}

        {jsonData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                  {Object.keys(jsonData[0]).map((header, index) => (
                    <th key={index} className="px-4 py-3">
                      <select
                        value={getSelectedField(index)}
                        onChange={(e) => handleMappingList(e, index)}
                        className="border rounded px-2 py-1 text-sm w-full"
                      >
                        <option value="">-- Select --</option>
                        {Object.keys(mapingList)
                          .filter(
                            (field) =>
                              !Boolean(mapingList[field]) ||
                              mapingList[field] === `${index}`
                          )
                          .map((field) => (
                            <option key={field} value={field}>
                              {field}
                            </option>
                          ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jsonData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {Object.values(row).map((value, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm text-gray-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* {loading && (
          <div className="text-center text-gray-700 text-lg py-10">
            Loading...
          </div>
        )} */}

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            disabled={loading}
            onClick={() => setJsonData([])}
            className={`px-4 py-2 text-gray-600 border-2 bg-red-100 border-red-300 rounded hover:bg-red-200 transition-colors hover:cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:text-red-600"
            } `}
          >
            Reset
          </button>
          <button
            type="submit"
            onClick={handleUploadTransactionViaCsv}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded transition-colors hover:cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {loading && jsonData.length > 0 && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading && jsonData.length > 0
                ? "Saving..."
                : "Upload Transactions via Csv"}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
