import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';
export function useLeaderboard(page=1,limit=10,branch=''){const [data,setData]=useState({rows:[],pages:1,total:0});const [loading,setLoading]=useState(true);const [error,setError]=useState('');useEffect(()=>{let active=true;setLoading(true);fetchLeaderboard({page,limit,branch}).then(d=>active&&setData(d)).catch(e=>active&&setError(e.message)).finally(()=>active&&setLoading(false));return()=>{active=false}},[page,limit,branch]);return {data,loading,error};}
