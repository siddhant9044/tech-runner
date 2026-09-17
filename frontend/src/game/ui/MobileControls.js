// // // export class MobileControls {
// // //   constructor(scene) {
// // //     this.scene = scene;

// // //     /*
// // //      * ==================================================
// // //      * INPUT STATE
// // //      * ==================================================
// // //      *
// // //      * These states represent buttons currently held.
// // //      */

// // //     this.state = {
// // //       left: false,
// // //       right: false,
// // //       jump: false,
// // //       crouch: false,
// // //       attack: false,
// // //     };

// // //     /*
// // //      * One-shot press state.
// // //      *
// // //      * This prevents jump from repeatedly triggering
// // //      * while the button is held.
// // //      */

// // //     this.justPressed = {
// // //       jump: false,
// // //       attack: false,
// // //     };

// // //     this.buttons = [];

// // //     /*
// // //      * ==================================================
// // //      * LEFT / RIGHT
// // //      * ==================================================
// // //      */

// // //     this.add(
// // //       scene,
// // //       75,
// // //       645,
// // //       '◀',
// // //       'left',
// // //       false
// // //     );

// // //     this.add(
// // //       scene,
// // //       165,
// // //       645,
// // //       '▶',
// // //       'right',
// // //       false
// // //     );

// // //     /*
// // //      * ==================================================
// // //      * CROUCH / JUMP / ATTACK
// // //      * ==================================================
// // //      */

// // //     this.add(
// // //       scene,
// // //       1020,
// // //       645,
// // //       '▼',
// // //       'crouch',
// // //       false
// // //     );

// // //     this.add(
// // //       scene,
// // //       1110,
// // //       645,
// // //       '▲',
// // //       'jump',
// // //       true
// // //     );

// // //     this.add(
// // //       scene,
// // //       1210,
// // //       645,
// // //       '●',
// // //       'attack',
// // //       true
// // //     );

// // //     /*
// // //      * ==================================================
// // //      * GLOBAL RELEASE
// // //      * ==================================================
// // //      *
// // //      * If the mouse/finger leaves the game,
// // //      * never leave a movement key stuck.
// // //      */

// // //     this.boundReleaseAll =
// // //       () => {
// // //         this.releaseAll();
// // //       };

// // //     window.addEventListener(
// // //       'blur',
// // //       this.boundReleaseAll
// // //     );

// // //     document.addEventListener(
// // //       'visibilitychange',
// // //       this.boundReleaseAll
// // //     );

// // //     /*
// // //      * Phaser pointer release.
// // //      */

// // //     if (scene.input) {
// // //       scene.input.on(
// // //         'pointerup',
// // //         this.boundReleaseAll
// // //       );

// // //       scene.input.on(
// // //         'gameout',
// // //         this.boundReleaseAll
// // //       );
// // //     }
// // //   }

// // //   /*
// // //    * ==================================================
// // //    * CREATE BUTTON
// // //    * ==================================================
// // //    */

// // //   add(
// // //     scene,
// // //     x,
// // //     y,
// // //     label,
// // //     key,
// // //     oneShot = false
// // //   ) {
// // //     const button =
// // //       scene.add
// // //         .text(
// // //           x,
// // //           y,
// // //           label,
// // //           {
// // //             fontFamily:
// // //               'Arial',

// // //             fontSize:
// // //               '27px',

// // //             fontStyle:
// // //               'bold',

// // //             color:
// // //               '#ffffff',

// // //             backgroundColor:
// // //               '#07111dcc',

// // //             padding: {
// // //               left: 18,
// // //               right: 18,
// // //               top: 10,
// // //               bottom: 10,
// // //             },
// // //           }
// // //         )
// // //         .setOrigin(0.5)
// // //         .setScrollFactor(0)
// // //         .setDepth(60)
// // //         .setInteractive({
// // //           useHandCursor: true,
// // //           draggable: false,
// // //         });

// // //     /*
// // //      * ==================================================
// // //      * PRESS
// // //      * ==================================================
// // //      */

// // //     const press =
// // //       (pointer) => {
// // //         pointer
// // //           ?.event
// // //           ?.preventDefault?.();

// // //         /*
// // //          * Ignore controls if the game has ended.
// // //          */

// // //         if (
// // //           scene.finished
// // //         ) {
// // //           return;
// // //         }

// // //         this.state[key] =
// // //           true;

// // //         if (oneShot) {
// // //           this.justPressed[key] =
// // //             true;
// // //         }

// // //         button
// // //           .setAlpha(0.55)
// // //           .setScale(0.94);
// // //       };

// // //     /*
// // //      * ==================================================
// // //      * RELEASE
// // //      * ==================================================
// // //      */

// // //     const release =
// // //       (pointer) => {
// // //         pointer
// // //           ?.event
// // //           ?.preventDefault?.();

// // //         this.state[key] =
// // //           false;

// // //         button
// // //           .setAlpha(1)
// // //           .setScale(1);
// // //       };

// // //     /*
// // //      * ==================================================
// // //      * PHASER POINTER EVENTS
// // //      * ==================================================
// // //      */

// // //     button.on(
// // //       'pointerdown',
// // //       press
// // //     );

// // //     button.on(
// // //       'pointerup',
// // //       release
// // //     );

// // //     button.on(
// // //       'pointerupoutside',
// // //       release
// // //     );

// // //     button.on(
// // //       'pointercancel',
// // //       release
// // //     );

// // //     /*
// // //      * ==================================================
// // //      * MOUSE SUPPORT
// // //      * ==================================================
// // //      *
// // //      * If mouse pointer leaves the button while
// // //      * holding it, release the movement.
// // //      */

// // //     button.on(
// // //       'pointerout',
// // //       (pointer) => {
// // //         if (
// // //           pointer?.pointerType ===
// // //             'mouse' &&
// // //           pointer.isDown
// // //         ) {
// // //           release(pointer);
// // //         }
// // //       }
// // //     );

// // //     /*
// // //      * ==================================================
// // //      * POINTER OVER
// // //      * ==================================================
// // //      */

// // //     button.on(
// // //       'pointerover',
// // //       () => {
// // //         if (
// // //           scene.input?.activePointer?.isDown
// // //         ) {
// // //           press(
// // //             scene.input.activePointer
// // //           );
// // //         }
// // //       }
// // //     );

// // //     this.buttons.push({
// // //       button,
// // //       key,
// // //       release,
// // //       oneShot,
// // //     });
// // //   }

// // //   /*
// // //    * ==================================================
// // //    * CONSUME PRESS
// // //    * ==================================================
// // //    *
// // //    * Used for:
// // //    *
// // //    * Jump
// // //    * Attack
// // //    */

// // //   consumePress(key) {
// // //     if (
// // //       !this.justPressed[key]
// // //     ) {
// // //       return false;
// // //     }

// // //     this.justPressed[key] =
// // //       false;

// // //     this.state[key] =
// // //       false;

// // //     const entry =
// // //       this.buttons.find(
// // //         (item) =>
// // //           item.key === key
// // //       );

// // //     if (
// // //       entry?.button?.active
// // //     ) {
// // //       entry.button
// // //         .setAlpha(1)
// // //         .setScale(1);
// // //     }

// // //     return true;
// // //   }

// // //   /*
// // //    * ==================================================
// // //    * RELEASE ALL
// // //    * ==================================================
// // //    */

// // //   releaseAll() {
// // //     Object.keys(
// // //       this.state
// // //     ).forEach(
// // //       (key) => {
// // //         this.state[key] =
// // //           false;
// // //       }
// // //     );

