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
import { Tooltip } from "react-tooltip";
import { MdModeEditOutline } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import { GrDeliver } from "react-icons/gr";
import { FaShippingFast } from "react-icons/fa";
import { MdDoneAll } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { MdClose } from "react-icons/md";
import { MdDoneOutline } from "react-icons/md";
import { TiCancel } from "react-icons/ti";

const RenderRow = ({ data, isEdit, setIsEdit, updateStatus }) => {
  const [options, setOptions] = useState(false);

  const [openDesc, setOpenDesc] = useState(false);

  return (
    <tr className="bg-white border-b dark:border-gray-700">
      <td className="px-6 py-4 sticky left-0 bg-white">
        {data?.status ? (
          <span
            class={`${
              data?.status === "approve"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
          >
            {camelCaseToNormalString(
              data?.status === "approve" ? "Approved" : "Rejected"
            )}
          </span>
        ) : (
          <span
            class={`bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
          >
            {camelCaseToNormalString("Pending")}
          </span>
        )}
      </td>
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
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {data?.name}
      </th>
      <td className="px-6 py-4">{data?.email}</td>
      <td className="px-6 py-4">{data?.phone}</td>
      <td className="px-6 py-4">{data?.businessName}</td>
      <td className="px-6 py-4">{data?.businessAddress}</td>
      <td className="px-6 py-4 uppercase">
        {camelCaseToNormalString(data?.branch)}
      </td>
      <td className="px-6 py-4 uppercase">
        {camelCaseToNormalString(data?.type)}
      </td>
      <td className="px-6 py-4 uppercase">
        {(data?.minimumInventory &&
          camelCaseToNormalString(data?.minimumInventory)) ||
          "-"}
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
              <Tooltip anchorSelect="#accepted" place="top">
                Approve
              </Tooltip>
              <Tooltip anchorSelect="#cancelled" place="top">
                Reject
              </Tooltip>
              <span
                onClick={(e) => {
                  updateStatus(e, {
                    id: data?.id,
                    status: "approve",
                  });
                }}
                id="accepted"
                className="rounded-lg p-2 bg-green-500"
              >
                <MdDoneOutline color="white" className="w-5" />
              </span>
              <span
                onClick={(e) => {
                  updateStatus(e, {
                    id: data?.id,
                    status: "reject",
                  });
                }}
                id="cancelled"
                className="rounded-lg p-2 bg-red-500"
              >
                <TiCancel color="white" className="w-5 scale-125" />
              </span>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const RenderRow2 = ({ data, isEdit, setIsEdit, updateStatus }) => {
  const [options, setOptions] = useState(false);

  const [openDesc, setOpenDesc] = useState(false);

  return (
    <tr className="bg-white border-b dark:border-gray-700">
      <td className="px-6 py-4 sticky left-0 bg-white">
        {data?.status ? (
          <span
            class={`${
              data?.status === "approve"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
          >
            {camelCaseToNormalString(
              data?.status === "approve" ? "Approved" : "Rejected"
            )}
          </span>
        ) : (
          <span
            class={`bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
          >
            {camelCaseToNormalString("Pending")}
          </span>
        )}
      </td>
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        <div className="flex flex-col">
          <span>{data?.name}</span>
          <span>{data?.email}</span>
          <span>{data?.companyName}</span>
        </div>
      </th>

      <td className="px-6 py-4">
        {new Date(data?.timestamp)?.toLocaleString()}
      </td>

      <td className="px-6 py-4 sticky right-0 bg-white">
        <div className="relative flex items-center">
          <div className="ml-2 flex flex-row space-x-2 cursor-pointer">
            <Tooltip anchorSelect="#accepted" place="top">
              Approve
            </Tooltip>
            <Tooltip anchorSelect="#cancelled" place="top">
              Reject
            </Tooltip>
            <span
              onClick={(e) => {
                updateStatus(e, {
                  id: data?.id,
                  status: "approve",
                });
              }}
              id="accepted"
              className="rounded-lg p-2 bg-green-500"
            >
              <MdDoneOutline color="white" className="w-5" />
            </span>
            <span
              onClick={(e) => {
                updateStatus(e, {
                  id: data?.id,
                  status: "reject",
                });
              }}
              id="cancelled"
              className="rounded-lg p-2 bg-red-500"
            >
              <TiCancel color="white" className="w-5 scale-125" />
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default function NewClientRequests(props) {
  const { session, setSession } = useContext(UserData);

  const [inventories, setInventories] = useState([]);

  const fetchInventories = async () => {
    await axios
      .get(CONSTANT.server + `api/logistics-registration`)
      .then(async (responce) => {
        setInventories(
          responce?.data?.filter((a, b) => {
            return parseInt(a?.warehouse?.id) === session?.personal?.id;
          })
        );
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
    id: null,
  });

  const updateStatus = async (e, __payload = {}) => {
    e.preventDefault();
    resetMessage();
    await axios
      .put(CONSTANT.server + `api/logistics-registration`, {
        ...__payload,
      })
      .then(async (responce) => {
        if (responce?.message) {
          setMessage(responce?.message, "red-500");
        } else {
          fetchInventories();
          //   setIsEdit({
          //     ...isEdit,
          //     open: false,
          //   });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (props?.count) {
    return inventories.filter((a) => {
      return a?.status === "approve";
    }).length;
  }

  if (props?.onlyTable) {
    return (
      <table className="w-full text-sm h-full">
        {/* <thead className="text-xs text-left text-white uppercase bg-black dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 sticky left-0 bg-black h-fit">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Client
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Business Name
            </th>
            <th scope="col" className="px-6 py-3">
              Business Address
            </th>
            <th scope="col" className="px-6 py-3">
              Branch
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Minimum Inventory
            </th>
            <th scope="col" className="px-6 py-3">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 sticky right-0 bg-black h-fit">
              Options
            </th>
          </tr>
        </thead> */}
        <tbody className="text-left whitespace-nowrap">
          {inventories?.map((a, b) => {
            return (
              <RenderRow2
                data={a}
                setIsEdit={setIsEdit}
                isEdit={isEdit}
                updateStatus={updateStatus}
              />
            );
          })}
        </tbody>
      </table>
    );
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
            Tracking Number
          </h1>
          <InputBox
            type="text"
            value={isEdit.value}
            onChange={(e) => {
              setIsEdit({
                ...isEdit,
                value: e.target.value,
              });
            }}
            label=""
            placeholder="Enter tracking number"
          />
          <CustomButton
            className="mt-5"
            label="Update"
            onClick={(e) => {
              updateStatus(e, {
                id: isEdit?.id,
                status: "accepted",
                trackingNumber: isEdit?.value,
              });
              setIsEdit({
                open: false,
                value: "",
                id: null,
              });
            }}
            icon={<FaRocket />}
          />
        </div>
      </ModalWrapper>
      <h1 class="text-center mb-5 text-4xl font-extrabold tracking-tight text-black">
        New Client Requests
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
                Client
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Business Name
              </th>
              <th scope="col" className="px-6 py-3">
                Business Address
              </th>
              <th scope="col" className="px-6 py-3">
                Branch
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Minimum Inventory
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
                  isEdit={isEdit}
                  updateStatus={updateStatus}
                />
              );
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
