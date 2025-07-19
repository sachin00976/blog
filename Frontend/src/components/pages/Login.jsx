import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../AppWrapper';
import Button from '../../utility/Button';
import Input from '../../utility/Input';
import { Link } from 'react-router-dom';
import { GoogleLoginComponent } from '../miniComponents/index.js'
import axios from '../../utility/AxiosInstance.jsx';
import { Helmet } from 'react-helmet-async'

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const [generalError, setGeneralError] = useState(null);

  const login = async (formData) => {

    try {
      const config = {
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        data: formData,
        withCredentials: true
      };

      const response = await axios(config);


      if (response && response.data) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (err) {

      setGeneralError(err.response?.data?.message || err.message || "Unexpected error occurred while login the user");
    }
  };

  return (
    <div className="bg-[#2f0c5f] min-h-screen flex items-center justify-center px-4">
      <Helmet>
        <title>{`Login - ${import.meta.env.VITE_APP_NAME}`}</title>
      </Helmet>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h1>

        {/* Display general errors */}
        {generalError && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit(login)} className="space-y-6">
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign in
          </Button>
        </form>
        {/* google Login */}
        <div className="mt-4 text-center">
          <GoogleLoginComponent />
        </div>
        {/* Registration Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