// // //     Object.keys(
// // //       this.justPressed
// // //     ).forEach(
// // //       (key) => {
// // //         this.justPressed[key] =
// // //           false;
// // //       }
// // //     );

// // //     this.buttons.forEach(
// // //       ({
// // //         button,
// // //       }) => {
// // //         if (
// // //           button?.active
// // //         ) {
// // //           button
// // //             .setAlpha(1)
// // //             .setScale(1);
// // //         }
// // //       }
// // //     );
// // //   }

// // //   /*
// // //    * ==================================================
// // //    * DESTROY
// // //    * ==================================================
// // //    */

// // //   destroy() {
// // //     this.releaseAll();

// // //     window.removeEventListener(
// // //       'blur',
// // //       this.boundReleaseAll
// // //     );

// // //     document.removeEventListener(
// // //       'visibilitychange',
// // //       this.boundReleaseAll
// // //     );

// // //     if (
// // //       this.scene?.input
// // //     ) {
// // //       this.scene.input.off(
// // //         'pointerup',
// // //         this.boundReleaseAll
// // //       );

// // //       this.scene.input.off(
// // //         'gameout',
// // //         this.boundReleaseAll
// // //       );
// // //     }

// // //     this.buttons.forEach(
// // //       ({
// // //         button,
// // //       }) => {
// // //         button?.removeAllListeners();

// // //         button?.destroy();
// // //       }
// // //     );

// // //     this.buttons = [];
// // //   }
// // // }
// // /*
// //  * =========================================================
// //  * TECH RUNNER MOBILE CONTROLS
// //  * =========================================================
// //  *
// //  * Supports:
// //  *
// //  * - Touch screens
// //  * - Mouse
// //  * - Multitouch
// //  * - Hold LEFT / RIGHT
// //  * - Hold CROUCH
// //  * - Tap JUMP
// //  * - Tap ATTACK
// //  * - Pointer cancellation
// //  * - Browser visibility changes
// //  * - Landscape 16:9 gameplay
// //  *
// //  * IMPORTANT:
// //  *
// //  * Phaser's logical game resolution is 1280 × 720.
// //  *
// //  * These coordinates are therefore logical game
// //  * coordinates and automatically scale through
// //  * Phaser.Scale.FIT on mobile.
// //  * =========================================================
// //  */

// // export class MobileControls {
// //   constructor(scene) {
// //     this.scene = scene;

// //     /*
// //      * =======================================================
// //      * STATE
// //      * =======================================================
// //      */

// //     this.state = {
// //       left: false,
// //       right: false,
// //       jump: false,
// //       crouch: false,
// //       attack: false,
// //     };

// //     /*
// //      * One-shot actions.
// //      *
// //      * Jump and attack are consumed by GameScene.
// //      */

// //     this.justPressed = {
// //       jump: false,
// //       attack: false,
// //     };

// //     /*
// //      * =======================================================
// //      * BUTTON COLLECTION
// //      * =======================================================
// //      */

// //     this.buttons = [];

// //     /*
// //      * Every currently active pointer gets its own
// //      * button assignment.
// //      *
// //      * Example:
// //      *
// //      * pointer 1 -> right
// //      * pointer 2 -> jump
// //      *
// //      * Both can remain active simultaneously.
// //      */

// //     this.pointerAssignments =
// //       new Map();

// //     /*
// //      * =======================================================
// //      * ENABLE MULTI-POINTER INPUT
// //      * =======================================================
// //      */

// //     try {
// //       if (
// //         scene.input &&
// //         scene.input.addPointer
// //       ) {
// //         /*
// //          * Phaser already has one active pointer.
// //          *
// //          * Add three more so the game can receive
// //          * multiple simultaneous touches.
// //          */

// //         scene.input.addPointer(3);
// //       }
// //     } catch {
// //       /*
// //        * Some Phaser versions may already have
// //        * the required pointer count.
// //        */
// //     }

// //     /*
// //      * =======================================================
// //      * LEFT / RIGHT
// //      * =======================================================
// //      */

// //     this.add(
// //       scene,
// //       92,
// //       625,
// //       '◀',
// //       'left',
// //       false
// //     );

// //     this.add(
// //       scene,
// //       205,
// //       625,
// //       '▶',
// //       'right',
// //       false
// //     );

// //     /*
// //      * =======================================================
// //      * RIGHT-SIDE ACTIONS
// //      * =======================================================
// //      */

// //     this.add(
// //       scene,
// //       1010,
// //       625,
// //       '▼',
// //       'crouch',
// //       false
// //     );

// //     this.add(
// //       scene,
// //       1120,
// //       625,
// //       '▲',
// //       'jump',
// //       true
// //     );

// //     this.add(
// //       scene,
// //       1210,
// //       625,
// //       '●',
// //       'attack',
// //       true
// //     );

// //     /*
// //      * =======================================================
// //      * GLOBAL SAFETY RELEASE
// //      * =======================================================
// //      *
// //      * These are only used when the entire browser/game
// //      * loses focus.
// //      *
// //      * We intentionally DO NOT release everything on
// //      * every Phaser pointerup because that would break
// //      * multitouch.
// //      */

// //     this.boundReleaseAll =
// //       () => {
// //         this.releaseAll();
// //       };

// //     window.addEventListener(
// //       'blur',
// //       this.boundReleaseAll
// //     );

// //     document.addEventListener(
// //       'visibilitychange',
// //       this.boundReleaseAll
// //     );

// //     /*
// //      * Phaser pointer cancel / game out.
// //      *
// //      * These events mean the entire interaction has
// //      * become invalid.
// //      */

// //     if (scene.input) {
// //       this.boundGameOut =
// //         () => {
// //           this.releaseAll();
// //         };

// //       this.boundGameOutPointer =
// //         (pointer) => {
// //           this.releasePointer(
// //             pointer
// //           );
// //         };

// //       scene.input.on(
// //         'gameout',
// //         this.boundGameOut
// //       );

// //       scene.input.on(
// //         'pointercancel',
// //         this.boundGameOutPointer
// //       );
// //     }
// //   }

// //   /*
// //    * =========================================================
// //    * CREATE MOBILE BUTTON
// //    * =========================================================
// //    */

// //   add(
// //     scene,
// //     x,
// //     y,
// //     label,
// //     key,
// //     oneShot = false
// //   ) {
// //     /*
// //      * =======================================================
// //      * BUTTON CONTAINER
// //      * =======================================================
// //      */

// //     const container =
// //       scene.add
// //         .container(
// //           x,
// //           y
// //         )
// //         .setScrollFactor(0)
// //         .setDepth(60);

// //     /*
// //      * =======================================================
// //      * VISUAL
// //      * =======================================================
// //      */

// //     const width =
// //       key === 'attack'
// //         ? 86
// //         : 78;

// //     const height =
// //       key === 'attack'
// //         ? 78
// //         : 70;

// //     const border =
// //       scene.add
// //         .rectangle(
// //           0,
// //           0,
// //           width,
// //           height,
// //           0x071522,
// //           0.86
// //         )
// //         .setStrokeStyle(
// //           2,
// //           key === 'attack'
// //             ? 0xff4354
// //             : 0x38c8ff,
// //           0.95
// //         );

// //     /*
// //      * Inner ring makes the buttons easier to see
// //      * without making them look like generic HTML
// //      * mobile controls.
// //      */

