// // // import { useState } from 'react';
// // // import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
// // // import { UserCircle2, LogOut, Maximize2 } from 'lucide-react';
// // // import { useAuth } from './hooks/useAuth';
// // // import { storage } from './utils/storage';
// // // import './App.css';

// // // export function ProtectedLayout(){const {player,loading,setPlayer}=useAuth();if(loading)return <div className="boot-screen">CONNECTING TO TECH RUNNER...</div>;if(!player)return <Navigate to="/login" replace/>;return <AppShell player={player} onLogout={()=>{storage.clearAuth();setPlayer(null)}}/>;}
// // // function AppShell({player,onLogout}){const nav=useNavigate();const [fullscreen,setFullscreen]=useState(false);const toggle=()=>{if(!document.fullscreenElement){document.documentElement.requestFullscreen?.();setFullscreen(true)}else{document.exitFullscreen?.();setFullscreen(false)}};return <div className="app-shell"><header className="nav"><button className="brand" onClick={()=>nav('/levels')}><span>TECH</span> RUNNER<small>CODE • RUN • SURVIVE • WIN</small></button><nav><NavLink to="/levels">PLAY</NavLink><NavLink to="/leaderboard">LEADERBOARD</NavLink><NavLink to="/results">RESULTS</NavLink><NavLink to="/stats">STATS</NavLink></nav><div className="profile"><UserCircle2 size={32}/><div><b>{player.name}</b><small>{player.branch.replace('Computer Science and Engineering (CSE)','CSE')}</small></div><button onClick={toggle} title="Fullscreen"><Maximize2 size={16}/></button><button onClick={onLogout} title="Logout"><LogOut size={16}/></button></div></header><Outlet/></div>}
// // // export function LandingRedirect(){return <Navigate to="/login" replace/>}

// // import { useEffect, useState } from 'react';
// // import {
// //   Navigate,
// //   NavLink,
// //   Outlet,
// //   useLocation,
// //   useNavigate,
// // } from 'react-router-dom';

// // import {
// //   UserCircle2,
// //   LogOut,
// //   Maximize2,
// //   Menu,
// //   X,
// // } from 'lucide-react';

// // import { useAuth } from './hooks/useAuth';
// // import { storage } from './utils/storage';

// // import './App.css';

// // export function ProtectedLayout() {
// //   const {
// //     player,
// //     loading,
// //     setPlayer,
// //   } = useAuth();

// //   if (loading) {
// //     return (
// //       <div className="boot-screen">
// //         CONNECTING TO TECH RUNNER...
// //       </div>
// //     );
// //   }

// //   if (!player) {
// //     return (
// //       <Navigate
// //         to="/login"
// //         replace
// //       />
// //     );
// //   }

// //   return (
// //     <AppShell
// //       player={player}
// //       onLogout={() => {
// //         storage.clearAuth();
// //         setPlayer(null);
// //       }}
// //     />
// //   );
// // }

// // function AppShell({
// //   player,
// //   onLogout,
// // }) {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const [
// //     fullscreen,
// //     setFullscreen,
// //   ] = useState(false);

// //   const [
// //     mobileMenu,
// //     setMobileMenu,
// //   ] = useState(false);

// //   /*
// //    * Close the mobile navigation
// //    * whenever the route changes.
// //    */
// //   useEffect(() => {
// //     setMobileMenu(false);
// //   }, [location.pathname]);

// //   /*
// //    * Keep fullscreen state synchronized
// //    * with the browser.
// //    */
// //   useEffect(() => {
// //     const syncFullscreen = () => {
// //       setFullscreen(
// //         Boolean(document.fullscreenElement)
// //       );
// //     };

// //     document.addEventListener(
// //       'fullscreenchange',
// //       syncFullscreen
// //     );

// //     return () => {
// //       document.removeEventListener(
// //         'fullscreenchange',
// //         syncFullscreen
// //       );
// //     };
// //   }, []);

// //   /*
// //    * Fullscreen is optional.
// //    * Some mobile browsers don't allow it,
// //    * so failure must never break navigation.
// //    */
// //   const toggleFullscreen = async () => {
// //     try {
// //       if (!document.fullscreenElement) {
// //         await document.documentElement.requestFullscreen?.();
// //       } else {
// //         await document.exitFullscreen?.();
// //       }
// //     } catch {
// //       // Fullscreen is optional.
// //     }
// //   };

