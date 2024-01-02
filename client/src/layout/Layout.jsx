import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserData from "../contexts/UserData";
import Navbar from "../components/Navbar";
import { checkLoginFromNonLogin } from "../CONSTANT";
import Sidebar from "../components/Sidebar";
export default function Layout(props) {
  let navigate = useNavigate();
  // ------------------
  // SESSION - END
  // ------------------
  let __init_session = {
    personal: {
      id: "",
      email: "",
      username: "",
      role: "",
    },
    isLoggedIn: false,
  };
  const [session, setSession] = useState(__init_session);

  useEffect(() => {
    let sessionData = JSON.parse(sessionStorage.getItem("loggedin"));
    if (sessionData) {
      setSession({
        ...__init_session,
        personal: sessionData.data,
        isLoggedIn: true,
      });
    }
  }, []);

  const value = { session, setSession };
  // ------------------
  // SESSION - END
  // ------------------
  useEffect(() => {
    if (checkLoginFromNonLogin()) {
      navigate("/login");
    }
  }, [session]);

  const logout = async () => {
    sessionStorage.removeItem("loggedin");
    setSession({
      ...session,
      personal: __init_session.personal,
      isLoggedIn: false,
    });
    navigate("/");
  };

  return (
    <>
      <UserData.Provider value={value}>
        <Navbar
          isLoggedIn={session.isLoggedIn}
          __init_session={__init_session}
          setSession={setSession}
          logout={logout}
          session={session}
        />
        <div className="m-auto w-full max-w-screen-2xl mt-10 flex flex-row h-full">
          <Sidebar session={session} />
          <div className="w-full overflow-auto">{props.children}</div>
        </div>
        <div className="py-3"></div>
      </UserData.Provider>
    </>
  );
}
