import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
