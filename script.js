const { gsap, gsap: { to, timeline, set, delayedCall }, Splitting } = window;
Splitting();

const BTN = document.querySelector('.birthday-button__button');
const SOUNDS = {
  CHEER: new Audio('https://s3-us-west-2.amazonaws.com/cdpn/sfx/cheer.mp3'),
  MATCH: new Audio('https://s3-us-west-2.amazonaws.com/cdpn/sfx/match.mp3'),
  TUNE: new Audio('https://s3-us-west-2.amazonaws.com/cdpn/sfx/happy-birthday.mp3'),
  ON: new Audio('https://assets.codepen.io/605876/switch-on.mp3'),
  BLOW: new Audio('https://s3-us-west-2.amazonaws.com/cdpn/sfx/blow-out.mp3'),
  POP: new Audio('https://s3-us-west-2.amazonaws.com/cdpn/sfx/pop.mp3'),
  HORN: new Audio('https://s3-us-west-2.amazonaws.com/cdpn/sfx/horn.mp3')
};

const EYES = document.querySelector('.cake__eyes');
const BLINK = eyes => {
  gsap.set(eyes, { scaleY: 1 });
  if (eyes.BLINK_TL) eyes.BLINK_TL.kill();
  eyes.BLINK_TL = gsap.timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => BLINK(eyes)
  });
  eyes.BLINK_TL.to(eyes, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1
  });
};
BLINK(EYES);

const FROSTING_TL = () =>
  timeline().to('#frosting', {
    scaleX: 1.05,
    scaleY: 1.2,
    duration: 1,
    ease: "elastic.out(1, 0.3)"
  });

const SPRINKLES_TL = () =>
  timeline().to('.cake__sprinkle', {
    scale: 1,
    duration: 0.06,
    stagger: 0.02
  });

const SPIN_TL = () =>
  timeline()
    .set('.cake__frosting-patch', { display: 'block' })
    .to(['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'], { x: 0, duration: 1 }, 0)
    .to(['.cake__frosting--start', '.cake__sprinkles--initial'], { x: 65, duration: 1 }, 0)
    .to('.cake__face', { x: -48.82, duration: 1 }, 0);

const flickerSpeed = 0.1;
const FLICKER_TL = timeline({ repeat: -1, yoyo: true });
FLICKER_TL.to('.candle__flame-outer', {
  duration: flickerSpeed,
  scaleY: 0.95,
  scaleX: 1.05,
  transformOrigin: '50% 50%'
});
FLICKER_TL.to('.candle__flame-inner', {
  duration: flickerSpeed,
  scaleY: 1.05,
  scaleX: 0.95,
  transformOrigin: '50% 50%'
}, 0);
FLICKER_TL.pause();

const SHAKE_TL = () =>
  timeline({ delay: 0.5 })
    .set('.cake__face', { display: 'none' })
    .set('.cake__face--straining', { display: 'block' })
    .to('.birthday-button', {
      x: 1, y: 1, repeat: 13, duration: 0.1,
      onComplete: () => {
        set('.cake__face--straining', { display: 'none' });
        set('.cake__face', { display: 'block' });
      }
    }, 0)
    .to('.cake__candle', {
      scaleY: 1,
      duration: 0.2,
      stagger: 0.2,
      onStart: () => {
        SOUNDS.POP.play();
        delayedCall(0.2, () => SOUNDS.POP.play());
        delayedCall(0.4, () => SOUNDS.POP.play());
      },
      onComplete: () => FLICKER_TL.play()
    }, 0.2);

const FLAME_TL = () =>
  timeline()
    .to('.cake__candle', { '--flame': 1, stagger: 0.2, duration: 0.1 })
    .to('body', { '--flame': 1, '--lightness': 5, duration: 0.2, delay: 0.2 });

const LIGHTS_OUT = () =>
  timeline().to('body', {
    onStart: () => SOUNDS.BLOW.play(),
    delay: 0.5,
    '--lightness': 0,
    duration: 0.1,
    '--glow-saturation': 0,
    '--glow-lightness': 0,
    '--glow-alpha': 1,
    '--transparency-alpha': 1
  });

const RESET = () => {
  set('.char', {
    '--hue': () => Math.random() * 360,
    '--char-sat': 0,
    '--char-light': 0,
    x: 0,
    y: 0,
    opacity: 1
  });

  set('body', {
    '--frosting-hue': Math.random() * 360,
    '--glow-saturation': 50,
    '--glow-lightness': 35,
    '--glow-alpha': 0.4,
    '--transparency-alpha': 0,
    '--flame': 0
  });

  set('.cake__candle', { '--flame': 0 });
  to('body', { '--lightness': 50, duration: 0.25 });

  set('.cake__frosting--end', { opacity: 0 });
  set('#frosting', { transformOrigin: '50% 10%', scaleX: 0, scaleY: 0 });
  set('.cake__frosting-patch', { display: 'none' });
  set(['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'], { x: -65 });
  set('.cake__face', { x: -110 });
  set('.cake__face--straining', { display: 'none' });
  set('.cake__sprinkle', {
    '--sprinkle-hue': () => Math.random() * 360,
    scale: 0,
    transformOrigin: '50% 50%'
  });

  set('.birthday-button', { scale: 0.6, x: 0, y: 0 });
  set('.birthday-button__cake', { display: 'none' });
  set('.cake__candle', { scaleY: 0, transformOrigin: '50% 100%' });

  FLICKER_TL.pause(0);
};
RESET();

const MASTER_TL = timeline({
  paused: true,
  onStart: () => SOUNDS.ON.play(),
  onComplete: () => {
    delayedCall(2, RESET);
    BTN.removeAttribute('disabled');
  }
})
  .set('.birthday-button__cake', { display: 'block' })
  .to('.birthday-button', { scale: 1, duration: 0.2, onStart: () => SOUNDS.CHEER.play() })
  .to('.char', { '--char-sat': 70, '--char-light': 65, duration: 0.2 }, 0)
  .to('.char', {
    y: () => gsap.utils.random(-100, -200),
    x: () => gsap.utils.random(-50, 50),
    delay: 0.75,
    duration: () => gsap.utils.random(0.5, 1),
    onStart: () => SOUNDS.HORN.play()
  })
  .to('.char', { opacity: 0, duration: 0.25 }, '>-0.5')
  .add(FROSTING_TL())
  .add(SPRINKLES_TL())
  .add(SPIN_TL())
  .add(SHAKE_TL())
  .add(FLAME_TL(), 'FLAME_ON')
  .add(LIGHTS_OUT(), 'LIGHTS_OUT');

// Không dùng onended → dùng delay chắc chắn hơn
MASTER_TL.addPause('FLAME_ON', () => {
  SOUNDS.MATCH.currentTime = 0;
  SOUNDS.MATCH.play();
  delayedCall(1.5, () => MASTER_TL.play());
});
MASTER_TL.addPause('LIGHTS_OUT', () => {
  SOUNDS.TUNE.currentTime = 0;
  SOUNDS.TUNE.play();
  delayedCall(6, () => MASTER_TL.play());
});

BTN.addEventListener('click', () => {
  BTN.setAttribute('disabled', true);
  MASTER_TL.restart();
});

// Toggle âm thanh theo trạng thái checkbox
document.querySelector('#volume').addEventListener('input', (e) => {
  const muted = !e.target.checked;
  Object.values(SOUNDS).forEach(sound => sound.muted = muted);
});
