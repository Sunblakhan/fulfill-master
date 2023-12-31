import React, { useContext, useState, useEffect } from "react";
import { setMessage, resetMessage, CONSTANT } from "../CONSTANT";
import UserData from "./../contexts/UserData"
import CreatableSelect from 'react-select/creatable';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LogisticsRegistration() {
  const { session, setSession } = useContext(UserData);
  let navigate = useNavigate()
  const init__payload = {
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    branch: "fba",
    type: "oa",
    minimumInventory: "0-30",
  };

  const [payload, setPayload] = useState(init__payload);

  const changePayload = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const [warehouses, setWarehouses] = useState([])

  
  const fetchWarehouses = async (select = "") => {
    await axios
      .get(CONSTANT.server + `api/warehouses/${session.personal.id}`)
      .then(async (responce) => {
        setWarehouses(responce?.data?.map((a,b)=>{
          if(select === a?.name){
            setPayload({
              ...payload,
              "warehouse": {
                value:a?.id,
                label:a?.name,
              },
            });
          }
          return {
            value:a?.id,
            label:a?.name,
          }
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addWarehouse = async (name) => {
    await axios
      .post(CONSTANT.server + `api/warehouses/${session.personal.id}`, {
        name:name
      })
      .then(async (responce) => {
        fetchWarehouses(name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  

  useEffect(() => {
    if (session.isLoggedIn) {
      fetchWarehouses();
    }
  }, [session]);
  
  const register = async (e) => {
    e.preventDefault();
    resetMessage();
  
    // Validate name
    if (payload.name.trim() === "") {
      setMessage("Please enter a name.", "red-500");
      return;
    }
  
    // Validate email
    if (payload.email.trim() === "") {
      setMessage("Please enter an email address.", "red-500");
      return;
    }
  
    // Validate phone
    if (payload.phone.trim() === "") {
      setMessage("Please enter a phone number.", "red-500");
      return;
    }
  
    // Validate businessName
    if (payload.businessName.trim() === "") {
      setMessage("Please enter a business name.", "red-500");
      return;
    }
  
    // Validate businessAddress
    if (payload.businessAddress.trim() === "") {
      setMessage("Please enter a business address.", "red-500");
      return;
    }
  
    // Validate branch
    if (!payload.branch) {
      setMessage("Please select a branch.", "red-500");
      return;
    }
  
    // Validate type
    if (!payload.type) {
      setMessage("Please select a type.", "red-500");
      return;
    }
  
    // Validate minimumInventory
    if (!payload.minimumInventory) {
      setMessage("Please select a minimum inventory range.", "red-500");
      return;
    }
  
    // All validations passed, proceed with adding inventory
    await axios
      .post(CONSTANT.server + `api/logistics-registration/${session.personal.id}`, {
        ...payload,
      })
      .then(async (response) => {
        if (response?.message) {
          setMessage(response?.message, "red-500");
        } else {
          navigate("/?registered=Success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  
  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Register Yourself To Logistics
      </h2>
      <div>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-4">
  <div>
    <label
      htmlFor="name"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Name
    </label>
    <input
      type="text"
      name="name"
      id="name"
      value={payload.name}
      onChange={changePayload}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      placeholder="Name"
      required
    />
  </div>
  <div className="flex space-x-4">
    <div>
      <label
        htmlFor="email"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Email
      </label>
      <input
        type="email"
        name="email"
        id="email"
        value={payload.email}
        onChange={changePayload}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="Email"
        required
      />
    </div>
    <div>
      <label
        htmlFor="phone"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Phone
      </label>
      <input
        type="tel"
        name="phone"
        id="phone"
        value={payload.phone}
        onChange={changePayload}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="Phone"
        required
      />
    </div>
  </div>
  <div className="flex space-x-4">
    <div>
      <label
        htmlFor="businessName"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Business Name
      </label>
      <input
        type="text"
        name="businessName"
        id="businessName"
        value={payload.businessName}
        onChange={changePayload}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="Business Name"
        required
      />
    </div>
    <div>
      <label
        htmlFor="businessAddress"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Business Address
      </label>
      <input
        type="text"
        name="businessAddress"
        id="businessAddress"
        value={payload.businessAddress}
        onChange={changePayload}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="Business Address"
        required
      />
    </div>
  </div>
  <div>
    <label
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Branch
    </label>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id="fba"
        name="branch"
        value="fba"
        checked={payload.branch === "fba"}
        onChange={changePayload}
        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
      />
      <label htmlFor="fba" className="text-sm text-gray-900 dark:text-white">
        FBA
      </label>
      <input
        type="radio"
        id="fbm"
        name="branch"
        value="fbm"
        checked={payload.branch === "fbm"}
        onChange={changePayload}
        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
      />
      <label htmlFor="fbm" className="text-sm text-gray-900 dark:text-white">
        FBM
      </label>
    </div>
  </div>
  <div>
    <label
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Type
    </label>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id="oa"
        name="type"
        value="oa"
        checked={payload.type === "oa"}
        onChange={changePayload}
        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
      />
      <label htmlFor="oa" className="text-sm text-gray-900 dark:text-white">
        OA
      </label>
      <input
        type="radio"
        id="wholesale"
        name="type"
        value="wholesale"
        checked={payload.type === "wholesale"}
        onChange={changePayload}
        className="text-primary-600 focus:ring-primary-500 h-4 w-4"
      />
      <label htmlFor="wholesale" className="text-sm text-gray-900 dark:text-white">
        Wholesale
      </label>
    </div>
  </div>
  <div>
    <label
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Minimum Inventory
    </label>
    <select
      name="minimumInventory"
      id="minimumInventory"
      value={payload.minimumInventory}
      onChange={changePayload}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
    >
      <option value="0-30">0-30</option>
      <option value="50-100">50-100</option>
      <option value="100<">100&lt;</option>
    </select>
  </div>
</div>

        <button
          onClick={register}
          className="w-full mt-5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Register
        </button>
        <div
          className="my-10"
          id="error"
          style={{ display: "none" }}
        ></div>
      </div>
    </div>
  );
}
