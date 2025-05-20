import Cookies from 'js-cookie';

const COOKIE_KEY = 'gstVatPercentage';
const DEFAULT_PERCENTAGE = '20';
const COOKIE_EXPIRY = 365; 

export const getDefaultGstPercentage = () => {
  const savedPercentage = Cookies.get(COOKIE_KEY);
  return savedPercentage || DEFAULT_PERCENTAGE;
};

export const saveGstPercentage = (percentage) => {
  Cookies.set(COOKIE_KEY, percentage, { expires: COOKIE_EXPIRY });
};

export const calculateGstAmount = (amount, percentage) => {
  if (!amount || !percentage) return '';
  const parsedAmount = parseFloat(amount);
  const parsedPercentage = parseFloat(percentage);
  if (isNaN(parsedAmount) || isNaN(parsedPercentage)) return '';
  return ((parsedPercentage / 100) * parsedAmount).toFixed(2);
}; 