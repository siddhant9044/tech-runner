// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Trophy, RotateCcw, Medal } from 'lucide-react';
// import { getGameSession, getScores, createGameSession } from '../../services/gameService';
// import { storage } from '../../utils/storage';
// import { LEVELS } from '../../utils/constants';
// import './FinalResults.css';
// export default function FinalResults(){const nav=useNavigate();const [session,setSession]=useState(null);const [scores,setScores]=useState([]);const [error,setError]=useState('');useEffect(()=>{Promise.all([getGameSession(),getScores()]).then(([s,sc])=>{setSession(s);setScores(sc)}).catch(e=>setError(e.message))},[]);const map=Object.fromEntries(scores.map(s=>[s.level,s]));const replay=async()=>{try{const s=await createGameSession();setSession(s);setScores([]);nav('/levels')}catch(e){setError(e.message)}};return <main className="results page"><div className="results-card panel"><div className="result-top"><div className="section-title">MISSION COMPLETE</div><Trophy size={54}/></div><h1>CYBERSECURITY COMPLETE</h1><div className="boss-banner"><Medal/> BOSS DEFEATED <Medal/></div><div className="player-line"><b>{storage.getPlayer()?.name}</b><span>{storage.getPlayer()?.branch}</span></div><div className="result-grid">{LEVELS.map(l=><div className="result-level" key={l.key}><small>{l.short}</small><b>{map[l.key]?.score||0}</b><span>{map[l.key]?.coins||0} COINS</span><span>{formatTime(map[l.key]?.time||0)} • {Math.round(map[l.key]?.distance||0)}m</span></div>)}</div><div className="totals"><div><span>TOTAL SCORE</span><b>{session?.totalScore||0}</b></div><div><span>TOTAL COINS</span><b>{session?.totalCoins||0}</b></div><div><span>TOTAL TIME</span><b>{formatTime(session?.totalTime||0)}</b></div><div><span>TOTAL DISTANCE</span><b>{((session?.totalDistance||0)/1000).toFixed(1)} km</b></div><div><span>OBSTACLES HIT</span><b>{session?.totalObstaclesHit||0}</b></div><div><span>LIVES REMAINING</span><b>{map.cyber?.livesRemaining??0}</b></div></div>{error&&<div className="result-error">{error}</div>}<div className="result-actions"><button onClick={()=>nav('/leaderboard')}>VIEW LEADERBOARD</button><button className="secondary" onClick={replay}><RotateCcw size={16}/> PLAY AGAIN</button></div></div></main>}
// function formatTime(s){const sec=Math.round(Number(s)||0);return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
import { useEffect, useState } from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  Trophy,
  RotateCcw,
  Medal,
} from 'lucide-react';

import {
  getGameSession,
  getScores,
  createGameSession,
} from '../../services/gameService';

import { storage } from '../../utils/storage';
import { LEVELS } from '../../utils/constants';

import './FinalResults.css';

