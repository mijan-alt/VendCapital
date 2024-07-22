'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function EditSettings() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    business: '',
    picture: '',
    role: ''
  });

  useEffect(() => {
    // Fetch user data here
    // This is a placeholder. Replace with actual API call
    const fetchUserData = async () => {
      try {
        // const response = await fetch('/api/user');
        // const userData = await response.json();
        // setUser(userData);

        // Placeholder data
        setUser({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          business: 'Acme Inc.',
          picture:
            'https://media.istockphoto.com/id/1300972574/photo/millennial-male-team-leader-organize-virtual-workshop-with-employees-online.jpg?s=612x612&w=0&k=20&c=uP9rKidKETywVil0dbvg_vAKyv2wjXMwWJDNPHzc_Ug=',
          role: 'Business Manager'
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="mx-4">
      <div className="mb-6">
        <Image
          src={user.picture}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700 text-muted-foreground">
            First Name
          </label>
          <input
            type="text"
            value={user.firstName}
            readOnly
            className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm  font-bold text-gray-700 text-muted-foreground">
            Last Name
          </label>
          <input
            type="text"
            value={user.lastName}
            readOnly
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
          Business
        </label>
        <input
          type="text"
          value={user.business}
          readOnly
          className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          role
        </label>
        <input
          type="text"
          value={user.role}
          readOnly
          className="w-full rounded-lg border px-3 py-2 text-sm text-muted-foreground"
        />
      </div>
    </div>
  );
}
