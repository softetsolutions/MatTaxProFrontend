import { History, User, Trash2 } from "lucide-react";

export const routeMapping = {
  transactions: "Transactions",
  addaccountant: "Add Accountant",
  users: "Users",
  bin: "Bin",
};

export const iconMapping = (route) => {
  if (route === "transactions") return History;
  else if (route === "addaccountant" || route === "users") return User;
  else if (route === "bin") return Trash2;
  else return null
};
