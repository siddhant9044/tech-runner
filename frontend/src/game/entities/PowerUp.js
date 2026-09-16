import Phaser from 'phaser';
export class PowerUp extends Phaser.Physics.Arcade.Sprite {
 constructor(scene,x,y,type='shield'){PowerUp.createTexture(scene,type);super(scene,x,y,`power-${type}`);scene.add.existing(this);scene.physics.add.existing(this);this.body.setAllowGravity(false);this.setDepth(8);this.startY=y;this.type=type;}
 preUpdate(time,delta){super.preUpdate(time,delta);this.y=this.startY+Math.sin(time/300)*10;this.angle+=1.5;}
 static createTexture(scene,type){const key=`power-${type}`;if(scene.textures.exists(key))return;const g=scene.add.graphics();g.fillStyle(type==='shield'?0x36b8ff:type==='boost'?0x7ee787:0xffc857,1).lineStyle(3,0xf4f4f4,1).fillCircle(18,18,16).strokeCircle(18,18,16);g.fillStyle(0x07111d,1).fillCircle(18,18,7);g.generateTexture(key,36,36);g.destroy();}
}
