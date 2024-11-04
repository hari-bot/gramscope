import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/instagram";
  };

  return (
    <Layout>
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-purple-600 mb-6">
            Welcome to Mustard
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your Instagram account to get started
          </p>
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition duration-300"
          >
            Login with Instagram
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;
