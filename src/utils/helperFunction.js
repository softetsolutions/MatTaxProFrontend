import { toast } from "react-toastify";


export const handleUnauthoriz = (navigate)=>{
    localStorage.removeItem("userToken");
    toast.error("PLs login again");
    navigate("/login");
}

export const csvToJson = (csvText, maxRows = 5) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
  
    for (let i = 0; i < lines.length && result.length < maxRows; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const rowObject = {};
  
      headers.forEach((header, index) => {
        rowObject[header] = values[index] || '';
      });
  
      result.push(rowObject);
    }
  
    return result;
  }