import Phaser from 'phaser';
export function intersects(a, b) { return Phaser.Geom.Intersects.RectangleToRectangle(a.getBounds(), b.getBounds()); }
