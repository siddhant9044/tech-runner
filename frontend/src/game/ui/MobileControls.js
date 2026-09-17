export class MobileControls {
  constructor(scene) {
    this.scene = scene;

    this.state = {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      attack: false,
    };

    this.justPressed = {
      jump: false,
      attack: false,
    };

    this.buttons = [];
    this.pointerAssignments = new Map();

    try {
      scene.input?.addPointer?.(3);
    } catch {
      // Phaser may already have enough pointers.
    }

    this.add(scene, 92, 625, "◀", "left", false);
    this.add(scene, 205, 625, "▶", "right", false);

    this.add(scene, 1010, 625, "▼", "crouch", false);
    this.add(scene, 1120, 625, "▲", "jump", true);
    this.add(scene, 1210, 625, "●", "attack", true);

    this.boundWindowPointerUp = (event) => {
      this.releasePointerId(event?.pointerId);
    };

    this.boundWindowPointerCancel = (event) => {
      this.releasePointerId(event?.pointerId);
    };

    this.boundWindowBlur = () => {
      this.releaseAll();
    };

    this.boundVisibilityChange = () => {
      if (document.hidden) {
        this.releaseAll();
      }
    };

    window.addEventListener(
      "pointerup",
      this.boundWindowPointerUp,
      { passive: true }
    );

    window.addEventListener(
      "pointercancel",
      this.boundWindowPointerCancel,
      { passive: true }
    );

    window.addEventListener(
      "blur",
      this.boundWindowBlur
    );

    document.addEventListener(
      "visibilitychange",
      this.boundVisibilityChange
    );

    this.boundPointerUp = (pointer) => {
      this.releasePointer(pointer);
    };

    this.boundPointerCancel = (pointer) => {
      this.releasePointer(pointer);
    };

    scene.input?.on(
      "pointerup",
      this.boundPointerUp
    );

    scene.input?.on(
      "pointercancel",
      this.boundPointerCancel
    );

    this.canvas = scene.game?.canvas || null;

    this.boundCanvasPointerDown = (event) => {
      this.handleDomPointerDown(event);
    };

    this.boundCanvasPointerUp = (event) => {
      this.releasePointerId(event?.pointerId);
    };

    this.boundCanvasPointerCancel = (event) => {
      this.releasePointerId(event?.pointerId);
    };

    this.boundCanvasPointerLeave = (event) => {
      if (event?.pointerType === "mouse") {
        this.releasePointerId(event?.pointerId);
      }
    };

    if (this.canvas) {
      this.canvas.addEventListener(
        "pointerdown",
        this.boundCanvasPointerDown,
        { passive: false }
      );

      this.canvas.addEventListener(
        "pointerup",
        this.boundCanvasPointerUp,
        { passive: false }
      );

      this.canvas.addEventListener(
        "pointercancel",
        this.boundCanvasPointerCancel,
        { passive: false }
      );

      this.canvas.addEventListener(
        "pointerleave",
        this.boundCanvasPointerLeave,
        { passive: true }
      );
    }

    this.boundUpdate = () => {
      this.update();
    };

    scene.events?.on(
      "update",
      this.boundUpdate
    );
  }

  add(
    scene,
    x,
    y,
    label,
    key,
    oneShot = false
  ) {
    const width = key === "attack" ? 86 : 78;
    const height = key === "attack" ? 78 : 70;

    const container = scene.add
      .container(x, y)
      .setScrollFactor(0)
      .setDepth(60);

    const border = scene.add
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
        key === "attack"
          ? 0xff4354
          : 0x38c8ff,
        0.95
      );

    const inner = scene.add
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
        key === "attack"
          ? 0x8c1c2b
          : 0x175c7e,
        0.8
      );

    const text = scene.add
      .text(
        0,
        0,
        label,
        {
          fontFamily: "Arial",
          fontSize:
            key === "attack"
              ? "26px"
              : "30px",
          fontStyle: "bold",
          color:
            key === "attack"
              ? "#ff6674"
              : "#dff6ff",
          align: "center",
          shadow: {
            offsetX: 0,
            offsetY: 0,
            color:
              key === "attack"
                ? "#ff3045"
                : "#39caff",
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

    const hitArea = scene.add
      .rectangle(
        0,
        0,
        width + 26,
        height + 26,
        0xffffff,
        0.001
      )
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: false,
        draggable: false,
      });

    container.add(hitArea);

    const entry = {
      key,
      oneShot,
      container,
      hitArea,
      border,
      inner,
      text,
      x,
      y,
      width: width + 26,
      height: height + 26,
    };

    const press = (pointer) => {
      pointer?.event?.preventDefault?.();

      if (
        !this.scene ||
        !this.scene.sys?.isActive?.() ||
        this.scene.finished ||
        this.scene.paused
      ) {
        return;
      }

      if (
        !pointer ||
        pointer.id === undefined ||
        pointer.id === null
      ) {
        return;
      }

      if (
        this.pointerAssignments.has(
          pointer.id
        )
      ) {
        return;
      }

      this.pointerAssignments.set(
        pointer.id,
        key
      );

      this.state[key] = true;

      if (oneShot) {
        this.justPressed[key] = true;
      }

      this.setButtonPressed(
        entry,
        true
      );
    };

    const release = (pointer) => {
      pointer?.event?.preventDefault?.();
      this.releasePointer(pointer);
    };

    hitArea.on(
      "pointerdown",
      press
    );

    hitArea.on(
      "pointerup",
      release
    );

    hitArea.on(
      "pointerupoutside",
      release
    );

    hitArea.on(
      "pointercancel",
      release
    );

    hitArea.on(
      "pointerout",
      (pointer) => {
        if (
          pointer?.pointerType === "mouse" &&
          pointer.isDown
        ) {
          release(pointer);
        }
      }
    );

    hitArea.on(
      "pointerover",
      (pointer) => {
        if (
          pointer?.pointerType === "mouse" &&
          pointer.isDown
        ) {
          press(pointer);
        }
      }
    );

    this.buttons.push(entry);
  }

  setButtonPressed(entry, pressed) {
    if (!entry) {
      return;
    }

    if (pressed) {
      entry.border?.setFillStyle(
        entry.key === "attack"
          ? 0x44101a
          : 0x0d2d40,
        0.96
      );

      entry.inner?.setFillStyle(
        entry.key === "attack"
          ? 0x310b12
          : 0x092335,
        0.72
      );

      entry.text?.setScale(0.9);
      entry.container?.setScale(0.96);
      return;
    }

    this.resetButtonVisual(entry);
  }

  resetButtonVisual(entry) {
    if (!entry) {
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

    entry.text?.setScale(1);
    entry.container?.setScale(1);
  }

  getLogicalPointerPosition(event) {
    const canvas = this.canvas;

    if (!canvas || !event) {
      return null;
    }

    const rect =
      canvas.getBoundingClientRect();

    if (
      !rect.width ||
      !rect.height
    ) {
      return null;
    }

    return {
      x:
        ((event.clientX - rect.left) /
          rect.width) *
        1280,

      y:
        ((event.clientY - rect.top) /
          rect.height) *
        720,
    };
  }

  findButtonAt(x, y) {
    return this.buttons.find(
      (entry) =>
        x >=
          entry.x -
            entry.width / 2 &&
        x <=
          entry.x +
            entry.width / 2 &&
        y >=
          entry.y -
            entry.height / 2 &&
        y <=
          entry.y +
            entry.height / 2
    );
  }

  handleDomPointerDown(event) {
    if (
      !this.scene ||
      !this.scene.sys?.isActive?.() ||
      this.scene.finished ||
      this.scene.paused
    ) {
      return;
    }

    if (
      !event ||
      event.pointerId === undefined ||
      event.pointerId === null
    ) {
      return;
    }

    if (
      this.pointerAssignments.has(
        event.pointerId
      )
    ) {
      event.preventDefault?.();
      return;
    }

    const position =
      this.getLogicalPointerPosition(
        event
      );

    if (!position) {
      return;
    }

    const entry =
      this.findButtonAt(
        position.x,
        position.y
      );

    if (!entry) {
      return;
    }

    event.preventDefault?.();

    this.pointerAssignments.set(
      event.pointerId,
      entry.key
    );

    this.state[entry.key] = true;

    if (entry.oneShot) {
      this.justPressed[entry.key] =
        true;
    }

    this.setButtonPressed(
      entry,
      true
    );

    try {
      this.canvas?.setPointerCapture?.(
        event.pointerId
      );
    } catch {
      // Pointer capture is optional.
    }
  }

  releasePointer(pointer) {
    if (!pointer) {
      return;
    }

    this.releasePointerId(
      pointer.id
    );
  }

  releasePointerId(pointerId) {
    if (
      pointerId === undefined ||
      pointerId === null
    ) {
      return;
    }

    const key =
      this.pointerAssignments.get(
        pointerId
      );

    if (!key) {
      return;
    }

    this.pointerAssignments.delete(
      pointerId
    );

    let stillHeld = false;

    for (
      const assignedKey of
      this.pointerAssignments.values()
    ) {
      if (assignedKey === key) {
        stillHeld = true;
        break;
      }
    }

    if (!stillHeld) {
      this.state[key] = false;

      const entry =
        this.buttons.find(
          (item) =>
            item.key === key
        );

      this.resetButtonVisual(entry);
    }
  }

  update() {
    if (
      !this.scene ||
      this.pointerAssignments.size === 0
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

    const staleIds = [];

    for (
      const pointerId of
      this.pointerAssignments.keys()
    ) {
      if (
        !activePointerIds.has(
          pointerId
        )
      ) {
        const pointer =
          pointers.find?.(
            (item) =>
              item?.id === pointerId
          );

        if (
          pointer &&
          pointer.pointerType ===
            "mouse"
        ) {
          staleIds.push(
            pointerId
          );
        }
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

  consumePress(key) {
    if (!this.justPressed[key]) {
      return false;
    }

    this.justPressed[key] = false;
    this.state[key] = false;

    for (
      const [
        pointerId,
        assignedKey,
      ] of this.pointerAssignments
    ) {
      if (assignedKey === key) {
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

    this.resetButtonVisual(entry);

    return true;
  }

  releaseAll() {
    Object.keys(
      this.state
    ).forEach(
      (key) => {
        this.state[key] = false;
      }
    );

    Object.keys(
      this.justPressed
    ).forEach(
      (key) => {
        this.justPressed[key] = false;
      }
    );

    this.pointerAssignments.clear();

    this.buttons.forEach(
      (entry) => {
        this.resetButtonVisual(entry);
      }
    );
  }

  destroy() {
    this.releaseAll();

    window.removeEventListener(
      "pointerup",
      this.boundWindowPointerUp
    );

    window.removeEventListener(
      "pointercancel",
      this.boundWindowPointerCancel
    );

    window.removeEventListener(
      "blur",
      this.boundWindowBlur
    );

    document.removeEventListener(
      "visibilitychange",
      this.boundVisibilityChange
    );

    if (this.canvas) {
      this.canvas.removeEventListener(
        "pointerdown",
        this.boundCanvasPointerDown
      );

      this.canvas.removeEventListener(
        "pointerup",
        this.boundCanvasPointerUp
      );

      this.canvas.removeEventListener(
        "pointercancel",
        this.boundCanvasPointerCancel
      );

      this.canvas.removeEventListener(
        "pointerleave",
        this.boundCanvasPointerLeave
      );
    }

    if (this.scene?.input) {
      this.scene.input.off(
        "pointerup",
        this.boundPointerUp
      );

      this.scene.input.off(
        "pointercancel",
        this.boundPointerCancel
      );
    }

    this.scene?.events?.off(
      "update",
      this.boundUpdate
    );

    this.buttons.forEach(
      (entry) => {
        entry.hitArea?.removeAllListeners();
        entry.hitArea?.destroy();
        entry.container?.destroy(true);
      }
    );

    this.buttons = [];
    this.pointerAssignments.clear();
    this.scene = null;
    this.canvas = null;
  }
}