// //     const inner =
// //       scene.add
// //         .rectangle(
// //           0,
// //           0,
// //           width - 10,
// //           height - 10,
// //           0x06111d,
// //           0.3
// //         )
// //         .setStrokeStyle(
// //           1,
// //           key === 'attack'
// //             ? 0x8c1c2b
// //             : 0x175c7e,
// //           0.8
// //         );

// //     const text =
// //       scene.add
// //         .text(
// //           0,
// //           0,
// //           label,
// //           {
// //             fontFamily:
// //               'Arial',

// //             fontSize:
// //               key === 'attack'
// //                 ? '26px'
// //                 : '30px',

// //             fontStyle:
// //               'bold',

// //             color:
// //               key === 'attack'
// //                 ? '#ff6674'
// //                 : '#dff6ff',

// //             align:
// //               'center',

// //             shadow: {
// //               offsetX: 0,
// //               offsetY: 0,
// //               color:
// //                 key === 'attack'
// //                   ? '#ff3045'
// //                   : '#39caff',
// //               blur: 8,
// //               fill: true,
// //             },
// //           }
// //         )
// //         .setOrigin(0.5);

// //     container.add([
// //       border,
// //       inner,
// //       text,
// //     ]);

// //     /*
// //      * =======================================================
// //      * HIT AREA
// //      * =======================================================
// //      *
// //      * The invisible hit area is slightly larger than
// //      * the visible button.
// //      *
// //      * This is important on phones.
// //      */

// //     const hitArea =
// //       scene.add
// //         .rectangle(
// //           0,
// //           0,
// //           width + 22,
// //           height + 22,
// //           0xffffff,
// //           0.001
// //         )
// //         .setOrigin(0.5)
// //         .setInteractive({
// //           useHandCursor:
// //             false,

// //           draggable:
// //             false,
// //         });

// //     container.add(
// //       hitArea
// //     );

// //     /*
// //      * =======================================================
// //      * POINTER PRESS
// //      * =======================================================
// //      */

// //     const press =
// //       (pointer) => {
// //         pointer
// //           ?.event
// //           ?.preventDefault?.();

// //         if (
// //           !scene ||
// //           scene.finished
// //         ) {
// //           return;
// //         }

// //         /*
// //          * Ignore a pointer if the same pointer
// //          * is already controlling this button.
// //          */

// //         if (
// //           this.pointerAssignments.has(
// //             pointer.id
// //           )
// //         ) {
// //           return;
// //         }

// //         /*
// //          * Assign this specific pointer to
// //          * this specific control.
// //          */

// //         this.pointerAssignments.set(
// //           pointer.id,
// //           key
// //         );

// //         this.state[key] =
// //           true;

// //         if (oneShot) {
// //           this.justPressed[key] =
// //             true;
// //         }

// //         /*
// //          * Visual pressed state.
// //          */

// //         border.setFillStyle(
// //           key === 'attack'
// //             ? 0x44101a
// //             : 0x0d2d40,
// //           0.96
// //         );

// //         inner.setFillStyle(
// //           key === 'attack'
// //             ? 0x310b12
// //             : 0x092335,
// //           0.7
// //         );

// //         text.setScale(
// //           0.9
// //         );

// //         container.setScale(
// //           0.96
// //         );
// //       };

// //     /*
// //      * =======================================================
// //      * POINTER RELEASE
// //      * =======================================================
// //      */

// //     const release =
// //       (pointer) => {
// //         pointer
// //           ?.event
// //           ?.preventDefault?.();

// //         this.releasePointer(
// //           pointer
// //         );

// //         this.resetButtonVisual(
// //           border,
// //           inner,
// //           text,
// //           container
// //         );
// //       };

// //     /*
// //      * =======================================================
// //      * PHASER EVENTS
// //      * =======================================================
// //      */

// //     hitArea.on(
// //       'pointerdown',
// //       press
// //     );

// //     hitArea.on(
// //       'pointerup',
// //       release
// //     );

// //     hitArea.on(
// //       'pointerupoutside',
// //       release
// //     );

// //     hitArea.on(
// //       'pointercancel',
// //       release
// //     );

// //     /*
// //      * =======================================================
// //      * MOUSE POINTEROUT
// //      * =======================================================
// //      *
// //      * Mouse dragging outside a movement button
// //      * should release that button.
// //      *
// //      * Touch pointers are NOT released here because
// //      * the user may temporarily move their finger.
// //      */

// //     hitArea.on(
// //       'pointerout',
// //       (pointer) => {
// //         if (
// //           pointer?.pointerType ===
// //             'mouse' &&
// //           pointer.isDown
// //         ) {
// //           release(pointer);
// //         }
// //       }
// //     );

// //     /*
// //      * =======================================================
// //      * MOUSE POINTEROVER
// //      * =======================================================
// //      *
// //      * Allows normal desktop mouse dragging.
// //      */

// //     hitArea.on(
// //       'pointerover',
// //       (pointer) => {
// //         if (
// //           pointer?.pointerType ===
// //             'mouse' &&
// //           pointer.isDown
// //         ) {
// //           press(pointer);
// //         }
// //       }
// //     );

// //     /*
// //      * =======================================================
// //      * STORE BUTTON
// //      * =======================================================
// //      */

// //     this.buttons.push({
// //       key,

// //       oneShot,

// //       container,

// //       hitArea,

// //       border,

// //       inner,

// //       text,

// //       release,
// //     });
// //   }

// //   /*
// //    * =========================================================
// //    * RESET VISUAL
// //    * =========================================================
// //    */

// //   resetButtonVisual(
// //     border,
// //     inner,
// //     text,
// //     container
// //   ) {
// //     if (
// //       !border ||
// //       !inner ||
// //       !text ||
// //       !container
// //     ) {
// //       return;
// //     }

// //     const isAttack =
// //       border.strokeColor ===
// //       0xff4354;

// //     border.setFillStyle(
// //       0x071522,
// //       0.86
// //     );

// //     inner.setFillStyle(
// //       0x06111d,
// //       0.3
// //     );

// //     text.setScale(
// //       1
// //     );

// //     container.setScale(
// //       1
// //     );
// //   }

// //   /*
// //    * =========================================================
// //    * RELEASE ONE POINTER
// //    * =========================================================
// //    */

// //   releasePointer(
// //     pointer
// //   ) {
// //     if (!pointer) {
// //       return;
// //     }

// //     const pointerId =
// //       pointer.id;

// //     const key =
// //       this.pointerAssignments.get(
// //         pointerId
// //       );

// //     if (!key) {
// //       return;
// //     }

// //     /*
// //      * Remove this pointer assignment.
// //      */

// //     this.pointerAssignments.delete(
// //       pointerId
// //     );

// //     /*
// //      * Determine whether another pointer
// //      * is still holding the same button.
// //      */

// //     let stillHeld =
// //       false;

// //     for (
// //       const assignedKey
// //       of this.pointerAssignments.values()
// //     ) {
// //       if (
// //         assignedKey ===
// //         key
// //       ) {
// //         stillHeld = true;
// //         break;
// //       }
// //     }

// //     /*
// //      * Only release the button if no other
// //      * pointer is holding it.
// //      */

// //     if (!stillHeld) {
// //       this.state[key] =
// //         false;

// //       /*
// //        * One-shot actions are consumed by
// //        * GameScene, so releasing the pointer
// //        * does not need to trigger anything else.
// //        */

// //       const entry =
// //         this.buttons.find(
// //           (item) =>
// //             item.key === key
// //         );

