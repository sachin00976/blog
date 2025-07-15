import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { Context } from "../../AppWrapper";
import { useNavigate } from "react-router-dom";

const GoogleLoginComponent = () => {
  const { setUser, setIsAuthenticated } = useContext(Context);
  const navigate=useNavigate();
  const [credential, setCredential] = useState(null);

  useEffect(() => {
    const sendCredential = async () => {
      try {
        if (credential) {
          console.log("Google Response: ", credential);

          
          const config = {
            method: "post", 
            url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/googleLogin`,
            data: { credential }, 
          };

          const response = await axios(config);
          if(response)
          {
             localStorage.setItem('user', JSON.stringify(response.data.data));
            setUser(response.data.data);
            setIsAuthenticated(true);
            toast.success("Login successfully!")
            navigate('/')
          }
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        toast.error("FAILED TO LOGIN | PLEASE TRY AGAIN");
      }
    };

    sendCredential();
  }, [credential]);

  const handleSuccess = (response) => {
    setCredential(response.credential); // Set the credential
  };

  const handleFailure = (error) => {
    console.error("Google Login Failed:", error);
    toast.error("Google Login Failed. Please try again.");
  };

  return (
   
      <div>
        <h2>OR</h2>
        <GoogleLogin
          useOneTap={false}
          onSuccess={handleSuccess}
          onError={handleFailure}
          flow="auth-code"
        />
      </div>
   
  );
};

export default GoogleLoginComponent;