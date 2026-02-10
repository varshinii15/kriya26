import React, { Suspense } from "react";
import "../../../styles/gradientAnimation.css";
import NavBarForDesktop from "../../../components/Navbar/NavBarForDesktop";
import NavBarForMobile from "../../../components/Navbar/NavBarForMobile";

const PortalWrapper = ({ children }) => {
  return (
    <main className="w-screen h-screen overflow-x-hidden flex text-black bg-[#181818]">
      <NavBarForDesktop />
      <NavBarForMobile />
      <Suspense fallback={
        <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-screen h-screen">
          <p className="text-lg font-semibold text-gray-600 animate-pulse">
            Loading...
          </p>
        </div>
      }>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </Suspense>
    </main>
  );
};

export default PortalWrapper;
