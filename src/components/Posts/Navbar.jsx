import React, { useContext, useEffect, useRef, useState } from "react";
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
import { userContext } from "../../App";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import search from "../../hooks/search";
import SearchBoxResult from "./SearchBoxResult";

export default function Navbar({ openModal, username }) {
  const [activityVisible, setActivityVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(userContext);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchSearchResults = async (searchQuery) => {
    try {
      const response = await search(searchQuery);
      setSearchResults(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value) {
      setIsOpen(true);
      fetchSearchResults(value);
    } else {
      setIsOpen(false);
    }
  };
  const handleLogout = () => {
    if (logoutUser()) {
      toast.success("Logout Successful");
      navigate("/login");
    } else {
      toast.error("There was a problem");
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target) &&
        (event.target.innerText || event.target.alt)
      ) {
        if(event.target.alt)
        {
          navigate(`/${event.target.alt}`)
        }
        else{
          navigate(`/${event.target.innerText}`);
        }
      }
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputRef, dropdownRef]);

  return (
    <Disclosure as="nav" className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-black  dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                  placeholder="Search... [CTRL+K]"
                  ref={inputRef}
                  value={query}
                  onChange={handleInputChange}
                  className="block text-black dark:text-gray-300 bg-white dark:bg-gray-900 w-64 h-8 p-3  border border-gray-400 dark:border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="flex items-center bg-gray-300 rounded-full p-2 ml-3">
                  <img className="h-4" src={searchIcon} alt="Search" />
                </button>
                {isOpen && searchResults?.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 w-64 mr-10 mt-9 overflow-hidden bg-white border border-gray-200 dark:border-gray-800  rounded-lg shadow-lg"
                  >
                    {searchResults.map((user) => (
                      <SearchBoxResult
                        key={user._id}
                        user={user}
                        onClick={() => {
                          setQuery(user.username);
                          setIsOpen(false);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 lg:gap-5">
            <button
              type="button"
              className="relative rounded-full bg-white dark:bg-gray-800 p-1 text-black dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-blue dark:focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={openModal}
              className="relative rounded-full bg-white dark:bg-gray-800 p-1 text-black dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-blue dark:focus:ring-offset-gray-800 ml-2"
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
                    onClick={() => navigate(`/${userData?.username}`)}
                    className="block px-4 py-2 text-sm text-black dark:text-gray-700 data-[focus]:bg-gray-100"
                  >
                    My Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <div className="flex items-center px-6 py-2">
                    <DarkModeToggle />
                  </div>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-black dark:text-gray-700 hover:bg-gray-100 focus:outline-none"
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

      <DisclosurePanel className="sm:hidden items-center justify-between relative">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="Search..."
              ref={inputRef}
              value={query}
              onChange={handleInputChange}
              className="block text-black dark:text-gray-300 bg-white dark:bg-gray-900 m-4 h-8 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="flex h-10 w-10 mt-3 items-center bg-gray-300 rounded-full p-2">
              <img className="h-5" src={searchIcon} alt="Search" />
            </button>
          </div>
          <div className="w-full h-1 mt-1"></div>
          {isOpen && searchResults?.length > 0 && (
            <div
              ref={dropdownRef}
              className="z-10 w-56 mr-7 mb-2 overflow-hidden bg-white border border-gray-200 dark:border-gray-800  rounded-lg shadow-lg"
            >
              {searchResults.map((user) => (
                <SearchBoxResult
                  key={user._id}
                  user={user}
                  onClick={() => {
                    console.log(`Navigating to: /${user.username}`);
                    navigate(`/${user.username}`);
                    setQuery(user.username);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
