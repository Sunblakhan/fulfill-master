import React, { useContext, useState, useEffect } from "react";
import { setMessage, resetMessage, CONSTANT } from "../CONSTANT";
import UserData from "./../contexts/UserData";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import { FaRocket } from "react-icons/fa";
import CustomButton from "../components/CustomButton";

export default function LogisticsRegistration() {
  const { session, setSession } = useContext(UserData);
  let navigate = useNavigate();
  const init__payload = {
    warehouse: "",
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    branch: "fba",
    type: "oa",
    minimumInventory: null,
  };

  const [payload, setPayload] = useState(init__payload);

  const changePayload = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();
    resetMessage();

    // Validate name
    if (!payload.warehouse) {
      setMessage("Please select a warehouse.", "red-500");
      return;
    }
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email.trim())) {
      setMessage("Please enter a valid email address.", "red-500");
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

    // Validate type
    if (payload.type === "oa" && !payload?.minimumInventory) {
      setMessage("Please select a minimum inventory.", "red-500");
      return;
    }

    // All validations passed, proceed with adding inventory
    await axios
      .post(
        CONSTANT.server + `api/logistics-registration/${session?.personal?.id}`,
        {
          ...payload,
        }
      )
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

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    await axios
      .get(CONSTANT.server + `authentication/user`)
      .then(async (responce) => {
        let temp = [];
        responce?.data?.map((a, b) => {
          if (a?.mode === "seller") {
            return;
          }
          temp.push({
            ...a,
          });
        });
        setUsers(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session?.isLoggedIn) {
      fetchUsers();
    }
  }, [session]);

  return (
    <div className="w-full">
      <h1 class="mb-5 text-center text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
        FBM
      </h1>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        Register Yourself To Logistics
      </h1>
      <div>
        <div className="w-full flex flex-col space-y-3">
          <InputBox
            type="select"
            name="warehouse"
            label="Warehouse"
            value={payload.warehouse}
            onChange={changePayload}
            options={[
              {
                id: "",
                name: "Select warehouse",
              },
              ...users.map((a) => {
                return {
                  id: a?.id,
                  name: `${a?.name} (${a?.email})`,
                };
              }),
            ]}
          />
          <InputBox
            type="text"
            name="name"
            value={payload.name}
            onChange={changePayload}
            label="Name"
          />
          <div className="flex flex-row space-x-2">
            <InputBox
              type="email"
              name="email"
              value={payload.email}
              onChange={changePayload}
              label="Email"
            />
            <InputBox
              type="tel"
              name="phone"
              value={payload.phone}
              onChange={changePayload}
              label="Phone"
            />
          </div>
          <div className="flex flex-row space-x-2">
            <InputBox
              type="text"
              name="businessName"
              value={payload.businessName}
              onChange={changePayload}
              label="Business Name"
            />
            <InputBox
              type="text"
              name="businessAddress"
              value={payload.businessAddress}
              onChange={changePayload}
              label="Business Address"
            />
          </div>

          {/* Radio buttons for Branch */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Branch
            </label>
            <div className="flex flex-row space-x-2">
              <InputBox
                name="branch"
                type="radio"
                value="fba"
                label="FBA"
                checked={payload.branch === "fba"}
                onChange={changePayload}
              />
              <InputBox
                name="branch"
                type="radio"
                value="fbm"
                label="FBM"
                checked={payload.branch === "fbm"}
                onChange={changePayload}
              />
            </div>
          </div>
          {/* Radio buttons for Type */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Type
            </label>
            <div className="flex flex-row space-x-2">
              <InputBox
                name="type"
                type="radio"
                value="oa"
                label="OA"
                checked={payload.type === "oa"}
                onChange={changePayload}
              />
              <InputBox
                name="type"
                type="radio"
                value="wholesale"
                label="Wholesale"
                checked={payload.type === "wholesale"}
                onChange={changePayload}
              />
            </div>
          </div>
          {payload.type === "oa" && (
            <InputBox
              type="select"
              name="minimumInventory"
              value={payload.minimumInventory}
              onChange={changePayload}
              label="Your minimum OA ordered inventory"
              options={[
                {
                  id: "",
                  name: "Select minimum ordered inventory",
                },
                {
                  id: "0-30",
                  name: "0-30",
                },
                {
                  id: "50-100",
                  name: "50-100",
                },
                {
                  id: "100<",
                  name: "100<",
                },
              ]}
            />
          )}
        </div>

        <CustomButton
          onClick={register}
          icon={<FaRocket />}
          label="Register"
          className="mt-5"
        />
        <div className="my-10" id="error" style={{ display: "none" }}></div>
      </div>
    </div>
  );
}