// //   return (
// //     <div className="app-shell">
// //       <header className="nav">
// //         {/* ================================
// //             BRAND
// //         ================================= */}
// //         <button
// //           className="brand"
// //           onClick={() => navigate('/levels')}
// //           aria-label="Tech Runner home"
// //         >
// //           <span>TECH</span> RUNNER

// //           <small>
// //             CODE • RUN • SURVIVE • WIN
// //           </small>
// //         </button>

// //         {/* ================================
// //             DESKTOP / MOBILE NAVIGATION
// //         ================================= */}
// //         <nav
// //           className={`main-nav ${
// //             mobileMenu
// //               ? 'open'
// //               : ''
// //           }`}
// //         >
// //           <NavLink to="/levels">
// //             PLAY
// //           </NavLink>

// //           <NavLink to="/leaderboard">
// //             LEADERBOARD
// //           </NavLink>

// //           <NavLink to="/results">
// //             RESULTS
// //           </NavLink>

// //           <NavLink to="/stats">
// //             STATS
// //           </NavLink>
// //         </nav>

// //         {/* ================================
// //             PLAYER PROFILE
// //         ================================= */}
// //         <div className="profile">
// //           <UserCircle2 size={30} />

// //           <div>
// //             <b>
// //               {player.name}
// //             </b>

// //             <small>
// //               {player.branch.replace(
// //                 'Computer Science and Engineering (CSE)',
// //                 'CSE'
// //               )}
// //             </small>
// //           </div>

// //           <button
// //             onClick={toggleFullscreen}
// //             title={
// //               fullscreen
// //                 ? 'Exit fullscreen'
// //                 : 'Fullscreen'
// //             }
// //             aria-label="Toggle fullscreen"
// //           >
// //             <Maximize2 size={16} />
// //           </button>

// //           <button
// //             onClick={onLogout}
// //             title="Logout"
// //             aria-label="Logout"
// //           >
// //             <LogOut size={16} />
// //           </button>
// //         </div>

// //         {/* ================================
// //             MOBILE MENU BUTTON
// //         ================================= */}
// //         <button
// //           className="mobile-menu-button"
// //           onClick={() =>
// //             setMobileMenu(
// //               (value) => !value
// //             )
// //           }
// //           aria-label={
// //             mobileMenu
// //               ? 'Close navigation'
// //               : 'Open navigation'
// //           }
// //           aria-expanded={
// //             mobileMenu
// //           }
// //         >
// //           {mobileMenu ? (
// //             <X size={22} />
// //           ) : (
// //             <Menu size={22} />
// //           )}
// //         </button>
// //       </header>

// //       <Outlet />
// //     </div>
// //   );
// // }

// // export function LandingRedirect() {
// //   return (
// //     <Navigate
// //       to="/login"
// //       replace
// //     />
// //   );
// // }

// import { useEffect, useState } from 'react';

// import {
//   Navigate,
//   NavLink,
//   Outlet,
//   useLocation,
//   useNavigate,
// } from 'react-router-dom';

// import {
//   UserCircle2,
//   LogOut,
//   Maximize2,
//   Menu,
//   X,
// } from 'lucide-react';

// import { useAuth } from './hooks/useAuth';
// import { storage } from './utils/storage';

// import './App.css';

// /*
//  * =========================================================
//  * PROTECTED LAYOUT
//  * =========================================================
//  */

// export function ProtectedLayout() {
//   const {
//     player,
//     loading,
//     setPlayer,
//   } = useAuth();

//   if (loading) {
//     return (
//       <div className="boot-screen">
//         CONNECTING TO TECH RUNNER...
//       </div>
//     );
//   }

//   if (!player) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//       />
//     );
//   }

//   return (
//     <AppShell
//       player={player}
//       onLogout={() => {
//         storage.clearAuth();
//         setPlayer(null);
//       }}
//     />
//   );
// }

// /*
//  * =========================================================
//  * APPLICATION SHELL
//  * =========================================================
//  */

// function AppShell({
//   player,
//   onLogout,
// }) {
//   const navigate =
//     useNavigate();

//   const location =
//     useLocation();

//   const [
//     fullscreen,
//     setFullscreen,
//   ] = useState(false);

//   const [
//     mobileMenu,
//     setMobileMenu,
//   ] = useState(false);

//   /*
//    * =======================================================
//    * TOUCH DEVICE DETECTION
//    * =======================================================
//    *
//    * Android Chrome shows its own browser/system message
//    * when fullscreen is entered.
//    *
//    * That message can cover the game and interfere with
//    * gameplay.
//    *
//    * Therefore:
//    *
//    * Desktop / mouse:
//    *     fullscreen button available
//    *
//    * Touch device:
//    *     fullscreen button hidden
//    *
//    * The actual game still works in landscape mode.
//    */

