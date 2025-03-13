import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { Context } from "../../AppWrapper";
import { useNavigate } from "react-router-dom";


const GoogleRegisterComponent = () => {
   const { setUser, setIsAuthenticated } = useContext(Context);
   const navigate=useNavigate();
  const [credential, setCredential] = useState(null);

  useEffect(() => {
    const sendCredential = async () => {
      try {
        if (credential) {
          console.log("Google Registration Response: ", credential);

          
          const config = {
            method: "post", // Change to POST
            url: "/api/v1/user/googleRegister",
            data: { credential }, // Send credential in the request body
          };

          const response = await axios(config);
          console.log("Refg:",response)
          if (response && response.data) {
            console.log("Registration Success:", response.data);
            setUser(response.data.data);
            setIsAuthenticated(true);
            toast.success("Registered successfully!");
            navigate('/');
          }

          
          
        }
      } catch (error) {
        console.error("Google Registration Error:", error);
        toast.error(error.response.data.message || "FAILED TO REGISTER | PLEASE TRY AGAIN");
      }
    };

    sendCredential();
  }, [credential]);

  const handleSuccess = (response) => {
    setCredential(response.credential); // ✅ Store the credential
  };

  const handleFailure = (error) => {
    console.error("Google Registration Failed:", error);
    toast.error("Google Registration Failed. Please try again.");
  };

  return (
    <div>
      <h2>OR</h2>
      <GoogleLogin
        useOneTap={false}
        onSuccess={handleSuccess}
        onError={handleFailure}
        flow="auth-code" // ✅ Ensure backend supports auth code flow
      />
    </div>
  );
};

export default GoogleRegisterComponent;
