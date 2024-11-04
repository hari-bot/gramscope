import React from "react";
import { Link as LinkIcon, User, IdCard } from "lucide-react";

export default function ProfileHeader({ profile }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-32 sm:h-48 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="relative px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:-mt-16">
          <div className="flex-shrink-0 -mt-16 sm:mt-0">
            <img
              src={profile.profile_picture_url}
              alt={`${profile.username}'s profile`}
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
          <div className="mt-6 sm:mt-0 sm:ml-6 flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  {profile.username}
                </h1>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start">
              <div className="flex items-center text-sm text-gray-500 mb-2 sm:mb-0">
                <IdCard
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                {profile.name}
              </div>
              <div className="flex items-center text-sm text-gray-500 mr-4 mb-2 sm:mb-0">
                <User
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                {profile.account_type}
              </div>
              <div className="flex items-center text-sm text-gray-500 mr-4 mb-2 sm:mb-0">
                <LinkIcon
                  className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
                <a
                  href={`https://www.instagram.com/${profile.username}/`}
                  className="hover:text-purple-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  instagram.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 max-w-5xl mx-auto">
          <p className="text-gray-700 whitespace-pre-line text-center sm:text-left">
            {profile.biography}
          </p>
        </div>
        <dl className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center px-4">
            <dt className="text-lg font-medium text-gray-900">
              {profile.media_count}
            </dt>
            <dd className="text-sm text-gray-500">Posts</dd>
          </div>
          <div className="flex flex-col items-center px-4">
            <dt className="text-lg font-medium text-gray-900">
              {profile.followers_count}
            </dt>
            <dd className="text-sm text-gray-500">Followers</dd>
          </div>
          <div className="flex flex-col items-center px-4">
            <dt className="text-lg font-medium text-gray-900">
              {profile.follows_count}
            </dt>
            <dd className="text-sm text-gray-500">Following</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
