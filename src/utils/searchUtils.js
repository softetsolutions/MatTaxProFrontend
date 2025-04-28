export const searchAccountants = (accountants, searchTerm) => {
  if (!searchTerm.trim()) return accountants;

  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return accountants.filter(accountant => {
    const nameMatch = accountant.name.toLowerCase().includes(lowerSearchTerm);
    const addressMatch = accountant.address.toLowerCase().includes(lowerSearchTerm);
    return nameMatch || addressMatch;
  });
};