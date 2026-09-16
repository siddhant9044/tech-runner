// import { useEffect, useState } from 'react';
// import { Trophy, Database, ChevronLeft, ChevronRight, Medal } from 'lucide-react';
// import { fetchLeaderboard, fetchPlayerRank } from '../../services/leaderboardService';
// import { storage } from '../../utils/storage';
// import { BRANCHES } from '../../utils/constants';
// import './Leaderboard.css';
// export default function Leaderboard(){const [data,setData]=useState({rows:[],pages:1,total:0});const [page,setPage]=useState(1);const [branch,setBranch]=useState('');const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [me,setMe]=useState(null);const load=()=>{setLoading(true);Promise.all([fetchLeaderboard({page,limit:10,branch}),fetchPlayerRank(storage.getPlayer()?.playerId).catch(()=>null)]).then(([d,r])=>{setData(d);setMe(r)}).catch(e=>setError(e.message)).finally(()=>setLoading(false))};useEffect(()=>{load()},[page,branch]);useEffect(()=>{const timer=setInterval(load,30000);return()=>clearInterval(timer)},[page,branch]);return <main className="leaderboard-page page"><section className="lb-main"><div className="lb-head"><div><div className="section-title">GLOBAL RANK</div><h1><Trophy/> LEADERBOARD</h1><p>Top players. Real skills. Server-calculated rank.</p></div><div className="live"><Database size={22}/> LIVE DATA<br/><small>FROM MONGODB</small></div></div><div className="filters"><select value={branch} onChange={e=>{setBranch(e.target.value);setPage(1)}}><option value="">All Branches</option>{BRANCHES.map(b=><option key={b}>{b}</option>)}</select><div className="filter-time">ALL TIME</div></div><div className="table-wrap"><table><thead><tr><th>#</th><th>Player</th><th>Branch</th><th>Cloud</th><th>Web Dev</th><th>AI/ML</th><th>Cyber</th><th>Total Score</th><th>Coins</th><th>Time</th><th>Distance</th></tr></thead><tbody>{loading?<tr><td colSpan="11" className="empty">LOADING SERVER DATA...</td></tr>:data.rows.length===0?<tr><td colSpan="11" className="empty">NO COMPLETED RESULTS YET</td></tr>:data.rows.map((r)=><tr key={r.playerId} className={r.playerId===storage.getPlayer()?.playerId?'mine':''}><td><Rank rank={r.rank}/></td><td><b>{r.player}</b></td><td>{shortBranch(r.branch)}</td><td>{r.cloud}</td><td>{r.webDev}</td><td>{r.aiml}</td><td>{r.cyber}</td><td><strong>{r.totalScore}</strong></td><td>{r.coins}</td><td>{formatTime(r.time)}</td><td>{(r.distance/1000).toFixed(1)} km</td></tr>)}</tbody></table></div><div className="pagination"><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}><ChevronLeft/></button><span>PAGE {page} / {data.pages}</span><button disabled={page>=data.pages} onClick={()=>setPage(p=>p+1)}><ChevronRight/></button></div></section><aside className="my-stats panel"><div className="section-title">YOUR STATS</div><div className="my-rank"><span>Rank</span><b>#{me?.rank||'—'}</b></div><div className="my-rank"><span>Total Score</span><b>{me?.totalScore||0}</b></div><h3>YOUR BREAKDOWN</h3>{[['Cloud','cloud'],['Web Dev','webDev'],['AI/ML','aiml'],['Cyber','cyber']].map(([n,k])=><div className="break" key={k}><span>{n}</span><b>{me?.[k]||0}</b></div>)}<div className="break"><span>Coins</span><b>{me?.coins||0}</b></div><div className="break"><span>Time</span><b>{formatTime(me?.time||0)}</b></div><div className="break"><span>Distance</span><b>{((me?.distance||0)/1000).toFixed(1)} km</b></div>{error&&<p className="lb-error">{error}</p>}<div className="quote">“KEEP CODING.<br/>KEEP RUNNING.<br/>KEEP GROWING.”</div></aside></main>}
// function Rank({rank}){return rank<=3?<span className={`medal m${rank}`}><Medal size={18}/></span>:<span>{rank}</span>};function shortBranch(b){return b.replace('Computer Science and Engineering (CSE)','CSE').replace('Artificial Intelligence and Machine Learning (AI & ML)','AI & ML')};function formatTime(s){const sec=Math.round(Number(s)||0);return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}
import { useEffect, useState } from 'react';

