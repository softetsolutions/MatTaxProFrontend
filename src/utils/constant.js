import { History, User, Trash2, Mail} from "lucide-react";

export const routeMapping = {
  transactions: "Transactions",
  addaccountant: "Add Accountant",
  users: "Users",
  bin: "Bin",
  invitations: "Invitations",
};

export const iconMapping = (route) => {
  if (route === "transactions") return History;
  else if (route === "addaccountant" || route === "users") return User;
  else if (route === "invitations") return Mail;
  else if (route === "bin") return Trash2;
  else return null
};
