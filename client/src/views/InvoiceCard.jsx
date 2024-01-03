import React, { useContext, useState, useEffect } from "react";
import {
  setMessage,
  resetMessage,
  CONSTANT,
  camelCaseToNormalString,
} from "../CONSTANT";
import UserData from "./../contexts/UserData";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InputBox from "../components/InputBox";
import CustomButton from "../components/CustomButton";

import { FaRocket } from "react-icons/fa";

const ContactInfo = ({ temp }) => {
  return (
    <>
      <div class="text-gray-700 mb-2 mt-3">{temp?.name}</div>
      <div class="text-gray-700 mb-2">{temp?.address}</div>
      <div class="text-gray-700">{temp?.email}</div>
    </>
  );
};

export default function InvoiceCard() {
  const calculateTotal = (payload) => {
    return payload.products.reduce((acc, product) => {
      return acc + product.quantity * product.amount;
    }, 0);
  };
  const { id } = useParams(); // Fetching ID from URL
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    // Fetch Invoice Data
    axios
      .get(CONSTANT.server + `api/oneinvoice/${id}`)
      .then((response) => {
        console.log({
          ...response.data,
          products: JSON.parse(response.data?.products),
        });
        setInvoiceData({
          ...response.data,
          products: JSON.parse(response.data?.products),
        });
      })
      .catch((error) => {
        console.error("Error fetching invoice data:", error);
      });
  }, [id]);

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        See Invoice
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
              Date: {new Date(invoiceData?.timestamp).toLocaleDateString()}
            </div>
            <div className="text-sm">Invoice #: {invoiceData?.id}</div>
            <div className="text-sm">
              Status : {camelCaseToNormalString(invoiceData?.status)}
            </div>
          </div>
        </div>
        <div className="my-10" id="error" style={{ display: "none" }}></div>
        <div class="border-b-2 border-gray-300 pb-8 mb-8">
          <h2 class="text-2xl font-bold mb-4">Bill To:</h2>
          <ContactInfo temp={invoiceData.user} />
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
            {invoiceData.products.map((product, index) => (
              <tr key={index}>
                <td class="py-4 text-gray-700">{product?.label}</td>
                <td class="py-4 text-gray-700">{product?.quantity}</td>
                <td class="py-4 text-gray-700">
                  ${parseInt(product?.amount).toFixed(2)}
                </td>
                <td class="py-4 text-gray-700">
                  ${parseInt(product?.quantity * product?.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div class="flex justify-end items-end mb-8">
          <div class="text-gray-700 mr-2">Total:</div>
          <div class="text-gray-700 font-bold text-xl">
            ${calculateTotal(invoiceData).toFixed(2)}
          </div>
        </div>
        <div class="border-t-2 border-gray-300 pt-8 mb-8">
          <span>{invoiceData.comments}</span>
        </div>
      </div>
    </div>
  );
}
