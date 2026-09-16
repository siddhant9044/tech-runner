import { Routes, Route } from 'react-router-dom';
import { LandingRedirect, ProtectedLayout } from '../App';
import Login from '../pages/Login/Login';
import LevelSelect from '../pages/LevelSelect/LevelSelect';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import FinalResults from '../pages/FinalResults/FinalResults';
import GameStats from '../pages/GameStats/GameStats';
import GamePage from '../pages/Game/GamePage';
export default function AppRoutes(){return <Routes><Route path="/" element={<LandingRedirect/>}/><Route path="/login" element={<Login/>}/><Route element={<ProtectedLayout/>}><Route path="/levels" element={<LevelSelect/>}/><Route path="/game/:level" element={<GamePage/>}/><Route path="/results" element={<FinalResults/>}/><Route path="/leaderboard" element={<Leaderboard/>}/><Route path="/stats" element={<GameStats/>}/></Route><Route path="*" element={<LandingRedirect/>}/></Routes>}
