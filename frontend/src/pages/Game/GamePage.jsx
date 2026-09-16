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

  const config =
    LEVELS.find(
      (item) =>
        item.key === level
    );

  const gameConfig =
    LEVEL_CONFIGS[level];

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

        try {
          session =
            await getGameSession();
        } catch {
          session =
            await createGameSession();
        }

        if (
          !alive
        ) {
          return;
        }

        const run =
          await startLevel(
            level,
            session.sessionId
          );

        if (
          !alive
        ) {
          return;
        }

        const levelConfig = {
          ...config,
          ...gameConfig,

          key:
            level,

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

        const phaserConfig = {
          type:
            Phaser.AUTO,

          parent:
            hostRef.current,

          width:
            1280,

          height:
            720,

          backgroundColor:
            '#06111d',

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
              1280,

            height:
              720,
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

        const game =
          new Phaser.Game(
            phaserConfig
          );

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

              if (
                !alive
              ) {
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
              if (
                alive
              ) {
                setError(
                  err?.message ||
                    'Unable to save level result.'
                );
              }
            }
          }
        );

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

              if (
                !alive
              ) {
                return;
              }

              setOver(
                gameResult
              );
            } catch (
              err
            ) {
              if (
                alive
              ) {
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
        if (
          !alive
        ) {
          return;
        }

        console.error(
          '[Tech Runner] Failed to start game:',
          err
        );

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

    return () => {
      alive = false;

      if (
        gameRef.current
      ) {
        gameRef.current.destroy(
          true
        );

        gameRef.current =
          null;
      }
    };
  }, [
    level,
    navigate,
  ]);

  if (
    !config
  ) {
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

  return (
    <main className="game-page">
      <div className="game-top">
        <span>
          TECH RUNNER
        </span>

        <span>
          {config.name}
        </span>
      </div>

      <div
        ref={hostRef}
        className="phaser-host"
      />

      {error && (
        <div className="game-modal">
          <div className="modal-card">
            <h2>
              CONNECTION ERROR
            </h2>

            <p>
              {error}
            </p>

            <button
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
                onClick={() =>
                  window.location.reload()
                }
              >
                RETRY LEVEL
              </button>

              <button
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
    Math.floor(
      Number(value) || 0
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