import React, { useState } from "react";
import { Link } from "react-router-dom";

const RenderSingleItem = (props) => {
  return (
    <li>
      <Link
        to={props?.to}
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        {props?.icon && props?.icon}
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
        className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        {props?.label}
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
        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        {props?.icon && props?.icon}
        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
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
              <RenderSubItem label={one?.label} to={one?.to} key={index} />
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default function Sidebar() {
  return (
    <div className="min-w-[15rem] mr-10">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <RenderSingleItem label="Home" to="/" />
          <RenderMultipleItem
            label="FBA"
            items={[
              {
                label: "Add Inventory",
                to: "/fba/addInventory",
              },
              {
                label: "View Inventories",
                to: "/fba/viewInventories",
              },
            ]}
          />
          <RenderMultipleItem
          label="FBM"
          items={[
            {
              label: "Add Inventory",
              to: "/fbm/addInventory",
            },
            {
              label: "Add Order",
              to: "/fbm/addOrder",
            },
            {
              label: "View Inventories",
              to: "/fbm/viewInventories",
            },
            {
              label: "View Orders",
              to: "/fbm/viewOrders",
            },
          ]}
        />
        <RenderSingleItem label="Logistics Registration" to="/logisticsRegistration" />
        </ul>
      </div>
    </div>
  );
}