// //       if (entry) {
// //         this.resetButtonVisual(
// //           entry.border,
// //           entry.inner,
// //           entry.text,
// //           entry.container
// //         );
// //       }
// //     }
// //   }

// //   /*
// //    * =========================================================
// //    * CONSUME ONE-SHOT PRESS
// //    * =========================================================
// //    *
// //    * GameScene calls this for:
// //    *
// //    * jump
// //    * attack
// //    */

// //   consumePress(
// //     key
// //   ) {
// //     if (
// //       !this.justPressed[key]
// //     ) {
// //       return false;
// //     }

// //     this.justPressed[key] =
// //       false;

// //     /*
// //      * Jump/attack should not remain held.
// //      */

// //     this.state[key] =
// //       false;

// //     /*
// //      * Remove pointer assignments for this
// //      * one-shot action.
// //      */

// //     for (
// //       const [
// //         pointerId,
// //         assignedKey,
// //       ] of this.pointerAssignments
// //     ) {
// //       if (
// //         assignedKey === key
// //       ) {
// //         this.pointerAssignments.delete(
// //           pointerId
// //         );
// //       }
// //     }

// //     const entry =
// //       this.buttons.find(
// //         (item) =>
// //           item.key === key
// //       );

// //     if (entry) {
// //       this.resetButtonVisual(
// //         entry.border,
// //         entry.inner,
// //         entry.text,
// //         entry.container
// //       );
// //     }

// //     return true;
// //   }

// //   /*
// //    * =========================================================
// //    * RELEASE ALL
// //    * =========================================================
// //    *
// //    * Used only for browser/game focus loss.
// //    */

// //   releaseAll() {
// //     Object.keys(
// //       this.state
// //     ).forEach(
// //       (key) => {
// //         this.state[key] =
// //           false;
// //       }
// //     );

// //     Object.keys(
// //       this.justPressed
// //     ).forEach(
// //       (key) => {
// //         this.justPressed[key] =
// //           false;
// //       }
// //     );

// //     this.pointerAssignments.clear();

// //     this.buttons.forEach(
// //       (entry) => {
// //         this.resetButtonVisual(
// //           entry.border,
// //           entry.inner,
// //           entry.text,
// //           entry.container
// //         );
// //       }
// //     );
// //   }

// //   /*
// //    * =========================================================
// //    * DESTROY
// //    * =========================================================
// //    */

// //   destroy() {
// //     this.releaseAll();

// //     window.removeEventListener(
// //       'blur',
// //       this.boundReleaseAll
// //     );

// //     document.removeEventListener(
// //       'visibilitychange',
// //       this.boundReleaseAll
// //     );

// //     if (
// //       this.scene?.input
// //     ) {
// //       this.scene.input.off(
// //         'gameout',
// //         this.boundGameOut
// //       );

// //       this.scene.input.off(
// //         'pointercancel',
// //         this.boundGameOutPointer
// //       );
// //     }

// //     this.buttons.forEach(
// //       (entry) => {
// //         entry.hitArea?.removeAllListeners();

// //         entry.hitArea?.destroy();

// //         entry.container?.destroy(
// //           true
// //         );
// //       }
// //     );

// //     this.buttons = [];

// //     this.pointerAssignments.clear();

// //     this.scene =
// //       null;
// //   }
// // }

// /*
//  * =========================================================
//  * TECH RUNNER — MOBILE CONTROLS
//  * =========================================================
//  *
//  * Supports:
//  *
//  * - Touch screens
//  * - Mouse
//  * - Multitouch
//  * - Hold LEFT
//  * - Hold RIGHT
//  * - Hold CROUCH
//  * - Tap JUMP
//  * - Tap ATTACK
//  * - Individual pointer tracking
//  * - Global pointer release fallback
//  * - Pointer cancellation
//  * - Browser visibility recovery
//  * - Stale-pointer watchdog
//  *
//  * IMPORTANT:
//  *
//  * Phaser's logical game resolution is:
//  *
//  *     1280 × 720
//  *
//  * These coordinates are therefore logical game
//  * coordinates and Phaser.Scale.FIT handles the
//  * physical mobile screen scaling.
//  *
//  * =========================================================
//  */

// export class MobileControls {
//   constructor(scene) {
//     this.scene =
//       scene;

//     /*
//      * =======================================================
//      * CURRENT CONTROL STATE
//      * =======================================================
//      */

//     this.state = {
//       left: false,
//       right: false,
//       jump: false,
//       crouch: false,
//       attack: false,
//     };

//     /*
//      * =======================================================
//      * ONE-SHOT ACTION STATE
//      * =======================================================
//      *
//      * Jump and attack are not continuous actions.
//      *
//      * They are queued once and consumed once by GameScene.
//      */

//     this.justPressed = {
//       jump: false,
//       attack: false,
//     };

//     /*
//      * =======================================================
//      * BUTTON LIST
//      * =======================================================
//      */

//     this.buttons = [];

//     /*
//      * =======================================================
//      * POINTER ASSIGNMENTS
//      * =======================================================
//      *
//      * Every finger gets its own ID.
//      *
//      * Example:
//      *
//      *     pointer 1 → right
//      *     pointer 2 → jump
//      *
//      * Both controls can remain active simultaneously.
//      *
//      * This prevents one finger from cancelling another.
//      */

//     this.pointerAssignments =
//       new Map();

//     /*
//      * =======================================================
//      * MULTITOUCH
//      * =======================================================
//      *
//      * Phaser has one pointer by default.
//      *
//      * Add three more.
//      *
//      * Total:
//      *
//      *     4 simultaneous pointers
//      *
//      * This is more than enough for:
//      *
//      *     movement + jump + attack
//      */

//     try {
//       scene.input?.addPointer?.(
//         3
//       );
//     } catch {
//       /*
//        * Some Phaser versions may already have enough
//        * pointers. Nothing needs to be done.
//        */
//     }

//     /*
//      * =======================================================
//      * CREATE CONTROLS
//      * =======================================================
//      */

//     /*
//      * LEFT
//      */

//     this.add(
//       scene,
//       92,
//       625,
//       '◀',
//       'left',
//       false
//     );

//     /*
//      * RIGHT
//      */

//     this.add(
//       scene,
//       205,
//       625,
//       '▶',
//       'right',
//       false
//     );

//     /*
//      * CROUCH
//      */

//     this.add(
//       scene,
//       1010,
//       625,
//       '▼',
//       'crouch',
//       false
//     );

//     /*
//      * JUMP
//      */

//     this.add(
//       scene,
//       1120,
//       625,
//       '▲',
//       'jump',
//       true
//     );

//     /*
//      * ATTACK
//      */

//     this.add(
//       scene,
//       1210,
//       625,
//       '●',
//       'attack',
//       true
//     );

//     /*
//      * =======================================================
//      * GLOBAL POINTER RELEASE
//      * =======================================================
//      *
//      * This is extremely important.
//      *
//      * The previous implementation used:
//      *
//      *     pointerup → releaseAll()
//      *
//      * That is incorrect for multitouch.
//      *
//      * If finger 1 released RIGHT while finger 2 was
//      * pressing JUMP, all controls could be cleared.
//      *
//      * Now only the pointer that actually released is
//      * removed.
//      */

//     this.boundPointerUp =
//       (pointer) => {
//         this.releasePointer(
//           pointer
//         );
//       };

//     /*
//      * Some browsers report pointer cancellation instead
//      * of normal pointerup.
//      */

