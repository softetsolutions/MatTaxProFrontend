import { getAuthInfo } from "./auth";
import { handleUnauthoriz } from "./helperFunction";

export const fetchReceipt = async (receiptId, navigate) => {
  try {
    const { token } = getAuthInfo();

    const url = `${import.meta.env.VITE_BASE_URL}/receipt/${receiptId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthoriz(navigate);
        throw new Error("Unauthorized: Please check your authentication");
      }
      throw new Error("Failed to fetch receipt");
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("Error fetching receipt:", err);
    throw err;
  }
};

export const extractReceiptData = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/receipt/extraction`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to extract receipt data');
    }

    const data = await response.json();

    // Validate and transform the data
    if (!data.amount && !data.desc1) {
      throw new Error('Could not extract sufficient data from the receipt');
    }
    let transactionType = 'moneyOut';
    if (data.type) {
      transactionType = data.type.toLowerCase() === 'credit' ? 'moneyIn' : 'moneyOut';
    }

//  remove currency symbols and spaces
    const cleanAmount = data.amount ? data.amount.replace(/[^0-9.-]/g, '') : '';

    // Build description from available fields
    let description = '';
    if (data.desc3) {
      description = data.desc3;
    } else if (data.desc1 && data.desc2) {
      description = `${data.desc1} - ${data.desc2}`;
    } else if (data.desc1) {
      description = data.desc1;
    } else if (data.desc2) {
      description = data.desc2;
    }

    return {
      amount: cleanAmount,
      description: description,
      type: transactionType,
      merchant: data.desc1 || '',
      category: data.category || '',
      accountNumber: '',
      location: data.desc2 || ''
    };
  } catch (error) {
    console.error('Error extracting receipt data:', error);
    throw error;
  }
};

export const handleFileUpload = async (file, vendorOptions, categoryOptions) => {
  try {
    const extractedData = await extractReceiptData(file);

    const matchingVendor = vendorOptions.find(v => 
      v.name?.toLowerCase() === extractedData.merchant?.toLowerCase()
    );
    const matchingCategory = categoryOptions.find(c => 
      c.name?.toLowerCase() === extractedData.category?.toLowerCase()
    );

    return {
      extractedData,
      matchingVendor,
      matchingCategory
    };
  } catch (error) {
    console.error('Error in handleFileUpload:', error);
    throw error;
  }
};
