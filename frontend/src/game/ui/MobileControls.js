// export class MobileControls {
//   constructor(scene) {
//     this.scene = scene;

//     /*
//      * ==================================================
//      * INPUT STATE
//      * ==================================================
//      *
//      * These states represent buttons currently held.
//      */

//     this.state = {
//       left: false,
//       right: false,
//       jump: false,
//       crouch: false,
//       attack: false,
//     };

//     /*
//      * One-shot press state.
//      *
//      * This prevents jump from repeatedly triggering
//      * while the button is held.
//      */

//     this.justPressed = {
//       jump: false,
//       attack: false,
//     };

//     this.buttons = [];

//     /*
//      * ==================================================
//      * LEFT / RIGHT
//      * ==================================================
//      */

//     this.add(
//       scene,
//       75,
//       645,
//       '◀',
//       'left',
//       false
//     );

//     this.add(
//       scene,
//       165,
//       645,
//       '▶',
//       'right',
//       false
//     );

//     /*
//      * ==================================================
//      * CROUCH / JUMP / ATTACK
//      * ==================================================
//      */

//     this.add(
//       scene,
//       1020,
//       645,
//       '▼',
//       'crouch',
//       false
//     );

//     this.add(
//       scene,
//       1110,
//       645,
//       '▲',
//       'jump',
//       true
//     );

//     this.add(
//       scene,
//       1210,
//       645,
//       '●',
//       'attack',
//       true
//     );

//     /*
//      * ==================================================
//      * GLOBAL RELEASE
//      * ==================================================
//      *
//      * If the mouse/finger leaves the game,
//      * never leave a movement key stuck.
//      */

//     this.boundReleaseAll =
//       () => {
//         this.releaseAll();
//       };

//     window.addEventListener(
//       'blur',
//       this.boundReleaseAll
//     );

//     document.addEventListener(
//       'visibilitychange',
//       this.boundReleaseAll
//     );

//     /*
//      * Phaser pointer release.
//      */

//     if (scene.input) {
//       scene.input.on(
//         'pointerup',
//         this.boundReleaseAll
//       );

//       scene.input.on(
//         'gameout',
//         this.boundReleaseAll
//       );
//     }
//   }

//   /*
//    * ==================================================
//    * CREATE BUTTON
//    * ==================================================
//    */

//   add(
//     scene,
//     x,
//     y,
//     label,
//     key,
//     oneShot = false
//   ) {
//     const button =
//       scene.add
//         .text(
//           x,
//           y,
//           label,
//           {
//             fontFamily:
//               'Arial',

//             fontSize:
//               '27px',

//             fontStyle:
//               'bold',

//             color:
//               '#ffffff',

//             backgroundColor:
//               '#07111dcc',

//             padding: {
//               left: 18,
//               right: 18,
//               top: 10,
//               bottom: 10,
//             },
//           }
//         )
//         .setOrigin(0.5)
//         .setScrollFactor(0)
//         .setDepth(60)
//         .setInteractive({
//           useHandCursor: true,
//           draggable: false,
//         });

//     /*
//      * ==================================================
//      * PRESS
//      * ==================================================
//      */

//     const press =
//       (pointer) => {
//         pointer
//           ?.event
//           ?.preventDefault?.();

//         /*
//          * Ignore controls if the game has ended.
//          */

//         if (
//           scene.finished
//         ) {
//           return;
//         }

//         this.state[key] =
//           true;

//         if (oneShot) {
//           this.justPressed[key] =
//             true;
//         }

//         button
//           .setAlpha(0.55)
//           .setScale(0.94);
//       };

//     /*
//      * ==================================================
//      * RELEASE
//      * ==================================================
//      */

//     const release =
//       (pointer) => {
//         pointer
//           ?.event
//           ?.preventDefault?.();

//         this.state[key] =
//           false;

//         button
//           .setAlpha(1)
//           .setScale(1);
//       };

//     /*
//      * ==================================================
//      * PHASER POINTER EVENTS
//      * ==================================================
//      */

//     button.on(
//       'pointerdown',
//       press
//     );

//     button.on(
//       'pointerup',
//       release
//     );

//     button.on(
//       'pointerupoutside',
//       release
//     );

//     button.on(
//       'pointercancel',
//       release
//     );

//     /*
//      * ==================================================
//      * MOUSE SUPPORT
//      * ==================================================
//      *
//      * If mouse pointer leaves the button while
//      * holding it, release the movement.
//      */

//     button.on(
//       'pointerout',
//       (pointer) => {
//         if (
//           pointer?.pointerType ===
//             'mouse' &&
//           pointer.isDown
//         ) {
//           release(pointer);
//         }
//       }
//     );

//     /*
//      * ==================================================
//      * POINTER OVER
//      * ==================================================
//      */

