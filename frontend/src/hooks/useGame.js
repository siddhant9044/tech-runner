import { useCallback, useEffect, useState } from 'react';
import { getGameSession } from '../services/gameService';
export function useGame(){const [session,setSession]=useState(null);const [loading,setLoading]=useState(true);const refresh=useCallback(()=>getGameSession().then(setSession).finally(()=>setLoading(false)),[]);useEffect(()=>{refresh().catch(()=>setLoading(false))},[refresh]);return {session,setSession,loading,refresh};}
