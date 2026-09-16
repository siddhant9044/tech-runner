export class MobileControls {
  constructor(scene) {
    this.scene = scene;

    /*
     * ==================================================
     * INPUT STATE
     * ==================================================
     *
     * These states represent buttons currently held.
     */

    this.state = {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      attack: false,
    };

    /*
     * One-shot press state.
     *
     * This prevents jump from repeatedly triggering
     * while the button is held.
     */

    this.justPressed = {
      jump: false,
      attack: false,
    };

    this.buttons = [];

    /*
     * ==================================================
     * LEFT / RIGHT
     * ==================================================
     */

    this.add(
      scene,
      75,
      645,
      '◀',
      'left',
      false
    );

    this.add(
      scene,
      165,
      645,
      '▶',
      'right',
      false
    );

    /*
     * ==================================================
     * CROUCH / JUMP / ATTACK
     * ==================================================
     */

    this.add(
      scene,
      1020,
      645,
      '▼',
      'crouch',
      false
    );

    this.add(
      scene,
      1110,
      645,
      '▲',
      'jump',
      true
    );

    this.add(
      scene,
      1210,
      645,
      '●',
      'attack',
      true
    );

    /*
     * ==================================================
     * GLOBAL RELEASE
     * ==================================================
     *
     * If the mouse/finger leaves the game,
     * never leave a movement key stuck.
     */

    this.boundReleaseAll =
      () => {
        this.releaseAll();
      };

    window.addEventListener(
      'blur',
      this.boundReleaseAll
    );

    document.addEventListener(
      'visibilitychange',
      this.boundReleaseAll
    );

    /*
     * Phaser pointer release.
     */

    if (scene.input) {
      scene.input.on(
        'pointerup',
        this.boundReleaseAll
      );

      scene.input.on(
        'gameout',
        this.boundReleaseAll
      );
    }
  }

  /*
   * ==================================================
   * CREATE BUTTON
   * ==================================================
   */

  add(
    scene,
    x,
    y,
    label,
    key,
    oneShot = false
  ) {
    const button =
      scene.add
        .text(
          x,
          y,
          label,
          {
            fontFamily:
              'Arial',

            fontSize:
              '27px',

            fontStyle:
              'bold',

            color:
              '#ffffff',

            backgroundColor:
              '#07111dcc',

            padding: {
              left: 18,
              right: 18,
              top: 10,
              bottom: 10,
            },
          }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(60)
        .setInteractive({
          useHandCursor: true,
          draggable: false,
        });

    /*
     * ==================================================
     * PRESS
     * ==================================================
     */

    const press =
      (pointer) => {
        pointer
          ?.event
          ?.preventDefault?.();

        /*
         * Ignore controls if the game has ended.
         */

        if (
          scene.finished
        ) {
          return;
        }

        this.state[key] =
          true;

        if (oneShot) {
          this.justPressed[key] =
            true;
        }

        button
          .setAlpha(0.55)
          .setScale(0.94);
      };

    /*
     * ==================================================
     * RELEASE
     * ==================================================
     */

    const release =
      (pointer) => {
        pointer
          ?.event
          ?.preventDefault?.();

        this.state[key] =
          false;

        button
          .setAlpha(1)
          .setScale(1);
      };

    /*
     * ==================================================
     * PHASER POINTER EVENTS
     * ==================================================
     */

    button.on(
      'pointerdown',
      press
    );

    button.on(
      'pointerup',
      release
    );

    button.on(
      'pointerupoutside',
      release
    );

    button.on(
      'pointercancel',
      release
    );

    /*
     * ==================================================
     * MOUSE SUPPORT
     * ==================================================
     *
     * If mouse pointer leaves the button while
     * holding it, release the movement.
     */

    button.on(
      'pointerout',
      (pointer) => {
        if (
          pointer?.pointerType ===
            'mouse' &&
          pointer.isDown
        ) {
          release(pointer);
        }
      }
    );

    /*
     * ==================================================
     * POINTER OVER
     * ==================================================
     */

    button.on(
      'pointerover',
      () => {
        if (
          scene.input?.activePointer?.isDown
        ) {
          press(
            scene.input.activePointer
          );
        }
      }
    );

    this.buttons.push({
      button,
      key,
      release,
      oneShot,
    });
  }

  /*
   * ==================================================
   * CONSUME PRESS
   * ==================================================
   *
   * Used for:
   *
   * Jump
   * Attack
   */

  consumePress(key) {
    if (
      !this.justPressed[key]
    ) {
      return false;
    }

    this.justPressed[key] =
      false;

    this.state[key] =
      false;

    const entry =
      this.buttons.find(
        (item) =>
          item.key === key
      );

    if (
      entry?.button?.active
    ) {
      entry.button
        .setAlpha(1)
        .setScale(1);
    }

    return true;
  }

  /*
   * ==================================================
   * RELEASE ALL
   * ==================================================
   */

  releaseAll() {
    Object.keys(
      this.state
    ).forEach(
      (key) => {
        this.state[key] =
          false;
      }
    );

    Object.keys(
      this.justPressed
    ).forEach(
      (key) => {
        this.justPressed[key] =
          false;
      }
    );

    this.buttons.forEach(
      ({
        button,
      }) => {
        if (
          button?.active
        ) {
          button
            .setAlpha(1)
            .setScale(1);
        }
      }
    );
  }

  /*
   * ==================================================
   * DESTROY
   * ==================================================
   */

  destroy() {
    this.releaseAll();

    window.removeEventListener(
      'blur',
      this.boundReleaseAll
    );

    document.removeEventListener(
      'visibilitychange',
      this.boundReleaseAll
    );

    if (
      this.scene?.input
    ) {
      this.scene.input.off(
        'pointerup',
        this.boundReleaseAll
      );

      this.scene.input.off(
        'gameout',
        this.boundReleaseAll
      );
    }

    this.buttons.forEach(
      ({
        button,
      }) => {
        button?.removeAllListeners();

        button?.destroy();
      }
    );

    this.buttons = [];
  }
}