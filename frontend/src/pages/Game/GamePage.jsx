// import {
//   useEffect,
//   useRef,
//   useState,
// } from 'react';

// import {
//   useNavigate,
//   useParams,
// } from 'react-router-dom';

// import Phaser from 'phaser';

// import { BootScene } from '../../game/scenes/BootScene';
// import { PreloadScene } from '../../game/scenes/PreloadScene';
// import { MenuScene } from '../../game/scenes/MenuScene';
// import { GameScene } from '../../game/scenes/GameScene';

// import { LEVELS } from '../../utils/constants';

// import { cloudConfig } from '../../game/levels/cloud/cloudConfig';
// import { webdevConfig } from '../../game/levels/webdev/webdevConfig';
// import { aimlConfig } from '../../game/levels/aiml/aimlConfig';
// import { cyberConfig } from '../../game/levels/cyber/cyberConfig';

// import {
//   completeLevel,
//   gameOver,
//   startLevel,
//   getGameSession,
//   createGameSession,
// } from '../../services/gameService';

// import './GamePage.css';

// const LEVEL_CONFIGS = {
//   cloud: cloudConfig,
//   webdev: webdevConfig,
//   aiml: aimlConfig,
//   cyber: cyberConfig,
// };

// export default function GamePage() {
//   const {
//     level,
//   } = useParams();

//   const navigate =
//     useNavigate();

//   const hostRef =
//     useRef(null);

//   const gameRef =
//     useRef(null);

//   const [error, setError] =
//     useState('');

//   const [result, setResult] =
//     useState(null);

//   const [over, setOver] =
//     useState(null);

//   const config =
//     LEVELS.find(
//       (item) =>
//         item.key === level
//     );

//   const gameConfig =
//     LEVEL_CONFIGS[level];

//   useEffect(() => {
//     let alive = true;

//     if (
//       !config ||
//       !gameConfig
//     ) {
//       navigate(
//         '/levels',
//         {
//           replace: true,
//         }
//       );

//       return undefined;
//     }

//     async function startGame() {
//       try {
//         setError('');
//         setResult(null);
//         setOver(null);

//         let session;

//         try {
//           session =
//             await getGameSession();
//         } catch {
//           session =
//             await createGameSession();
//         }

//         if (
//           !alive
//         ) {
//           return;
//         }

//         const run =
//           await startLevel(
//             level,
//             session.sessionId
//           );

//         if (
//           !alive
//         ) {
//           return;
//         }

//         const levelConfig = {
//           ...config,
//           ...gameConfig,

//           key:
//             level,

//           accent:
//             typeof gameConfig.accent ===
//             'number'
//               ? gameConfig.accent
//               : Number.parseInt(
//                   String(
//                     config.color
//                   ).replace(
//                     '#',
//                     ''
//                   ),
//                   16
//                 ),

//           overlay:
//             typeof gameConfig.overlay ===
//             'number'
//               ? gameConfig.overlay
//               : 0x06111d,

//           background:
//             gameConfig.background ||
//             `/assets/backgrounds/${
//               level === 'cloud'
//                 ? 'cloud-background.png'
//                 : level === 'webdev'
//                   ? 'webdev-background.png'
//                   : level === 'aiml'
//                     ? 'aiml-background.png'
//                     : 'cyber-background.png'
//             }`,
//         };

//         if (
//           !Array.isArray(
//             levelConfig.obstacles
//           ) ||
//           levelConfig.obstacles.length ===
//             0
//         ) {
//           throw new Error(
//             `No obstacle configuration found for ${
//               levelConfig.name ||
//               level
//             }.`
//           );
//         }

//         const phaserConfig = {
//           type:
//             Phaser.AUTO,

//           parent:
//             hostRef.current,

//           width:
//             1280,

//           height:
//             720,

//           backgroundColor:
//             '#06111d',

//           physics: {
//             default:
//               'arcade',

//             arcade: {
//               gravity: {
//                 x: 0,
//                 y: 1100,
//               },

//               debug:
//                 false,
//             },
//           },

//           scale: {
//             mode:
//               Phaser.Scale.FIT,

//             autoCenter:
//               Phaser.Scale.CENTER_BOTH,

//             width:
//               1280,

//             height:
//               720,
//           },

