import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Context } from '../../AppWrapper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';

function EditProfile() {
  const { user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone,
      education: user.education,
      avatar: user.avatar.url,
    },
  });

  const avatarPreview = watch('avatar');

  const onSubmit = async (data) => {
    try {
      const { data: updatedUser } = await axios.put('/api/v1/user/updateProfile', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setUser(updatedUser.user);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#2f0c5f] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-center text-4xl font-bold mb-6 text-gray-800">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center relative">
            <img
              src={avatarPreview || user.avatar.url}
              alt="User Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black mx-auto object-cover"
            />
            <label className="absolute bottom-2 right-12 bg-gray-500 hover:bg-gray-400 p-2 rounded-full cursor-pointer">
              <FaCamera className="text-black" />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-black">Name:</label>
            <input {...register('name', { required: 'Name is required' })} className="w-full p-3 rounded-lg bg-white text-black border border-black focus:ring-2 focus:ring-gray-500" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-black">Phone:</label>
            <input {...register('phone', { required: 'Phone is required' })} className="w-full p-3 rounded-lg bg-white text-black border border-black focus:ring-2 focus:ring-gray-500" />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-black">Education:</label>
            <input {...register('education', { required: 'Education is required' })} className="w-full p-3 rounded-lg bg-white text-black border border-black focus:ring-2 focus:ring-gray-500" />
            {errors.education && <p className="text-red-500 text-sm">{errors.education.message}</p>}
          </div>
          <div>
            <label className="block text-black">Email (Cannot be changed):</label>
            <p className="text-black text-lg">{user.email}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;