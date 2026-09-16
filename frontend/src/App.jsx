import { useState } from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserCircle2, LogOut, Maximize2 } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { storage } from './utils/storage';
import './App.css';

export function ProtectedLayout(){const {player,loading,setPlayer}=useAuth();if(loading)return <div className="boot-screen">CONNECTING TO TECH RUNNER...</div>;if(!player)return <Navigate to="/login" replace/>;return <AppShell player={player} onLogout={()=>{storage.clearAuth();setPlayer(null)}}/>;}
function AppShell({player,onLogout}){const nav=useNavigate();const [fullscreen,setFullscreen]=useState(false);const toggle=()=>{if(!document.fullscreenElement){document.documentElement.requestFullscreen?.();setFullscreen(true)}else{document.exitFullscreen?.();setFullscreen(false)}};return <div className="app-shell"><header className="nav"><button className="brand" onClick={()=>nav('/levels')}><span>TECH</span> RUNNER<small>CODE • RUN • SURVIVE • WIN</small></button><nav><NavLink to="/levels">PLAY</NavLink><NavLink to="/leaderboard">LEADERBOARD</NavLink><NavLink to="/results">RESULTS</NavLink><NavLink to="/stats">STATS</NavLink></nav><div className="profile"><UserCircle2 size={32}/><div><b>{player.name}</b><small>{player.branch.replace('Computer Science and Engineering (CSE)','CSE')}</small></div><button onClick={toggle} title="Fullscreen"><Maximize2 size={16}/></button><button onClick={onLogout} title="Logout"><LogOut size={16}/></button></div></header><Outlet/></div>}
export function LandingRedirect(){return <Navigate to="/login" replace/>}
