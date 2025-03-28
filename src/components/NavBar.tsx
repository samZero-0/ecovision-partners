'use client'

import { useContext, useEffect, useState } from "react";

import { AiOutlineLogin } from "react-icons/ai";
import { AuthContext } from "../../providers/AuthProvider";
// import { DarkModeSwitch } from "react-toggle-dark-mode";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaCartPlus } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [hamburger, setHamburger] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode, isAdmin, isUser, isSeller, cart } = useContext(AuthContext);
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
      return "/adminDashboard";
    } else if (isSeller) {
      return "/sellerDashboard";
    } else if (isUser) {
      return "/userDashboard";
    } else {
      return "/userDashboard"; 
    }
  };

  console.log(user);
  

  return (
    <section className="sticky top-0 z-50 backdrop-blur-lg bg-white ">
      <section className="md:w-11/12 md:mx-auto">
        <div className="navbar">
          {/* Navbar Start */}
          <div className="navbar-start flex items-center">
            <button
              className="lg:hidden btn btn-ghost btn-circle"
              onClick={() => setHamburger(!hamburger)}
            >
              {hamburger ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
            <Link href="/" className="btn btn-ghost text-xl hidden lg:block">
              {/* <Image src="/logo.png" alt="Logo" className="md:block w-[200px]" /> */}
            </Link>
          </div>

          {/* Navbar Center */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-lg ">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
            </ul>
          </div>

          {/* Navbar End */}
          <div className="navbar-end flex items-center">
            
          
            {/* <div className="md:mr-8 mr-3">
              <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode} size={30} />
            </div> */}
            {user && user.email ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.photoURL} alt="User Avatar" width={10} />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-base-200 rounded-box z-[50] mt-2 w-52 p-2 shadow"
                >
                  <li>
                    <Link href="/myOrders">Update profile</Link>
                  </li>
                  <li>
                    {/* Dynamic Dashboard Link */}
                    <Link href={getDashboardPath()}>Dashboard</Link>
                  </li>
                  <li>
                    <button onClick={logOut}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              showLoginButton && (
                <Link href="/login" className="btn bg-[#a0e2ff] hidden lg:flex">
                  <AiOutlineLogin className="text-xl" /> Join Us
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {hamburger && (
          <div className="lg:hidden bg-white dark:bg-black shadow-lg">
            <ul className="menu menu-vertical p-4">
              <li>
                <Link href="/" onClick={() => setHamburger(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" onClick={() => setHamburger(false)}>
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/login" onClick={() => setHamburger(false)}>
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