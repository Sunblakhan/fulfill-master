import React, { useContext, useState, useEffect } from "react";
import { setMessage, resetMessage, CONSTANT } from "../../CONSTANT";
import UserData from "./../../contexts/UserData"
import CreatableSelect from 'react-select/creatable';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddInventory() {
  const { session, setSession } = useContext(UserData);
  let navigate = useNavigate()
  const init__payload = {
    warehouse: null,
    totalSKU: 0,
    totalBoxes: 0,
    nameOnInventory: "",
    companyName: "",
    packageComingFrom: "",
    comments: "",
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
  
  const  addInventory =async (e) => {
    e.preventDefault();
    resetMessage();
    // Validate warehouse
    if (payload.warehouse !== "") {
      // Validate totalSKU
      if (payload.totalSKU > 0) {
        // Validate totalBoxes
        if (payload.totalBoxes > 0) {
          // Validate nameOnInventory
          if (payload.nameOnInventory.trim() !== "") {
            // Validate companyName
            if (payload.companyName.trim() !== "") {
              // Validate packageComingFrom
              if (payload.packageComingFrom.trim() !== "") {
                // All validations passed, proceed with adding inventory
                await axios
                .post(CONSTANT.server + `api/fba-inventory-requests/${session.personal.id}`, {
                  ...payload,
                  warehouse:payload.warehouse?.value
                })
                .then(async (responce) => {
                  if(responce?.message){
                    setMessage(responce?.message, "red-500")
                  }
                  else{
                    navigate("/fba/viewInventories");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              } else {
                setMessage("Please enter the package coming from.", "red-500");
              }
            } else {
              setMessage("Please enter the company name.", "red-500");
            }
          } else {
            setMessage("Please enter the name on inventory.", "red-500");
          }
        } else {
          setMessage("Please enter a valid number for total boxes.", "red-500");
        }
      } else {
        setMessage("Please enter a valid number for total SKU.", "red-500");
      }
    } else {
      setMessage("Please select a warehouse.", "red-500");
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Add Inventory - FBA
      </h2>
      <div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="warehouse"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Warehouse
            </label>
            <CreatableSelect
              name="warehouse"
              id="warehouse"
              isClearable
              onCreateOption={addWarehouse}
              value={payload.warehouse}
              onChange={(data)=>{
                setPayload({
                  ...payload,
                  "warehouse": data,
                });
              }}
              options={warehouses}
              placeholder="Select or create warehouse"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="totalSKU"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Total SKU
            </label>
            <input
              type="number"
              name="totalSKU"
              id="totalSKU"
              value={payload.totalSKU}
              onChange={changePayload}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Total SKU"
              min="1"
              max="12"
              required
            />
          </div>
          <div>
            <label
              htmlFor="totalBoxes"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Total Boxes
            </label>
            <input
              type="number"
              name="totalBoxes"
              id="totalBoxes"
              value={payload.totalBoxes}
              onChange={changePayload}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Total Boxes"
              min="1"
              max="20"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="nameOnInventory"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name on Inventory
            </label>
            <input
              type="text"
              name="nameOnInventory"
              id="nameOnInventory"
              value={payload.nameOnInventory}
              onChange={changePayload}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Name on Inventory"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="companyName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={payload.companyName}
              onChange={changePayload}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Company Name"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="packageComingFrom"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Package Coming From
            </label>
            <input
              type="text"
              name="packageComingFrom"
              id="packageComingFrom"
              value={payload.packageComingFrom}
              onChange={changePayload}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="e.g. Amazon Ebay Walmart"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="comments"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              What prep is needed and additional comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={4}
              value={payload.comments}
              onChange={changePayload}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Your comments here"
            />
          </div>
        </div>
        <button
          onClick={addInventory}
          className="w-full mt-5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add Inventory
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
