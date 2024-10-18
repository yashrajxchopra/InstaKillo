import React, { useState } from "react";
import searchIcon from "./img/icon/search.png";
import homeIcon from "./img/icon/home.png";
import logout from "./img/icon/logout.png";
import addIcon from "./img/icon/add.png";
import logo from "../LogIn/logo.png";
import CreatePost from "../CreatePost/CreatePost";
import heartIcon from "./img/icon/heart-nofill.png";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import logoutUser from "../../hooks/logout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import user from "./img/icon/user.png";

export default function Navbar({ openModal }) {
  const [activityVisible, setActivityVisible] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: "Feed", href: "#", current: true },
    { name: "Team", href: "#", current: false },
    { name: "Projects", href: "#", current: false },
    { name: "Calendar", href: "#", current: false },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const toggleActivity = () => {
    setActivityVisible(!activityVisible);
    setHeartIcon(heartIconn === heartIcon ? heartIconF : heartIcon);
  };
  const handleLogout = () => {
    if (logoutUser()) {
      toast.success("Logout Successful");
      navigate("/login");
    } else {
      toast.error("There was a problem");
    }
  };
  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center cursor-pointer">
              <img
                alt="InstaKillo"
                src={logo}
                className="h-8 w-auto"
                onClick={() => navigate("/")}
              />
            </div>
            <div className="hidden sm:ml-6 sm:block flex-grow">
              <div className="flex justify-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-64 h-8 p-3  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="flex items-center bg-gray-300 rounded-full p-2 ml-3">
                  <img className="h-4" src={searchIcon} alt="Search" />
                </button>
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 lg:gap-5">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={openModal}
              className="relative rounded-full ml-2 bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Create post</span>
              <img
                src={addIcon}
                aria-hidden="true"
                className="h-6 w-6 "
                alt="add"
              />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img alt="" src={user} className="h-8 w-8 rounded-full" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                  >
                    My Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                  >
                    <img src={logout} className="h-4 w-4 mr-2" alt="Log out" />
                    Log out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden items-center justify-between">
        <div className="flex justify-center items-center">
          <input
            type="text"
            placeholder="Search..."
            className="block m-4 h-8 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="flex items-center bg-gray-300 rounded-full p-2">
            <img className="h-5" src={searchIcon} alt="Search" />
          </button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