//           callbacks: {
//             preBoot:
//               (instance) => {
//                 instance.registry.set(
//                   'levelConfig',
//                   levelConfig
//                 );

//                 const lives =
//                   Number(
//                     run.initialLives
//                   );

//                 instance.registry.set(
//                   'initialLives',
//                   Number.isFinite(
//                     lives
//                   ) &&
//                   lives > 0
//                     ? Math.min(
//                         4,
//                         Math.floor(
//                           lives
//                         )
//                       )
//                     : 4
//                 );
//               },
//           },

//           scene: [
//             BootScene,
//             PreloadScene,
//             MenuScene,
//             GameScene,
//           ],
//         };

//         const game =
//           new Phaser.Game(
//             phaserConfig
//           );

//         game.registry.set(
//           'onLevelComplete',
//           async (
//             gameResult
//           ) => {
//             try {
//               const saved =
//                 await completeLevel(
//                   level,
//                   gameResult
//                 );

//               if (
//                 !alive
//               ) {
//                 return;
//               }

//               setResult({
//                 ...gameResult,

//                 ...saved.level,

//                 session:
//                   saved.session,

//                 final:
//                   saved.final,
//               });
//             } catch (
//               err
//             ) {
//               if (
//                 alive
//               ) {
//                 setError(
//                   err?.message ||
//                     'Unable to save level result.'
//                 );
//               }
//             }
//           }
//         );

//         game.registry.set(
//           'onGameOver',
//           async (
//             gameResult
//           ) => {
//             try {
//               await gameOver(
//                 level,
//                 gameResult
//               );

//               if (
//                 !alive
//               ) {
//                 return;
//               }

//               setOver(
//                 gameResult
//               );
//             } catch (
//               err
//             ) {
//               if (
//                 alive
//               ) {
//                 setError(
//                   err?.message ||
//                     'Unable to save game-over result.'
//                 );
//               }
//             }
//           }
//         );

//         gameRef.current =
//           game;
//       } catch (
//         err
//       ) {
//         if (
//           !alive
//         ) {
//           return;
//         }

//         console.error(
//           '[Tech Runner] Failed to start game:',
//           err
//         );

//         if (
//           /locked|not currently|already completed/i.test(
//             err?.message || ''
//           )
//         ) {
//           navigate(
//             '/levels',
//             {
//               replace: true,
//             }
//           );
//         } else {
//           setError(
//             err?.message ||
//               'Unable to start the game.'
//           );
//         }
//       }
//     }

//     startGame();

//     return () => {
//       alive = false;

//       if (
//         gameRef.current
//       ) {
//         gameRef.current.destroy(
//           true
//         );

//         gameRef.current =
//           null;
//       }
//     };
//   }, [
//     level,
//     navigate,
//   ]);

//   if (
//     !config
//   ) {
//     return null;
//   }

//   const nextLabel =
//     level === 'cloud'
//       ? 'CONTINUE TO WEB DEVELOPMENT'
//       : level === 'webdev'
//         ? 'CONTINUE TO AI/ML'
//         : level === 'aiml'
//           ? 'CONTINUE TO CYBERSECURITY'
//           : 'VIEW FINAL RESULTS';

//   return (
//     <main className="game-page">
//       <div className="game-top">
//         <span>
//           TECH RUNNER
//         </span>

//         <span>
//           {config.name}
//         </span>
//       </div>

//       <div
//         ref={hostRef}
//         className="phaser-host"
//       />

//       {error && (
//         <div className="game-modal">
//           <div className="modal-card">
//             <h2>
//               CONNECTION ERROR
//             </h2>

//             <p>
//               {error}
//             </p>

//             <button
//               onClick={() =>
//                 navigate(
//                   '/levels'
//                 )
//               }
//             >
//               BACK TO LEVELS
//             </button>
//           </div>
//         </div>
//       )}

//       {result && (
//         <div className="game-modal">
//           <div className="modal-card">
//             <div className="eyebrow">
//               {result.final
//                 ? 'CYBERSECURITY COMPLETE'
//                 : 'LEVEL COMPLETE'}
//             </div>

//             <h2>
//               {result.final
//                 ? 'BOSS DEFEATED'
//                 : config.name}
//             </h2>

//             <div className="stat-grid">
//               <span>
//                 Score
//                 <b>
//                   {result.score}
//                 </b>
//               </span>

