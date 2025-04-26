import { History, User, Trash2, Mail, UserRoundPlus } from "lucide-react";

export const routeMapping = {
  transactions: "Transactions",
  addaccountant: "Add Accountant",
  users: "Users",
  bin: "Bin",
  invitations: "Invitations",
  accounts: "Accounts",
};

export const iconMapping = (route) => {
  if (route === "transactions") return History;
  else if (route === "addaccountant") return UserRoundPlus;
  else if (route === "users" || route === "accounts") return User;
  else if (route === "invitations") return Mail;
  else if (route === "bin") return Trash2;
  else return null;
};
