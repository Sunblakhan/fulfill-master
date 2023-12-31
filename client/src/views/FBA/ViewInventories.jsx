import React, { useContext, useState, useEffect } from "react";
import { setMessage, resetMessage, CONSTANT, camelCaseToNormalString } from "../../CONSTANT";
import UserData from "./../../contexts/UserData"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ViewInventories() {
  const { session, setSession } = useContext(UserData);

  const [inventories, setInventories] = useState([])


  const fetchInventories = async () => {
    await axios
      .get(CONSTANT.server + `api/fba-inventory-requests/${session.personal.id}`)
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
    <div className='w-full'><div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Warehouse
          </th>
          <th scope="col" className="px-6 py-3">
            Total SKU
          </th>
          <th scope="col" className="px-6 py-3">
            Total Boxes
          </th>
          <th scope="col" className="px-6 py-3">
            Name on Inventory
          </th>
          <th scope="col" className="px-6 py-3">
            Company Name
          </th>
          <th scope="col" className="px-6 py-3">
            Package coming from
          </th>
          <th scope="col" className="px-6 py-3">
            Prep Comments
          </th>
          <th scope="col" className="px-6 py-3">
            Inventory Status
          </th>
          <th scope="col" className="px-6 py-3">
            Logistics Status
          </th>
          <th scope="col" className="px-6 py-3">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        {
          inventories?.map((a,b)=>{
            return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {a?.warehouse?.name}
            </th>
            <td className="px-6 py-4">
              {a?.totalSKU}
            </td>
            <td className="px-6 py-4">
              {a?.totalBoxes}
            </td>
            <td className="px-6 py-4">
              {a?.nameOnInventory}
            </td>
            <td className="px-6 py-4">
              {a?.companyName}
            </td>
            <td className="px-6 py-4">
              {a?.packageComingFrom}
            </td>
            <td className="px-6 py-4">
              {a?.comments}
            </td>
            <td className="px-6 py-4">
            <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{camelCaseToNormalString(a?.status)}</span>
            </td>
            <td className="px-6 py-4">
              <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{camelCaseToNormalString(a?.receivedStatus)}</span>
            </td>
            <td className="px-6 py-4 text-center">
              <span className="font-bold text-black cursor-pointer">Edit</span>
            </td>
          </tr>
          })
        }
      </tbody>
    </table>
  </div>
  </div>
  )
}