export default function FinalResults() {
  const navigate =
    useNavigate();

  const [session, setSession] =
    useState(null);

  const [scores, setScores] =
    useState([]);

  const [error, setError] =
    useState('');

  const [restarting, setRestarting] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadResults() {
      try {
        const [
          currentSession,
          currentScores,
        ] = await Promise.all([
          getGameSession(),
          getScores(),
        ]);

        if (!active) {
          return;
        }

        setSession(
          currentSession
        );

        setScores(
          Array.isArray(
            currentScores
          )
            ? currentScores
            : []
        );
      } catch (e) {
        if (active) {
          setError(
            e?.message ||
              'Unable to load final results.'
          );
        }
      }
    }

    loadResults();

    return () => {
      active = false;
    };
  }, []);

  const scoreMap =
    Object.fromEntries(
      scores.map(
        (score) => [
          score.level,
          score,
        ]
      )
    );

  async function replay() {
    setRestarting(true);
    setError('');

    try {
      await createGameSession();

      navigate('/levels');
    } catch (e) {
      setError(
        e?.message ||
          'Unable to start a new game.'
      );
    } finally {
      setRestarting(false);
    }
  }

  const player =
    storage.getPlayer();

  return (
    <main className="results page">
      <div className="results-overlay" />

      <section className="results-card panel">
        {/* =================================================
            TOP
        ================================================= */}
        <div className="result-top">
          <div>
            <div className="section-title">
              MISSION COMPLETE
            </div>

            <span>
              FINAL MISSION REPORT
            </span>
          </div>

          <Trophy />
        </div>

        <h1>
          CYBERSECURITY COMPLETE
        </h1>

        {/* =================================================
            BOSS STATUS
        ================================================= */}
        <div className="boss-banner">
          <Medal />

          <span>
            BOSS DEFEATED
          </span>

          <Medal />
        </div>

        {/* =================================================
            PLAYER
        ================================================= */}
        <div className="player-line">
          <b>
            {player?.name ||
              'PLAYER'}
          </b>

          <span>
            {player?.branch ||
              'BRANCH NOT AVAILABLE'}
          </span>
        </div>

        {/* =================================================
            LEVEL RESULTS
        ================================================= */}
        <section
          className="result-grid"
          aria-label="Domain results"
        >
          {LEVELS.map(
            (level) => {
              const result =
                scoreMap[
                  level.key
                ];

              return (
                <article
                  className="result-level"
                  key={
                    level.key
                  }
                >
                  <small>
                    {level.short}
                  </small>

                  <strong>
                    {result?.score ||
                      0}
                  </strong>

                  <span>
                    {result?.coins ||
                      0}{' '}
                    COINS
                  </span>

                  <span>
                    {formatTime(
                      result?.time ||
                        0
                    )}
                    {' • '}
                    {Math.round(
                      Number(
                        result?.distance
                      ) || 0
                    )}
                    m
                  </span>
                </article>
              );
            }
          )}
        </section>

        {/* =================================================
            TOTALS
        ================================================= */}
        <section
          className="totals"
          aria-label="Total mission statistics"
        >
          <Total
            label="TOTAL SCORE"
            value={
              session?.totalScore ||
              0
            }
          />

          <Total
            label="TOTAL COINS"
            value={
              session?.totalCoins ||
              0
            }
          />

          <Total
            label="TOTAL TIME"
            value={formatTime(
              session?.totalTime ||
                0
            )}
          />

          <Total
            label="TOTAL DISTANCE"
            value={`${(
              (Number(
                session?.totalDistance
              ) || 0) / 1000
            ).toFixed(1)} km`}
          />

          <Total
            label="OBSTACLES HIT"
            value={
              session?.totalObstaclesHit ||
              0
            }
          />

          <Total
            label="LIVES REMAINING"
            value={
              scoreMap?.cyber
                ?.livesRemaining ??
              0
            }
          />
        </section>

        {/* =================================================
            ERROR
        ================================================= */}
        {error && (
          <div className="result-error">
            {error}
          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}
        <div className="result-actions">
          <button
            type="button"
            onClick={() =>
              navigate(
                '/leaderboard'
              )
            }
          >
            VIEW LEADERBOARD
          </button>

          <button
            type="button"
            className="secondary"
            disabled={restarting}
            onClick={replay}
          >
            <RotateCcw
              size={16}
            />

            {restarting
              ? 'STARTING...'
              : 'PLAY AGAIN'}
          </button>
        </div>
      </section>
    </main>
  );
}

function Total({
  label,
  value,
}) {
  return (
    <div>
      <span>
        {label}
      </span>

      <b>
        {value}
      </b>
    </div>
  );
}

function formatTime(value) {
  const seconds = Math.max(
    0,
    Math.round(
      Number(value) || 0
    )
  );

  const minutes =
    Math.floor(
      seconds / 60
    );

  const remaining =
    seconds % 60;

  return `${String(
    minutes
  ).padStart(
    2,
    '0'
  )}:${String(
    remaining
  ).padStart(
    2,
    '0'
  )}`;
}