//               <span>
//                 Coins
//                 <b>
//                   {result.coins}
//                 </b>
//               </span>

//               <span>
//                 Distance
//                 <b>
//                   {Math.round(
//                     result.distance
//                   )}{' '}
//                   m
//                 </b>
//               </span>

//               <span>
//                 Time
//                 <b>
//                   {formatSeconds(
//                     result.time
//                   )}
//                 </b>
//               </span>

//               <span>
//                 Lives
//                 <b>
//                   {
//                     result.livesRemaining
//                   }
//                 </b>
//               </span>

//               <span>
//                 Obstacles Hit
//                 <b>
//                   {
//                     result.obstaclesHit
//                   }
//                 </b>
//               </span>
//             </div>

//             <button
//               onClick={() =>
//                 navigate(
//                   result.final
//                     ? '/results'
//                     : '/levels'
//                 )
//               }
//             >
//               {nextLabel}
//             </button>
//           </div>
//         </div>
//       )}

//       {over && (
//         <div className="game-modal">
//           <div className="modal-card">
//             <div className="eyebrow">
//               GAME OVER
//             </div>

//             <h2>
//               {config.name}
//             </h2>

//             <div className="stat-grid">
//               <span>
//                 Score
//                 <b>
//                   {over.score}
//                 </b>
//               </span>

//               <span>
//                 Coins
//                 <b>
//                   {over.coins}
//                 </b>
//               </span>

//               <span>
//                 Distance
//                 <b>
//                   {Math.round(
//                     over.distance
//                   )}{' '}
//                   m
//                 </b>
//               </span>

//               <span>
//                 Time
//                 <b>
//                   {formatSeconds(
//                     over.time
//                   )}
//                 </b>
//               </span>

//               <span>
//                 Obstacles Hit
//                 <b>
//                   {
//                     over.obstaclesHit
//                   }
//                 </b>
//               </span>

//               <span>
//                 Lives
//                 <b>
//                   {
//                     over.livesRemaining
//                   }
//                 </b>
//               </span>
//             </div>

//             <div className="button-row">
//               <button
//                 onClick={() =>
//                   window.location.reload()
//                 }
//               >
//                 RETRY LEVEL
//               </button>

//               <button
//                 className="secondary"
//                 onClick={() =>
//                   navigate(
//                     '/levels'
//                   )
//                 }
//               >
//                 EXIT TO LEVELS
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// function formatSeconds(
//   value
// ) {
//   const sec =
//     Math.floor(
//       Number(value) || 0
//     );

//   return `${String(
//     Math.floor(
//       sec / 60
//     )
//   ).padStart(
//     2,
//     '0'
//   )}:${String(
//     sec % 60
//   ).padStart(
//     2,
//     '0'
//   )}`;
// }

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import Phaser from 'phaser';

import { BootScene } from '../../game/scenes/BootScene';
import { PreloadScene } from '../../game/scenes/PreloadScene';
import { MenuScene } from '../../game/scenes/MenuScene';
import { GameScene } from '../../game/scenes/GameScene';

import { LEVELS } from '../../utils/constants';

import { cloudConfig } from '../../game/levels/cloud/cloudConfig';
import { webdevConfig } from '../../game/levels/webdev/webdevConfig';
import { aimlConfig } from '../../game/levels/aiml/aimlConfig';
import { cyberConfig } from '../../game/levels/cyber/cyberConfig';

import {
  completeLevel,
  gameOver,
  startLevel,
  getGameSession,
  createGameSession,
} from '../../services/gameService';

import './GamePage.css';

const LEVEL_CONFIGS = {
  cloud: cloudConfig,
  webdev: webdevConfig,
  aiml: aimlConfig,
  cyber: cyberConfig,
};

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

