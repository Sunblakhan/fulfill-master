import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  checkLoginFromLogin,
  capitalizeFirstLetter,
} from "../CONSTANT";
import CustomButton from "../components/CustomButton";
import InputBox from "../components/InputBox";
import { SiGnuprivacyguard } from "react-icons/si";
import PhoneInput, {
  isPossiblePhoneNumber,
  formatPhoneNumber,
  formatPhoneNumberIntl,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Register = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);
  const getErrorMessage = (message) => {
    let toReturn = "";
    for (const key in message) {
      toReturn += `${capitalizeFirstLetter(
        key.split("_").join(" ")
      )}: ${capitalizeFirstLetter(message[key][0])}\n`;
    }
    return toReturn;
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

  const register = async (e) => {
    e.preventDefault();
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    resetMessage();

    let allGood = true;

    if (!payload.name) {
      setMessage("Please enter name.", "red-500");
      allGood = false;
    } else if (
      !payload.email ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(payload.email)
    ) {
      setMessage("Please enter valid email.", "red-500");
      allGood = false;
    } else if (!payload.companyName) {
      setMessage("Please enter company name.", "red-500");
      allGood = false;
    } else if (!payload.address) {
      setMessage("Please enter company address.", "red-500");
      allGood = false;
    } else if (!value) {
      setMessage("Please enter phone number.", "red-500");
      allGood = false;
    } else if (!isPossiblePhoneNumber(value)) {
      setMessage("Please enter valid phone number.", "red-500");
      allGood = false;
    } else if (!payload.password || payload?.password?.length < 8) {
      setMessage("Password should be atleast 8 characters long.", "red-500");
      allGood = false;
    }

    if (allGood) {
      await axios
        .post(CONSTANT.server + "authentication/user", {
          ...payload,
          phone: value,
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
          setMessage("Server error.", "red-500");
        });
    }

    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Register";
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-row w-full items-center justify-center min-h-screen h-full">
        <div className="min-h-screen h-full md:w-1/2 w-full flex justify-center items-center">
          <div className="md:w-3/5 space-y-4 md:space-y-6">
            <h1 class="text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-5xl">
              Register
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="mode"
                  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Registering as
                </label>
                <div className="flex flex-row w-full space-x-2">
                  <InputBox
                    name="mode"
                    type="radio"
                    value="seller"
                    label="Seller"
                    checked={payload.mode === "seller"}
                    onChange={changePayload}
                  />
                  <InputBox
                    name="mode"
                    type="radio"
                    value="logistic"
                    label="Logistics"
                    checked={payload.mode === "logistic"}
                    onChange={changePayload}
                  />
                </div>
              </div>
              <div className="flex flex-row w-full space-x-2">
                <InputBox
                  name="name"
                  label="Name"
                  value={payload.name}
                  onChange={changePayload}
                />

                <InputBox
                  type="email"
                  name="email"
                  label="Email"
                  value={payload.email}
                  onChange={changePayload}
                />
              </div>

              <div className="flex flex-row w-full space-x-2">
                <InputBox
                  name="companyName"
                  label="Company Name"
                  value={payload.companyName}
                  onChange={changePayload}
                />
                <InputBox
                  name="address"
                  label="Company Address"
                  value={payload.address}
                  onChange={changePayload}
                />
              </div>

              <div className="flex flex-row w-full space-x-2">
                {/* <InputBox
                  type="tel"
                  name="phone"
                  label="Phone"
                  value={payload.phone}
                  onChange={changePayload}
                /> */}
                <div className="w-full">
                  <label
                    htmlFor={"phone"}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <PhoneInput
                    international
                    id="phone"
                    value={value}
                    onChange={setValue}
                    placeholder="Phone Number"
                    className="__PhoneInputInput px-3 h-[2.7rem] w-full flex flex-row items-center justify-center text-sm bg-white border border-gray-300 text-gray-900 rounded-lg focus-within:ring-2 ring-black"
                  />
                </div>

                <InputBox
                  type="password"
                  name="password"
                  label="Password"
                  value={payload.password}
                  onChange={changePayload}
                  placeholder="••••••••"
                />
              </div>

              <CustomButton
                label="Register"
                onClick={register}
                icon={<SiGnuprivacyguard />}
              />
              <div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login.
                  </Link>
                </p>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Back to{" "}
                  <Link
                    to="/"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    home.
                  </Link>
                </p>
              </div>
              <div
                className="my-10"
                id="error"
                style={{ display: "none" }}
              ></div>
            </div>
          </div>
        </div>
        <div className="min-h-screen h-full bg-gradient-to-r from-green-200 via-green-300 to-blue-500 md:w-1/2 w-full flex flex-col justify-center items-center">
          <Link to="/">
            {/* <h1 class="text-center text-4xl font-extrabold tracking-tight italic text-white md:text-5xl lg:text-6xl">
              Fulfill Master
            </h1> */}
            <img
              className={`w-60 object-contain`}
              src="/logo_full.png"
              alt="Fulfill Master Logo"
            />
          </Link>
          <img className="mt-10 w-3/4" src="/illus/register.svg" />
        </div>
      </div>
    </section>
  );
};

export default Register;