//   const isTouchDevice =
//     typeof navigator !==
//       'undefined' &&
//     navigator.maxTouchPoints >
//       0;

//   /*
//    * =======================================================
//    * CLOSE MOBILE MENU AFTER ROUTE CHANGE
//    * =======================================================
//    */

//   useEffect(() => {
//     setMobileMenu(false);
//   }, [
//     location.pathname,
//   ]);

//   /*
//    * =======================================================
//    * FULLSCREEN STATE
//    * =======================================================
//    *
//    * This is still useful on desktop.
//    */

//   useEffect(() => {
//     const syncFullscreen =
//       () => {
//         setFullscreen(
//           Boolean(
//             document.fullscreenElement
//           )
//         );
//       };

//     document.addEventListener(
//       'fullscreenchange',
//       syncFullscreen
//     );

//     /*
//      * Initial state.
//      */

//     syncFullscreen();

//     return () => {
//       document.removeEventListener(
//         'fullscreenchange',
//         syncFullscreen
//       );
//     };
//   }, []);

//   /*
//    * =======================================================
//    * FULLSCREEN TOGGLE
//    * =======================================================
//    */

//   const toggleFullscreen =
//     async () => {
//       /*
//        * Safety check.
//        *
//        * Even if this function somehow gets called on
//        * a touch device, do nothing.
//        */

//       if (isTouchDevice) {
//         return;
//       }

//       try {
//         if (
//           !document.fullscreenElement
//         ) {
//           if (
//             document.documentElement
//               .requestFullscreen
//           ) {
//             await document.documentElement.requestFullscreen();
//           }
//         } else {
//           if (
//             document.exitFullscreen
//           ) {
//             await document.exitFullscreen();
//           }
//         }
//       } catch {
//         /*
//          * Fullscreen is optional.
//          *
//          * Never allow a fullscreen browser error
//          * to break the application.
//          */
//       }
//     };

//   /*
//    * =======================================================
//    * LOGOUT
//    * =======================================================
//    */

//   const handleLogout =
//     () => {
//       /*
//        * Close menu first.
//        */

//       setMobileMenu(false);

//       /*
//        * If desktop fullscreen is active, exit it
//        * before leaving the protected application.
//        */

//       if (
//         document.fullscreenElement &&
//         !isTouchDevice
//       ) {
//         document
//           .exitFullscreen?.()
//           .catch(() => {});
//       }

//       onLogout();
//     };

//   return (
//     <div className="app-shell">
//       {/* =================================================
//           NAVIGATION HEADER
//       ================================================= */}

//       <header className="nav">
//         {/* =================================================
//             BRAND
//         ================================================= */}

//         <button
//           type="button"
//           className="brand"
//           onClick={() =>
//             navigate('/levels')
//           }
//           aria-label="Tech Runner home"
//         >
//           <span>
//             TECH
//           </span>{' '}
//           RUNNER

//           <small>
//             CODE • RUN • SURVIVE • WIN
//           </small>
//         </button>

//         {/* =================================================
//             DESKTOP / MOBILE NAVIGATION
//         ================================================= */}

//         <nav
//           className={`main-nav ${
//             mobileMenu
//               ? 'open'
//               : ''
//           }`}
//         >
//           <NavLink
//             to="/levels"
//           >
//             PLAY
//           </NavLink>

//           <NavLink
//             to="/leaderboard"
//           >
//             LEADERBOARD
//           </NavLink>

//           <NavLink
//             to="/results"
//           >
//             RESULTS
//           </NavLink>

//           <NavLink
//             to="/stats"
//           >
//             STATS
//           </NavLink>
//         </nav>

//         {/* =================================================
//             PLAYER PROFILE
//         ================================================= */}

//         <div className="profile">
//           <UserCircle2
//             size={30}
//           />

//           <div>
//             <b>
//               {player.name}
//             </b>

//             <small>
//               {(
//                 player.branch ||
//                 ''
//               ).replace(
//                 'Computer Science and Engineering (CSE)',
//                 'CSE'
//               )}
//             </small>
//           </div>

//           {/* =================================================
//               DESKTOP FULLSCREEN ONLY
//           ================================================= */}