export default function GamePage() {
  const {
    level,
  } = useParams();

  const navigate =
    useNavigate();

  const hostRef =
    useRef(null);

  const gameRef =
    useRef(null);

  const [error, setError] =
    useState('');

  const [result, setResult] =
    useState(null);

  const [over, setOver] =
    useState(null);

  const [
    landscape,
    setLandscape,
  ] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia(
          '(orientation: landscape)'
        ).matches
      : true
  );

  const config =
    LEVELS.find(
      (item) =>
        item.key === level
    );

  const gameConfig =
    LEVEL_CONFIGS[level];

  /*
   * =========================================================
   * ORIENTATION DETECTION
   * =========================================================
   *
   * The game itself remains landscape-first.
   *
   * On portrait phones we show a dedicated
   * rotate-device screen instead of squeezing
   * the 16:9 Phaser canvas.
   */

  useEffect(() => {
    const media =
      window.matchMedia(
        '(orientation: landscape)'
      );

    const update =
      () => {
        setLandscape(
          media.matches
        );
      };

    update();

    if (
      media.addEventListener
    ) {
      media.addEventListener(
        'change',
        update
      );
    } else {
      media.addListener(
        update
      );
    }

    window.addEventListener(
      'resize',
      update
    );

    return () => {
      if (
        media.removeEventListener
      ) {
        media.removeEventListener(
          'change',
          update
        );
      } else {
        media.removeListener(
          update
        );
      }

      window.removeEventListener(
        'resize',
        update
      );
    };
  }, []);

  /*
   * =========================================================
   * MOBILE ORIENTATION / FULLSCREEN HELPER
   * =========================================================
   */

  useEffect(() => {
    document.body.classList.add(
      'game-running'
    );

    /*
     * Attempt orientation lock where the browser
     * supports it.
     *
     * Browsers may reject this because orientation
     * locking generally requires fullscreen or a
     * user gesture. That rejection is intentionally
     * ignored because the CSS rotate screen still
     * handles the experience correctly.
     */

    const lockOrientation =
      async () => {
        try {
          if (
            screen.orientation?.lock
          ) {
            await screen.orientation.lock(
              'landscape'
            );
          }
        } catch {
          // Browser does not allow automatic locking.
        }
      };

    lockOrientation();

    return () => {
      document.body.classList.remove(
        'game-running'
      );

      try {
        screen.orientation?.unlock?.();
      } catch {
        // Ignore unsupported browsers.
      }
    };
  }, []);

  /*
   * =========================================================
   * PHASER GAME INITIALIZATION
   * =========================================================
   */

  useEffect(() => {
    let alive = true;

    if (
      !config ||
      !gameConfig
    ) {
      navigate(
        '/levels',
        {
          replace: true,
        }
      );

      return undefined;
    }

    async function startGame() {
      try {
        setError('');
        setResult(null);
        setOver(null);

        let session;

        /*
         * Use the existing server session.
         *
         * This is intentionally not replaced
         * with localStorage.
         */

        try {
          session =
            await getGameSession();
        } catch {
          session =
            await createGameSession();
        }

        if (!alive) {
          return;
        }

        const run =
          await startLevel(
            level,
            session.sessionId
          );

        if (!alive) {
          return;
        }

        /*
         * Combine the common level information
         * with the existing domain configuration.
         */

        const levelConfig = {
          ...config,
          ...gameConfig,

          key: level,

          accent:
            typeof gameConfig.accent ===
            'number'
              ? gameConfig.accent
              : Number.parseInt(
                  String(
                    config.color
                  ).replace(
                    '#',
                    ''
                  ),
                  16
                ),

          overlay:
            typeof gameConfig.overlay ===
            'number'
              ? gameConfig.overlay
              : 0x06111d,

          background:
            gameConfig.background ||
            `/assets/backgrounds/${
              level === 'cloud'
                ? 'cloud-background.png'
                : level === 'webdev'
                  ? 'webdev-background.png'
                  : level === 'aiml'
                    ? 'aiml-background.png'
                    : 'cyber-background.png'
            }`,
        };

        if (
          !Array.isArray(
            levelConfig.obstacles
          ) ||
          levelConfig.obstacles.length ===
            0
        ) {
          throw new Error(
            `No obstacle configuration found for ${
              levelConfig.name ||
              level
            }.`
          );
        }

        /*
         * =====================================================
         * PHASER CONFIG
         * =====================================================
         *
         * The logical game is ALWAYS 1280 × 720.
         *
         * Phaser.Scale.FIT scales this exact game
         * into whatever landscape phone viewport is
         * available.
         *
         * This prevents the player, obstacles,
         * background and HUD from becoming distorted.
         */

        const phaserConfig = {
          type:
            Phaser.AUTO,

          parent:
            hostRef.current,

          width:
            GAME_WIDTH,

          height:
            GAME_HEIGHT,

          backgroundColor:
            '#06111d',

          /*
           * Avoid Phaser's default canvas
           * interpolation changing the game layout.
           */

          render: {
            antialias:
              true,

            roundPixels:
              false,

            pixelArt:
              false,

            powerPreference:
              'high-performance',
          },

          physics: {
            default:
              'arcade',

            arcade: {
              gravity: {
                x: 0,
                y: 1100,
              },

              debug:
                false,
            },
          },

          scale: {
            mode:
              Phaser.Scale.FIT,

            autoCenter:
              Phaser.Scale.CENTER_BOTH,

            width:
              GAME_WIDTH,

            height:
              GAME_HEIGHT,

            expand:
              false,
          },

          input: {
            activePointers:
              4,

            smoothFactor:
              0,
          },

          callbacks: {
            preBoot:
              (instance) => {
                instance.registry.set(
                  'levelConfig',
                  levelConfig
                );

                const lives =
                  Number(
                    run.initialLives
                  );

                instance.registry.set(
                  'initialLives',
                  Number.isFinite(
                    lives
                  ) &&
                  lives > 0
                    ? Math.min(
                        4,
                        Math.floor(
                          lives
                        )
                      )
                    : 4
                );
              },
          },

          scene: [
            BootScene,
            PreloadScene,
            MenuScene,
            GameScene,
          ],
        };

        /*
         * Destroy an old game instance before
         * creating a new one.
         */

        if (
          gameRef.current
        ) {
          try {
            gameRef.current.destroy(
              true
            );
          } catch {
            // Ignore stale Phaser instances.
          }

          gameRef.current =
            null;
        }

        if (
          !hostRef.current
        ) {
          throw new Error(
            'Game container is unavailable.'
          );
        }

        const game =
          new Phaser.Game(
            phaserConfig
          );

        /*
         * =====================================================
         * SERVER RESULT CALLBACK
         * =====================================================
         */

        game.registry.set(
          'onLevelComplete',
          async (
            gameResult
          ) => {
            try {
              const saved =
                await completeLevel(
                  level,
                  gameResult
                );

              if (!alive) {
                return;
              }

              setResult({
                ...gameResult,

                ...saved.level,

                session:
                  saved.session,

                final:
                  saved.final,
              });
            } catch (
              err
            ) {
              if (alive) {
                setError(
                  err?.message ||
                    'Unable to save level result.'
                );
              }
            }
          }
        );

        /*
         * =====================================================
         * SERVER GAME-OVER CALLBACK
         * =====================================================
         */

        game.registry.set(
          'onGameOver',
          async (
            gameResult
          ) => {
            try {
              await gameOver(
                level,
                gameResult
              );

              if (!alive) {
                return;
              }

              setOver(
                gameResult
              );
            } catch (
              err
            ) {
              if (alive) {
                setError(
                  err?.message ||
                    'Unable to save game-over result.'
                );
              }
            }
          }
        );

        gameRef.current =
          game;

      } catch (
        err
      ) {
        if (!alive) {
          return;
        }

        console.error(
          '[Tech Runner] Failed to start game:',
          err
        );

        /*
         * If the backend says that the level
         * cannot currently be played, return to
         * level selection.
         */

        if (
          /locked|not currently|already completed/i.test(
            err?.message || ''
          )
        ) {
          navigate(
            '/levels',
            {
              replace: true,
            }
          );
        } else {
          setError(
            err?.message ||
              'Unable to start the game.'
          );
        }
      }
    }

    startGame();

    /*
     * =========================================================
     * CLEANUP
     * =========================================================
     */

    return () => {
      alive = false;

      if (
        gameRef.current
      ) {
        try {
          gameRef.current.destroy(
            true
          );
        } catch {
          // Ignore Phaser cleanup errors.
        }

        gameRef.current =
          null;
      }
    };
  }, [
    level,
    navigate,
  ]);

  if (!config) {
    return null;
  }

  const nextLabel =
    level === 'cloud'
      ? 'CONTINUE TO WEB DEVELOPMENT'
      : level === 'webdev'
        ? 'CONTINUE TO AI/ML'
        : level === 'aiml'
          ? 'CONTINUE TO CYBERSECURITY'
          : 'VIEW FINAL RESULTS';

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main className="game-page">
      {/* ===================================================
          SMALL TOP BAR
      =================================================== */}

      <div className="game-top">
        <span>
          TECH RUNNER
        </span>

        <span>
          {config.name}
        </span>

        <span className="game-orientation">
          LANDSCAPE
        </span>
      </div>

      {/* ===================================================
          PHASER HOST
      =================================================== */}

      <div
        ref={hostRef}
        className="phaser-host"
      />

      {/* ===================================================
          PORTRAIT ROTATE SCREEN
      =================================================== */}

      {!landscape && (
        <div className="rotate-screen">
          <div className="rotate-card">
            <div className="rotate-icon">
              <span />
              <span />
              <span />
            </div>

            <div className="rotate-eyebrow">
              TECH RUNNER
            </div>

            <h1>
              ROTATE YOUR PHONE
            </h1>

            <p>
              Turn your device
              horizontally to play
              this level.
            </p>

            <div className="rotate-preview">
              <div className="phone">
                <div className="phone-screen">
                  TECH
                  <br />
                  RUNNER
                </div>
              </div>

              <div className="rotate-arrow">
                ↻
              </div>

              <div className="phone landscape-phone">
                <div className="phone-screen">
                  TECH RUNNER
                </div>
              </div>
            </div>

            <small>
              16:9 GAMEPLAY MODE
            </small>
          </div>
        </div>
      )}

      {/* ===================================================
          CONNECTION ERROR
      =================================================== */}

      {error && (
        <div className="game-modal">
          <div className="modal-card">
            <div className="eyebrow">
              TECH RUNNER
            </div>

            <h2>
              CONNECTION ERROR
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/levels'
                )
              }
            >
              BACK TO LEVELS
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          LEVEL COMPLETE
      =================================================== */}

      {result && (
        <div className="game-modal">
          <div className="modal-card">
            <div className="eyebrow">
              {result.final
                ? 'CYBERSECURITY COMPLETE'
                : 'LEVEL COMPLETE'}
            </div>

            <h2>
              {result.final
                ? 'BOSS DEFEATED'
                : config.name}
            </h2>

            <div className="stat-grid">
              <span>
                Score
                <b>
                  {result.score}
                </b>
              </span>

              <span>
                Coins
                <b>
                  {result.coins}
                </b>
              </span>

              <span>
                Distance
                <b>
                  {Math.round(
                    result.distance
                  )}{' '}
                  m
                </b>
              </span>

              <span>
                Time
                <b>
                  {formatSeconds(
                    result.time
                  )}
                </b>
              </span>

              <span>
                Lives
                <b>
                  {
                    result.livesRemaining
                  }
                </b>
              </span>

              <span>
                Obstacles Hit
                <b>
                  {
                    result.obstaclesHit
                  }
                </b>
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  result.final
                    ? '/results'
                    : '/levels'
                )
              }
            >
              {nextLabel}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          GAME OVER
      =================================================== */}

      {over && (
        <div className="game-modal">
          <div className="modal-card">
            <div className="eyebrow">
              GAME OVER
            </div>

            <h2>
              {config.name}
            </h2>

            <div className="stat-grid">
              <span>
                Score
                <b>
                  {over.score}
                </b>
              </span>

              <span>
                Coins
                <b>
                  {over.coins}
                </b>
              </span>

              <span>
                Distance
                <b>
                  {Math.round(
                    over.distance
                  )}{' '}
                  m
                </b>
              </span>

              <span>
                Time
                <b>
                  {formatSeconds(
                    over.time
                  )}
                </b>
              </span>

              <span>
                Obstacles Hit
                <b>
                  {
                    over.obstaclesHit
                  }
                </b>
              </span>

              <span>
                Lives
                <b>
                  {
                    over.livesRemaining
                  }
                </b>
              </span>
            </div>

            <div className="button-row">
              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                RETRY LEVEL
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() =>
                  navigate(
                    '/levels'
                  )
                }
              >
                EXIT TO LEVELS
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function formatSeconds(
  value
) {
  const sec =
    Math.max(
      0,
      Math.floor(
        Number(value) || 0
      )
    );

  return `${String(
    Math.floor(
      sec / 60
    )
  ).padStart(
    2,
    '0'
  )}:${String(
    sec % 60
  ).padStart(
    2,
    '0'
  )}`;
}