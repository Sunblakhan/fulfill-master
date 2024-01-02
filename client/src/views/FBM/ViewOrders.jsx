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
      <td className="px-6 py-4 sticky left-0 bg-white">
        <span
          class={`${
            data?.status === "delivered"
              ? "bg-green-100 text-green-800"
              : ["error"].includes(data?.status)
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          } text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
        >
          {camelCaseToNormalString(data?.status)}
        </span>
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {data?.product?.nameOnInventory}
      </th>
      <td className="px-6 py-4">{camelCaseToNormalString(data?.labelType)}</td>
      <td className="px-6 py-4">{data?.pdf}</td>
      <td
        className="px-6 py-4 cursor-pointer hover:text-gray-500"
        onClick={() => {
          setOpenDesc(!openDesc);
        }}
      >
        {openDesc
          ? data?.prep === ""
            ? ""
            : data?.prep
          : `${data?.prep.slice(0, 40)}...`}
      </td>
      <td className="px-6 py-4">{data?.expectedDeliveryDate}</td>
      <td className="px-6 py-4">{data?.trackingNumber || "-"}</td>
      <td className="px-6 py-4">
        {new Date(data?.timestamp)?.toLocaleString()}
      </td>
    </tr>
  );
};

export default function ViewOrders() {
  const { session, setSession } = useContext(UserData);

  const [inventories, setInventories] = useState([]);

  const fetchInventories = async () => {
    await axios
      .get(CONSTANT.server + `api/fbm-orders/${session?.personal?.id}`)
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
  return (
    <div className="w-full">
      <h1 class="mb-5 text-center text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
        FBM
      </h1>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        View Orders
      </h1>
      <div className="w-full mt-10 overflow-auto">
        <table className="w-full text-sm overflow-auto">
          <thead className="text-xs text-left text-white uppercase bg-black dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 sticky left-0 bg-black h-fit"
              >
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Label type
              </th>
              <th scope="col" className="px-6 py-3">
                PDF
              </th>
              <th scope="col" className="px-6 py-3">
                Prep
              </th>
              <th scope="col" className="px-6 py-3">
                Expected Delivery Date
              </th>
              <th scope="col" className="px-6 py-3">
                Tracking ID
              </th>
              <th scope="col" className="px-6 py-3">
                Timestamp
              </th>
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
            No order requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