//     button.on(
//       'pointerover',
//       () => {
//         if (
//           scene.input?.activePointer?.isDown
//         ) {
//           press(
//             scene.input.activePointer
//           );
//         }
//       }
//     );

//     this.buttons.push({
//       button,
//       key,
//       release,
//       oneShot,
//     });
//   }

//   /*
//    * ==================================================
//    * CONSUME PRESS
//    * ==================================================
//    *
//    * Used for:
//    *
//    * Jump
//    * Attack
//    */

//   consumePress(key) {
//     if (
//       !this.justPressed[key]
//     ) {
//       return false;
//     }

//     this.justPressed[key] =
//       false;

//     this.state[key] =
//       false;

//     const entry =
//       this.buttons.find(
//         (item) =>
//           item.key === key
//       );

//     if (
//       entry?.button?.active
//     ) {
//       entry.button
//         .setAlpha(1)
//         .setScale(1);
//     }

//     return true;
//   }

//   /*
//    * ==================================================
//    * RELEASE ALL
//    * ==================================================
//    */

//   releaseAll() {
//     Object.keys(
//       this.state
//     ).forEach(
//       (key) => {
//         this.state[key] =
//           false;
//       }
//     );

//     Object.keys(
//       this.justPressed
//     ).forEach(
//       (key) => {
//         this.justPressed[key] =
//           false;
//       }
//     );

//     this.buttons.forEach(
//       ({
//         button,
//       }) => {
//         if (
//           button?.active
//         ) {
//           button
//             .setAlpha(1)
//             .setScale(1);
//         }
//       }
//     );
//   }

//   /*
//    * ==================================================
//    * DESTROY
//    * ==================================================
//    */

//   destroy() {
//     this.releaseAll();

//     window.removeEventListener(
//       'blur',
//       this.boundReleaseAll
//     );

//     document.removeEventListener(
//       'visibilitychange',
//       this.boundReleaseAll
//     );

//     if (
//       this.scene?.input
//     ) {
//       this.scene.input.off(
//         'pointerup',
//         this.boundReleaseAll
//       );

//       this.scene.input.off(
//         'gameout',
//         this.boundReleaseAll
//       );
//     }

//     this.buttons.forEach(
//       ({
//         button,
//       }) => {
//         button?.removeAllListeners();

//         button?.destroy();
//       }
//     );

//     this.buttons = [];
//   }
// }
/*
 * =========================================================
 * TECH RUNNER MOBILE CONTROLS
 * =========================================================
 *
 * Supports:
 *
 * - Touch screens
 * - Mouse
 * - Multitouch
 * - Hold LEFT / RIGHT
 * - Hold CROUCH
 * - Tap JUMP
 * - Tap ATTACK
 * - Pointer cancellation
 * - Browser visibility changes
 * - Landscape 16:9 gameplay
 *
 * IMPORTANT:
 *
 * Phaser's logical game resolution is 1280 × 720.
 *
 * These coordinates are therefore logical game
 * coordinates and automatically scale through
 * Phaser.Scale.FIT on mobile.
 * =========================================================
 */

export class MobileControls {
  constructor(scene) {
    this.scene = scene;

    /*
     * =======================================================
     * STATE
     * =======================================================
     */

    this.state = {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      attack: false,
    };

    /*
     * One-shot actions.
     *
     * Jump and attack are consumed by GameScene.
     */

    this.justPressed = {
      jump: false,
      attack: false,
    };

    /*
     * =======================================================
     * BUTTON COLLECTION
     * =======================================================
     */

    this.buttons = [];

    /*
     * Every currently active pointer gets its own
     * button assignment.
     *
     * Example:
     *
     * pointer 1 -> right
     * pointer 2 -> jump
     *
     * Both can remain active simultaneously.
     */

    this.pointerAssignments =
      new Map();

    /*
     * =======================================================
     * ENABLE MULTI-POINTER INPUT
     * =======================================================
     */

    try {
      if (
        scene.input &&
        scene.input.addPointer
      ) {
        /*
         * Phaser already has one active pointer.
         *
         * Add three more so the game can receive
         * multiple simultaneous touches.
         */

        scene.input.addPointer(3);
      }
    } catch {
      /*
       * Some Phaser versions may already have
       * the required pointer count.
       */
    }

    /*
     * =======================================================
     * LEFT / RIGHT
     * =======================================================
     */

    this.add(
      scene,
      92,
      625,
      '◀',
      'left',
      false
    );

    this.add(
      scene,
      205,
      625,
      '▶',
      'right',
      false
    );

    /*
     * =======================================================
     * RIGHT-SIDE ACTIONS
     * =======================================================
     */

    this.add(
      scene,
      1010,
      625,
      '▼',
      'crouch',
      false
    );

    this.add(
      scene,
      1120,
      625,
      '▲',
      'jump',
      true
    );

    this.add(
      scene,
      1210,
      625,
      '●',
      'attack',
      true
    );

    /*
     * =======================================================
     * GLOBAL SAFETY RELEASE
     * =======================================================
     *
     * These are only used when the entire browser/game
     * loses focus.
     *
     * We intentionally DO NOT release everything on
     * every Phaser pointerup because that would break
     * multitouch.
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
     * Phaser pointer cancel / game out.
     *
     * These events mean the entire interaction has
     * become invalid.
     */

    if (scene.input) {
      this.boundGameOut =
        () => {
          this.releaseAll();
        };

      this.boundGameOutPointer =
        (pointer) => {
          this.releasePointer(
            pointer
          );
        };

      scene.input.on(
        'gameout',
        this.boundGameOut
      );

      scene.input.on(
        'pointercancel',
        this.boundGameOutPointer
      );
    }
  }