//     this.boundPointerCancel =
//       (pointer) => {
//         this.releasePointer(
//           pointer
//         );
//       };

//     /*
//      * If the pointer completely leaves the game canvas,
//      * release everything as a safety measure.
//      *
//      * This is intentionally different from normal
//      * pointerup.
//      */

//     this.boundGameOut =
//       () => {
//         this.releaseAll();
//       };

//     /*
//      * Register global Phaser pointer events.
//      */

//     scene.input?.on(
//       'pointerup',
//       this.boundPointerUp
//     );

//     scene.input?.on(
//       'pointercancel',
//       this.boundPointerCancel
//     );

//     scene.input?.on(
//       'gameout',
//       this.boundGameOut
//     );

//     /*
//      * =======================================================
//      * BROWSER FOCUS SAFETY
//      * =======================================================
//      *
//      * If Android opens a system UI, notification shade,
//      * browser UI, etc., we must not leave a button stuck.
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
//      * =======================================================
//      * STALE POINTER WATCHDOG
//      * =======================================================
//      *
//      * Some Android/browser combinations can occasionally
//      * miss a pointerup event.
//      *
//      * We therefore inspect all active Phaser pointers
//      * every scene update.
//      *
//      * If our map contains a pointer that is no longer
//      * physically down, it is automatically released.
//      *
//      * This prevents:
//      *
//      *     "I tapped RIGHT once and it kept running."
//      */

//     this.boundSceneUpdate =
//       () => {
//         this.update();
//       };

//     scene.events?.on(
//       'update',
//       this.boundSceneUpdate
//     );
//   }

//   /*
//    * =========================================================
//    * CREATE ONE MOBILE BUTTON
//    * =========================================================
//    */

//   add(
//     scene,
//     x,
//     y,
//     label,
//     key,
//     oneShot = false
//   ) {
//     /*
//      * Attack gets a slightly larger visual button.
//      */

//     const width =
//       key === 'attack'
//         ? 86
//         : 78;

//     const height =
//       key === 'attack'
//         ? 78
//         : 70;

//     /*
//      * =======================================================
//      * CONTAINER
//      * =======================================================
//      */

//     const container =
//       scene.add
//         .container(
//           x,
//           y
//         )
//         .setScrollFactor(0)
//         .setDepth(60);

//     /*
//      * =======================================================
//      * OUTER PANEL
//      * =======================================================
//      */

//     const border =
//       scene.add
//         .rectangle(
//           0,
//           0,
//           width,
//           height,
//           0x071522,
//           0.88
//         )
//         .setStrokeStyle(
//           2,
//           key === 'attack'
//             ? 0xff4354
//             : 0x38c8ff,
//           0.95
//         );

//     /*
//      * =======================================================
//      * INNER PANEL
//      * =======================================================
//      */

//     const inner =
//       scene.add
//         .rectangle(
//           0,
//           0,
//           width - 10,
//           height - 10,
//           0x06111d,
//           0.32
//         )
//         .setStrokeStyle(
//           1,
//           key === 'attack'
//             ? 0x8c1c2b
//             : 0x175c7e,
//           0.8
//         );

//     /*
//      * =======================================================
//      * ICON
//      * =======================================================
//      */

//     const text =
//       scene.add
//         .text(
//           0,
//           0,
//           label,
//           {
//             fontFamily:
//               'Arial',

//             fontSize:
//               key === 'attack'
//                 ? '26px'
//                 : '30px',

//             fontStyle:
//               'bold',

//             color:
//               key === 'attack'
//                 ? '#ff6674'
//                 : '#dff6ff',

//             align:
//               'center',

//             shadow: {
//               offsetX: 0,
//               offsetY: 0,
//               color:
//                 key === 'attack'
//                   ? '#ff3045'
//                   : '#39caff',
//               blur: 8,
//               fill: true,
//             },
//           }
//         )
//         .setOrigin(
//           0.5
//         );

//     container.add([
//       border,
//       inner,
//       text,
//     ]);

//     /*
//      * =======================================================
//      * TOUCH HIT AREA
//      * =======================================================
//      *
//      * The actual touch target is intentionally larger
//      * than the visible button.
//      *
//      * This makes it easier to press on smaller phones.
//      */

//     const hitArea =
//       scene.add
//         .rectangle(
//           0,
//           0,
//           width + 24,
//           height + 24,
//           0xffffff,
//           0.001
//         )
//         .setOrigin(
//           0.5
//         )
//         .setInteractive({
//           useHandCursor:
//             false,

//           draggable:
//             false,
//         });

//     container.add(
//       hitArea
//     );

//     /*
//      * =======================================================
//      * PRESS
//      * =======================================================
//      */

//     const press =
//       (pointer) => {
//         pointer
//           ?.event
//           ?.preventDefault?.();

//         /*
//          * Ignore controls after game end.
//          */

//         if (
//           !this.scene ||
//           this.scene.finished ||
//           this.scene.paused
//         ) {
//           return;
//         }

//         /*
//          * Ignore duplicate pointerdown for the same
//          * physical pointer.
//          */

//         if (
//           this.pointerAssignments.has(
//             pointer.id
//           )
//         ) {
//           return;
//         }

//         /*
//          * Assign this pointer to this button.
//          */

//         this.pointerAssignments.set(
//           pointer.id,
//           key
//         );

//         /*
//          * Set the logical control state.
//          */

//         this.state[key] =
//           true;

//         /*
//          * Queue one-shot actions.
//          */

//         if (
//           oneShot
//         ) {
//           this.justPressed[key] =
//             true;
//         }

//         /*
//          * Pressed visual.
//          */

//         this.setButtonPressed(
//           key,
//           true
//         );
//       };

//     /*
//      * =======================================================
//      * LOCAL RELEASE
//      * =======================================================
//      *
//      * Global pointerup is the important fallback.
//      */

//     const release =
//       (pointer) => {
//         pointer
//           ?.event
//           ?.preventDefault?.();

//         this.releasePointer(
//           pointer
//         );
//       };

//     /*
//      * =======================================================
//      * POINTER DOWN
//      * =======================================================
//      */

//     hitArea.on(
//       'pointerdown',
//       press
//     );

//     /*
//      * =======================================================
//      * POINTER UP
//      * =======================================================
//      */

//     hitArea.on(
//       'pointerup',
//       release
//     );

//     /*
//      * =======================================================
//      * POINTER UP OUTSIDE
//      * =======================================================
//      */

//     hitArea.on(
//       'pointerupoutside',
//       release
//     );

//     /*
//      * =======================================================
//      * POINTER CANCEL
//      * =======================================================
//      */

//     hitArea.on(
//       'pointercancel',
//       release
//     );

//     /*
//      * =======================================================
//      * MOUSE POINTER OUT
//      * =======================================================
//      *
//      * This is only for desktop mouse interaction.
//      *
//      * We intentionally don't do this for touch because
//      * moving a finger outside a small visual button should
//      * not accidentally cancel a touch interaction.
//      */

//     hitArea.on(
//       'pointerout',
//       (pointer) => {
//         if (
//           pointer?.pointerType ===
//             'mouse' &&
//           pointer.isDown
//         ) {
//           release(
//             pointer
//           );
//         }
//       }
//     );

//     /*
//      * =======================================================
//      * MOUSE POINTER OVER
//      * =======================================================
//      */

//     hitArea.on(
//       'pointerover',
//       (pointer) => {
//         if (
//           pointer?.pointerType ===
//             'mouse' &&
//           pointer.isDown
//         ) {
//           press(
//             pointer
//           );
//         }
//       }
//     );

//     /*
//      * =======================================================
//      * STORE BUTTON
//      * =======================================================
//      */

//     this.buttons.push({
//       key,
//       oneShot,
//       container,
//       hitArea,
//       border,
//       inner,
//       text,
//     });
//   }

//   /*
//    * =========================================================
//    * BUTTON VISUAL STATE
//    * =========================================================
//    */

//   setButtonPressed(
//     key,
//     pressed
//   ) {
//     const entry =
//       this.buttons.find(
//         (item) =>
//           item.key === key
//       );

//     if (!entry) {
//       return;
//     }

//     const attack =
//       key === 'attack';

//     /*
//      * PRESSED
//      */

//     if (
//       pressed
//     ) {
//       entry.border.setFillStyle(
//         attack
//           ? 0x44101a
//           : 0x0d2d40,
//         0.96
//       );

//       entry.inner.setFillStyle(
//         attack
//           ? 0x310b12
//           : 0x092335,
//         0.72
//       );

//       entry.text.setScale(
//         0.9
//       );

//       entry.container.setScale(
//         0.96
//       );

//       return;
//     }

//     /*
//      * NORMAL
//      */

//     entry.border.setFillStyle(
//       0x071522,
//       0.88
//     );

//     entry.inner.setFillStyle(
//       0x06111d,
//       0.32
//     );

//     entry.text.setScale(
//       1
//     );

//     entry.container.setScale(
//       1
//     );
//   }

//   /*
//    * =========================================================
//    * RELEASE ONE POINTER
//    * =========================================================
//    */

//   releasePointer(
//     pointer
//   ) {
//     if (!pointer) {
//       return;
//     }

//     this.releasePointerId(
//       pointer.id
//     );
//   }

//   /*
//    * =========================================================
//    * RELEASE POINTER BY ID
//    * =========================================================
//    */

//   releasePointerId(
//     pointerId
//   ) {
//     if (
//       pointerId ===
//         undefined ||
//       pointerId ===
//         null
//     ) {
//       return;
//     }

//     /*
//      * Find which button this pointer controls.
//      */

//     const key =
//       this.pointerAssignments.get(
//         pointerId
//       );

//     /*
//      * Pointer is not assigned.
//      */

//     if (!key) {
//       return;
//     }

//     /*
//      * Remove this pointer only.
//      */

//     this.pointerAssignments.delete(
//       pointerId
//     );

//     /*
//      * =======================================================
//      * CHECK OTHER POINTERS
//      * =======================================================
//      *
//      * Example:
//      *
//      * Finger 1 → RIGHT
//      * Finger 2 → RIGHT
//      *
//      * Finger 1 releases.
//      *
//      * RIGHT must remain active because Finger 2
//      * is still holding it.
//      */

//     let stillHeld =
//       false;

//     for (
//       const assignedKey
//       of this.pointerAssignments.values()
//     ) {
//       if (
//         assignedKey ===
//         key
//       ) {
//         stillHeld =
//           true;

//         break;
//       }
//     }

//     /*
//      * If no other pointer is using the control,
//      * release its logical state.
//      */

//     if (
//       !stillHeld
//     ) {
//       this.state[key] =
//         false;

//       /*
//        * IMPORTANT:
//        *
//        * Don't clear justPressed here.
//        *
//        * A very fast tap can generate pointerup before
//        * the next Phaser update.
//        *
//        * The jump/attack must remain queued until
//        * GameScene consumes it.
//        */

//       this.setButtonPressed(
//         key,
//         false
//       );
//     }
//   }

//   /*
//    * =========================================================
//    * STALE POINTER WATCHDOG
//    * =========================================================
//    *
//    * Android can occasionally miss pointerup during:
//    *
//    * - browser gestures
//    * - system UI
//    * - touch interruption
//    * - rapid finger movement
//    * - browser focus changes
//    *
//    * We check Phaser's actual pointer states.
//    *
//    * If a pointer is recorded as active by us but Phaser
//    * says it is no longer down, we release it.
//    * =========================================================
//    */

//   update() {
//     if (
//       !this.scene ||
//       !this.pointerAssignments.size
//     ) {
//       return;
//     }

//     /*
//      * Phaser's pointer collection.
//      *
//      * In Phaser 3 this contains the active pointers
//      * including the additional pointers added above.
//      */

//     const pointers =
//       this.scene.input
//         ?.manager
//         ?.pointers || [];

//     const activeIds =
//       new Set();

//     /*
//      * Collect pointers that are genuinely still down.
//      */

//     pointers.forEach(
//       (pointer) => {
//         if (
//           pointer &&
//           pointer.isDown
//         ) {
//           activeIds.add(
//             pointer.id
//           );
//         }
//       }
//     );

//     /*
//      * Find stale assignments.
//      */

//     const staleIds =
//       [];

//     for (
//       const pointerId
//       of this.pointerAssignments.keys()
//     ) {
//       if (
//         !activeIds.has(
//           pointerId
//         )
//       ) {
//         staleIds.push(
//           pointerId
//         );
//       }
//     }

//     /*
//      * Release stale pointers.
//      */

//     staleIds.forEach(
//       (pointerId) => {
//         this.releasePointerId(
//           pointerId
//         );
//       }
//     );
//   }

//   /*
//    * =========================================================
//    * CONSUME ONE-SHOT ACTION
//    * =========================================================
//    *
//    * GameScene uses this for:
//    *
//    * - jump
//    * - attack
//    *
//    * Each press is consumed exactly once.
//    * =========================================================
//    */

//   consumePress(
//     key
//   ) {
//     if (
//       !this.justPressed[key]
//     ) {
//       return false;
//     }

//     /*
//      * Consume the queued action.
//      */

//     this.justPressed[key] =
//       false;

//     /*
//      * One-shot action is no longer held.
//      */

//     this.state[key] =
//       false;

//     /*
//      * Remove any pointer assignment for this
//      * one-shot control.
//      */

//     for (
//       const [
//         pointerId,
//         assignedKey,
//       ] of this.pointerAssignments
//     ) {
//       if (
//         assignedKey ===
//         key
//       ) {
//         this.pointerAssignments.delete(
//           pointerId
//         );
//       }
//     }

//     /*
//      * Reset visual.
//      */

//     this.setButtonPressed(
//       key,
//       false
//     );

//     return true;
//   }

//   /*
//    * =========================================================
//    * RELEASE ALL
//    * =========================================================
//    *
//    * This is ONLY for situations where the whole game
//    * loses focus or the canvas interaction becomes invalid.
//    *
//    * It is NOT used for a normal pointerup.
//    * =========================================================
//    */

//   releaseAll() {
//     /*
//      * Reset held state.
//      */

//     Object.keys(
//       this.state
//     ).forEach(
//       (key) => {
//         this.state[key] =
//           false;
//       }
//     );

//     /*
//      * Reset queued actions.
//      */

//     Object.keys(
//       this.justPressed
//     ).forEach(
//       (key) => {
//         this.justPressed[key] =
//           false;
//       }
//     );

//     /*
//      * Remove every pointer assignment.
//      */

//     this.pointerAssignments.clear();

//     /*
//      * Reset every button visual.
//      */

//     this.buttons.forEach(
//       (entry) => {
//         this.setButtonPressed(
//           entry.key,
//           false
//         );
//       }
//     );
//   }

//   /*
//    * =========================================================
//    * DESTROY
//    * =========================================================
//    */

//   destroy() {
//     /*
//      * First clear all states.
//      */

//     this.releaseAll();

//     /*
//      * Remove browser listeners.
//      */

//     window.removeEventListener(
//       'blur',
//       this.boundReleaseAll
//     );

//     document.removeEventListener(
//       'visibilitychange',
//       this.boundReleaseAll
//     );

//     /*
//      * Remove Phaser input listeners.
//      */

//     if (
//       this.scene?.input
//     ) {
//       this.scene.input.off(
//         'pointerup',
//         this.boundPointerUp
//       );

//       this.scene.input.off(
//         'pointercancel',
//         this.boundPointerCancel
//       );

//       this.scene.input.off(
//         'gameout',
//         this.boundGameOut
//       );
//     }

//     /*
//      * Remove scene update listener.
//      */

//     this.scene?.events?.off(
//       'update',
//       this.boundSceneUpdate
//     );

//     /*
//      * Destroy controls.
//      */

//     this.buttons.forEach(
//       (entry) => {
//         entry.hitArea?.removeAllListeners();

//         entry.hitArea?.destroy();

//         entry.container?.destroy(
//           true
//         );
//       }
//     );

//     this.buttons = [];

//     this.pointerAssignments.clear();

//     this.scene =
//       null;
//   }
// }


/*
 * =========================================================
 * TECH RUNNER — MOBILE CONTROLS
 * =========================================================
 *
 * Features:
 *
 * - Android touch
 * - iPhone/iPad touch
 * - Desktop mouse
 * - Multitouch
 * - LEFT / RIGHT hold
 * - CROUCH hold
 * - JUMP tap
 * - ATTACK tap
 * - Individual pointer tracking
 * - Pointer cancellation
 * - Global pointer release fallback
 * - Browser focus recovery
 * - Visibility recovery
 * - Viewport resize recovery
 * - Stale pointer watchdog
 *
 * =========================================================
 */

export class MobileControls {
  constructor(scene) {
    this.scene =
      scene;

    /*
     * -------------------------------------------------------
     * INPUT STATE
     * -------------------------------------------------------
     */

    this.state = {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      attack: false,
    };

    /*
     * -------------------------------------------------------
     * ONE-SHOT INPUT
     * -------------------------------------------------------
     */

    this.justPressed = {
      jump: false,
      attack: false,
    };

    /*
     * -------------------------------------------------------
     * BUTTONS
     * -------------------------------------------------------
     */

    this.buttons = [];

    /*
     * -------------------------------------------------------
     * POINTER -> CONTROL
     * -------------------------------------------------------
     *
     * Example:
     *
     * pointer 1 -> right
     * pointer 2 -> jump
     *
     * Both can remain active.
     */

    this.pointerAssignments =
      new Map();

    /*
     * -------------------------------------------------------
     * ADDITIONAL PHASER POINTERS
     * -------------------------------------------------------
     */

    try {
      scene.input?.addPointer?.(
        3
      );
    } catch {
      /*
       * Already enough pointers.
       */
    }

    /*
     * -------------------------------------------------------
     * CREATE BUTTONS
     * -------------------------------------------------------
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
     * -------------------------------------------------------
     * GLOBAL SAFETY RELEASE
     * -------------------------------------------------------
     */

    this.boundReleaseAll =
      () => {
        this.releaseAll();
      };

    /*
     * Browser focus lost.
     */

    window.addEventListener(
      'blur',
      this.boundReleaseAll
    );

    /*
     * Browser visibility changed.
     */

    document.addEventListener(
      'visibilitychange',
      this.boundReleaseAll
    );

    /*
     * -------------------------------------------------------
     * VIEWPORT RESIZE
     * -------------------------------------------------------
     *
     * Android Chrome can change viewport dimensions when
     * its address bar appears/disappears.
     *
     * We do NOT destroy the controls.
     *
     * We only release stale touches and allow Phaser's
     * Scale Manager to recalculate its canvas.
     */

    this.boundResize =
      () => {
        this.releaseAll();

        /*
         * Phaser will handle the actual canvas resize.
         */
      };

    window.addEventListener(
      'resize',
      this.boundResize,
      {
        passive: true,
      }
    );

    /*
     * -------------------------------------------------------
     * SCREEN ORIENTATION CHANGE
     * -------------------------------------------------------
     */

    this.boundOrientationChange =
      () => {
        this.releaseAll();

        window.setTimeout(
          () => {
            window.dispatchEvent(
              new Event(
                'resize'
              )
            );
          },
          60
        );
      };

    if (
      screen.orientation
    ) {
      screen.orientation.addEventListener(
        'change',
        this.boundOrientationChange
      );
    }

    /*
     * -------------------------------------------------------
     * PHASER POINTER EVENTS
     * -------------------------------------------------------
     */

    this.boundPointerUp =
      (pointer) => {
        this.releasePointer(
          pointer
        );
      };

    this.boundPointerCancel =
      (pointer) => {
        this.releasePointer(
          pointer
        );
      };

    /*
     * DO NOT use releaseAll() on every pointerup.
     *
     * That was one of the original bugs.
     */

    scene.input?.on(
      'pointerup',
      this.boundPointerUp
    );

    scene.input?.on(
      'pointercancel',
      this.boundPointerCancel
    );

    /*
     * -------------------------------------------------------
     * GAME OUT
     * -------------------------------------------------------
     *
     * If the entire pointer leaves the game canvas,
     * release active controls.
     *
     * This does not disable Phaser input.
     */

    this.boundGameOut =
      () => {
        this.releaseAll();
      };

    scene.input?.on(
      'gameout',
      this.boundGameOut
    );

    /*
     * -------------------------------------------------------
     * PHASER UPDATE WATCHDOG
     * -------------------------------------------------------
     *
     * If Android fails to deliver pointerup, this checks
     * the real Phaser pointer state and releases stale
     * assignments.
     */

    this.boundUpdate =
      () => {
        this.update();
      };

    scene.events?.on(
      'update',
      this.boundUpdate
    );
  }

  /*
   * =========================================================
   * CREATE BUTTON
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
    const width =
      key === 'attack'
        ? 86
        : 78;

    const height =
      key === 'attack'
        ? 78
        : 70;

    /*
     * -------------------------------------------------------
     * CONTAINER
     * -------------------------------------------------------
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
     * -------------------------------------------------------
     * OUTER BUTTON
     * -------------------------------------------------------
     */

    const border =
      scene.add
        .rectangle(
          0,
          0,
          width,
          height,
          0x071522,
          0.88
        )
        .setStrokeStyle(
          2,
          key === 'attack'
            ? 0xff4354
            : 0x38c8ff,
          0.95
        );

    /*
     * -------------------------------------------------------
     * INNER PANEL
     * -------------------------------------------------------
     */

    const inner =
      scene.add
        .rectangle(
          0,
          0,
          width - 10,
          height - 10,
          0x06111d,
          0.32
        )
        .setStrokeStyle(
          1,
          key === 'attack'
            ? 0x8c1c2b
            : 0x175c7e,
          0.8
        );

    /*
     * -------------------------------------------------------
     * LABEL
     * -------------------------------------------------------
     */

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
        .setOrigin(
          0.5
        );

    container.add([
      border,
      inner,
      text,
    ]);

    /*
     * -------------------------------------------------------
     * LARGE INVISIBLE TOUCH TARGET
     * -------------------------------------------------------
     */

