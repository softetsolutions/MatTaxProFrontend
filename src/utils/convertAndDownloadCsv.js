const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(','));
    return `${headers}\n${rows.join('\n')}`;
  };

 export const downloadCSV = (jsonData) => {
    jsonData = jsonData.map((value)=>{
      return {
        Date:value.created_at, 
        Amount: value.amount,
        Category:value.category,
        Type:value.type,
        Vendor:value.vendorname
      }
    })
    const csvData = convertToCSV(jsonData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MatTaxAllTransactions.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };