import Phaser from 'phaser';
export class PreloadScene extends Phaser.Scene { constructor(){super('PreloadScene');} preload(){const cfg=this.registry.get('levelConfig');if(cfg?.background)this.load.image('level-background',cfg.background);this.load.on('loaderror',()=>console.warn('[Tech Runner] Optional asset failed; generated visuals will be used.'));} create(){this.scene.start('GameScene');} }
