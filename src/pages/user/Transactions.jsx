import { useState, useEffect, useRef } from "react";
import {
  ArrowUpDown,
  Edit,
  Trash2,
  ChevronDown,
  X,
  Logs,
  Check,
  Eye,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleUnauthoriz } from "../../utils/helperFunction";
import { fetchAuthorizedUsers } from "../../utils/authorizedUsers";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../utils/transactionsApi";
import { fetchAllVendors, updateVendor, createVendor } from "../../utils/vendorApi";
import { fetchAllCategories, updateCategory, createCategory } from "../../utils/categoryApi";
import { fetchAllAccounts, updateAccount, createAccount } from "../../utils/accountApi";
import { downloadCSV } from "../../utils/convertAndDownloadCsv";
import UploadCsv from "./UploadCsv";
import { fetchReceipt, handleFileUpload as handleReceiptUpload } from "../../utils/receiptApi";
import DateRangeFilter from "../../components/DateRangeFilter";
import { filterTransactionsByDate } from "../../utils/dateFilter";
import TransactionTypeFilter from "../../components/TransactionTypeFilter";
import { getDefaultGstPercentage, saveGstPercentage, calculateGstAmount } from "../../utils/gstVatUtils";
import Pagination from "../../components/Pagination";

export default function TransactionsPage({ setIsTransasctionLog, selectedUserId: propSelectedUserId }) {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "moneyIn",
    vendor: "",
    desc3: "",
    accountNo: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTableList, setRefreshTableList] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(propSelectedUserId || null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('transactionsCurrentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const userRef = useRef(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [editingVendorName, setEditingVendorName] = useState("");
  const [isUploadModalCsvOpen, setIsUploadModalCsvOpen] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");
  const [accountNumberSearch, setAccountNumberSearch] = useState("");
  const [showAccountNumberDropdown, setShowAccountNumberDropdown] = useState(false);
  const accountNumberRef = useRef(null);
  const [accountOptions, setAccountOptions] = useState([]);
  const [editingAccountId, setEditingAccountId] = useState(null);
  const [editingAccountNumber, setEditingAccountNumber] = useState("");
  const filteredAccountNumbers = accountOptions.filter((acc) =>
    acc.number?.toLowerCase()?.includes(accountNumberSearch.toLowerCase())
  );
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const categoryRef = useRef(null);
  const vendorRef = useRef(null);
  const [showGstVat, setShowGstVat] = useState(false);
  const [gstVatAmount, setGstVatAmount] = useState("");
  const [gstVatPercentage, setGstVatPercentage] = useState("");
  const [isExtractingReceipt, setIsExtractingReceipt] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState(null);

  // Initialize userRole once when component mounts
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const decoded = jwtDecode(token);
    setUserRole(decoded.role);
  }, []);

  useEffect(() => {
    setSelectedUserId(propSelectedUserId || null);
  }, [propSelectedUserId]);

  // Fetch transaction data when selectedUserId changes
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const decoded = jwtDecode(token);
    setUserRole(decoded.role);
    setSelectedUserId(propSelectedUserId || null);
    const fetchTransactionData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("userToken");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        // For accountants -> fetch vendors if user selected
        if (userRole === "accountant" && !selectedUserId) {
          setTransactions([]);
          setVendorOptions([]);
          setCategoryOptions([]);
          setAccountOptions([]);
          setLoading(false);
          return;
        }

        const data = await Promise.allSettled([
          fetchTransactions(selectedUserId, navigate, currentPage, pageSize),
          fetchAllVendors(userRole === "accountant" ? selectedUserId : userId),
          fetchAllCategories(userRole === "accountant" ? selectedUserId : userId),
          fetchAllAccounts(userRole === "accountant" ? selectedUserId : userId),
        ]);

        const vendors = data[1].value.reduce((acc, vendor) => {
          let vendorData = {
            id: vendor.id,
            name: vendor.name,
          };
          acc.push(vendorData);
          return acc;
        }, []);

        const categories = data[2].value.reduce((acc, category) => {
          let categoryData = {
            id: category.id,
            name: category.name,
          };
          acc.push(categoryData);
          return acc;
        }, []);

        const accounts = data[3].value.reduce((acc, account) => {
          let accountData = {
            id: account.id,
            number: account.accountNo,
          };
          acc.push(accountData);
          return acc;
        }, []);

        setVendorOptions(vendors);
        setCategoryOptions(categories);
        setAccountOptions(accounts);
        
        // Handle paginated transactions response
        const transactionsResponse = data[0].value;
        setTransactions(transactionsResponse.transactions || []);
        setTotalPages(transactionsResponse.totalPages || 1);
        setTotalItems(transactionsResponse.totalItems || 0);
        setPageSize(transactionsResponse.limit || 10);
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
        console.error("API Error:", err);
        if (err.message.includes("Unauthorized")) {
          handleUnauthoriz(navigate);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [refreshTableList, selectedUserId, navigate, currentPage]);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (vendorRef.current && !vendorRef.current.contains(event.target)) {
        setShowVendorDropdown(false);
      }
      if (accountNumberRef.current && !accountNumberRef.current.contains(event.target)) {
        setShowAccountNumberDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

   //trigger amount when gst changes 
    if (name === 'amount' && showGstVat && gstVatPercentage) {
      const calculatedAmount = calculateGstAmount(value, gstVatPercentage);
      setGstVatAmount(calculatedAmount);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Check required fields
    const requiredFields = {
      amount: "Amount",
      category: "Category",
      type: "Transaction Type",
      vendor: "Vendor",
      desc3: "Transaction Details"
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => {
        if (key === 'category') {
          return !formData[key] && !categorySearch;
        }
        if (key === 'vendor') {
          return !formData[key] && !vendorSearch;
        }
        return !formData[key];
      })
      .map(([, label]) => label);

    if (missingFields.length > 0) {
      toast.warning(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("userToken");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      if (editingId) {
        // Handle category
        let categoryId = formData.category;
        if (categorySearch) {
          // First check if the category already exists
          const existingCategory = categoryOptions.find(
            c => c.name.toLowerCase() === categorySearch.toLowerCase()
          );
          
          if (existingCategory) {
            // Use the existing category ID
            categoryId = existingCategory.id;
          } else {
            // Create new category only if it doesn't exist
            try {
              const newCategory = await createCategory(
                categorySearch,
                userRole === "accountant" ? selectedUserId : userId
              );
              categoryId = newCategory.id;
              
              // Update the categories list
              setCategoryOptions(prev => [...prev, { id: newCategory.id, name: categorySearch }]);
            } catch (err) {
              console.error("Error creating new category:", err);
              toast.error(err.message || "Failed to create new category");
              return;
            }
          }
        }

        // Handle vendor
        let vendorId = formData.vendor;
        if (vendorSearch) {
          // First check if vendor already exists
          const existingVendor = vendorOptions.find(
            v => v.name.toLowerCase() === vendorSearch.toLowerCase()
          );

          if (existingVendor) {
            vendorId = existingVendor.id;
          } else {
            try {
              const newVendor = await createVendor(
                vendorSearch,
                userRole === "accountant" ? selectedUserId : userId
              );
              vendorId = newVendor.id;
              
              // Update the vendors list
              setVendorOptions(prev => [...prev, { id: newVendor.id, name: vendorSearch }]);
            } catch (err) {
              console.error("Error creating new vendor:", err);
              toast.error(err.message || "Failed to create new vendor");
              return;
            }
          }
        }

        // Handle account number
        let accountId = formData.accountNo;
        if (accountNumberSearch) {
          // First check if account already exists
          const existingAccount = accountOptions.find(
            acc => acc.number.toLowerCase() === accountNumberSearch.toLowerCase()
          );

          if (existingAccount) {
            accountId = existingAccount.id;
          } else {
            try {
              const newAccount = await createAccount(
                accountNumberSearch,
                userRole === "accountant" ? selectedUserId : userId
              );
              accountId = newAccount.id;
              
              // Update the accounts list
              setAccountOptions(prev => [...prev, { id: newAccount.id, number: accountNumberSearch }]);
            } catch (err) {
              console.error("Error creating new account:", err);
              toast.error(err.message || "Failed to create new account");
              return;
            }
          }
        }

        if (!vendorId) {
          toast.error("Please select or create a valid vendor");
          return;
        }

        if (!categoryId) {
          toast.error("Please select or create a valid category");
          return;
        }

        // Update existing transaction
        const transactionData = {
          transactionId: editingId,
          newAmount: formData.amount,
          newCategory: categoryId,
          newType: formData.type,
          accountNo: accountId,
          vat_gst_amount: gstVatAmount || null,
          vat_gst_percentage: gstVatPercentage || null,
          desc1: formData.desc1 || "",
          desc2: formData.desc2 || "",
          desc3: formData.desc3,
          vendorId: vendorId
        };

        // If there are new files, create a FormData object
        if (files.length > 0) {
          const formDataObj = new FormData();
          // Append all transaction data
          Object.entries(transactionData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formDataObj.append(key, value);
            }
          });
          // Append the file
          files.forEach((file) => {
            formDataObj.append("file", file);
          });

          await toast.promise(
            updateTransaction(formDataObj, selectedUserId),
            {
              pending: "Updating transaction with new receipt...",
              success: "Transaction updated successfully 👌",
              error: "Failed to update transaction 🤯",
            }
          );
        } else {
          await toast.promise(
            updateTransaction(transactionData, selectedUserId),
            {
              pending: "Updating transaction...",
              success: "Transaction updated successfully 👌",
              error: "Failed to update transaction 🤯",
            }
          );
        }
        setShowModal(false);
        setEditingId(null);
        setRefreshTableList((prev) => !prev);
      } else {
        // Create new transaction
        let categoryId = formData.category;
        let accountId = formData.accountNo;
        let vendorId = formData.vendor;
        
        // If there's a category search term but no category ID
        if (categorySearch && !categoryId) {
          // First check if the category already exists
          const existingCategory = categoryOptions.find(
            c => c.name.toLowerCase() === categorySearch.toLowerCase()
          );
          
          if (existingCategory) {
            // Use the existing category ID
            categoryId = existingCategory.id;
          } else {
            // Create new category only if it doesn't exist
            try {
              const newCategory = await createCategory(
                categorySearch,
                userRole === "accountant" ? selectedUserId : userId
              );
              categoryId = newCategory.id;
              
              // Update the categories list
              setCategoryOptions(prev => [...prev, { id: newCategory.id, name: categorySearch }]);
            } catch (err) {
              console.error("Error creating new category:", err);
              toast.error("Failed to create new category");
              return;
            }
          }
        }

        // If there's a custom vendor name in the search field, create a new vendor
        if (vendorSearch && !vendorId) {
          try {
            const newVendor = await createVendor(
              vendorSearch,
              userRole === "accountant" ? selectedUserId : userId
            );
            vendorId = newVendor.id;
            
            // Update the vendors list
            setVendorOptions(prev => [...prev, { id: newVendor.id, name: vendorSearch }]);
          } catch (err) {
            console.error("Error creating new vendor:", err);
            toast.error("Failed to create new vendor");
            return;
          }
        }
        if (!accountId && accountNumberSearch) {
          try {
            const newAccount = await createAccount(
              accountNumberSearch,
              userRole === "accountant" ? selectedUserId : userId
            );
            accountId = newAccount.id;
            
            // Update the accounts list
            setAccountOptions(prev => [...prev, { id: newAccount.id, number: newAccount.name }]);
          } catch (err) {
            console.error("Error creating new account:", err);
            toast.error("Failed to create new account");
            return;
          }
        }
        if (!vendorId) {
          toast.error("Please select or create a valid vendor");
          return;
        }

        if (!categoryId) {
          toast.error("Please select or create a valid category");
          return;
        }

        const transactionData = {
          amount: parseFloat(formData.amount),
          category: categoryId,
          type: formData.type,
          vendorId: vendorId,
          desc3: formData.desc3,
          isDeleted: false,
          userId: userRole === "accountant" ? selectedUserId : userId,
          accountNo: accountId,
          vat_gst_amount: gstVatAmount || null,
          vat_gst_percentage: gstVatPercentage || null
        };

        if (files.length > 0) {
          const formDataObj = new FormData();
          // Append each field individually to ensure correct naming
          formDataObj.append("amount", transactionData.amount);
          formDataObj.append("category", transactionData.category);
          formDataObj.append("type", transactionData.type);
          formDataObj.append("vendorId", transactionData.vendorId);
          formDataObj.append("desc3", transactionData.desc3);
          formDataObj.append("isDeleted", transactionData.isDeleted);
          formDataObj.append("userId", transactionData.userId);
          formDataObj.append("accountNo", transactionData.accountNo);
          formDataObj.append("vat_gst_amount", transactionData.vat_gst_amount);
          formDataObj.append("vat_gst_percentage", transactionData.vat_gst_percentage);
          files.forEach((file) => {
            formDataObj.append("file", file);
          });

          await toast.promise(createTransaction(formDataObj, selectedUserId), {
            pending: "Creating transaction with receipts...",
            success: "Transaction created successfully 👌",
            error: "Failed to create transaction 🤯",
          });
        } else {
          await toast.promise(
            createTransaction(transactionData, selectedUserId),
            {
              pending: "Creating transaction...",
              success: "Transaction created successfully 👌",
              error: "Failed to create transaction 🤯",
            }
          );
        }

        setFormData({
          amount: "",
          category: "",
          type: "moneyIn",
          vendor: "",
          desc3: "",
          accountNo: "",
        });
        setFiles([]);
        setVendorSearch("");
        setAccountNumberSearch("");
        setCategorySearch("");
      }
    } catch (err) {
      console.error("Operation failed:", err);
      toast.error(err.message || "Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setEditingReceipt(null);
    setFormData({
      amount: "",
      category: "",
      type: "moneyIn",
      vendor: "",
      desc3: "",
      accountNo: "",
    });
    setFiles([]);
    setVendorSearch("");
    setAccountNumberSearch("");
    setCategorySearch("");
    setGstVatAmount("");
    setGstVatPercentage("");
    setShowGstVat(false);
    setRefreshTableList((prev) => !prev);
  };

  // Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Add event listener for Enter key
  useEffect(() => {
    if (showModal) {
      document.addEventListener("keydown", handleKeyPress);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showModal, formData, editingId]);

  const handleEdit = async (id) => {
    const transactionToEdit = transactions.find((txn) => txn.id === id);
    if (transactionToEdit) {
      const category = categoryOptions.find(c => String(c.id) === String(transactionToEdit.category));
      const vendor = vendorOptions.find(v => String(v.id) === String(transactionToEdit.vendorid));
      const account = accountOptions.find(a => String(a.id) === String(transactionToEdit.accountno));
      
      setFormData({
        amount: transactionToEdit.amount.replace("$", ""),
        category: transactionToEdit.category,
        type: transactionToEdit.type,
        vendor: transactionToEdit.vendorid,
        desc3: transactionToEdit.desc3 || "",
        accountNo: transactionToEdit.accountno || "",
      });

      // Set search values for dropdowns
      if (category) setCategorySearch(category.name);
      if (vendor) setVendorSearch(vendor.name);
      if (account) setAccountNumberSearch(account.number);

      setEditingId(id);
      setShowModal(true);

      // Try to fetch receipt if it exists
      if (transactionToEdit.receipt) {
        try {
          const base64Image = await fetchReceipt(transactionToEdit.receipt, navigate);
          if (base64Image && typeof base64Image === 'string' && base64Image.trim() !== '') {
            setEditingReceipt(`data:image/jpeg;base64,${base64Image}`);
          } else {
            setEditingReceipt(null);
          }
        } catch (error) {
          console.error("Error fetching receipt:", error);
          setEditingReceipt(null);
        }
      } else {
        setEditingReceipt(null);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await toast.promise(deleteTransaction(id, selectedUserId), {
        pending: "Deleting Transaction",
        success: "Successfully Deleted Transaction 👌",
        error: "Got Error Deleting transaction, Try again 🤯",
      });
      setRefreshTableList((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter functions dropdowns
  const filteredCategories = categoryOptions.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredVendors = vendorOptions.filter((vendor) =>
    vendor.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );
  const sortedTransactions = [...transactions].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (sortField === "amount") {
      const amountA = Number.parseFloat(a.amount.replace("$", ""));
      const amountB = Number.parseFloat(b.amount.replace("$", ""));
      return (amountA - amountB) * modifier;
    }
    return String(a[sortField]).localeCompare(String(b[sortField])) * modifier;
  });

  const filteredTransactions = filterTransactionsByDate(
    sortedTransactions.filter((txn) =>
      transactionTypeFilter === "all" ? true : txn.type === transactionTypeFilter
    ),
    startDate,
    endDate
  );

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    `${user.fname} ${user.lname}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  // to get authorized users
  const fetchAuthorizedUsersList = async () => {
    try {
      const data = await fetchAuthorizedUsers();
      // Transform the data to match the expected format
      const transformedUsers = data.map((user) => ({
        id: user.userid,
        fname: user.fname,
        lname: user.lname,
      }));
      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching authorized users:", err);
      toast.error(err.message || "Failed to fetch authorized users");
    }
  };

  useEffect(() => {
    if (userRole === "accountant") {
      fetchAuthorizedUsersList();
    }
  }, [userRole]);

  const handleVendorNameUpdate = async (vendorId, newName) => {
    try {
      await updateVendor(vendorId, newName);
      setVendorOptions((prev) =>
        prev.map((vendor) =>
          vendor.id === vendorId ? { ...vendor, name: newName } : vendor
        )
      );
      setEditingVendorId(null);
      setEditingVendorName("");
      toast.success("Vendor updated successfully");
    } catch (err) {
      console.error("Error updating vendor:", err);
      toast.error(err.message || "Failed to update vendor");
    }
  };

  const handleViewReceipt = async (receiptId) => {
    if (!receiptId) {
      toast.info("No receipt available for this transaction");
      return;
    }

    try {
      setIsLoadingReceipt(true);
      const base64Image = await fetchReceipt(receiptId, navigate);
      
      // Validate the base64 image data
      if (!base64Image || typeof base64Image !== 'string' || base64Image.trim() === '') {
        toast.warning("No receipt image found");
        setIsLoadingReceipt(false);
        return;
      }
      
      // Only open modal if we have valid image data
      setShowReceiptModal(true);
      
      // Create an image object to pre-load the image
      const img = new Image();
      img.onload = () => {
        setCurrentReceipt(`data:image/jpeg;base64,${base64Image}`);
        setIsLoadingReceipt(false);
      };
      
      img.onerror = () => {
        console.error("Error loading image preview");
        setIsLoadingReceipt(false);
        setShowReceiptModal(false);
        toast.error("Failed to load receipt image. The format may be unsupported.");
      };
      
      img.src = `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
      setIsLoadingReceipt(false);
      setShowReceiptModal(false);
      toast.error("Failed to load receipt. Please try again.");
      console.error("Error loading receipt:", error);
    }
  };

  // Add this function to clear date filters
  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleAccountNumberUpdate = async (accountId, newNumber) => {
    try {
      await updateAccount(accountId, newNumber);
      setAccountOptions((prev) =>
        prev.map((account) =>
          account.id === accountId ? { ...account, number: newNumber } : account
        )
      );
      setEditingAccountId(null);
      setEditingAccountNumber("");
      toast.success("Account number updated successfully");
    } catch (err) {
      console.error("Error updating account number:", err);
      toast.error(err.message || "Failed to update account number");
    }
  };

  const handleCategoryNameUpdate = async (categoryId, newName) => {
    try {
      await updateCategory(categoryId, newName);
      setCategoryOptions((prev) =>
        prev.map((category) =>
          category.id === categoryId ? { ...category, name: newName } : category
        )
      );
      setEditingCategoryId(null);
      setEditingCategoryName("");
      toast.success("Category updated successfully");
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(err.message || "Failed to update category");
    }
  };

  // Function to handle percentage change with cookie update
  const handleGstPercentageChange = (newPercentage) => {
    setGstVatPercentage(newPercentage);
    if (newPercentage && formData.amount) {
      saveGstPercentage(newPercentage);
      const calculatedAmount = calculateGstAmount(formData.amount, newPercentage);
      setGstVatAmount(calculatedAmount);
    } else {
      setGstVatAmount("");
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length === 0) return;

    setFiles(uploadedFiles);
    
    // preview for the uploaded image
    if (uploadedFiles[0].type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(uploadedFiles[0]);
      setEditingReceipt(previewUrl);
    }
    
    try {
      setIsExtractingReceipt(true);
      const result = await handleReceiptUpload(
        uploadedFiles[0],
        vendorOptions,
        categoryOptions
      );

      if (!result.matchingVendor && result.extractedData.merchant) {
        setVendorSearch(result.extractedData.merchant);
      }
      if (!result.matchingCategory && result.extractedData.category) {
        setCategorySearch(result.extractedData.category);
      }
      // Update form data 
      const newFormData = {
        ...formData,
        amount: result.extractedData.amount || '',
        desc3: result.extractedData.description || '',
        type: result.extractedData.type,
        vendor: result.matchingVendor?.id || '',
        category: result.matchingCategory?.id || '',
        accountNo: result.extractedData.accountNumber || ''
      };
      setFormData(newFormData);

      // Update search fields
      if (result.extractedData.merchant) {
        setVendorSearch(result.extractedData.merchant);
      }
      if (result.extractedData.category) {
        setCategorySearch(result.extractedData.category);
      }

      toast.success('Receipt data extracted');
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error(error.message || 'Failed to extract receipt data');
    } finally {
      setIsExtractingReceipt(false);
    }
  };

  // Update localStorage when currentPage changes
  useEffect(() => {
    localStorage.setItem('transactionsCurrentPage', currentPage.toString());
  }, [currentPage]);

  // Reset page to 1 when user changes
  useEffect(() => {
    setCurrentPage(1);
    localStorage.setItem('transactionsCurrentPage', '1');
  }, [selectedUserId]);

  // remove image preview
  useEffect(() => {
    return () => {
      if (editingReceipt && editingReceipt.startsWith('blob:')) {
        URL.revokeObjectURL(editingReceipt);
      }
    };
  }, [editingReceipt]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 flex flex-col items-center shadow-md">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-red-600 mb-2">Failed to load Transactions</div>
          <div className="text-sm text-red-500 mb-6">Please check your connection or try again later.</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500">
            View and manage your transactions
          </p>
        </div>
        <div className="flex items-center gap-4">
          {userRole === "accountant" && (
            <div className="relative" ref={userRef}>
              <div
                className="flex items-center w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black cursor-pointer"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <span className="flex-grow">
                  {selectedUserId
                    ? users.find((u) => u.id === selectedUserId)?.fname +
                      " " +
                      users.find((u) => u.id === selectedUserId)?.lname
                    : "Select a user"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {showUserDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                  <div className="p-2 border-b">
                    <div className="flex items-center border rounded bg-gray-50 text-black">
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full p-2 bg-transparent focus:outline-none text-sm"
                        placeholder="Search users..."
                        autoFocus
                      />
                      {userSearch && (
                        <button
                          onClick={() => setUserSearch("")}
                          className="mr-2"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowUserDropdown(false);
                            setUserSearch("");
                          }}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
                        >
                          {user.fname} {user.lname}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 text-center">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {userRole !== "accountant" ||
          (userRole === "accountant" && selectedUserId) ? (
            <>
              <button
                onClick={() => {
                  setEditingId(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer"
              >
                Add Transaction
              </button>

              <button
                onClick={() => {
                  setIsUploadModalCsvOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer"
              >
                Add Transaction(via Csv)
              </button>

              <button
                onClick={() => {
                  downloadCSV(transactions);
                }}
                disabled={transactions.length === 0}
                className={`inline-flex items-center px-4 py-2 ${
                  transactions.length === 0
                    ? `bg-blue-200`
                    : `bg-blue-600 hover:bg-blue-700`
                } text-white text-sm font-medium rounded-md transition-colors hover:cursor-pointer`}
              >
                Export Transaction
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DateRangeFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onClear={clearDateFilters}
          />
          {/* Transaction Type Filter Dropdown */}
          <TransactionTypeFilter
            value={transactionTypeFilter}
            onChange={setTransactionTypeFilter}
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredTransactions.length} transactions found
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {userRole === "accountant" && !selectedUserId ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Please select a user to view their transactions
            </div>
            <div className="text-gray-400 text-sm">
              Click on the user dropdown above to select a user
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-200">
                    {[
                      { field: "created_at", label: "Date" },
                      { field: "Desc3", label: "Transaction Detail" },
                      { field: "amount", label: "Amount" },
                      { field: "category", label: "Category" },
                      { field: "type", label: "Type" },
                      { field: "vendorname", label: "Vendor Name" },
                      { field: "actions", label: "Actions" },
                    ].map((header) => (
                      <th
                        key={header.field}
                        className="px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-1">
                          {header.label}
                          {header.field !== "actions" && (
                            <>
                              <ArrowUpDown
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => handleSort(header.field)}
                              />
                              {sortField === header.field && (
                                <span className="text-xs">
                                  ({sortDirection === "asc" ? "↑" : "↓"})
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.created_at}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.desc3 ?? " - "}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {txn.amount}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {categoryOptions.find((c) => String(c.id) === String(txn.category))?.name || txn.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                          {txn.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {txn.vendorname}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsTransasctionLog(txn.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                              title="Log"
                            >
                              <Logs className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(txn.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewReceipt(txn.receipt)}
                              className="p-1 text-teal-600 hover:text-teal-800 rounded hover:bg-teal-50"
                              title="View Receipt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(txn.id)}
                              className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                className="mt-4"
              />
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-gray-200 transition-all animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:cursor-pointer hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Transaction Details
                  </label>
                  <input
                    type="text"
                    id="desc3"
                    name="desc3"
                    value={formData.desc3}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter Detail"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="mb-4" ref={accountNumberRef}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Account Number
                  </label>
                  <div className="relative">
                    <div
                      className="flex items-center w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                      onClick={() => setShowAccountNumberDropdown(true)}
                    >
                      <input
                        type="text"
                        value={
                          accountOptions.find(acc => acc.number === formData.accountNo)?.number ||
                          accountNumberSearch
                        }
                        onChange={e => {
                          setAccountNumberSearch(e.target.value);
                          setShowAccountNumberDropdown(true);
                        }}
                        className="w-full bg-transparent focus:outline-none text-sm text-black"
                        placeholder="Search or type account number"
                        autoComplete="off"
                      />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                    {showAccountNumberDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                        <div className="p-2 border-b">
                          <div className="flex items-center border rounded bg-gray-50">
                            <input
                              type="text"
                              value={accountNumberSearch}
                              onChange={e => setAccountNumberSearch(e.target.value)}
                              className="w-full p-2 bg-transparent focus:outline-none text-sm text-black"
                              placeholder="Search account numbers..."
                              autoFocus
                            />
                            {accountNumberSearch && (
                              <button onClick={() => setAccountNumberSearch("")} className="p-2">
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredAccountNumbers.length > 0 ? (
                            filteredAccountNumbers.map((acc) => (
                              <div
                                key={acc.id}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, accountNo: acc.id }));
                                  setAccountNumberSearch(acc.number);
                                  setShowAccountNumberDropdown(false);
                                }}
                              >
                                {editingAccountId === acc.id ? (
                                  <div className="flex items-center gap-2 w-full">
                                    <input
                                      type="text"
                                      value={editingAccountNumber}
                                      onChange={(e) =>
                                        setEditingAccountNumber(e.target.value)
                                      }
                                      className="flex-grow p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleAccountNumberUpdate(
                                            acc.id,
                                            editingAccountNumber
                                          );
                                        } else if (e.key === "Escape") {
                                          setEditingAccountId(null);
                                          setEditingAccountNumber("");
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={() =>
                                        handleAccountNumberUpdate(
                                          acc.id,
                                          editingAccountNumber
                                        )
                                      }
                                      className="p-1 text-green-600 hover:text-green-800 rounded hover:bg-green-50"
                                      title="Save changes"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingAccountId(null);
                                        setEditingAccountNumber("");
                                      }}
                                      className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 w-full">
                                    <span
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, accountNo: acc.id }));
                                        setAccountNumberSearch(acc.number);
                                        setShowAccountNumberDropdown(false);
                                      }}
                                      className="flex-grow"
                                    >
                                      {acc.number}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingAccountId(acc.id);
                                        setEditingAccountNumber(acc.number);
                                      }}
                                      className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                                      title="Edit account number"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 text-center">
                              No account numbers found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter amount"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showGstVat}
                      onChange={e => {
                        setShowGstVat(e.target.checked);
                        if (!e.target.checked) {
                          setGstVatAmount("");
                          setGstVatPercentage("");
                        } else {
                          const defaultPercentage = getDefaultGstPercentage();
                          setGstVatPercentage(defaultPercentage);
                          const calculatedAmount = calculateGstAmount(formData.amount, defaultPercentage);
                          setGstVatAmount(calculatedAmount);
                        }
                      }}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    GST/VAT
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">GST/VAT Amount</label>
                      <input
                        type="number"
                        value={gstVatAmount}
                        disabled={!showGstVat || gstVatPercentage !== ""}
                        onChange={e => {
                          const newAmount = e.target.value;
                          setGstVatAmount(newAmount);
                          setGstVatPercentage("");
                        }}
                        className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                          !showGstVat || gstVatPercentage !== "" ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                        }`}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">GST/VAT %</label>
                      <input
                        type="number"
                        value={gstVatPercentage}
                        disabled={!showGstVat}
                        onChange={e => handleGstPercentageChange(e.target.value)}
                        className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                          !showGstVat ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                        }`}
                        placeholder="Enter percentage"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4" ref={categoryRef}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <div
                      className="flex items-center w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                      onClick={() => setShowCategoryDropdown(true)}
                    >
                      <input
                        type="text"
                        value={categoryOptions.find(c => c.id === formData.category)?.name || categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                          // Clear the category ID when typing a new name
                          setFormData(prev => ({
                            ...prev,
                            category: ""
                          }));
                        }}
                        className="w-full bg-transparent focus:outline-none text-sm text-black"
                        placeholder="Search or type category name"
                      />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>

                    {showCategoryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                        <div className="p-2 border-b">
                          <div className="flex items-center border rounded bg-gray-50">
                            <input
                              type="text"
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              className="w-full p-2 bg-transparent focus:outline-none text-sm text-black"
                              placeholder="Search categories..."
                              autoFocus
                            />
                            {categorySearch && (
                              <button onClick={() => setCategorySearch("")} className="p-2">
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <div
                                key={category.id}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black flex justify-between items-center"
                              >
                                {editingCategoryId === category.id ? (
                                  <div className="flex items-center gap-2 w-full">
                                    <input
                                      type="text"
                                      value={editingCategoryName}
                                      onChange={(e) =>
                                        setEditingCategoryName(e.target.value)
                                      }
                                      className="flex-grow p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleCategoryNameUpdate(
                                            category.id,
                                            editingCategoryName
                                          );
                                        } else if (e.key === "Escape") {
                                          setEditingCategoryId(null);
                                          setEditingCategoryName("");
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={() =>
                                        handleCategoryNameUpdate(
                                          category.id,
                                          editingCategoryName
                                        )
                                      }
                                      className="p-1 text-green-600 hover:text-green-800 rounded hover:bg-green-50"
                                      title="Save changes"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingCategoryId(null);
                                        setEditingCategoryName("");
                                      }}
                                      className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          category: category.id,
                                        }));
                                        setShowCategoryDropdown(false);
                                        setCategorySearch(category.name);
                                      }}
                                      className="flex-grow"
                                    >
                                      {category.name}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingCategoryId(category.id);
                                        setEditingCategoryName(category.name);
                                      }}
                                      className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                                      title="Edit category name"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 text-center">
                              No categories found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4" ref={vendorRef}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Vendor
                  </label>
                  <div className="relative">
                    <div
                      className="flex items-center w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                      onClick={() => setShowVendorDropdown(true)}
                    >
                      <input
                        type="text"
                        value={
                          vendorOptions.find((v) => v.id === formData.vendor)
                            ?.name || vendorSearch
                        }
                        onChange={(e) => {
                          setVendorSearch(e.target.value);
                          setShowVendorDropdown(true);

                          setFormData((prev) => ({
                            ...prev,
                            vendor: "",
                          }));
                        }}
                        className="w-full bg-transparent focus:outline-none text-sm text-black"
                        placeholder="Search or type vendor name"
                        autoComplete="off"
                      />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>

                    {showVendorDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                        <div className="p-2 border-b">
                          <div className="flex items-center border rounded bg-gray-50">
                            <input
                              type="text"
                              value={vendorSearch}
                              onChange={(e) => {
                                setVendorSearch(e.target.value);
                                // Clear the vendor ID when typing a new name
                                setFormData((prev) => ({
                                  ...prev,
                                  vendor: "",
                                }));
                              }}
                              className="w-full p-2 bg-transparent focus:outline-none text-sm text-black"
                              placeholder="Search vendors..."
                              autoFocus
                            />
                            {vendorSearch && (
                              <button
                                onClick={() => {
                                  setVendorSearch("");
                                  setFormData((prev) => ({
                                    ...prev,
                                    vendor: "",
                                  }));
                                }}
                                className="p-2"
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="max-h-40 overflow-y-auto pb-2">
                          {filteredVendors.length > 0 ? (
                            filteredVendors.map((vendor) => (
                              <div
                                key={vendor.id}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black flex justify-between items-center"
                              >
                                {editingVendorId === vendor.id ? (
                                  <div className="flex items-center gap-2 w-full">
                                    <input
                                      type="text"
                                      value={editingVendorName}
                                      onChange={(e) =>
                                        setEditingVendorName(e.target.value)
                                      }
                                      className="flex-grow p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleVendorNameUpdate(
                                            vendor.id,
                                            editingVendorName
                                          );
                                        } else if (e.key === "Escape") {
                                          setEditingVendorId(null);
                                          setEditingVendorName("");
                                        }
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={() =>
                                        handleVendorNameUpdate(
                                          vendor.id,
                                          editingVendorName
                                        )
                                      }
                                      className="p-1 text-green-600 hover:text-green-800 rounded hover:bg-green-50"
                                      title="Save changes"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingVendorId(null);
                                        setEditingVendorName("");
                                      }}
                                      className="p-1 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                                      title="Cancel"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span
                                      onClick={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          vendor: vendor.id,
                                        }));
                                        setShowVendorDropdown(false);
                                        setVendorSearch(vendor.name);
                                      }}
                                      className="flex-grow"
                                    >
                                      {vendor.name}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingVendorId(vendor.id);
                                        setEditingVendorName(vendor.name);
                                      }}
                                      className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                                      title="Edit vendor name"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 text-center">
                              No vendors found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Transaction Type
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="moneyIn"
                        checked={formData.type === "moneyIn"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Money In</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="moneyOut"
                        checked={formData.type === "moneyOut"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Money Out</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex-1 border-l pl-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Receipt Management
                  </h4>
                  <div className="flex gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,.pdf';
                        input.onchange = (e) => {
                          const files = e.target.files;
                          if (files.length > 0) {
                            setFiles(Array.from(files));
                            if (files[0].type.startsWith('image/')) {
                              const previewUrl = URL.createObjectURL(files[0]);
                              setEditingReceipt(previewUrl);
                            }
                          }
                        };
                        input.click();
                      }}
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Upload Receipt
                    </button>
                    <button
                      type="button"
                      disabled={files.length === 0 && !editingReceipt}
                      onClick={() => {
                        if (files.length > 0) {
                          handleFileUpload({ target: { files } });
                        } else if (editingReceipt) {
                          // Create a File object from the base64 image
                          fetch(editingReceipt)
                            .then(res => res.blob())
                            .then(blob => {
                              const file = new File([blob], "receipt.jpg", { type: "image/jpeg" });
                              handleFileUpload({ target: { files: [file] } });
                            })
                            .catch(err => {
                              console.error("Error converting receipt to file:", err);
                              toast.error("Failed to process receipt for extraction");
                            });
                        }
                      }}
                      className={`flex-1 px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                        files.length === 0 && !editingReceipt
                          ? 'bg-blue-200 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Extract Receipt Data
                      <span className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-3 py-1.5 rounded-full ml-1.5 font-semibold border border-yellow-200 shadow-sm flex items-center gap-2 group/badge hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-500 group-hover/badge:text-yellow-600 transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="relative">
                          AI
                          <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-yellow-300 scale-x-0 group-hover/badge:scale-x-100 transition-transform duration-300"></span>
                        </span>
                      </span>
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-start h-80 bg-white relative overflow-hidden mb-4">
                    {isExtractingReceipt && (
                      <div className="absolute inset-0 bg-white/90 flex items-center justify-center flex-col gap-3 z-10 rounded-lg">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                        <p className="text-sm text-gray-600">Extracting data from receipt...</p>
                      </div>
                    )}
                    {(files.length > 0 || editingReceipt) ? (
                      <>
                        <div className="w-full flex items-center justify-between mb-2">
                          <span className="text-gray-700 text-sm truncate">
                            {files.length > 0 ? files[0].name : "Current Receipt"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFiles([]);
                              if (editingReceipt && editingReceipt.startsWith('blob:')) {
                                URL.revokeObjectURL(editingReceipt);
                              }
                              setEditingReceipt(null);
                            }}
                            className="px-2 py-1 text-red-600 border border-red-300 rounded hover:bg-red-100 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex-1 w-full flex items-center justify-center">
                          <img
                            src={files.length > 0 ? URL.createObjectURL(files[0]) : editingReceipt}
                            alt="Receipt Preview"
                            className="max-h-56 max-w-full object-contain"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center py-12 w-full">No receipt selected</div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Supported formats: JPG, PNG, PDF
                  </p>
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border-2 bg-red-100 border-red-300 rounded hover:bg-red-200 transition-colors hover:cursor-pointer hover:text-red-600"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded transition-colors hover:cursor-pointer ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingId ? "Updating..." : "Saving..."}
                  </div>
                ) : editingId ? (
                  "Update Transaction"
                ) : (
                  "Save and Add New Transaction"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalCsvOpen && (
        <UploadCsv
          closeUploadModalCsvOpen={() => setIsUploadModalCsvOpen(false)}
        />
      )}

      {/* Add Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-4xl w-[80vw] max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Receipt</h3>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setCurrentReceipt(null);
                }}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-auto flex-1 flex items-center justify-center min-h-[60vh]">
              {isLoadingReceipt ? (
                <div className="flex justify-center items-center h-64 w-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <img
                    src={currentReceipt}
                    alt="Receipt"
                    className="max-w-full h-auto min-h-[50vh] object-contain border border-gray-200 shadow-sm"
                    onError={(e) => {
                      console.error("Image failed to load",e);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-between">
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setCurrentReceipt(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
