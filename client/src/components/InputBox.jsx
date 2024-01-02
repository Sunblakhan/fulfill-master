import React from "react";

export default function InputBox(props) {
  if (props?.type === "check") {
    return (
      <div className="w-full flex items-start space-x-2 __CHECK_REG__">
        <span className="flex items-center translate-y-1">
          <input
            id={`check_${props?.name}`}
            type="checkbox"
            checked={props?.value}
            onChange={props?.onChange}
            className="cursor-pointer text-black bg-white border-gray-300 hover:bg-gray-50 focus:ring-0 dark:focus:ring-0 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
          />
        </span>
        <label
          htmlFor={`check_${props?.name}`}
          className="tracking-normal text-gray-300 leading-snug"
        >
          {props?.label}
        </label>
      </div>
    );
  }
  if (props?.type === "select") {
    return (
      <div className="w-full">
        {props?.label ? (
          <label
            htmlFor={props?.name}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {props?.label}
          </label>
        ) : null}
        <select
          name={props?.name}
          value={props?.value}
          onChange={props?.onChange}
          className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={props?.placeholder}
          required={props?.required || true}
        >
          {props?.options?.map((one, index) => {
            return (
              <option key={index} value={one?.id}>
                {one?.name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
  if (props?.type === "date") {
    return (
      <div className="w-full">
        {props?.label ? (
          <label
            htmlFor={props?.name}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {props?.label}
          </label>
        ) : null}
        <input
          type={"date"}
          name={props?.name}
          value={props?.value}
          onChange={props?.onChange}
          className={`${props?.className}  bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          placeholder={props?.placeholder}
          required={props?.required || true}
        />
      </div>
    );
  }
  if (props?.type === "radio") {
    return (
      <div className="w-full flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
        <input
          id={props?.value}
          type="radio"
          value={props?.value}
          checked={props?.checked}
          onChange={props?.onChange}
          required={props?.required || true}
          name={props?.name}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 ring-0"
        />
        <label
          htmlFor={props?.value}
          className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {props?.label}
        </label>
      </div>
    );
  }
  if (props?.type === "textarea") {
    return (
      <div className="w-full">
        <label
          htmlFor={props?.name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {props?.label}
        </label>
        <textarea
          id={props?.name}
          name={props?.name}
          rows={props?.rows || 4}
          value={props?.value}
          onChange={props?.onChange}
          className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder={props?.placeholder || props?.label}
        />
      </div>
    );
  }
  if (props?.type === "file") {
    return (
      <div className="w-full">
        {props?.label ? (
          <label
            htmlFor={props?.name}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {props?.label}
          </label>
        ) : null}
        <input
          className={`${props?.className}  bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
          id={props?.name}
          onChange={props?.onChange}
          type="file"
        />
      </div>
    );
  }
  return (
    <div className="w-full">
      {props?.label ? (
        <label
          htmlFor={props?.name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {props?.label}
        </label>
      ) : null}
      <input
        type={props?.type || "text"}
        name={props?.name}
        id={props?.name}
        value={props?.value}
        onChange={props?.onChange}
        className={`${props?.className}  bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        placeholder={props?.placeholder || props?.label}
        required={props?.required || true}
        {...props}
      />
    </div>
  );
}
