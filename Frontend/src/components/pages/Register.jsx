import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import Button from '../../utility/Button';
import Input from '../../utility/Input';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../AppWrapper';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {GoogleRegisterComponent,GoogleLoginComponent} from '../miniComponents/index.js'

function Register() {
  const { setUser, setIsAuthenticated } = useContext(Context);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [generalError, setGeneralError] = useState("");
  const selectedFile = watch("avatar");
  const imagePreview = selectedFile && selectedFile[0] ? URL.createObjectURL(selectedFile[0]) : null;
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const reg = async (formData) => {
    try {
      {console.log("form data:",formData)}
      setGeneralError(null);
      const config = {
        url: "/api/v1/user/register",
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      };
      const response = await axios(config);
     
      

      if (response && response.data) {
        console.log("regi res:",response.data);
        setUser(response.data.data);
        setIsAuthenticated(true);
        toast.success(response.data.message)
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      setGeneralError(error.response?.data?.message || error.message || "Unexpected error occurred while registering the user");
    }
  };

  return (
    <div className="bg-[#2f0c5f] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h1>

        {/* Display general errors */}
        {generalError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit(reg)} className="space-y-6">
          {/* Name Field */}
          <div>
            <Input
              label="Name"
              placeholder="Enter your name"
              className="w-full"
              type="text"
              {...register("name", {
                required: 'Name is required',
              })}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Phone Number Field */}
          <div>
            <Input
              label="Phone No."
              placeholder="Enter your phone number"
              className="w-full"
              type="text"
              {...register("phone", {
                required: 'Phone number is required',
              })}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          {/* Education Dropdown */}
          <div>
            <label htmlFor="education" className="block text-gray-700 font-medium mb-1">Education</label>
            <select
              id="education"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('education', {
                required: 'Education is required',
              })}
            >
              <option value="">Select your education</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="PHD">PHD</option>
              <option value="10Th pass">10Th pass</option>
              <option value="12Th pass">12Th pass</option>
            </select>
            {errors.education && <p className="text-sm text-red-500 mt-1">{errors.education.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              className="w-full"
              {...register('email', {
                required: 'Email is required',
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    'Email address must be valid',
                },
              })}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              className="w-full"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Role Dropdown */}
          <div>
            <label htmlFor="role" className="block text-gray-700 font-medium mb-1">Role</label>
            <select
              id="role"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('role', {
                required: 'Role is required',
              })}
            >
              <option value="">Select your role</option>
              <option value="Reader">Reader</option>
              <option value="Author">Author</option>
            </select>
            {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
          </div>

          {/* Avatar Field */}
          <div>
            <label htmlFor="avatar" className="block text-gray-700 font-medium mb-1">Avatar</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full"
              {...register("avatar", {
                required: "Avatar is required",
              })}
            />
            {errors.avatar && <p className="text-sm text-red-500 mt-1">{errors.avatar.message}</p>}

            {imagePreview && (
              <div className="mt-3">
                <p className="text-gray-700 text-sm mb-1">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Selected Avatar"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Button>
        </form>
          {/* google register */}
          <div className="mt-4 text-center">
          <GoogleRegisterComponent/>
        </div>
        
        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