//           {!isTouchDevice && (
//             <button
//               type="button"
//               onClick={
//                 toggleFullscreen
//               }
//               title={
//                 fullscreen
//                   ? 'Exit fullscreen'
//                   : 'Fullscreen'
//               }
//               aria-label={
//                 fullscreen
//                   ? 'Exit fullscreen'
//                   : 'Enter fullscreen'
//               }
//             >
//               <Maximize2
//                 size={16}
//               />
//             </button>
//           )}

//           {/* =================================================
//               LOGOUT
//           ================================================= */}

//           <button
//             type="button"
//             onClick={
//               handleLogout
//             }
//             title="Logout"
//             aria-label="Logout"
//           >
//             <LogOut
//               size={16}
//             />
//           </button>
//         </div>

//         {/* =================================================
//             MOBILE MENU BUTTON
//         ================================================= */}

//         <button
//           type="button"
//           className="mobile-menu-button"
//           onClick={() =>
//             setMobileMenu(
//               (value) =>
//                 !value
//             )
//           }
//           aria-label={
//             mobileMenu
//               ? 'Close navigation'
//               : 'Open navigation'
//           }
//           aria-expanded={
//             mobileMenu
//           }
//         >
//           {mobileMenu ? (
//             <X
//               size={22}
//             />
//           ) : (
//             <Menu
//               size={22}
//             />
//           )}
//         </button>
//       </header>

//       {/* =================================================
//           PAGE CONTENT
//       ================================================= */}

//       <Outlet />
//     </div>
//   );
// }

// /*
//  * =========================================================
//  * LANDING REDIRECT
//  * =========================================================
//  */

// export function LandingRedirect() {
//   return (
//     <Navigate
//       to="/login"
//       replace
//     />
//   );
// }

import {
  useEffect,
  useState,
} from 'react';

import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  UserCircle2,
  LogOut,
  Maximize2,
  Minimize2,
  Menu,
  X,
} from 'lucide-react';

import { useAuth } from './hooks/useAuth';
import { storage } from './utils/storage';

import './App.css';

export function ProtectedLayout() {
  const {
    player,
    loading,
    setPlayer,
  } = useAuth();

  if (loading) {
    return (
      <div className="boot-screen">
        CONNECTING TO TECH RUNNER...
      </div>
    );
  }

  if (!player) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <AppShell
      player={player}
      onLogout={() => {
        storage.clearAuth();
        setPlayer(null);
      }}
    />
  );
}

