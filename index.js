import {
    checkLogin
} from "./firebase.js";

checkLogin((user)=>{

    if(user){

        console.log("Logged In:", user.email);

    }else{

        console.log("Guest User");

    }

});