function getTimeAgoString(timestamp) {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diff = Math.abs(now - createdAt);
  
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30; 
    const year = day * 365; 
  
    if (diff < minute) {
      return Math.floor(diff / 1000) + ' seconds ago';
    } else if (diff < hour) {
      return Math.floor(diff / minute) + ' minutes ago';
    } else if (diff < day) {
      return Math.floor(diff / hour) + ' hours ago';
    } else if (diff < month) {
      return Math.floor(diff / day) + ' days ago';
    } else if (diff < year) {
      return Math.floor(diff / month) + ' months ago';
    } else {
      return Math.floor(diff / year) + ' years ago';
    }
  }

  export default getTimeAgoString;