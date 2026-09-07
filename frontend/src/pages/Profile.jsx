import { useState } from 'react';
import { useAuthStore } from '../context/useAuthStore';
import { Camera, User, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Profile</h1>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-zinc-100 shadow-md dark:border-zinc-800 dark:bg-zinc-800">
              <img
                src={selectedImage || authUser?.profilePicture || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-brand-primary text-white shadow-sm transition-transform hover:scale-105 ${
                isUpdatingProfile ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <Camera size={18} />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Full Name</label>
              <div className="mt-1 flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
                <User size={18} className="text-zinc-400" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{authUser?.fullName}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Email Address</label>
              <div className="mt-1 flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50">
                <Mail size={18} className="text-zinc-400" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{authUser?.email}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 rounded-xl bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <p>Your profile picture is uploaded securely to Cloudinary and synchronized across all your devices.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
