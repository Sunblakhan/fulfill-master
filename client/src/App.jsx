import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./auth/Login";
import Home from "./views/Home";
import Layout from "./layout/Layout";
import TakeMeToAdmin from "./components/TakeMeToAdmin";
import Register from "./auth/Register";
import AddInventory from "./views/FBA/AddInventory";
import ViewInventories from "./views/FBA/ViewInventories";
import FBMAddInventory from "./views/FBM/AddInventory";
import FBMViewInventories from "./views/FBM/ViewInventories";
import AddOrder from "./views/FBM/AddOrder";
import LogisticsRegistration from "./views/LogisticsRegistration";
import "./App.css";
import ViewOrders from "./views/FBM/ViewOrders";
import OrderRequests from "./views/Logistic/OrderRequests";
import InventoryRequests from "./views/Logistic/InventoryRequests";
import NewClientRequests from "./views/Logistic/NewClientRequests";
import AddInvoice from "./views/Logistic/AddInvoice";
import Page404 from "./views/Page404";
import ViewInvoices from "./views/Logistic/ViewInvoices";

function App() {
  return (
    <div className="App min-h-screen h-full bg-[#F4F7FA]">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/fba/addInventory"
            element={
              <Layout>
                <AddInventory />
              </Layout>
            }
          />
          <Route
            path="/fba/viewInventories"
            element={
              <Layout>
                <ViewInventories />
              </Layout>
            }
          />
          <Route
            path="/fbm/addInventory"
            element={
              <Layout>
                <FBMAddInventory />
              </Layout>
            }
          />
          <Route
            path="/fbm/viewInventories"
            element={
              <Layout>
                <FBMViewInventories />
              </Layout>
            }
          />
          <Route
            path="/fbm/addOrder"
            element={
              <Layout>
                <AddOrder />
              </Layout>
            }
          />
          <Route
            path="/fbm/viewOrders"
            element={
              <Layout>
                <ViewOrders />
              </Layout>
            }
          />
          <Route
            path="/logisticsRegistration"
            element={
              <Layout>
                <LogisticsRegistration />
              </Layout>
            }
          />
          {/* Logistics */}

          <Route
            path="/logistic/orderRequests"
            element={
              <Layout>
                <OrderRequests />
              </Layout>
            }
          />
          <Route
            path="/logistic/inventoryRequests"
            element={
              <Layout>
                <InventoryRequests />
              </Layout>
            }
          />
          <Route
            path="/logistic/newClientRequests"
            element={
              <Layout>
                <NewClientRequests />
              </Layout>
            }
          />
          <Route
            path="/logistic/addInvoice"
            element={
              <Layout>
                <AddInvoice />
              </Layout>
            }
          />
          <Route
            path="/logistic/viewInvoices"
            element={
              <Layout>
                <ViewInvoices all={true} />
              </Layout>
            }
          />
          <Route
            path="/logistic/myInvoices"
            element={
              <Layout>
                <ViewInvoices />
              </Layout>
            }
          />
          <Route path="/admin" element={<TakeMeToAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
