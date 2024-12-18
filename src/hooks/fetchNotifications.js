import axios from 'axios';

export default async function fetchNotifications() {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/api/getNotifications?page=1&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const unread = data.notifications.filter((notif) => !notif.isRead).length;
      return unread;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
}