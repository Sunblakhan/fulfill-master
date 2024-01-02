import React, { useContext, useState, useEffect } from "react";
import {
  setMessage,
  resetMessage,
  CONSTANT,
  camelCaseToNormalString,
} from "../../CONSTANT";
import UserData from "../../contexts/UserData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import InputBox from "../../components/InputBox";
import CustomButton from "../../components/CustomButton";
import { MdModeEditOutline } from "react-icons/md";
import { FaRocket } from "react-icons/fa";

const RenderRow = ({ data }) => {
  const [openDesc, setOpenDesc] = useState(false);
  return (
    <tr className="bg-white border-b dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        <div className="flex flex-col">
          <span>{data?.user?.name}</span>
          <span>{data?.user?.email}</span>
          <span>{data?.user?.companyName}</span>
        </div>
      </th>
      <td className="px-6 py-4 bg-white">
        <ProductList products={data?.products} />
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        ${data?.total}
      </th>
      <td
        className="px-6 py-4 cursor-pointer hover:text-gray-500"
        onClick={() => {
          setOpenDesc(!openDesc);
        }}
      >
        {openDesc
          ? data?.comments === ""
            ? ""
            : data?.comments
          : `${data?.comments.slice(0, 40)}...`}
      </td>
      <td className="px-6 py-4">
        {new Date(data?.timestamp)?.toLocaleString()}
      </td>
      {/* <td className="px-6 py-4">
        <span className="cursor-pointer text-indigo-500 smooth-transition hover:text-indigo-300">
          View
        </span>
      </td> */}
    </tr>
  );
};

const ProductList = ({ products }) => {
  let productData;
  try {
    // Parse the JSON string into an object
    productData = JSON.parse(products);
  } catch (e) {
    // If parsing fails, handle the error (e.g., render an error message or log to console)
    console.error("Error parsing JSON:", e);
    return <div>Invalid product data</div>;
  }

  return (
    <div>
      {productData.map((product, index) => (
        <div
          key={index}
          className={`${
            productData.length !== index + 1 && "border-b border-gray-200"
          } py-2`}
        >
          <div>
            <strong>Description:</strong> {product.label}
          </div>
          <div>
            <strong>Quantity:</strong> {product.quantity}
          </div>
          <div>
            <strong>Amount:</strong> ${product.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ViewInvoices(props) {
  const { session, setSession } = useContext(UserData);

  const [inventories, setInventories] = useState([]);

  const fetchInventories = async () => {
    let to = `api/invoice/${session?.personal?.id}`;
    if (props?.all) {
      to = `api/invoice`;
    }
    await axios
      .get(CONSTANT.server + to)
      .then(async (responce) => {
        setInventories(responce?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session.isLoggedIn) {
      fetchInventories();
    }
  }, [session]);

  if (props?.totalOrders) {
    return (
      inventories?.map((a) => {
        return a?.status === "delivered";
      }).length || 67
    );
  }

  return (
    <div className="w-full">
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        View Invoices
      </h1>
      <div className="w-full mt-10 overflow-auto">
        <table className="w-full text-sm overflow-auto">
          <thead className="text-xs text-left text-white uppercase bg-black dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 sticky left-0 bg-black h-fit"
              >
                Client
              </th>
              <th scope="col" className="px-6 py-3">
                Products
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
              <th scope="col" className="px-6 py-3">
                Comments
              </th>
              <th scope="col" className="px-6 py-3">
                Timestamp
              </th>
              {/* <th scope="col" className="px-6 py-3">
                View
              </th> */}
            </tr>
          </thead>
          <tbody className="text-left whitespace-nowrap">
            {inventories?.map((a, b) => {
              return <RenderRow data={a} />;
            })}
          </tbody>
        </table>
        {inventories?.length <= 0 && (
          <div className="mt-5 pb-5 w-full flex items-center justify-center">
            No invoices yet.
          </div>
        )}
      </div>
    </div>
  );
}
