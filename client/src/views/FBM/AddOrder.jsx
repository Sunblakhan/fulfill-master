import React, { useContext, useState, useEffect } from "react";
import { setMessage, resetMessage, CONSTANT } from "../../CONSTANT";
import UserData from "../../contexts/UserData";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox";
import CustomButton from "../../components/CustomButton";
import { FaRocket } from "react-icons/fa";

export default function AddOrder() {
  let tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 2);
  let formattedTomorrowDate = tomorrowDate.toISOString().split("T")[0];

  const { session, setSession } = useContext(UserData);
  let navigate = useNavigate();
  const init__payload = {
    product: null,
    labelType: "labelYourself",
    pdf: null,
    prep: "",
    expectedDeliveryDate: formattedTomorrowDate,
  };

  const [payload, setPayload] = useState(init__payload);

  const changePayload = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    await axios
      .get(
        CONSTANT.server + `api/fbm-inventory-requests/${session?.personal?.id}`
      )
      .then(async (responce) => {
        setProducts(
          responce?.data?.map((a, b) => {
            return {
              id: a?.id,
              name: a?.nameOnInventory,
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session.isLoggedIn) {
      fetchProducts();
    }
  }, [session]);

  const addOrder = async (e) => {
    e.preventDefault();
    resetMessage();

    // Validations
    if (!payload.product) {
      setMessage("Please select a product.", "red-500");
      return;
    }
    if (!payload.labelType) {
      setMessage("Please select a label type.", "red-500");
      return;
    }
    if (!payload.pdf) {
      setMessage("Please upload a PDF.", "red-500");
      return;
    }
    if (!payload.expectedDeliveryDate) {
      setMessage("Please select an expected delivery date.", "red-500");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("product", payload.product);
    formData.append("labelType", payload.labelType);
    formData.append("pdf", payload.pdf);
    formData.append("prep", payload.prep);
    formData.append("expectedDeliveryDate", payload.expectedDeliveryDate);

    // Make API call with FormData
    await axios
      .post(
        CONSTANT.server + `api/fbm-orders/${session?.personal?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(async (response) => {
        if (response?.data?.message) {
          setMessage(response.data.message, "green-500"); // Assuming success messages are green
        } else {
          navigate("/fbm/viewOrders"); // Adjust the redirect as necessary
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage("Error in submitting order. Please try again.", "red-500");
      });
  };

  return (
    <div className="w-full">
      <h1 class="mb-5 text-center text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
        FBM
      </h1>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        Add Order Request
      </h1>
      <div>
        <div className="flex flex-col space-y-4">
          <InputBox
            type="select"
            name="product"
            value={payload.product}
            onChange={changePayload}
            label="Product"
            options={[
              {
                id: "",
                name: "Select product",
              },
              ...products,
            ]}
          />
          <div>
            <label
              htmlFor="mode"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select label type
            </label>
            <div className="flex flex-row w-full space-x-2">
              <InputBox
                name="labelType"
                type="radio"
                value="labelYourself"
                label="Label Yourself"
                checked={payload.labelType === "labelYourself"}
                onChange={changePayload}
              />
              <InputBox
                name="labelType"
                type="radio"
                value="provideLabel"
                label="Provide Label"
                checked={payload.labelType === "provideLabel"}
                onChange={changePayload}
              />
            </div>
          </div>
          <InputBox
            type="file"
            value={payload.product}
            onChange={(e) => {
              setPayload({
                ...payload,
                pdf: e.target.files[0],
              });
            }}
            label={`${
              payload.labelType === "labelYourself"
                ? "Download Order ID form from amazon and attach your file in .pdf"
                : "Download and buy shipping label form and add file here"
            }`}
          />
          <InputBox
            name="prep"
            type="textarea"
            value={payload.prep}
            onChange={changePayload}
            label="What prep is needed?"
            placeholder="..."
          />
          <InputBox
            type="date"
            name="expectedDeliveryDate"
            value={payload.expectedDeliveryDate}
            onChange={changePayload}
            label="Expected Delivery Date"
          />
        </div>
        <CustomButton
          className="mt-5"
          label="Send Request"
          onClick={addOrder}
          icon={<FaRocket />}
        />
        <div className="my-10" id="error" style={{ display: "none" }}></div>
      </div>
    </div>
  );
}
