import React from 'react';
import emptyprofile from '../assets/emptyprofile.jpg';

export default function SearchUser({ user }) {

    return (

        <div>
            {user.map((u) => (
                <div
                    className="h-14 w-full mt-2 flex items-center justify-between hover:bg-gray-200 hover:bg-opacity-60 rounded-md px-2 py-1 cursor-pointer transition duration-200"   
                >
                    <div className="h-5/6 flex items-center space-x-2" key={u.id}>
                        <img
                            src={u.photoURL || emptyprofile}
                            alt="profilePicture"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-bold text-gray-800">
                                {u.name}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
