// import { useEffect, useState } from 'react';
// import {
//   CheckCircle2,
//   Play,
//   Shield,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import {
//   createGameSession,
//   getGameSession,
// } from '../../services/gameService';

// import { LEVELS } from '../../utils/constants';

// import './LevelSelect.css';

// export default function LevelSelect() {
//   const nav = useNavigate();

//   const [session, setSession] =
//     useState(null);

//   const [error, setError] =
//     useState('');

//   useEffect(() => {
//     let active = true;

//     async function loadSession() {
//       try {
//         const existing =
//           await getGameSession();

//         if (active) {
//           setSession(existing);
//         }
//       } catch {
//         try {
//           const created =
//             await createGameSession();

//           if (active) {
//             setSession(created);
//           }
//         } catch (e) {
//           if (active) {
//             setError(
//               e?.message ||
//                 'Unable to create game session.'
//             );
//           }
//         }
//       }
//     }

//     loadSession();

//     return () => {
//       active = false;
//     };
//   }, []);

//   /*
//    * A level is completed only when that
//    * particular level exists in session.levels
//    * with completed === true.
//    *
//    * We DO NOT use currentLevel to determine
//    * whether a level is unlocked anymore.
//    */

//   function isCompleted(levelKey) {
//     return Boolean(
//       session?.levels?.some(
//         (item) =>
//           item.level === levelKey &&
//           item.completed === true
//       )
//     );
//   }

//   return (
//     <main className="levels page">
//       <div className="levels-hero">
//         <div>
//           <div className="section-title">
//             MISSION CONTROL
//           </div>

//           <h1>
//             CHOOSE YOUR TECH WORLD
//           </h1>

//           <p>
//             Four independent runner worlds.
//             Choose any domain and start your
//             mission.
//           </p>
//         </div>

//         <div className="mission-badge">
//           <Shield size={22} />

//           <span>
//             SERVER VERIFIED
//             <br />

//             <b>
//               {session?.status ||
//                 'SYNCING'}
//             </b>
//           </span>
//         </div>
//       </div>

//       {error && (
//         <div className="panel error-box">
//           {error}
//         </div>
//       )}

//       <div className="level-grid">
//         {LEVELS.map((level, index) => {
//           const completed =
//             isCompleted(level.key);

//           /*
//            * IMPORTANT:
//            *
//            * Every level is unlocked.
//            *
//            * There is intentionally NO:
//            *
//            * LEVELS.findIndex(...)
//            *
//            * comparison here.
//            */

//           const unlocked = true;

//           return (
//             <article
//               className={`level-card ${
//                 unlocked
//                   ? 'unlocked'
//                   : 'locked'
//               } ${
//                 completed
//                   ? 'completed'
//                   : ''
//               }`}
//               key={level.key}
//             >
//               <div className="level-number">
//                 0{index + 1}
//               </div>

//               <div className="level-icon">
//                 {completed ? (
//                   <CheckCircle2 />
//                 ) : (
//                   <Play />
//                 )}
//               </div>

//               <div className="section-title">
//                 WORLD {index + 1}
//               </div>

//               <h2>
//                 {level.name}
//               </h2>

//               <p>
//                 {description(
//                   level.key
//                 )}
//               </p>

//               <div className="card-footer">
//                 <span>
//                   {completed
//                     ? 'COMPLETED'
//                     : 'READY'}
//                 </span>

//                 {unlocked && (
//                   <button
//                     onClick={() =>
//                       nav(level.path)
//                     }
//                   >
//                     {completed
//                       ? 'PLAY AGAIN'
//                       : 'START'}

//                     <Play size={15} />
//                   </button>
//                 )}
//               </div>
//             </article>
//           );
//         })}
//       </div>

//       <div className="rules panel">
//         <b>
//           RUN PROTOCOL
//         </b>

//         <span>
//           SPACE / W = JUMP
//         </span>

//         <span>
//           A / D = MOVE
//         </span>

//         <span>
//           F = CYBER ATTACK
//         </span>

//         <span>
//           4 LIVES • MANUAL DOMAIN SELECTION
//         </span>

//         <span>
//           CYBER RESETS TO 4 LIVES FOR THE
//           FINAL BOSS
//         </span>
//       </div>
//     </main>
//   );
// }

// function description(key) {
//   if (key === 'cloud') {
//     return 'Servers, packets and virtual machines form the first route.';
//   }

//   if (key === 'webdev') {
//     return 'HTML, CSS, JavaScript and HTTP hazards block the developer route.';
//   }

