import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { TbBrandAmazon } from "react-icons/tb";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaPlus } from "react-icons/fa";
import { FaThList } from "react-icons/fa";
import { FaFirstOrder } from "react-icons/fa6";
import { LuBoxes } from "react-icons/lu";
import { FaPeopleArrows } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";


const RenderSingleItem = (props) => {
  return (
    <li>
      <Link
        to={props?.to}
        className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-accent_2 dark:hover:bg-gray-700 group"
      >
        {props?.icon && <span className="mr-2">{props?.icon}</span>}
        <span className="ms-3">{props?.label}</span>
      </Link>
    </li>
  );
};

const RenderSubItem = (props) => {
  return (
    <li>
      <Link
        to={props?.to}
        className="flex items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-accent_2 dark:text-white dark:hover:bg-gray-700"
      >
        {props?.icon && <span className="mr-2">{props?.icon}</span>}
        <span className="ms-3">{props?.label}</span>
      </Link>
    </li>
  );
};

const RenderMultipleItem = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="flex items-center w-full p-2 text-base text-white transition duration-75 rounded-lg group hover:bg-accent_2 dark:text-white dark:hover:bg-gray-700"
      >
        {props?.icon && <span className="mr-2">{props?.icon}</span>}
        <span className="flex-1 text-left whitespace-nowrap">
          {props?.label}
        </span>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
          className={`w-3 h-3 ${open && "rotate-180"}`}
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {open && (
        <ul className="py-2 space-y-2">
          {props?.items?.map((one, index) => {
            return (
              <RenderSubItem
                label={one?.label}
                to={one?.to}
                key={index}
                icon={one?.icon}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default function Sidebar({ session }) {
  return (
    <div className="min-w-[15rem] min-h-[calc(100vh-10rem)] mr-10">
      <div className="h-full bg-gradient-to-b from-blue-500 to-green-300 rounded-lg px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          <div className="w-full flex flex-col p-2 text-white">
            <span className="capitalize text-2xl font-semibold whitespace-nowrap dark:text-white">
              {session?.personal?.mode}
            </span>
            <span className="text-2xl font-semibold whitespace-nowrap dark:text-white">
              Dashboard
            </span>
          </div>
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <div className="py-1"></div>
          <RenderSingleItem label="Home" to="/" icon={<FaHome />} />
          {session?.personal?.mode === "seller" && (
            <>
              <RenderMultipleItem
                label="FBA"
                icon={<TbBrandAmazon />}
                items={[
                  {
                    label: "Add Inventory",
                    to: "/fba/addInventory",
                    icon: <FaPlus />,
                  },
                  {
                    label: "View Inventories",
                    to: "/fba/viewInventories",
                    icon: <FaThList />,
                  },
                ]}
              />
              <RenderMultipleItem
                label="FBM"
                icon={<TbBrandAmazon />}
                items={[
                  {
                    label: "Add Inventory",
                    to: "/fbm/addInventory",
                    icon: <FaPlus />,
                  },
                  {
                    label: "View Inventories",
                    to: "/fbm/viewInventories",
                    icon: <FaThList />,
                  },
                  {
                    label: "Add Order",
                    to: "/fbm/addOrder",
                    icon: <FaPlus />,
                  },
                  {
                    label: "View Orders",
                    to: "/fbm/viewOrders",
                    icon: <FaThList />,
                  },
                ]}
              />
              <RenderSingleItem
                label="Logistics Registration"
                to="/logisticsRegistration"
                icon={<SiGnuprivacyguard />}
              />
            </>
          )}
          {session?.personal?.mode === "logistic" && (
            <>
              <RenderSingleItem
                label="Order Requests"
                to="/logistic/orderRequests"
                icon={<FaFirstOrder />}
              />
              <RenderSingleItem
                label="Inventory Requests"
                to="/logistic/inventoryRequests"
                icon={<LuBoxes />}
              />
              <RenderSingleItem
                label="New Client Requests"
                to="/logistic/newClientRequests"
                icon={<FaPeopleArrows />}
              />
              <RenderMultipleItem
                label="Invoice Management"
                icon={<FaFileInvoice />}
                items={[
                  {
                    label: "Add Invoice",
                    to: "/logistic/addInvoice",
                    icon: <FaPlus />,
                  },
                  {
                    label: "View Invoices",
                    to: "/logistic/viewInvoices",
                    icon: <FaThList />,
                  },
                ]}
              />
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
