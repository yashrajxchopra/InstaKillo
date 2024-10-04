export default function logoutUser(){
    if(localStorage.getItem('token')){
        localStorage.removeItem('token')
        return true;
    }
    else{
        return false;
    }
}