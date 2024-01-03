import React, { useContext, useState, useEffect } from "react";
import {
  setMessage,
  resetMessage,
  CONSTANT,
  camelCaseToNormalString,
} from "../../CONSTANT";
import UserData from "../../contexts/UserData";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import InputBox from "../../components/InputBox";
import CustomButton from "../../components/CustomButton";
import { MdModeEditOutline } from "react-icons/md";
import { FaRocket } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { MdClose } from "react-icons/md";
import { TiCancel } from "react-icons/ti";
import { Tooltip } from "react-tooltip";
import { FaAmazonPay } from "react-icons/fa";

const RenderRow = ({ data, setIsEdit, updateInventory }) => {
  const [options, setOptions] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);
  return (
    <tr className="bg-white border-b dark:border-gray-700">
      <td className="px-6 py-4 sticky left-0 bg-white">
        <span
          className={`${
            data?.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : data?.status === "paid"
              ? "bg-green-100 text-green-800"
              : data?.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          } text-sm font-medium me-2 px-2.5 py-0.5 rounded`}
        >
          {camelCaseToNormalString(data?.status)}
        </span>
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
      <td className="px-6 py-4">
        <Link
          to={`/seeInvoice/${data?.id}`}
          className="cursor-pointer text-indigo-500 smooth-transition hover:text-indigo-300"
        >
          View
        </Link>
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
                Pay
              </Tooltip>
              <span
                onClick={(e) => {
                  setIsEdit({
                    id: data?.id,
                    open: true,
                  });
                }}
                id="edit"
                className="rounded-lg p-2 bg-blue-500"
              >
                <FaAmazonPay color="white" className="w-5" />
              </span>
            </div>
          )}
        </div>
      </td>
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

  const [isEdit, setIsEdit] = useState({
    open: false,
    pdf: null,
  });

  useEffect(() => {
    if (session.isLoggedIn) {
      fetchInventories();
    }
  }, [session]);

  const updateInventory = async (e) => {
    e.preventDefault();
    resetMessage();
    if (!isEdit.pdf) {
      setMessage("Please upload a paid invoice PDF.", "red-500");
      return;
    }
    const formData = new FormData();
    formData.append("id", isEdit.id);
    formData.append("pdf", isEdit.pdf);
    formData.append("status", "paid");
    await axios
      .put(CONSTANT.server + `api/invoice/${session?.personal?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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

  if (props?.totalDue) {
    return inventories?.filter((a) => {
      return a.status === "pending";
    }).length;
  }
  if (props?.totalSales) {
    // Calculate the sum of all totals where the status is "pending"
    return inventories
      ?.filter((a) => a.status === "paid")
      .reduce((acc, curr) => acc + parseFloat(curr.total || 0), 0);
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
            Pay Invoice
          </h1>
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
                Status
              </th>
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
              <th scope="col" className="px-6 py-3">
                View
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
                  updateInventory={updateInventory}
                />
              );
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
