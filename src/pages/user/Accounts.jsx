import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchUserDetails, updateUserDetails } from "../../utils/user";
import { User, Mail, Phone, MapPin, Edit2, X, Check } from "lucide-react";
import PhoneInput from "react-phone-input-2";

export default function AccountPage() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    postcode: "",
    country: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserDetails();
        setUserData(data);
        setFormData(data);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = await updateUserDetails(formData);
      setUserData(updatedData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.message || "Failed to update profile. Please try again."
      );
    }
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!userData.firstName && !userData.lastName) return "U";
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(
      0
    )}`.toUpperCase();
  };

  const fields = [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      icon: User,
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      icon: User,
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      disabled: true,
      icon: Mail,
    },
    { id: "phone", label: "Phone Number", type: "tel", icon: Phone },
    {
      id: "addressLine1",
      label: "Address Line 1",
      type: "text",
      fullWidth: true,
      icon: MapPin,
    },
    {
      id: "city",
      label: "City",
      type: "text",
      icon: MapPin,
    },
    {
      id: "postcode",
      label: "Postcode",
      type: "text",
      icon: MapPin,
    },
    {
      id: "country",
      label: "Country",
      type: "text",
      icon: MapPin,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">
            Manage your personal information and account preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-700 shadow-lg border-4 border-white">
              {getInitials()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="text-blue-100 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail size={16} />
                {userData.email}
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Phone size={16} />
                {userData.phone || "No phone number"}
              </p>
              <p className="text-blue-100 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <MapPin size={16} />
                {userData.addressLine1 || "No address"}
                {userData.city && `, ${userData.city}`}
                {userData.postcode && `, ${userData.postcode}`}
                {userData.country && `, ${userData.country}`}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start"></div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="ml-auto hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm font-medium hover:cursor-pointer"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {!isEditing && (
              <div className="sm:hidden mb-6 flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.id}
                        className={field.fullWidth ? "md:col-span-2" : ""}
                      >
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} className="text-blue-600" />
                            {field.label}
                            {field.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </div>
                        </label>
                        <div className="relative">
                          {field.id === "phone" ? (
                            <PhoneInput
                              country={"gb"}
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              inputProps={{
                                name: "phone",
                                required: true,
                                autoFocus: false,
                              }}
                              inputStyle={{
                                width: "100%",
                                height: "48px",
                                borderRadius: "0.5rem",
                                border: "1px solid #e5e7eb",
                                paddingLeft: "48px",
                                fontSize: "1rem",
                                color: "#000000",
                                backgroundColor: "#fff",

                              }}
                              dropdownStyle={{
                                color: "#000000",
                                backgroundColor: "#ffffff"
                              }}
                              buttonStyle={{
                                border: "none",
                                background: "none",
                                left: "12px",
                                top: "12px",
                                paddingBottom: "10px",
                              }}
                              containerStyle={{
                                width: "100%",
                              }}
                            />
                          ) : (
                            <input
                              type={field.type}
                              id={field.id}
                              name={field.id}
                              value={formData[field.id] || ""}
                              onChange={handleChange}
                              className={`w-full p-3 pl-4 bg-white border ${
                                field.disabled
                                  ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                                  : "hover:border-blue-300"
                              } border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200`}
                              required={field.required}
                              disabled={field.disabled}
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                          )}
                        </div>
                        {field.disabled && (
                          <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                            Email cannot be changed for security reasons
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="hover:cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="hover:cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow font-medium"
                  >
                    <Check size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.slice(0, 2).map((field) => {
                      const Icon = field.icon;
                      return (
                        <div
                          key={field.id}
                          className="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                            <Icon size={16} className="text-blue-600" />
                            {field.label}
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            {userData[field.id] || "Not provided"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.slice(2, 4).map((field) => {
                      const Icon = field.icon;
                      return (
                        <div
                          key={field.id}
                          className="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                            <Icon size={16} className="text-blue-600" />
                            {field.label}
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            {userData[field.id] || "Not provided"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: "addressLine1", label: "Address Line 1" },
                      { id: "city", label: "City" },
                      { id: "postcode", label: "Postcode" },
                      { id: "country", label: "Country" },
                    ].map((field) => (
                      <div
                        key={field.id}
                        className="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                          <MapPin size={16} className="text-blue-600" />
                          {field.label}
                        </div>
                        <p className="text-gray-900">
                          {userData[field.id] || <span className="italic text-gray-400">Not provided</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
