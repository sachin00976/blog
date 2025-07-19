import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '../../AppWrapper';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../utility/AxiosInstance';
import { Helmet } from 'react-helmet-async'

function EditProfile() {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone || '',
      education: user.education || '',
    },
  });

  const selectedFile = watch("avatar");
  const avatarPreview = selectedFile && selectedFile[0]
    ? URL.createObjectURL(selectedFile[0])
    : user.avatar.url;

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview !== user.avatar.url) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview, user.avatar.url]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone || '');
      formData.append('education', data.education || '');
      if (data.avatar && data.avatar.length > 0) {
        formData.append('avatar', data.avatar[0]); // Send file directly
      }

      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/updateUserProfile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        console.log("update User Profile:",response)
        setUser(response.data.data);
        toast.success(response.data.message)
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || "Error Occured While Updating Profile ! Please Try Again")
      console.error('Update error:', err);
    }
  };

  return (
    <div className="bg-[#2f0c5f] min-h-screen flex items-center justify-center px-4">
      <Helmet>
        <title>{`Edit profile - ${import.meta.env.VITE_APP_NAME}`}</title>
      </Helmet>
      <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-center text-4xl font-bold mb-6 text-gray-800">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Preview */}
          <div className="text-center relative">
            <img
              src={avatarPreview}
              alt="User Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black mx-auto object-cover"
            />
            <label className="absolute bottom-2 right-12 bg-gray-500 hover:bg-gray-400 p-2 rounded-full cursor-pointer">
              <FaCamera className="text-black" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register('avatar')}
              />
            </label>
          </div>
  
          {/* Name */}
          <div>
            <label className="block text-black">Name:</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full p-3 rounded-lg bg-white text-black border border-black focus:ring-2 focus:ring-gray-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
  
          {/* Phone (optional) */}
          <div>
            <label className="block text-black">Phone:</label>
            <input
              {...register('phone')}
              className="w-full p-3 rounded-lg bg-white text-black border border-black focus:ring-2 focus:ring-gray-500"
            />
          </div>
  
          {/* Education (dropdown) */}
          <div>
            <label className="block text-black">Education:</label>
            <select
              {...register('education')}
              className="w-full p-3 rounded-lg bg-white text-black border border-black focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select your education</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="PHD">PHD</option>
              <option value="10Th pass">10Th pass</option>
              <option value="12Th pass">12Th pass</option>
              <option value="Other">Other</option>
            </select>
          </div>
  
          {/* Email (read-only) */}
          <div>
            <label className="block text-black">Email (Cannot be changed):</label>
            <p className="text-black text-lg">{user.email}</p>
          </div>
  
          {/* Submit and Cancel Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Save Changes'}
            </button>
  
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-300 text-black py-3 rounded-lg hover:bg-gray-400 transition duration-200 text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
}

export default EditProfile;
