type RoomAudio = {
  start: () => Promise<void>;
  stop: () => void;
  dispose: () => void;
};

function makeNoiseBuffer(ctx: AudioContext) {
  const length = Math.floor(ctx.sampleRate * 2.4);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  return buffer;
}

function playPiano(ctx: AudioContext, dest: GainNode) {
  const notes = [196.0, 220.0, 261.63, 293.66, 329.63];
  const freq = notes[Math.floor(Math.random() * notes.length)] ?? 220;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = "sine";
  osc.frequency.value = freq;
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.028, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  osc.start(now);
  osc.stop(now + 3);
  osc.onended = () => {
    try {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
    } catch {
      /* ignore */
    }
  };
}

export function createRoomAudio(): RoomAudio {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let rain: AudioBufferSourceNode | null = null;
  let hum: OscillatorNode | null = null;
  let pianoTimer: number | null = null;
  let stopped = true;

  function schedulePiano() {
    if (stopped || !ctx || !master) return;
    const wait = 15000 + Math.random() * 16000;
    pianoTimer = window.setTimeout(() => {
      if (stopped || !ctx || !master) return;
      playPiano(ctx, master);
      schedulePiano();
    }, wait);
  }

  return {
    async start() {
      if (!ctx) {
        ctx = new AudioContext();
      }
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      stopped = false;
      master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);
      master.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.4);

      const noise = ctx.createBufferSource();
      noise.buffer = makeNoiseBuffer(ctx);
      noise.loop = true;
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "bandpass";
      rainFilter.frequency.value = 920;
      rainFilter.Q.value = 0.55;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.085;
      noise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(master);
      noise.start();
      rain = noise;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 52;
      const humGain = ctx.createGain();
      humGain.gain.value = 0.012;
      osc.connect(humGain);
      humGain.connect(master);
      osc.start();
      hum = osc;

      schedulePiano();
    },
    stop() {
      stopped = true;
      if (pianoTimer !== null) {
        window.clearTimeout(pianoTimer);
        pianoTimer = null;
      }
      if (ctx && master) {
        try {
          master.gain.cancelScheduledValues(ctx.currentTime);
          master.gain.setValueAtTime(master.gain.value || 0.001, ctx.currentTime);
          master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.1);
        } catch {
          /* ignore */
        }
      }
      window.setTimeout(() => {
        try {
          rain?.stop();
          hum?.stop();
          rain?.disconnect();
          hum?.disconnect();
          master?.disconnect();
        } catch {
          /* ignore */
        }
        rain = null;
        hum = null;
        master = null;
        void ctx?.suspend();
      }, 1200);
    },
    dispose() {
      this.stop();
      const old = ctx;
      ctx = null;
      window.setTimeout(() => {
        void old?.close();
      }, 1400);
    },
  };
}
