'use client'

import { useContext, useEffect, useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { AuthContext } from "../../providers/AuthProvider";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import Link from "next/link";

const Navbar = () => {
  const [hamburger, setHamburger] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode, isAdmin, isDonor, isVolunteer } = useContext(AuthContext);
  const [showLoginButton, setShowLoginButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Determine the dashboard path based on the user's role
  const getDashboardPath = () => {
    if (isAdmin) {
      return "/admin";
    } else if (isDonor) {
      return "/donor";
    } else if (isVolunteer) {
      return "/volunteer";
    } else {
      return "/donor"; 
    }
  };

  console.log(user);
  console.log(isAdmin, isDonor, isVolunteer);
  
  return (
    <section className="fixed top-0 left-0 right-0 z-150 shadow-md bg-white  ">
      <section className="md:w-11/12 md:mx-auto">
        <div className="navbar py-3">
          {/* Navbar Start */}
          <div className="navbar-start flex items-center">
            <button
              className="lg:hidden btn btn-ghost btn-circle bg-teal-50 hover:bg-teal-100 transition-colors"
              onClick={() => setHamburger(!hamburger)}
            >
              {hamburger ? <AiOutlineClose size={24} className="text-teal-700" /> : <AiOutlineMenu size={24} className="text-teal-700" />}
            </button>
            <Link href="/" className=" text-xl  lg:flex items-center gap-2">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">
                Ecovision
              </span>
              <span className="text-3xl font-medium text-gray-700">Partners</span>
            </Link>
          </div>

          {/* Navbar Center */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex space-x-8 text-base font-medium">
              <li>
                <Link href="/" className="relative py-2 px-1 text-gray-700 hover:text-teal-600 transition-colors after:absolute after:w-0 after:h-0.5 after:bg-teal-500 after:bottom-0 after:left-0 hover:after:w-full after:transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/" className="relative py-2 px-1 text-gray-700 hover:text-teal-600 transition-colors after:absolute after:w-0 after:h-0.5 after:bg-teal-500 after:bottom-0 after:left-0 hover:after:w-full after:transition-all">
                  About
                </Link>
              </li>
              <li>
                <Link href="/events" className="relative py-2 px-1 text-gray-700 hover:text-teal-600 transition-colors after:absolute after:w-0 after:h-0.5 after:bg-teal-500 after:bottom-0 after:left-0 hover:after:w-full after:transition-all">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Navbar End */}
          <div className="navbar-end flex items-center">
            {user && user.email ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="btn btn-ghost btn-circle avatar ring-2 ring-teal-300 ring-offset-2">
                  <div className="w-10 rounded-full">
                    <img src={user.photoURL} alt="User Avatar" width={10} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-white rounded-lg z-[50] mt-2 w-52 p-2 shadow-lg border border-teal-100"
                >
                  <li>
                    <Link href={getDashboardPath()} className="text-gray-700 hover:text-teal-600 hover:bg-teal-50">Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={logOut} className="text-gray-700 hover:text-teal-600 hover:bg-teal-50">Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              showLoginButton && (
                <Link 
                  href="/login" 
                  className="btn bg-gradient-to-r from-teal-500 to-emerald-500 border-none text-white hover:from-teal-600 hover:to-emerald-600 hidden lg:flex gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <AiOutlineLogin className="text-xl" /> Join Us
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {hamburger && (
          <div className="lg:hidden bg-white shadow-lg rounded-b-lg overflow-hidden">
            <ul className="p-4 space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="flex py-2 px-4 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-md transition-colors"
                  onClick={() => setHamburger(false)}
                >
                  Home
                </Link>
              </li>
              <li>
              <Link href="/events" className="relative py-2 px-1 text-gray-700 hover:text-teal-600 transition-colors after:absolute after:w-0 after:h-0.5 after:bg-teal-500 after:bottom-0 after:left-0 hover:after:w-full after:transition-all">
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="flex py-2 px-4  text-black rounded-md"
                  onClick={() => setHamburger(false)}
                >
                  Join Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </section>
    </section>
  );
};

export default Navbar;