function AppShell({
  player,
  onLogout,
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    gameViewExpanded,
    setGameViewExpanded,
  ] = useState(false);

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  /*
   * -------------------------------------------------------
   * DEVICE DETECTION
   * -------------------------------------------------------
   *
   * Native browser fullscreen is deliberately NOT used on
   * touch devices.
   *
   * Android Chrome can display its own fullscreen message,
   * which covers the game temporarily.
   *
   * Instead, mobile uses our own in-app expanded view.
   */

  const isTouchDevice =
    typeof window !==
      'undefined' &&
    (
      navigator.maxTouchPoints >
        0 ||
      'ontouchstart' in window
    );

  /*
   * -------------------------------------------------------
   * CLOSE MOBILE MENU WHEN ROUTE CHANGES
   * -------------------------------------------------------
   */

  useEffect(() => {
    setMobileMenu(false);

    /*
     * Leaving a game should always restore the normal
     * application layout.
     */

    if (
      !location.pathname.startsWith(
        '/game'
      )
    ) {
      setGameViewExpanded(
        false
      );
    }
  }, [
    location.pathname,
  ]);

  /*
   * -------------------------------------------------------
   * DESKTOP FULLSCREEN STATE
   * -------------------------------------------------------
   */

  const [
    desktopFullscreen,
    setDesktopFullscreen,
  ] = useState(false);

  useEffect(() => {
    const handleFullscreenChange =
      () => {
        setDesktopFullscreen(
          Boolean(
            document.fullscreenElement
          )
        );
      };

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );

    handleFullscreenChange();

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  /*
   * -------------------------------------------------------
   * FULLSCREEN / EXPANDED VIEW
   * -------------------------------------------------------
   */

  const toggleGameView =
    async () => {
      /*
       * MOBILE
       *
       * Use our own CSS expanded view.
       *
       * This DOES NOT call requestFullscreen().
       *
       * Therefore Android Chrome will not show:
       *
       * "To exit full screen..."
       */

      if (isTouchDevice) {
        /*
         * MOBILE EXPANDED VIEW
         *
         * Never call requestFullscreen() on a touch device.
         * Android Chrome can show its native fullscreen
         * instruction overlay, which can cover the game.
         *
         * The existing expand button therefore uses the
         * in-app expanded view instead.
         */
        setGameViewExpanded(
          (value) =>
            !value
        );

        /*
         * Let layout settle, then tell Phaser to recalculate
         * its FIT canvas. The Phaser game is NOT recreated.
         */
        window.setTimeout(() => {
          window.dispatchEvent(
            new Event('resize')
          );
        }, 120);

        return;
      }

      /*
       * DESKTOP
       *
       * Keep the original native fullscreen experience.
       */

      try {
        if (
          !document.fullscreenElement
        ) {
          await document.documentElement.requestFullscreen?.();
        } else {
          await document.exitFullscreen?.();
        }
      } catch {
        /*
         * Fullscreen is optional.
         *
         * Never break the game if the browser rejects it.
         */
      }
    };

  /*
   * -------------------------------------------------------
   * LOGOUT
   * -------------------------------------------------------
   */

  const handleLogout =
    () => {
      setMobileMenu(false);
      setGameViewExpanded(false);

      if (
        document.fullscreenElement
      ) {
        document
          .exitFullscreen?.()
          .catch(() => {});
      }

      onLogout();
    };

  /*
   * -------------------------------------------------------
   * APP SHELL CLASS
   * -------------------------------------------------------
   *
   * GamePage.css uses this class to enlarge the game
   * without using the browser Fullscreen API.
   */

  const shellClassName =
    [
      'app-shell',
      gameViewExpanded
        ? 'game-view-expanded'
        : '',
    ]
      .filter(Boolean)
      .join(' ');

  return (
    <div
      className={
        shellClassName
      }
    >
      <header className="nav">
        {/* =================================================
            BRAND
        ================================================= */}

        <button
          type="button"
          className="brand"
          onClick={() =>
            navigate('/levels')
          }
          aria-label="Tech Runner home"
        >
          <span>
            TECH
          </span>{' '}
          RUNNER

          <small>
            CODE • RUN • SURVIVE • WIN
          </small>
        </button>

        {/* =================================================
            MAIN NAVIGATION
        ================================================= */}

        <nav
          className={`main-nav ${
            mobileMenu
              ? 'open'
              : ''
          }`}
        >
          <NavLink
            to="/levels"
          >
            PLAY
          </NavLink>

          <NavLink
            to="/leaderboard"
          >
            LEADERBOARD
          </NavLink>

          <NavLink
            to="/results"
          >
            RESULTS
          </NavLink>

          <NavLink
            to="/stats"
          >
            STATS
          </NavLink>
        </nav>

        {/* =================================================
            PROFILE
        ================================================= */}

        <div className="profile">
          <UserCircle2
            size={30}
          />

          <div>
            <b>
              {player.name}
            </b>

            <small>
              {(
                player.branch ||
                ''
              ).replace(
                'Computer Science and Engineering (CSE)',
                'CSE'
              )}
            </small>
          </div>

          {/* =================================================
              EXPAND / FULLSCREEN BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={
              toggleGameView
            }
            title={
              isTouchDevice
                ? (
                    gameViewExpanded
                      ? 'Zoom out'
                      : 'Zoom in'
                  )
                : (
                    desktopFullscreen
                      ? 'Exit fullscreen'
                      : 'Fullscreen'
                  )
            }
            aria-label={
              isTouchDevice
                ? (
                    gameViewExpanded
                      ? 'Zoom out'
                      : 'Zoom in'
                  )
                : (
                    desktopFullscreen
                      ? 'Exit fullscreen'
                      : 'Fullscreen'
                  )
            }
          >
            {isTouchDevice ? (
              gameViewExpanded ? (
                <Minimize2
                  size={18}
                />
              ) : (
                <Maximize2
                  size={18}
                />
              )
            ) : (
              <Maximize2
                size={18}
              />
            )}
          </button>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={
              handleLogout
            }
            title="Logout"
            aria-label="Logout"
          >
            <LogOut
              size={18}
            />
          </button>
        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenu(
              (value) =>
                !value
            )
          }
          aria-label={
            mobileMenu
              ? 'Close navigation'
              : 'Open navigation'
          }
          aria-expanded={
            mobileMenu
          }
        >
          {mobileMenu ? (
            <X
              size={22}
            />
          ) : (
            <Menu
              size={22}
            />
          )}
        </button>
      </header>

      <Outlet />
    </div>
  );
}

export function LandingRedirect() {
  return (
    <Navigate
      to="/login"
      replace
    />
  );
}