//   if (key === 'aiml') {
//     return 'Neural nodes, datasets and GPU compute make the AI world unpredictable.';
//   }

//   return 'Security threats culminate in the final Cyber Threat boss arena.';
// }

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Play,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  createGameSession,
  getGameSession,
} from '../../services/gameService';

import { LEVELS } from '../../utils/constants';

import './LevelSelect.css';

export default function LevelSelect() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [creatingSession, setCreatingSession] =
    useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const existing = await getGameSession();

        if (active) {
          setSession(existing);
        }
      } catch {
        try {
          setCreatingSession(true);

          const created =
            await createGameSession();

          if (active) {
            setSession(created);
          }
        } catch (e) {
          if (active) {
            setError(
              e?.message ||
                'Unable to create game session.'
            );
          }
        } finally {
          if (active) {
            setCreatingSession(false);
          }
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  function isCompleted(levelKey) {
    return Boolean(
      session?.levels?.some(
        (item) =>
          item.level === levelKey &&
          item.completed === true
      )
    );
  }

  function openLevel(path) {
    navigate(path);
  }

  return (
    <main className="levels page">
      <div className="levels-overlay" />

      <section className="levels-content">
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="levels-hero">
          <div className="levels-heading">
            <div className="section-title">
              MISSION CONTROL
            </div>

            <h1>
              CHOOSE YOUR TECH WORLD
            </h1>

            <p>
              Four independent runner worlds.
              Choose any domain and start your
              mission.
            </p>
          </div>

          <div className="mission-badge">
            <Shield size={22} />

            <span>
              SERVER VERIFIED

              <b>
                {creatingSession
                  ? 'CREATING SESSION'
                  : session?.status ||
                    'SYNCING'}
              </b>
            </span>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}
        {error && (
          <div className="panel error-box">
            <strong>
              SESSION ERROR
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        {/* =================================================
            LEVEL GRID
        ================================================= */}
        <section
          className="level-grid"
          aria-label="Available technology worlds"
        >
          {LEVELS.map(
            (level, index) => {
              const completed =
                isCompleted(
                  level.key
                );

              /*
               * All four domains remain manually
               * selectable as in the existing game.
               */
              const unlocked = true;

              return (
                <article
                  className={[
                    'level-card',
                    unlocked
                      ? 'unlocked'
                      : 'locked',
                    completed
                      ? 'completed'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={level.key}
                >
                  <div className="level-number">
                    {String(index + 1).padStart(
                      2,
                      '0'
                    )}
                  </div>

                  <div className="level-top">
                    <div className="level-icon">
                      {completed ? (
                        <CheckCircle2 />
                      ) : (
                        <Play />
                      )}
                    </div>

                    <div className="level-status">
                      {completed
                        ? 'COMPLETED'
                        : 'READY'}
                    </div>
                  </div>

                  <div className="section-title">
                    WORLD {index + 1}
                  </div>

                  <h2>
                    {level.name}
                  </h2>

                  <p>
                    {description(
                      level.key
                    )}
                  </p>

                  <div className="card-footer">
                    <span>
                      {completed
                        ? 'MISSION RECORDED'
                        : 'MISSION AVAILABLE'}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        openLevel(
                          level.path
                        )
                      }
                    >
                      {completed
                        ? 'PLAY AGAIN'
                        : 'START'}

                      <Play size={15} />
                    </button>
                  </div>
                </article>
              );
            }
          )}
        </section>

        {/* =================================================
            GAME RULES
        ================================================= */}
        <section className="rules panel">
          <div className="rules-title">
            RUN PROTOCOL
          </div>

          <div className="rules-list">
            <span>
              <b>SPACE / W</b>
              JUMP
            </span>

            <span>
              <b>A / D</b>
              MOVE
            </span>

            <span>
              <b>F</b>
              CYBER ATTACK
            </span>

            <span>
              <b>4 LIVES</b>
              STANDARD
            </span>

            <span>
              <b>CYBER</b>
              FINAL BOSS
            </span>
          </div>
        </section>
      </section>
    </main>
  );
}

function description(key) {
  if (key === 'cloud') {
    return 'Servers, packets and virtual machines form the first route.';
  }

  if (key === 'webdev') {
    return 'HTML, CSS, JavaScript and HTTP hazards block the developer route.';
  }

  if (key === 'aiml') {
    return 'Neural nodes, datasets and GPU compute make the AI world unpredictable.';
  }

  return 'Security threats culminate in the final Cyber Threat boss arena.';
}