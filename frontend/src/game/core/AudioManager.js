export class AudioManager {
  static muted = localStorage.getItem('techRunnerMuted') === 'true';
  static ctx = null;
  static toggle() { this.muted = !this.muted; localStorage.setItem('techRunnerMuted', String(this.muted)); return this.muted; }
  static resume() { if (!this.ctx) this.ctx = new AudioContext(); if (this.ctx.state === 'suspended') this.ctx.resume(); }
  static play(type) { if (this.muted) return; this.resume(); const presets = { jump:[300,650,.16,'sine'], coin:[700,1100,.12,'triangle'], hit:[160,60,.2,'square'], complete:[440,880,.45,'sine'], bossHit:[220,80,.15,'sawtooth'], bossShoot:[120,70,.2,'triangle'], defeat:[520,45,.8,'sawtooth'] }; const p = presets[type] || presets.coin; const now=this.ctx.currentTime; const o=this.ctx.createOscillator(); const g=this.ctx.createGain(); o.type=p[3]; o.frequency.setValueAtTime(p[0],now); o.frequency.exponentialRampToValueAtTime(p[1],now+p[2]); g.gain.setValueAtTime(.0001,now); g.gain.exponentialRampToValueAtTime(.08,now+.01); g.gain.exponentialRampToValueAtTime(.0001,now+p[2]); o.connect(g).connect(this.ctx.destination); o.start(now); o.stop(now+p[2]+.02); }
}
