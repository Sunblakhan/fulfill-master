import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  checkLoginFromLogin,
} from "../CONSTANT";
import InputBox from "../components/InputBox";
import CustomButton from "../components/CustomButton";
import { RiLoginCircleFill } from "react-icons/ri";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);
  const login = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      payload.email !== "" &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(payload.email)
    ) {
      if (payload.password !== "") {
        await axios
          .post(CONSTANT.server + "authentication/validate", payload)
          .then((responce) => {
            if (responce.status === 200) {
              let res = responce.data;
              if (res.message) {
                setMessage(res.message, "red-500");
              } else {
                sessionStorage.setItem(
                  "loggedin",
                  JSON.stringify({
                    data: res,
                  })
                );
                navigate("/");
              }
            }
          })
          .catch((error) => {
            console.log(error);
            setMessage("Server error.", "red-500");
          });
      } else {
        setMessage("Please enter password.", "red-500");
      }
    } else {
      setMessage("Please enter valid email.", "red-500");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Log In";
  };

  const init__payload = {
    email: "",
    password: "",
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
      <div className="flex flex-row-reverse w-full items-center justify-center min-h-screen h-full">
        <div className="min-h-screen h-full md:w-1/2 w-full flex justify-center items-center">
          <div className="md:w-3/5 space-y-4 md:space-y-6">
            <h1 class="text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-5xl">
              Log In
            </h1>
            <div className="space-y-4 md:space-y-6">
              <InputBox
                type="email"
                name="email"
                label="Email"
                value={payload.email}
                onChange={changePayload}
              />

              <InputBox
                type="password"
                name="password"
                label="Password"
                value={payload.password}
                onChange={changePayload}
                placeholder="••••••••"
              />

              <CustomButton
                label="Log In"
                onClick={login}
                icon={<RiLoginCircleFill />}
              />
              <div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Register.
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
          <img className="mt-10 w-3/4" src="/illus/login.svg" />
        </div>
      </div>
    </section>
  );
};

export default Login;
