import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProfileHeader from "../components/ProfileHeader";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getQueryParams = () => {
      const params = new URLSearchParams(location.search);
      return {
        accessToken: params.get("accessToken"),
        userId: params.get("userId"),
      };
    };

    const { accessToken, userId } = getQueryParams();

    if (accessToken && userId) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", userId);
      window.history.replaceState({}, document.title, "/profile");
    } else if (!localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/instagram/profile?accessToken=${accessToken}`
          );
          const data = await response.json();
          setProfile(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      fetchProfile();
    }
  }, []);

  return (
    <Layout>
      {profile ? (
        <ProfileHeader profile={profile} />
      ) : (
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </Layout>
  );
}

export default ProfilePage;
