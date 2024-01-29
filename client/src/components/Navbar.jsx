import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AvatarGenerator } from "random-avatar-generator";

const generator = new AvatarGenerator();
export default function Navbar(props) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  return (
    <nav className="bg-white shadow-md border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/logo_nav.png" className="w-28" alt="Fulfill Master Logo" />
          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Fulfill Master
          </span> */}
        </Link>
        <button
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={() => {
            setIsOpenMenu(!isOpenMenu);
          }}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:flex md:w-auto flex-row-reverse items-center justify-center space-x-4">
          <div className="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => {
                setIsOpenProfile(!isOpenProfile);
              }}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={generator.generateRandomAvatar(
                  props?.session?.personal?.email
                )}
                alt="user photo"
              />
            </button>
            {/* Dropdown menu */}
            {isOpenProfile && (
              <>
                <div
                  className="fixed w-screen h-screen inset-0 bg-white opacity-0"
                  onClick={() => {
                    setIsOpenProfile(!isOpenProfile);
                  }}
                ></div>
                <div className="z-20 absolute right-0 top-5 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py- 3">
                    <span className="block text-md text-gray-900 dark:text-white">
                      {props?.session?.personal?.name}
                    </span>
                    <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                      {props?.session?.personal?.email}
                    </span>
                    <div className="mt-1 mb-2">
                      <span class="capitalize bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {props?.session?.personal?.mode}
                      </span>
                    </div>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        My Profile
                      </Link>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-row space-x-2">
            {!props?.isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-300 smooth-transition font-bold uppercase rounded-lg text-md min-w-[8rem] px-4 py-2 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-500 hover:text-gray-700 cursor-pointer bg-gray-100 hover:bg-gray-300 smooth-transition font-bold uppercase rounded-lg text-md min-w-[8rem] px-4 py-2 text-center"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div
                  onClick={props?.logout}
                  className="text-white cursor-pointer bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
                >
                  Logout
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
