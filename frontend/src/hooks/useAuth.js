import { useEffect, useState } from 'react';
import { me } from '../services/authService';
import { storage } from '../utils/storage';
export function useAuth(){const [player,setPlayer]=useState(storage.getPlayer());const [loading,setLoading]=useState(Boolean(storage.getToken()));useEffect(()=>{if(!storage.getToken()){setLoading(false);return;}me().then(setPlayer).catch(()=>{storage.clearAuth();setPlayer(null)}).finally(()=>setLoading(false));},[]);return {player,setPlayer,loading};}
