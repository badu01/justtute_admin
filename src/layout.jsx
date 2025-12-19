import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Events from "./pages/events";
import About from "./pages/about";
import Team from "./pages/team";

function Layout() {
  return (
    <div className="flex flex-col h-screen w-screen">

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Team />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <div className="h-14 bg-amber-300 flex items-center justify-around border-t border-black">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 bg-red-600 text-white rounded"
              : "px-4 py-2 text-black"
          }
        >
          HOME
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 bg-red-600 text-white rounded"
              : "px-4 py-2 text-black"
          }
        >
          ABOUT
        </NavLink>

        <NavLink
          to="/event"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 bg-red-600 text-white rounded"
              : "px-4 py-2 text-black"
          }
        >
          EVENTS
        </NavLink>

        <NavLink
          to="/teams"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 bg-red-600 text-white rounded"
              : "px-4 py-2 text-black"
          }
        >
          TEAMS
        </NavLink>
      </div>
    </div>
  );
}

export default Layout;