  /*
   * =========================================================
   * CREATE MOBILE BUTTON
   * =========================================================
   */

  add(
    scene,
    x,
    y,
    label,
    key,
    oneShot = false
  ) {
    /*
     * =======================================================
     * BUTTON CONTAINER
     * =======================================================
     */

    const container =
      scene.add
        .container(
          x,
          y
        )
        .setScrollFactor(0)
        .setDepth(60);

    /*
     * =======================================================
     * VISUAL
     * =======================================================
     */

    const width =
      key === 'attack'
        ? 86
        : 78;

    const height =
      key === 'attack'
        ? 78
        : 70;

    const border =
      scene.add
        .rectangle(
          0,
          0,
          width,
          height,
          0x071522,
          0.86
        )
        .setStrokeStyle(
          2,
          key === 'attack'
            ? 0xff4354
            : 0x38c8ff,
          0.95
        );

    /*
     * Inner ring makes the buttons easier to see
     * without making them look like generic HTML
     * mobile controls.
     */

    const inner =
      scene.add
        .rectangle(
          0,
          0,
          width - 10,
          height - 10,
          0x06111d,
          0.3
        )
        .setStrokeStyle(
          1,
          key === 'attack'
            ? 0x8c1c2b
            : 0x175c7e,
          0.8
        );

    const text =
      scene.add
        .text(
          0,
          0,
          label,
          {
            fontFamily:
              'Arial',

            fontSize:
              key === 'attack'
                ? '26px'
                : '30px',

            fontStyle:
              'bold',

            color:
              key === 'attack'
                ? '#ff6674'
                : '#dff6ff',

            align:
              'center',

            shadow: {
              offsetX: 0,
              offsetY: 0,
              color:
                key === 'attack'
                  ? '#ff3045'
                  : '#39caff',
              blur: 8,
              fill: true,
            },
          }
        )
        .setOrigin(0.5);

    container.add([
      border,
      inner,
      text,
    ]);

    /*
     * =======================================================
     * HIT AREA
     * =======================================================
     *
     * The invisible hit area is slightly larger than
     * the visible button.
     *
     * This is important on phones.
     */

    const hitArea =
      scene.add
        .rectangle(
          0,
          0,
          width + 22,
          height + 22,
          0xffffff,
          0.001
        )
        .setOrigin(0.5)
        .setInteractive({
          useHandCursor:
            false,

          draggable:
            false,
        });

    container.add(
      hitArea
    );

    /*
     * =======================================================
     * POINTER PRESS
     * =======================================================
     */

    const press =
      (pointer) => {
        pointer
          ?.event
          ?.preventDefault?.();

        if (
          !scene ||
          scene.finished
        ) {
          return;
        }

        /*
         * Ignore a pointer if the same pointer
         * is already controlling this button.
         */

        if (
          this.pointerAssignments.has(
            pointer.id
          )
        ) {
          return;
        }

        /*
         * Assign this specific pointer to
         * this specific control.
         */

        this.pointerAssignments.set(
          pointer.id,
          key
        );

        this.state[key] =
          true;

        if (oneShot) {
          this.justPressed[key] =
            true;
        }

        /*
         * Visual pressed state.
         */

        border.setFillStyle(
          key === 'attack'
            ? 0x44101a
            : 0x0d2d40,
          0.96
        );

        inner.setFillStyle(
          key === 'attack'
            ? 0x310b12
            : 0x092335,
          0.7
        );

        text.setScale(
          0.9
        );

        container.setScale(
          0.96
        );
      };

    /*
     * =======================================================
     * POINTER RELEASE
     * =======================================================
     */

    const release =
      (pointer) => {
        pointer
          ?.event
          ?.preventDefault?.();

        this.releasePointer(
          pointer
        );

        this.resetButtonVisual(
          border,
          inner,
          text,
          container
        );
      };

    /*
     * =======================================================
     * PHASER EVENTS
     * =======================================================
     */

    hitArea.on(
      'pointerdown',
      press
    );

    hitArea.on(
      'pointerup',
      release
    );

    hitArea.on(
      'pointerupoutside',
      release
    );

    hitArea.on(
      'pointercancel',
      release
    );

    /*
     * =======================================================
     * MOUSE POINTEROUT
     * =======================================================
     *
     * Mouse dragging outside a movement button
     * should release that button.
     *
     * Touch pointers are NOT released here because
     * the user may temporarily move their finger.
     */

    hitArea.on(
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
     * =======================================================
     * MOUSE POINTEROVER
     * =======================================================
     *
     * Allows normal desktop mouse dragging.
     */

    hitArea.on(
      'pointerover',
      (pointer) => {
        if (
          pointer?.pointerType ===
            'mouse' &&
          pointer.isDown
        ) {
          press(pointer);
        }
      }
    );

    /*
     * =======================================================
     * STORE BUTTON
     * =======================================================
     */

    this.buttons.push({
      key,

      oneShot,

      container,

      hitArea,

      border,

      inner,

      text,

      release,
    });
  }

  /*
   * =========================================================
   * RESET VISUAL
   * =========================================================
   */

  resetButtonVisual(
    border,
    inner,
    text,
    container
  ) {
    if (
      !border ||
      !inner ||
      !text ||
      !container
    ) {
      return;
    }

    const isAttack =
      border.strokeColor ===
      0xff4354;

    border.setFillStyle(
      0x071522,
      0.86
    );

    inner.setFillStyle(
      0x06111d,
      0.3
    );

    text.setScale(
      1
    );

    container.setScale(
      1
    );
  }

  /*
   * =========================================================
   * RELEASE ONE POINTER
   * =========================================================
   */

  releasePointer(
    pointer
  ) {
    if (!pointer) {
      return;
    }

    const pointerId =
      pointer.id;

    const key =
      this.pointerAssignments.get(
        pointerId
      );

    if (!key) {
      return;
    }

    /*
     * Remove this pointer assignment.
     */

    this.pointerAssignments.delete(
      pointerId
    );

    /*
     * Determine whether another pointer
     * is still holding the same button.
     */

    let stillHeld =
      false;

    for (
      const assignedKey
      of this.pointerAssignments.values()
    ) {
      if (
        assignedKey ===
        key
      ) {
        stillHeld = true;
        break;
      }
    }

    /*
     * Only release the button if no other
     * pointer is holding it.
     */

    if (!stillHeld) {
      this.state[key] =
        false;

      /*
       * One-shot actions are consumed by
       * GameScene, so releasing the pointer
       * does not need to trigger anything else.
       */

      const entry =
        this.buttons.find(
          (item) =>
            item.key === key
        );

      if (entry) {
        this.resetButtonVisual(
          entry.border,
          entry.inner,
          entry.text,
          entry.container
        );
      }
    }
  }

  /*
   * =========================================================
   * CONSUME ONE-SHOT PRESS
   * =========================================================
   *
   * GameScene calls this for:
   *
   * jump
   * attack
   */

  consumePress(
    key
  ) {
    if (
      !this.justPressed[key]
    ) {
      return false;
    }

    this.justPressed[key] =
      false;

    /*
     * Jump/attack should not remain held.
     */

    this.state[key] =
      false;

    /*
     * Remove pointer assignments for this
     * one-shot action.
     */

    for (
      const [
        pointerId,
        assignedKey,
      ] of this.pointerAssignments
    ) {
      if (
        assignedKey === key
      ) {
        this.pointerAssignments.delete(
          pointerId
        );
      }
    }

    const entry =
      this.buttons.find(
        (item) =>
          item.key === key
      );

    if (entry) {
      this.resetButtonVisual(
        entry.border,
        entry.inner,
        entry.text,
        entry.container
      );
    }

    return true;
  }

  /*
   * =========================================================
   * RELEASE ALL
   * =========================================================
   *
   * Used only for browser/game focus loss.
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

    this.pointerAssignments.clear();

    this.buttons.forEach(
      (entry) => {
        this.resetButtonVisual(
          entry.border,
          entry.inner,
          entry.text,
          entry.container
        );
      }
    );
  }

  /*
   * =========================================================
   * DESTROY
   * =========================================================
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
        'gameout',
        this.boundGameOut
      );

      this.scene.input.off(
        'pointercancel',
        this.boundGameOutPointer
      );
    }

    this.buttons.forEach(
      (entry) => {
        entry.hitArea?.removeAllListeners();

        entry.hitArea?.destroy();

        entry.container?.destroy(
          true
        );
      }
    );

    this.buttons = [];

    this.pointerAssignments.clear();

    this.scene =
      null;
  }
}