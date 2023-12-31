import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./auth/Login";
import Home from "./views/Home";
import Layout from "./layout/Layout";
import TakeMeToAdmin from "./components/TakeMeToAdmin";
import Register from "./auth/Register";
import AddInventory from "./views/FBA/AddInventory";
import ViewInventories from "./views/FBA/ViewInventories";
import LogisticsRegistration from "./views/LogisticsRegistration";

function App() {
  return (
    <div className="App min-h-screen h-full">
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
            path="/logisticsRegistration"
            element={
              <Layout>
                <LogisticsRegistration />
              </Layout>
            }
          />
          <Route path="/admin" element={<TakeMeToAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