import {
  Trophy,
  Database,
  ChevronLeft,
  ChevronRight,
  Medal,
  RefreshCw,
} from 'lucide-react';

import {
  fetchLeaderboard,
  fetchPlayerRank,
} from '../../services/leaderboardService';

import { storage } from '../../utils/storage';
import { BRANCHES } from '../../utils/constants';

import './Leaderboard.css';

export default function Leaderboard() {
  const [data, setData] = useState({
    rows: [],
    pages: 1,
    total: 0,
  });

  const [page, setPage] =
    useState(1);

  const [branch, setBranch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [me, setMe] =
    useState(null);

  const player =
    storage.getPlayer();

  async function load() {
    setLoading(true);
    setError('');

    try {
      const [
        leaderboard,
        playerRank,
      ] = await Promise.all([
        fetchLeaderboard({
          page,
          limit: 10,
          branch,
        }),

        player?.playerId
          ? fetchPlayerRank(
              player.playerId
            ).catch(() => null)
          : Promise.resolve(null),
      ]);

      setData(
        leaderboard || {
          rows: [],
          pages: 1,
          total: 0,
        }
      );

      setMe(playerRank);
    } catch (e) {
      setError(
        e?.message ||
          'Unable to load leaderboard.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, branch]);

  useEffect(() => {
    const timer =
      setInterval(
        load,
        30000
      );

    return () =>
      clearInterval(timer);
  }, [page, branch]);

  function changeBranch(value) {
    setBranch(value);
    setPage(1);
  }

  return (
    <main className="leaderboard-page page">
      <div className="leaderboard-overlay" />

      <section className="lb-main">
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="lb-head">
          <div className="lb-heading">
            <div className="section-title">
              GLOBAL RANK
            </div>

            <h1>
              <Trophy />
              LEADERBOARD
            </h1>

            <p>
              Server-calculated rankings
              from completed game results.
            </p>
          </div>

          <div className="live">
            <Database size={20} />

            <span>
              LIVE DATA
              <small>
                FROM MONGODB
              </small>
            </span>
          </div>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}
        <div className="filters">
          <label>
            <span>
              BRANCH
            </span>

            <select
              value={branch}
              onChange={(event) =>
                changeBranch(
                  event.target.value
                )
              }
            >
              <option value="">
                All Branches
              </option>

              {BRANCHES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </label>

          <div className="filter-time">
            <span>
              PERIOD
            </span>

            <b>
              ALL TIME
            </b>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}
        {error && (
          <div className="lb-error">
            {error}

            <button
              type="button"
              onClick={load}
            >
              <RefreshCw size={14} />
              RETRY
            </button>
          </div>
        )}

        {/* =================================================
            MOBILE TABLE HELPER
        ================================================= */}
        <div className="table-hint">
          <span>
            SWIPE LEFT / RIGHT
          </span>

          <span>
            {data.total || 0} RECORDS
          </span>
        </div>

        {/* =================================================
            TABLE
        ================================================= */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Branch</th>
                <th>Cloud</th>
                <th>Web Dev</th>
                <th>AI/ML</th>
                <th>Cyber</th>
                <th>Total Score</th>
                <th>Coins</th>
                <th>Time</th>
                <th>Distance</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="11"
                    className="empty"
                  >
                    LOADING SERVER DATA...
                  </td>
                </tr>
              ) : data.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="empty"
                  >
                    NO COMPLETED RESULTS YET
                  </td>
                </tr>
              ) : (
                data.rows.map(
                  (row) => (
                    <tr
                      key={
                        row.playerId
                      }
                      className={
                        row.playerId ===
                        player?.playerId
                          ? 'mine'
                          : ''
                      }
                    >
                      <td>
                        <Rank
                          rank={
                            row.rank
                          }
                        />
                      </td>

                      <td className="player-cell">
                        <b>
                          {row.player}
                        </b>
                      </td>

                      <td className="branch-cell">
                        {shortBranch(
                          row.branch
                        )}
                      </td>

                      <td>
                        {row.cloud}
                      </td>

                      <td>
                        {row.webDev}
                      </td>

                      <td>
                        {row.aiml}
                      </td>

                      <td>
                        {row.cyber}
                      </td>

                      <td className="score-cell">
                        <strong>
                          {row.totalScore}
                        </strong>
                      </td>

                      <td>
                        {row.coins}
                      </td>

                      <td>
                        {formatTime(
                          row.time
                        )}
                      </td>

                      <td>
                        {(
                          Number(
                            row.distance
                          ) || 0
                        ) /
                          1000 >
                        0
                          ? `${(
                              (Number(
                                row.distance
                              ) || 0) /
                              1000
                            ).toFixed(
                              1
                            )} km`
                          : '0.0 km'}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}
        <div className="pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage(
                (value) =>
                  value - 1
              )
            }
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>

          <span>
            PAGE {page} /{' '}
            {data.pages || 1}
          </span>

          <button
            type="button"
            disabled={
              page >=
              (data.pages || 1)
            }
            onClick={() =>
              setPage(
                (value) =>
                  value + 1
              )
            }
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* ===================================================
          MY STATS
      =================================================== */}
      <aside className="my-stats panel">
        <div className="section-title">
          YOUR STATS
        </div>

        <div className="my-rank">
          <span>
            Rank
          </span>

          <b>
            #
            {me?.rank ||
              '—'}
          </b>
        </div>

        <div className="my-rank">
          <span>
            Total Score
          </span>

          <b>
            {me?.totalScore ||
              0}
          </b>
        </div>

        <h3>
          YOUR BREAKDOWN
        </h3>

        {[
          ['Cloud', 'cloud'],
          ['Web Dev', 'webDev'],
          ['AI/ML', 'aiml'],
          ['Cyber', 'cyber'],
        ].map(
          ([name, key]) => (
            <div
              className="break"
              key={key}
            >
              <span>
                {name}
              </span>

              <b>
                {me?.[key] || 0}
              </b>
            </div>
          )
        )}

        <div className="break">
          <span>
            Coins
          </span>

          <b>
            {me?.coins || 0}
          </b>
        </div>

        <div className="break">
          <span>
            Time
          </span>

          <b>
            {formatTime(
              me?.time || 0
            )}
          </b>
        </div>

        <div className="break">
          <span>
            Distance
          </span>

          <b>
            {(
              (Number(
                me?.distance
              ) || 0) / 1000
            ).toFixed(1)}{' '}
            km
          </b>
        </div>

        <div className="quote">
          KEEP CODING.
          <br />
          KEEP RUNNING.
          <br />
          KEEP GROWING.
        </div>
      </aside>
    </main>
  );
}

function Rank({ rank }) {
  if (
    rank >= 1 &&
    rank <= 3
  ) {
    return (
      <span
        className={`medal m${rank}`}
        aria-label={`Rank ${rank}`}
      >
        <Medal size={18} />
      </span>
    );
  }

  return (
    <span>
      {rank}
    </span>
  );
}

function shortBranch(branch = '') {
  return branch
    .replace(
      'Computer Science and Engineering (CSE)',
      'CSE'
    )
    .replace(
      'Artificial Intelligence and Machine Learning (AI & ML)',
      'AI & ML'
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