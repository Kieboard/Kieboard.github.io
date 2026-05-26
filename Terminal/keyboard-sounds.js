// Simple keyboard click sounds for Terminal

const KeyboardSounds = {
  enabled: true,
  sounds: [],
  index: 0,

  init() {
    // Load 4 keyboard click sounds
    const files = [
      'Terminal/sounds/keyboard/key-1.mp3',
      'Terminal/sounds/keyboard/key-2.mp3',
      'Terminal/sounds/keyboard/key-3.mp3',
      'Terminal/sounds/keyboard/key-4.mp3'
    ];

    files.forEach(file => {
      const audio = new Audio(file);
      audio.volume = 0.5;
      this.sounds.push(audio);
    });

    // Listen for keystrokes in terminal
    const input = document.getElementById('cmd-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
          this.play();
        }
      });
    }

    // Set up mute button
    this.setupMuteButton();
  },

  play() {
    if (!this.enabled || this.sounds.length === 0) return;

    const sound = this.sounds[this.index];
    this.index = (this.index + 1) % this.sounds.length;

    sound.currentTime = 0;
    sound.play().catch(() => {});
  },

  setupMuteButton() {
    const btn = document.getElementById('term-mute-btn');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    const btn = document.getElementById('term-mute-btn');
    if (btn) {
      if (this.enabled) {
        btn.classList.remove('muted');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        btn.title = 'Mute sound';
      } else {
        btn.classList.add('muted');
        btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        btn.title = 'Unmute sound';
      }
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => KeyboardSounds.init());
} else {
  KeyboardSounds.init();
}
