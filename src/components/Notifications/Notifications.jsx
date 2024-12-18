import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Notifications({ setIsNotificatonsOpen }) {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const notificationRefs = useRef([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleMarkAsRead = async (notification) => {
    const token = localStorage.getItem("token");
    if (notification?.isRead === false) {
      try {
        const response = await axios.put(
          `${API_URL}/api/notification/read/${notification._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications((prevNotifications) => {
          return prevNotifications.map((notif) =>
            notif._id === notification._id ? { ...notif, isRead: true } : notif
          );
        });
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_URL}/api/getNotifications?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications((prev) =>
        page === 1 ? data.notifications : [...prev, ...data?.notifications]
      );
      setHasMore(page < data.totalPages);
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        toast.error("Session expired or invalid token, please login again!");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Error occurred while processing request!");
        console.error("Error details:", error);
      }
    }
  };

  const handleClick = (URL, post = "") => {
    setIsNotificatonsOpen(false);
    if (post) {
      navigate(`/post/${post}`);
    } else {
      navigate(`/${URL}`);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const notification = entry.target;

            const notificationIndex = notification.dataset.index;
            const notificationToMark = notifications[notificationIndex];
            handleMarkAsRead(notificationToMark);
          }
        });
      },
      {
        threshold: 1.0,
      }
    );

    notificationRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      notificationRefs.current.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [notifications]);

  return (
    <div className="absolute top-14 right-4 w-64 p-4 bg-slate-50 dark:bg-darkgray shadow-lg rounded-lg z-50">
      <h3 className="text-black dark:text-white font-bold mb-2">
        Notifications
      </h3>
      <hr className="border-t border-gray-300 dark:border-gray-700 mb-2" />
      <div className="flex flex-col gap-2 h-auto max-h-28">
        {notifications?.length === 0 && (
          <span className="text-black dark:text-white text-center">
            No Notifications
          </span>
        )}
        {notifications &&
          notifications.map((notification, index) => (
            <span
              onClick={() =>
                handleClick(
                  notification?.message?.trim().split(" ")[0],
                  notification?.post
                )
              }
              key={notification._id}
              data-index={index}
              className="text-black dark:text-white cursor-pointer focus:underline"
              ref={(el) => (notificationRefs.current[index] = el)}
              tabIndex={index}
            >
              {notification.message}
            </span>
          ))}
        {hasMore && (
          <div ref={loader} className="h-2 bg-slate-50 dark:bg-darkgray" />
        )}
      </div>
    </div>
  );
}
