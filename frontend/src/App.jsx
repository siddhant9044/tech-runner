// import { useState } from 'react';
// import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { UserCircle2, LogOut, Maximize2 } from 'lucide-react';
// import { useAuth } from './hooks/useAuth';
// import { storage } from './utils/storage';
// import './App.css';

// export function ProtectedLayout(){const {player,loading,setPlayer}=useAuth();if(loading)return <div className="boot-screen">CONNECTING TO TECH RUNNER...</div>;if(!player)return <Navigate to="/login" replace/>;return <AppShell player={player} onLogout={()=>{storage.clearAuth();setPlayer(null)}}/>;}
// function AppShell({player,onLogout}){const nav=useNavigate();const [fullscreen,setFullscreen]=useState(false);const toggle=()=>{if(!document.fullscreenElement){document.documentElement.requestFullscreen?.();setFullscreen(true)}else{document.exitFullscreen?.();setFullscreen(false)}};return <div className="app-shell"><header className="nav"><button className="brand" onClick={()=>nav('/levels')}><span>TECH</span> RUNNER<small>CODE • RUN • SURVIVE • WIN</small></button><nav><NavLink to="/levels">PLAY</NavLink><NavLink to="/leaderboard">LEADERBOARD</NavLink><NavLink to="/results">RESULTS</NavLink><NavLink to="/stats">STATS</NavLink></nav><div className="profile"><UserCircle2 size={32}/><div><b>{player.name}</b><small>{player.branch.replace('Computer Science and Engineering (CSE)','CSE')}</small></div><button onClick={toggle} title="Fullscreen"><Maximize2 size={16}/></button><button onClick={onLogout} title="Logout"><LogOut size={16}/></button></div></header><Outlet/></div>}
// export function LandingRedirect(){return <Navigate to="/login" replace/>}

import { useEffect, useState } from 'react';
import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  UserCircle2,
  LogOut,
  Maximize2,
  Menu,
  X,
} from 'lucide-react';

import { useAuth } from './hooks/useAuth';
import { storage } from './utils/storage';

import './App.css';

export function ProtectedLayout() {
  const {
    player,
    loading,
    setPlayer,
  } = useAuth();

  if (loading) {
    return (
      <div className="boot-screen">
        CONNECTING TO TECH RUNNER...
      </div>
    );
  }

  if (!player) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <AppShell
      player={player}
      onLogout={() => {
        storage.clearAuth();
        setPlayer(null);
      }}
    />
  );
}

function AppShell({
  player,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    fullscreen,
    setFullscreen,
  ] = useState(false);

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  /*
   * Close the mobile navigation
   * whenever the route changes.
   */
  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  /*
   * Keep fullscreen state synchronized
   * with the browser.
   */
  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      'fullscreenchange',
      syncFullscreen
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        syncFullscreen
      );
    };
  }, []);

  /*
   * Fullscreen is optional.
   * Some mobile browsers don't allow it,
   * so failure must never break navigation.
   */
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      // Fullscreen is optional.
    }
  };

  return (
    <div className="app-shell">
      <header className="nav">
        {/* ================================
            BRAND
        ================================= */}
        <button
          className="brand"
          onClick={() => navigate('/levels')}
          aria-label="Tech Runner home"
        >
          <span>TECH</span> RUNNER

          <small>
            CODE • RUN • SURVIVE • WIN
          </small>
        </button>

        {/* ================================
            DESKTOP / MOBILE NAVIGATION
        ================================= */}
        <nav
          className={`main-nav ${
            mobileMenu
              ? 'open'
              : ''
          }`}
        >
          <NavLink to="/levels">
            PLAY
          </NavLink>

          <NavLink to="/leaderboard">
            LEADERBOARD
          </NavLink>

          <NavLink to="/results">
            RESULTS
          </NavLink>

          <NavLink to="/stats">
            STATS
          </NavLink>
        </nav>

        {/* ================================
            PLAYER PROFILE
        ================================= */}
        <div className="profile">
          <UserCircle2 size={30} />

          <div>
            <b>
              {player.name}
            </b>

            <small>
              {player.branch.replace(
                'Computer Science and Engineering (CSE)',
                'CSE'
              )}
            </small>
          </div>

          <button
            onClick={toggleFullscreen}
            title={
              fullscreen
                ? 'Exit fullscreen'
                : 'Fullscreen'
            }
            aria-label="Toggle fullscreen"
          >
            <Maximize2 size={16} />
          </button>

          <button
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* ================================
            MOBILE MENU BUTTON
        ================================= */}
        <button
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenu(
              (value) => !value
            )
          }
          aria-label={
            mobileMenu
              ? 'Close navigation'
              : 'Open navigation'
          }
          aria-expanded={
            mobileMenu
          }
        >
          {mobileMenu ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </header>

      <Outlet />
    </div>
  );
}

export function LandingRedirect() {
  return (
    <Navigate
      to="/login"
      replace
    />
  );
}