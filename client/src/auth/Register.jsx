import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  checkLoginFromLogin,
  capitalizeFirstLetter
} from "../CONSTANT";

const Register = () => {
  const button = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);
  const getErrorMessage = (message) => {
    let toReturn = "";
    for (const key in message) {
      toReturn += `[${capitalizeFirstLetter(key.split("_").join(" "))}]: ${
        message[key][0]
      }\n`;
    }
    return toReturn;
  };

  const register = async (e) => {
    e.preventDefault();
    // button.style.pointerEvents = "none";
    // button.innerHTML =
    //   '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    resetMessage();

    if (payload.email !== "") {
      if (payload.password !== "" && payload.password.length >= 8) {
        await axios
          .post(CONSTANT.server + "authentication/user", {
            ...payload,
          })
          .then((responce) => {
            let res = responce.data;
            if (res.message) {
              setMessage(getErrorMessage(res.message), "red-500");
              // setMessage(res.message, "red-500");
            } else {
              sessionStorage.setItem(
                "loggedin",
                JSON.stringify({
                  data: res,
                })
              );
              navigate("/");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setMessage("Password should be greater than 7 characters.", "red-500");
      }
    } else {
      setMessage("Please enter username.", "red-500");
    }
    // button.style.pointerEvents = "unset";
    // button.innerHTML = "Register";
  };

  const init__payload = {
    email: "",
    password: "",
    name: "",
    address: "",
    companyName: "",
    phone: "",
    mode: "seller",
  };
  const [payload, setPayload] = useState(init__payload);
  const changePayload = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Link to="/">
              <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 md:text-3xl text-xl dark:text-white">
                Fulfill Master
              </h1>
            </Link>
            <h1 className="text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-xl dark:text-white">
              Register
            </h1>
            <form className="space-y-3" onSubmit={register}>
              <div>
                <label
                  htmlFor="mode"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Registering as
                </label>
                <div className="flex flex-row w-full space-x-2">
                  <div className="w-full flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                    <input
                      id="seller"
                      type="radio"
                      value="seller"
                      checked={payload.mode === "seller"}
                      onChange={changePayload}
                      required
                      name="mode"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 ring-0"
                    />
                    <label
                      htmlFor="seller"
                      className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Seller
                    </label>
                  </div>
                  <div className="w-full flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
                    <input
                      id="logistics"
                      type="radio"
                      value="logistic"
                      checked={payload.mode === "logistic"}
                      onChange={changePayload}
                      required
                      name="mode"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 ring-0"
                    />
                    <label
                      htmlFor="logistics"
                      className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Logistics Provider
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={payload.name}
                  onChange={changePayload}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={payload.email}
                  onChange={changePayload}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label
                  htmlFor="companyName"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={payload.companyName}
                  onChange={changePayload}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                />
              </div>{" "}
              <div>
                <label
                  htmlFor="address"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Company Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={payload.address}
                  onChange={changePayload}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={payload.phone}
                  onChange={changePayload}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={payload.password}
                  onChange={changePayload}
                  required
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div></div>
              <button
              ref={button}
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Register
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login.
                </Link>
              </p>
              <div
                className="my-10"
                id="error"
                style={{ display: "none" }}
              ></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
