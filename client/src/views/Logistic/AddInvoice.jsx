import React, { useContext, useState, useEffect } from "react";
import { setMessage, resetMessage, CONSTANT } from "../../CONSTANT";
import UserData from "./../../contexts/UserData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputBox from "../../components/InputBox";
import CustomButton from "../../components/CustomButton";

import { FaRocket } from "react-icons/fa";

const ContactInfo = ({ selected, list = [] }) => {
  let temp = list.find((a, b) => {
    return parseInt(a?.id) === parseInt(selected);
  });
  return (
    <>
      <div class="text-gray-700 mb-2 mt-3">{temp?.name}</div>
      <div class="text-gray-700 mb-2">{temp?.address}</div>
      <div class="text-gray-700">{temp?.email}</div>
    </>
  );
};

export default function AddInvoice() {
  const { session, setSession } = useContext(UserData);
  let navigate = useNavigate();
  const init__payload = {
    user: null,
    products: [],
    total: 0,
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
      .get(CONSTANT.server + `api/logistics-registration`)
      .then(async (responce) => {
        setWarehouses(
          responce?.data?.filter((a, b) => {
            return (
              parseInt(a?.warehouse?.id) === session?.personal?.id &&
              a?.status === "approve"
            );
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session?.isLoggedIn) {
      fetchWarehouses();
    }
  }, [session]);

  const [newProduct, setNewProduct] = useState({
    label: "",
    quantity: 1,
    amount: 0,
    id: 0,
  });

  // ... existing functions

  const handleNewProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = () => {
    resetMessage();
    if (!newProduct.label) {
      setMessage("Please enter label.", "red-500");
      return;
    }
    if (newProduct.quantity < 1) {
      setMessage("Please enter quantity.", "red-500");
      return;
    }
    if (newProduct.amount < 0) {
      setMessage("Please enter amount.", "red-500");
      return;
    }
    // Assuming product.id is required and should be unique
    const productWithId = { ...newProduct, id: Date.now() };
    setPayload({
      ...payload,
      products: [...payload.products, productWithId],
    });
    setNewProduct({ label: "", quantity: 1, amount: 0, id: newProduct.length }); // Reset form
  };
  // Function to handle product deletion
  const handleDeleteProduct = (id) => {
    setPayload({
      ...payload,
      products: payload.products.filter((product) => product.id !== id),
    });
  };

  const calculateTotal = () => {
    return payload.products.reduce((acc, product) => {
      return acc + product.quantity * product.amount;
    }, 0);
  };

  const addInvoice = async (e) => {
    e.preventDefault();
    resetMessage();

    // Validate name
    if (!payload.user) {
      setMessage("Please select a user.", "red-500");
      return;
    }

    // Validate email
    if (payload.products?.length <= 0) {
      setMessage("Please add atleast one product.", "red-500");
      return;
    }

    // All validations passed, proceed with adding inventory
    await axios
      .post(CONSTANT.server + `api/invoice`, {
        ...payload,
        total: calculateTotal(),
        products: JSON.stringify(payload.products),
      })
      .then(async (response) => {
        if (response?.message) {
          setMessage(response?.message, "red-500");
        } else {
          navigate("/?added=Success");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        Add Invoice
      </h1>
      <div class="bg-white rounded-lg shadow-lg px-8 py-10 max-w-xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div class="flex flex-col justify-center space-y-2">
            <img class="w-20 mr-2" src="/logo_nav.png" alt="Logo" />
            <div class="text-gray-700 font-semibold text-lg">
              {/* {session?.personal?.companyName} */}
            </div>
          </div>
          <div class="text-gray-700">
            <div class="font-bold text-xl mb-2">INVOICE</div>
            <div className="text-sm">
              Date: {new Date().toLocaleDateString()}
            </div>
            <div className="text-sm">
              Invoice #: {Math.floor(Math.random() * 1000) + 1}
            </div>
          </div>
        </div>
        <div className="my-10" id="error" style={{ display: "none" }}></div>
        <div class="border-b-2 border-gray-300 pb-8 mb-8">
          <h2 class="text-2xl font-bold mb-4">Bill To:</h2>
          <InputBox
            type="select"
            name="user"
            value={payload.user}
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
          {payload.user && (
            <ContactInfo selected={payload.user} list={warehouses} />
          )}
        </div>
        <table class="w-full text-left mb-8">
          <thead>
            <tr>
              <th class="text-gray-700 font-bold uppercase py-2">
                Description
              </th>
              <th class="text-gray-700 font-bold uppercase py-2">Quantity</th>
              <th class="text-gray-700 font-bold uppercase py-2">Price</th>
              <th class="text-gray-700 font-bold uppercase py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {payload.products.map((product, index) => (
              <tr key={index}>
                <td class="py-4 text-gray-700">{product?.label}</td>
                <td class="py-4 text-gray-700">{product?.quantity}</td>
                <td class="py-4 text-gray-700">
                  ${parseInt(product?.amount).toFixed(2)}
                </td>
                <td class="py-4 text-gray-700">
                  ${parseInt(product?.quantity * product?.amount).toFixed(2)}
                </td>
                <td className="py-4 text-gray-700">
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex flex-row space-x-4 my-5">
          <InputBox
            type="text"
            name="label"
            value={newProduct.label}
            onChange={handleNewProductChange}
            placeholder="Description"
          />
          <InputBox
            type="number"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleNewProductChange}
            placeholder="Quantity"
          />
          <InputBox
            type="number"
            name="amount"
            value={newProduct.amount}
            onChange={handleNewProductChange}
            placeholder="Amount"
          />
          <CustomButton
            onClick={handleAddProduct}
            label="Add"
            width="w-fit whitespace-nowrap"
            padding="px-2"
          />
        </div>
        <div class="flex justify-end items-end mb-8">
          <div class="text-gray-700 mr-2">Total:</div>
          <div class="text-gray-700 font-bold text-xl">
            ${calculateTotal().toFixed(2)}
          </div>
        </div>
        <div class="border-t-2 border-gray-300 pt-8 mb-8">
          <InputBox
            type="textarea"
            name="comments"
            value={payload.comments}
            onChange={changePayload}
            label="Comments"
            placeholder="Add your comments here"
          />
        </div>
        <CustomButton
          onClick={addInvoice}
          icon={<FaRocket />}
          label="Send"
          className="mt-5"
        />
      </div>
    </div>
  );
}
