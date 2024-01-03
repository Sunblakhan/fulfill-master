import React, { useContext, useState, useEffect } from "react";
import { setMessage, resetMessage, CONSTANT } from "../../CONSTANT";
import UserData from "./../../contexts/UserData";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox";
import CustomButton from "../../components/CustomButton";
import { FaRocket } from "react-icons/fa";

export default function AddInventory() {
  const { session, setSession } = useContext(UserData);
  let navigate = useNavigate();
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

  const [warehouses, setWarehouses] = useState([]);

  const fetchWarehouses = async () => {
    await axios
      .get(
        CONSTANT.server + `api/logistics-registration/${session?.personal?.id}`
      )
      .then(async (responce) => {
        setWarehouses(
          responce?.data
          ?.filter((a, b) => {
            return a.status === "approve";
          })
          .map((a) => {
            return a?.warehouse;
          })
        );
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

  const addInventory = async (e) => {
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
                  .post(
                    CONSTANT.server +
                      `api/fbm-inventory-requests/${session?.personal?.id}`,
                    {
                      ...payload,
                      warehouse: parseInt(payload.warehouse),
                    }
                  )
                  .then(async (responce) => {
                    if (responce?.message) {
                      setMessage(responce?.message, "red-500");
                    } else {
                      navigate("/fbm/viewInventories");
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
      <h1 class="mb-5 text-center text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
        FBM
      </h1>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        Add Inventory Request
      </h1>
      <div>
        <div className="flex flex-col space-y-4">
          {/* <div className="sm:col-span-2">
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
              classNamePrefix="__multiple"
              value={payload.warehouse}
              onChange={(data) => {
                setPayload({
                  ...payload,
                  warehouse: data,
                });
              }}
              options={warehouses}
              placeholder="Select or create warehouse"
              className="text-gray-900 text-sm rounded-lg block w-full"
              required
            />
          </div> */}
          <InputBox
            type="select"
            name="warehouse"
            label="Warehouse"
            value={payload.warehouse}
            onChange={changePayload}
            options={[
              {
                id: "",
                name: "Select client",
              },
              ...warehouses.map((a) => {
                return {
                  id: a?.id,
                  name: `${a?.name} (${a?.email})`,
                };
              }),
            ]}
          />
          <div className="flex flex-row space-x-2">
            <InputBox
              type="number"
              name="totalSKU"
              value={payload.totalSKU}
              onChange={changePayload}
              label="Total SKU"
              min="1"
              max="12"
            />

            <InputBox
              type="number"
              name="totalBoxes"
              value={payload.totalBoxes}
              onChange={changePayload}
              label="Total Boxes"
              min="1"
              max="20"
            />
          </div>
          <div className="flex flex-row space-x-2">
            <InputBox
              name="nameOnInventory"
              value={payload.nameOnInventory}
              onChange={changePayload}
              label="Name on Inventory"
            />
            <InputBox
              name="companyName"
              value={payload.companyName}
              onChange={changePayload}
              label="Company Name"
            />
          </div>

          <InputBox
            name="packageComingFrom"
            value={payload.packageComingFrom}
            onChange={changePayload}
            label="Package Coming From"
            placeholder="e.g. Amazon Ebay Walmart"
          />
          <InputBox
            name="comments"
            type="textarea"
            value={payload.comments}
            onChange={changePayload}
            label="What prep is needed and additional comments"
            placeholder="Your comments here"
          />
        </div>
        <CustomButton
          className="mt-5"
          label="Send Request"
          onClick={addInventory}
          icon={<FaRocket />}
        />
        <div className="my-10" id="error" style={{ display: "none" }}></div>
      </div>
    </div>
  );
}