    const hitArea =
      scene.add
        .rectangle(
          0,
          0,
          width + 26,
          height + 26,
          0xffffff,
          0.001
        )
        .setOrigin(
          0.5
        )
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
     * -------------------------------------------------------
     * PRESS
     * -------------------------------------------------------
     */

    const press =
      (pointer) => {
        pointer
          ?.event
          ?.preventDefault?.();

        if (
          !this.scene ||
          this.scene.finished
        ) {
          return;
        }

        if (
          this.scene.paused
        ) {
          return;
        }

        /*
         * A valid Phaser pointer is required.
         */

        if (
          !pointer ||
          pointer.id ===
            undefined
        ) {
          return;
        }

        /*
         * Prevent duplicate assignment.
         */

        if (
          this.pointerAssignments.has(
            pointer.id
          )
        ) {
          return;
        }

        /*
         * Assign pointer.
         */

        this.pointerAssignments.set(
          pointer.id,
          key
        );

        /*
         * Activate state.
         */

        this.state[key] =
          true;

        /*
         * Queue one-shot actions.
         */

        if (
          oneShot
        ) {
          this.justPressed[key] =
            true;
        }

        /*
         * Visual feedback.
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
          0.72
        );

        text.setScale(
          0.9
        );

        container.setScale(
          0.96
        );
      };

    /*
     * -------------------------------------------------------
     * RELEASE
     * -------------------------------------------------------
     */

    const release =
      (pointer) => {
        pointer
          ?.event
          ?.preventDefault?.();

        this.releasePointer(
          pointer
        );
      };

    /*
     * -------------------------------------------------------
     * POINTER DOWN
     * -------------------------------------------------------
     */

    hitArea.on(
      'pointerdown',
      press
    );

    /*
     * -------------------------------------------------------
     * POINTER UP
     * -------------------------------------------------------
     */

    hitArea.on(
      'pointerup',
      release
    );

    /*
     * -------------------------------------------------------
     * POINTER UP OUTSIDE
     * -------------------------------------------------------
     */

    hitArea.on(
      'pointerupoutside',
      release
    );

    /*
     * -------------------------------------------------------
     * POINTER CANCEL
     * -------------------------------------------------------
     */

    hitArea.on(
      'pointercancel',
      release
    );

    /*
     * -------------------------------------------------------
     * DESKTOP MOUSE SUPPORT
     * -------------------------------------------------------
     */

    hitArea.on(
      'pointerout',
      (pointer) => {
        if (
          pointer?.pointerType ===
            'mouse' &&
          pointer.isDown
        ) {
          release(
            pointer
          );
        }
      }
    );

    hitArea.on(
      'pointerover',
      (pointer) => {
        if (
          pointer?.pointerType ===
            'mouse' &&
          pointer.isDown
        ) {
          press(
            pointer
          );
        }
      }
    );

    /*
     * -------------------------------------------------------
     * STORE
     * -------------------------------------------------------
     */

    this.buttons.push({
      key,
      oneShot,
      container,
      hitArea,
      border,
      inner,
      text,
    });
  }

  /*
   * =========================================================
   * BUTTON VISUAL RESET
   * =========================================================
   */

  resetButtonVisual(
    entry
  ) {
    if (
      !entry
    ) {
      return;
    }

    entry.border?.setFillStyle(
      0x071522,
      0.88
    );

    entry.inner?.setFillStyle(
      0x06111d,
      0.32
    );

    entry.text?.setScale(
      1
    );

    entry.container?.setScale(
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
    if (
      !pointer
    ) {
      return;
    }

    this.releasePointerId(
      pointer.id
    );
  }

  /*
   * =========================================================
   * RELEASE POINTER ID
   * =========================================================
   */

  releasePointerId(
    pointerId
  ) {
    if (
      pointerId ===
        undefined ||
      pointerId ===
        null
    ) {
      return;
    }

    const key =
      this.pointerAssignments.get(
        pointerId
      );

    if (
      !key
    ) {
      return;
    }

    /*
     * Remove only this pointer.
     */

    this.pointerAssignments.delete(
      pointerId
    );

    /*
     * Check whether another pointer is still
     * holding the same control.
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
        stillHeld =
          true;

        break;
      }
    }

    /*
     * Release logical state only when the final
     * pointer using this button is gone.
     */

    if (
      !stillHeld
    ) {
      this.state[key] =
        false;

      const entry =
        this.buttons.find(
          (item) =>
            item.key ===
            key
        );

      this.resetButtonVisual(
        entry
      );
    }
  }

  /*
   * =========================================================
   * STALE POINTER WATCHDOG
   * =========================================================
   */

  update() {
    if (
      !this.scene ||
      this.pointerAssignments.size ===
        0
    ) {
      return;
    }

    const pointers =
      this.scene.input
        ?.manager
        ?.pointers || [];

    const activePointerIds =
      new Set();

    pointers.forEach(
      (pointer) => {
        if (
          pointer &&
          pointer.isDown
        ) {
          activePointerIds.add(
            pointer.id
          );
        }
      }
    );

    const staleIds =
      [];

    for (
      const pointerId
      of this.pointerAssignments.keys()
    ) {
      if (
        !activePointerIds.has(
          pointerId
        )
      ) {
        staleIds.push(
          pointerId
        );
      }
    }

    staleIds.forEach(
      (pointerId) => {
        this.releasePointerId(
          pointerId
        );
      }
    );
  }

  /*
   * =========================================================
   * CONSUME ONE-SHOT ACTION
   * =========================================================
   */

  consumePress(
    key
  ) {
    if (
      !this.justPressed[key]
    ) {
      return false;
    }

    /*
     * Consume the action.
     */

    this.justPressed[key] =
      false;

    /*
     * Jump / attack are one-shot actions.
     */

    this.state[key] =
      false;

    /*
     * Remove any pointer assignments for
     * this one-shot control.
     */

    for (
      const [
        pointerId,
        assignedKey,
      ] of this.pointerAssignments
    ) {
      if (
        assignedKey ===
        key
      ) {
        this.pointerAssignments.delete(
          pointerId
        );
      }
    }

    const entry =
      this.buttons.find(
        (item) =>
          item.key ===
          key
      );

    this.resetButtonVisual(
      entry
    );

    return true;
  }

  /*
   * =========================================================
   * RELEASE EVERYTHING
   * =========================================================
   *
   * Only used for:
   *
   * - blur
   * - visibility change
   * - resize
   * - orientation change
   * - gameout
   * - explicit cleanup
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
          entry
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
    /*
     * Release all active controls first.
     */

    this.releaseAll();

    /*
     * Browser listeners.
     */

    window.removeEventListener(
      'blur',
      this.boundReleaseAll
    );

    window.removeEventListener(
      'resize',
      this.boundResize
    );

    document.removeEventListener(
      'visibilitychange',
      this.boundReleaseAll
    );

    /*
     * Orientation listener.
     */

    if (
      screen.orientation
    ) {
      screen.orientation.removeEventListener(
        'change',
        this.boundOrientationChange
      );
    }

    /*
     * Phaser listeners.
     */

    if (
      this.scene?.input
    ) {
      this.scene.input.off(
        'pointerup',
        this.boundPointerUp
      );

      this.scene.input.off(
        'pointercancel',
        this.boundPointerCancel
      );

      this.scene.input.off(
        'gameout',
        this.boundGameOut
      );
    }

    /*
     * Scene update listener.
     */

    this.scene?.events?.off(
      'update',
      this.boundUpdate
    );

    /*
     * Destroy buttons.
     */

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