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

const RenderRow = ({ data, setIsEdit }) => {
  const [openDesc, setOpenDesc] = useState(false);
  return (
    <tr className="bg-white border-b dark:border-gray-700">
      <td className="px-6 py-4">
        <span
          class={` ${
            data?.receivedStatus === "notReceivedYet"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          } text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
        >
          {camelCaseToNormalString(data?.receivedStatus)}
        </span>
      </td>
      <td className="px-6 py-4 sticky left-0 bg-white">
        <span
          class={`${
            data?.status === "accepted"
              ? "bg-green-100 text-green-800"
              : ["cancelled", "declined", "error"].includes(data?.status)
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
        {data?.warehouse?.name}
      </th>
      <td className="px-6 py-4">{data?.totalSKU}</td>
      <td className="px-6 py-4">{data?.totalBoxes}</td>
      <td className="px-6 py-4">{data?.nameOnInventory}</td>
      <td className="px-6 py-4">{data?.companyName}</td>
      <td className="px-6 py-4">{data?.packageComingFrom}</td>
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
      <td className="px-6 py-4 sticky right-0 bg-white text-center">
        <span
          className="font-bold text-black cursor-pointer flex flex-row items-center justify-center"
          onClick={() => {
            setIsEdit({
              value: data?.comments,
              id: data?.id,
              open: true,
            });
          }}
        >
          <MdModeEditOutline className="mr-1" />
          <span className="md:block hidden">Edit</span>
        </span>
      </td>
    </tr>
  );
};

export default function ViewInventories() {
  const { session, setSession } = useContext(UserData);

  const [inventories, setInventories] = useState([]);

  const fetchInventories = async () => {
    await axios
      .get(
        CONSTANT.server + `api/fbm-inventory-requests/${session?.personal?.id}`
      )
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

  const [isEdit, setIsEdit] = useState({
    open: false,
    value: "",
  });

  const updateInventory = async (e) => {
    e.preventDefault();
    resetMessage();
    // Validate warehouse
    await axios
      .put(
        CONSTANT.server + `api/fbm-inventory-requests/${session?.personal?.id}`,
        {
          id: isEdit.id,
          comments: isEdit.value,
        }
      )
      .then(async (responce) => {
        if (responce?.message) {
          setMessage(responce?.message, "red-500");
        } else {
          fetchInventories();
          setIsEdit({
            ...isEdit,
            open: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="w-full">
      <ModalWrapper
        isOpen={isEdit.open}
        onClose={() => {
          setIsEdit({
            ...isEdit,
            open: false,
          });
        }}
      >
        <div className="w-full">
          <h1 class="mb-5 text-center text-4xl font-extrabold tracking-tight text-black">
            Edit Prep Comments
          </h1>
          <InputBox
            name="comments"
            type="textarea"
            value={isEdit.value}
            onChange={(e) => {
              setIsEdit({
                ...isEdit,
                value: e.target.value,
              });
            }}
            label=""
            placeholder="Your comments here"
          />
          <CustomButton
            className="mt-5"
            label="Update"
            onClick={updateInventory}
            icon={<FaRocket />}
          />
        </div>
      </ModalWrapper>
      <h1 class="mb-5 text-center text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
        FBM
      </h1>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        View Inventory Requests
      </h1>
      <div className="w-full mt-10 overflow-auto">
        <table className="w-full text-sm overflow-auto">
          <thead className="text-xs text-left text-white uppercase bg-black dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 h-fit">
                Logistics Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 sticky left-0 bg-black h-fit"
              >
                Inventory Status
              </th>
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
                Timestamp
              </th>
              <th
                scope="col"
                className="px-6 py-3 sticky right-0 bg-black h-fit"
              >
                Options
              </th>
            </tr>
          </thead>
          <tbody className="text-left whitespace-nowrap">
            {inventories?.map((a, b) => {
              return <RenderRow data={a} setIsEdit={setIsEdit} />;
            })}
          </tbody>
        </table>
        {inventories?.length <= 0 && (
          <div className="mt-5 pb-5 w-full flex items-center justify-center">
            No inventory requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
