import React, { useContext } from "react";
import UserData from "../contexts/UserData";
import Dashboard from "./Logistic/Dashboard";
import SellerDashboard from "./Dashboard";

export default function Home() {
  const { session, setSession } = useContext(UserData);

  if (session?.personal?.mode === "logistic") {
    return <Dashboard />;
  }
  return <SellerDashboard />;
}
