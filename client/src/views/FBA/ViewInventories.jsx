import React, { useContext, useState, useEffect } from "react";
import {
  setMessage,
  resetMessage,
  CONSTANT,
  camelCaseToNormalString,
} from "../../CONSTANT";
import UserData from "./../../contexts/UserData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import InputBox from "../../components/InputBox";
import CustomButton from "../../components/CustomButton";
import { MdModeEditOutline } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { FaRocket } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { TiCancel } from "react-icons/ti";
import { Tooltip } from "react-tooltip";

const RenderRow = ({ data, setIsEdit, deleteInventory }) => {
  const [options, setOptions] = useState(false);
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
          className={`${
            data?.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : data?.status === "requested"
              ? "bg-indigo-100 text-indigo-800"
              : data?.status === "acknowledged"
              ? "bg-purple-100 text-purple-800"
              : data?.status === "shipped"
              ? "bg-blue-100 text-blue-800"
              : data?.status === "delivered"
              ? "bg-green-100 text-green-800"
              : data?.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          } text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
        >
          {camelCaseToNormalString(data?.status)}
        </span>
      </td>
      <td className="px-6 py-4">{data?.logisticsComments || "-"}</td>
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
        {data?.pdf && (
          <span
            onClick={() => {
              const pdfUrl = `${CONSTANT.server}${data?.pdf}`;
              window.open(pdfUrl, "_blank", "noopener,noreferrer");
            }}
            className="cursor-pointer text-indigo-500 smooth-transition hover:text-indigo-300"
          >
            Preview PDF
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {new Date(data?.timestamp)?.toLocaleString()}
      </td>
      <td className="px-6 py-4 sticky right-0 bg-white">
        <div className="relative flex items-center">
          <span
            className="bg-transparent smooth-transition hover:bg-slate-100 p-2.5 rounded-full cursor-pointer"
            onClick={() => {
              setOptions(!options);
            }}
          >
            {options ? (
              <MdClose color="black" className="z-0 relative scale-125" />
            ) : (
              <SlOptionsVertical color="black" className="z-0 relative" />
            )}
          </span>
          {options && (
            <div className="ml-2 flex flex-row space-x-2 cursor-pointer">
              <Tooltip anchorSelect="#edit" place="top">
                Edit
              </Tooltip>
              <Tooltip anchorSelect="#delete" place="top">
                Delete
              </Tooltip>
              <span
                onClick={(e) => {
                  setIsEdit({
                    value: data?.comments,
                    id: data?.id,
                    open: true,
                  });
                }}
                id="edit"
                className="rounded-lg p-2 bg-blue-500"
              >
                <MdModeEditOutline color="white" className="w-5" />
              </span>
              <span
                onClick={(e) => {
                  deleteInventory(data?.id);
                }}
                id="delete"
                className="rounded-lg p-2 bg-red-500"
              >
                <TiCancel color="white" className="w-5 scale-150" />
              </span>
            </div>
          )}
        </div>
      </td>
      {/* <td className="px-6 py-4 sticky right-0 bg-white text-center">
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
      </td> */}
    </tr>
  );
};

export default function ViewInventories(props) {
  const { session, setSession } = useContext(UserData);

  const [inventories, setInventories] = useState([]);

  const fetchInventories = async () => {
    await axios
      .get(
        CONSTANT.server + `api/fba-inventory-requests/${session?.personal?.id}`
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
    pdf: null,
  });

  const updateInventory = async (e) => {
    e.preventDefault();
    resetMessage();
    if (!isEdit.value) {
      setMessage("Please add comments.", "red-500");
      return;
    }
    if (!isEdit.pdf) {
      setMessage("Please upload a PDF.", "red-500");
      return;
    }
    const formData = new FormData();
    formData.append("id", isEdit.id);
    formData.append("comments", isEdit.value);
    formData.append("pdf", isEdit.pdf);
    formData.append("status", "pending");
    await axios
      .put(
        CONSTANT.server + `api/fba-inventory-requests/${session?.personal?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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

  const deleteInventory = async (id) => {
    await axios
      .delete(CONSTANT.server + `api/fba-inventory-requests/${id}`)
      .then(async (responce) => {
        fetchInventories();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (props?.action) {
    return inventories?.filter((a) => {
      return a?.status === "requested";
    }).length;
  }

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
            Update Request
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
          <div className="py-3"></div>
          <InputBox
            type="file"
            value={isEdit.pdf}
            onChange={(e) => {
              setIsEdit({
                ...isEdit,
                pdf: e.target.files[0],
              });
            }}
            label={`Attach updated label.`}
            accept=".pdf"
          />
          <CustomButton
            className="mt-5"
            label="Update"
            onClick={updateInventory}
            icon={<FaRocket />}
          />
          <div className="my-10" id="error" style={{ display: "none" }}></div>
        </div>
      </ModalWrapper>
      <h1 class="mb-5 text-center text-4xl font-extrabold tracking-tight text-black md:text-5xl lg:text-6xl">
        FBA
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
                Remarks
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
                PDF
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
              return (
                <RenderRow
                  data={a}
                  setIsEdit={setIsEdit}
                  deleteInventory={deleteInventory}
                />
              );
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
