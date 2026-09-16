import Phaser from 'phaser';
export class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene,x,y){Coin.createTexture(scene);super(scene,x,y,'tr-coin');scene.add.existing(this);scene.physics.add.existing(this);this.body.setAllowGravity(false);this.setDepth(8);this.startY=y;}
  preUpdate(time,delta){super.preUpdate(time,delta);this.y=this.startY+Math.sin(time/260+this.x/80)*8;this.angle+=3;}
  static createTexture(scene){if(scene.textures.exists('tr-coin'))return;const g=scene.add.graphics();g.fillStyle(0xf7c948,1).lineStyle(3,0xfff0a6,1).fillCircle(14,14,12).strokeCircle(14,14,12);g.fillStyle(0x7c5100,1).fillCircle(14,14,4);g.generateTexture('tr-coin',28,28);g.destroy();}
}
