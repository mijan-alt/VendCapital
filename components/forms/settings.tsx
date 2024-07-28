'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import axios from 'axios';
import Formloader from '../loaders/Formloader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function UserProfileSettings() {
  const router = useRouter();
  const { data: session } = useSession();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    image: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPicture, setNewPicture] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // useEffect(() => {
  //   if (session?.user?.email) {
  //     setImageUrl(`/api/picture/${session.user.email}`);
  //   }
  // }, [session?.user?.email]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/currentuser`);

        if (response.status === 200) {
          setUser(response.data);
          setLoading(false);
          console.log(response.data);
        }
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  console.log(user);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    try {
      setLoading(true);

      if (newPicture) {
        // Upload new picture first
        const formData = new FormData();
        formData.append('file', newPicture);
        formData.append('email', session.user.email);
        await axios.post('/api/upload', formData);
      }

      const updatedUser = { ...user };

      const response = await axios.put(`/api/currentuser`, updatedUser);

      if (response.status === 200) {
        setUser(response.data);
        setIsEditing(false);
        setNewPicture(null);
      }

      //update the session
      const newSession = await getSession();
      if (newSession) {
        newSession.user = {
          ...newSession.user,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          name: `${response.data.firstName} ${response.data.lastName}`.trim()
        };
        await signIn('credentials', { redirect: false, ...newSession });
      }
    } catch (err) {
      setError('Failed to update user data');
      console.error('Error updating user data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4">
      <div className="flex items-start justify-between">
        <Heading title={`Settings`} description="" />
      </div>

      <Separator />

      <>
        {loading ? (
          <Formloader />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6 mt-4 flex flex-row justify-between">
              <div>
                <Avatar className="h-[100px] w-[100px]">
                  <AvatarImage src={imageUrl} alt={user?.username ?? ''} />
                  <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                )}
              </div>
              {!isEditing ? (
                <Button
                  className="text-xs md:text-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex flex-row gap-2">
                  <Button type="submit" className="text-xs md:text-sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Save changes
                  </Button>
                  <Button
                    type="submit"
                    className="text-xs md:text-sm"
                    onClick={() => setIsEditing(false)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700 text-muted-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm  font-bold text-gray-700 text-muted-foreground">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full rounded-lg border  px-3 py-2 text-sm text-muted-foreground"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                role
              </label>
              <input
                type="text"
                value={user?.role}
                readOnly
                className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
          </form>
        )}
      </>
    </div>
  );
}
