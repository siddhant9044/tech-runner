// import { useEffect, useState } from 'react';
// import { Activity, Coins, Clock3, Route, ShieldAlert } from 'lucide-react';
// import { getGameSession, getScores } from '../../services/gameService';
// import { LEVELS } from '../../utils/constants';
// import './GameStats.css';
// export default function GameStats(){const [session,setSession]=useState(null);const [scores,setScores]=useState([]);useEffect(()=>{Promise.all([getGameSession(),getScores()]).then(([s,sc])=>{setSession(s);setScores(sc)})},[]);return <main className="stats-page page"><div className="section-title">PLAYER / GAME STATISTICS</div><h1>MISSION ANALYTICS</h1><div className="metrics"><Metric icon={Activity} label="TOTAL SCORE" value={session?.totalScore||0}/><Metric icon={Coins} label="TOTAL COINS" value={session?.totalCoins||0}/><Metric icon={Clock3} label="TOTAL TIME" value={formatTime(session?.totalTime||0)}/><Metric icon={Route} label="TOTAL DISTANCE" value={`${((session?.totalDistance||0)/1000).toFixed(1)} km`}/><Metric icon={ShieldAlert} label="OBSTACLES HIT" value={session?.totalObstaclesHit||0}/></div><div className="stats-table panel"><table><thead><tr><th>Level</th><th>Score</th><th>Coins</th><th>Distance</th><th>Time</th><th>Obstacles</th><th>Lives</th></tr></thead><tbody>{LEVELS.map(l=>{const s=scores.find(x=>x.level===l.key);return <tr key={l.key}><td>{l.name}</td><td>{s?.score||0}</td><td>{s?.coins||0}</td><td>{Math.round(s?.distance||0)}m</td><td>{formatTime(s?.time||0)}</td><td>{s?.obstaclesHit||0}</td><td>{s?.livesRemaining??'—'}</td></tr>})}</tbody></table></div></main>}
// function Metric({icon:Icon,label,value}){return <div className="metric panel"><Icon/><span>{label}</span><b>{value}</b></div>}function formatTime(s){const sec=Math.round(Number(s)||0);return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
import { useEffect, useState } from 'react';

import {
  Activity,
  Coins,
  Clock3,
  Route,
  ShieldAlert,
} from 'lucide-react';

import {
  getGameSession,
  getScores,
} from '../../services/gameService';

import { LEVELS } from '../../utils/constants';

import './GameStats.css';

export default function GameStats() {
  const [session, setSession] =
    useState(null);

  const [scores, setScores] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    let active = true;

    async function loadStats() {
      setLoading(true);

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
              'Unable to load game statistics.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="stats-page page">
      <div className="stats-overlay" />

      <section className="stats-content">
        <div className="section-title">
          PLAYER / GAME STATISTICS
        </div>

        <h1>
          MISSION ANALYTICS
        </h1>

        {error && (
          <div className="stats-error">
            {error}
          </div>
        )}

        <section
          className="metrics"
          aria-label="Overall game statistics"
        >
          <Metric
            icon={Activity}
            label="TOTAL SCORE"
            value={
              session?.totalScore ||
              0
            }
          />

          <Metric
            icon={Coins}
            label="TOTAL COINS"
            value={
              session?.totalCoins ||
              0
            }
          />

          <Metric
            icon={Clock3}
            label="TOTAL TIME"
            value={formatTime(
              session?.totalTime ||
                0
            )}
          />

          <Metric
            icon={Route}
            label="TOTAL DISTANCE"
            value={`${(
              (Number(
                session?.totalDistance
              ) || 0) / 1000
            ).toFixed(1)} km`}
          />

          <Metric
            icon={ShieldAlert}
            label="OBSTACLES HIT"
            value={
              session?.totalObstaclesHit ||
              0
            }
          />
        </section>

        <section className="stats-table panel">
          <div className="stats-table-head">
            <div>
              <div className="section-title">
                DOMAIN BREAKDOWN
              </div>

              <h2>
                FOUR WORLD RESULTS
              </h2>
            </div>

            <span>
              SWIPE TABLE
            </span>
          </div>

          {loading ? (
            <div className="stats-loading">
              LOADING GAME DATA...
            </div>
          ) : (
            <div className="stats-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Score</th>
                    <th>Coins</th>
                    <th>Distance</th>
                    <th>Time</th>
                    <th>Obstacles</th>
                    <th>Lives</th>
                  </tr>
                </thead>

                <tbody>
                  {LEVELS.map(
                    (level) => {
                      const score =
                        scores.find(
                          (item) =>
                            item.level ===
                            level.key
                        );

                      return (
                        <tr
                          key={
                            level.key
                          }
                        >
                          <td className="stats-level">
                            {level.name}
                          </td>

                          <td>
                            {score?.score ||
                              0}
                          </td>

                          <td>
                            {score?.coins ||
                              0}
                          </td>

                          <td>
                            {Math.round(
                              Number(
                                score?.distance
                              ) || 0
                            )}
                            m
                          </td>

                          <td>
                            {formatTime(
                              score?.time ||
                                0
                            )}
                          </td>

                          <td>
                            {score?.obstaclesHit ||
                              0}
                          </td>

                          <td>
                            {score?.livesRemaining ??
                              '—'}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}) {
  return (
    <article className="metric panel">
      <div className="metric-icon">
        <Icon />
      </div>

      <span>
        {label}
      </span>

      <b>
        {value}
      </b>
    </article>
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