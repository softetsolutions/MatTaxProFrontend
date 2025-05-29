import { History, User, Trash2, Mail, UserRoundPlus, Proportions } from "lucide-react";

export const routeMapping = {
  transactions: "Transactions",
  addaccountant: "Authorise Accountant",
  users: "Users",
  bin: "Bin",
  invitations: "Invitations",
  accounts: "Profile",
  allUsers: "All Users",
  allAccountants: "All Accountants",
  report: "Report"
};

export const iconMapping = (route) => {
  if (route === "transactions") return History;
  else if (route === "addaccountant") return UserRoundPlus;
  else if (route === "users" || route === "accounts" || route === "allUsers" || route === "allAccountants") return User;
  else if (route === "invitations") return Mail;
  else if (route === "bin") return Trash2;
  else if (route === "report") return Proportions;
  else return null; 
};
