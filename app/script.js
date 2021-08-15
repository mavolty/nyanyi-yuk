// Color Thief
import ColorThief from './dist/color-thief.mjs';

const colorThief = new ColorThief();
const displayImg = document.querySelector('img');

// Get Element
const music = document.querySelector('audio');
const volumeBtn = document.getElementById('js-volume');
const playBtn = document.getElementById('js-play');
const pauseBtn = document.getElementById('js-pause');
const prevBtn = document.getElementById('js-prev');
const nextBtn = document.getElementById('js-next');
const repeatBtn = document.getElementById('js-repeat');
const libraryBtn = document.getElementById('js-btn-lib');
const playerContainer = document.querySelector('.player__song-wrapper');
const volumeBar = document.getElementById('js-volume-bar');
const volumeIcon = document.querySelector('.controls__icon');
const displayVolume = document.querySelector('.controls__volume');
const displayBackground = document.querySelector('body');
const displayPlayerImg = document.querySelector('.player__img');
const displayTitle = document.querySelector('.player__song');
const displayArtist = document.querySelector('.player__artist');
const displayProgress = document.getElementById('js-progress');
const displayProgressEl = document.getElementById('js-progress-el');
const displayCurrentTime = document.querySelector('.progress__current-time');
const displayDuration = document.querySelector('.progress__end-time');
const displayLibrary = document.querySelector('.library');
const app = document.querySelector('.app');

displayImg.addEventListener('load', function () {
  const primaryCol = colorThief.getColor(displayImg);
  const secondaryCol = colorThief.getPalette(displayImg)[1];
  const [firstCol, secondCol, thirdCol] = primaryCol;
  const [firstSecCol, secondSecCol, thirdSecCol] = secondaryCol;
  displayBackground.style.background = `linear-gradient(to right top, rgb(${firstCol}, ${secondCol}, ${thirdCol}) 0%, rgb(${firstSecCol}, ${secondSecCol}, ${thirdSecCol}) 100%)`;
  libraryBtn.style.color = `rgb(${firstCol}, ${secondCol}, ${thirdCol})`;
});

class Songs {
  constructor(name, title, artist) {
    this.name = name;
    this.title = title;
    this.artist = artist;
  }
}

let isPlaying = false;

let drunk = new Songs('drunk', 'drunk', 'Keshi');
let tooSoon = new Songs('tooSoon', '2 soon', 'Keshi');
let blue = new Songs('blue', 'blue', 'Keshi');
let itKillsMe = new Songs('itKillsMe', 'it kills me', 'Keshi');
let bandaids = new Songs('bandaids', 'bandaids', 'Keshi');

let songs = [drunk, tooSoon, blue, itKillsMe, bandaids];

let startIndex = 0;

function playSong() {
  isPlaying = true;
  pauseBtn.classList.add('show');
  playBtn.classList.add('hide');
  music.play();
  displayPlayerImg.classList.remove('playing');
  setTimeout(() => {
    displayPlayerImg.classList.add('playing');
  }, 100);
}

function pauseSong() {
  displayPlayerImg.classList.remove('playing');
  isPlaying = false;
  pauseBtn.classList.remove('show');
  playBtn.classList.remove('hide');
  music.pause();
}

function loadSong(song) {
  displayImg.setAttribute('src', `img/${song.title}.jpg`);
  music.setAttribute('src', `music/${song.title}.mp3`);
  playerContainer.dataset.name = song.name;
  displayTitle.textContent = song.title;
  displayArtist.textContent = song.artist;
}

function prevSong() {
  startIndex--;
  if (startIndex < 0) {
    startIndex = songs.length - 1;
  }
  loadSong(songs[startIndex]);
  playSong();
  const song = Array.from(document.querySelectorAll('.song'));
  song
    .filter(el => el.classList.contains('active'))
    .map(el => el.classList.remove('active'));
  song
    .filter(el => el.dataset.name === playerContainer.dataset.name)
    .map(el => el.classList.add('active'));
}

function nextSong() {
  startIndex++;
  if (startIndex > songs.length - 1) {
    startIndex = 0;
  }
  loadSong(songs[startIndex]);
  playSong();
  const song = Array.from(document.querySelectorAll('.song'));
  song
    .filter(el => el.classList.contains('active'))
    .map(el => el.classList.remove('active'));
  song
    .filter(el => el.dataset.name === playerContainer.dataset.name)
    .map(el => el.classList.add('active'));
}

function chooseSong(e) {
  const btn = e.target.closest('.song');
  if (!btn) return;
  const song = Array.from(document.querySelectorAll('.song'));

  song
    .filter(el => el.classList.contains('active'))
    .map(el => el.classList.remove('active'));

  const songIndex = songs.findIndex(el => el.name === btn.dataset.name);
  loadSong(songs[songIndex]);

  if (playerContainer.dataset.name === btn.dataset.name) {
    btn.classList.add('active');
  }

  playSong();
}

function progressBar(e) {
  if (isPlaying) {
    const { currentTime, duration } = e.srcElement;
    let progressPercent = (currentTime / duration) * 100;
    displayProgress.style.width = `${progressPercent}%`;

    let currentMinutes = Math.trunc(currentTime / 60);
    let currentSeconds = Math.trunc(currentTime % 60);
    if (currentMinutes < 10) {
      currentMinutes = `0${currentMinutes}`;
    }
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    displayCurrentTime.textContent = `${currentMinutes}:${currentSeconds}`;

    let durationMinutes = Math.trunc(duration / 60);
    let durationSeconds = Math.trunc(duration % 60);
    if (durationMinutes < 10) {
      durationMinutes = `0${durationMinutes}`;
    }
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }

    if (durationMinutes) {
      displayDuration.textContent = `${durationMinutes}:${durationSeconds}`;
    }
  }

  if (displayProgress.style.width == '100%') {
    pauseBtn.classList.remove('show');
    playBtn.classList.remove('hide');
    pauseSong();
  }
}

function setProgressBar(e) {
  playSong();
  const width = displayProgressEl.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  const value = (clickX / width) * duration;
  music.currentTime = value;
}

function activeDisplay() {
  displayLibrary.classList.toggle('active');
  app.classList.toggle('active');
}

function setLibrary() {
  songs.map(el =>
    displayLibrary.insertAdjacentHTML(
      'beforeend',
      `<div class="song" data-name="${el.name}">
          <img class="song__img" src="img/${el.title}.jpg" alt="${el.title}">
          <div class="song__details">
              <h2 class="song__title">${el.title}</h2>
              <span class="song__artist">${el.artist}</span>
          </div>
      </div>`
    )
  );

  const song = Array.from(document.querySelectorAll('.song'));
  song
    .filter(el => el.dataset.name === playerContainer.dataset.name)
    .map(el => el.classList.add('active'));
}

function setVolume() {
  music.volume = volumeBar.value / 100;
  volumeBar.style.backgroundSize = `${music.volume * 100}% 100%`;
}

function activeVolume() {
  displayVolume.classList.toggle('active');

  if (displayVolume.classList.contains('active')) {
    setTimeout(() => {
      volumeBtn.style.marginLeft = '.4em';
      if (music.volume === 0)
        volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-mute');
      if (music.volume > 0 && music.volume <= 33)
        volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-low');
      if (music.volume > 33 && music.volume <= 66)
        volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-medium');
      if (music.volume > 66 && music.volume <= 100)
        volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-high');
    }, 50);
  } else {
    volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-off');
    volumeBtn.style.marginLeft = '0';
  }
}

function changeVolume(e) {
  const value = e.target.value;
  const min = e.target.min;
  const max = e.target.max;

  if (value == 0) volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-mute');
  if (value > 0 && value <= 33)
    volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-low');
  if (value > 33 && value <= 66)
    volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-medium');
  if (value > 66 && value <= 100)
    volumeIcon.setAttribute('href', 'svg/sprite.svg#volume-high');

  volumeBar.style.backgroundSize = `${
    ((value - min) * 100) / (max - min)
  }% 100%`;
  music.volume = value / 100;
}

function loopSong(e) {
  music.loop === false ? (music.loop = true) : (music.loop = false);
  repeatBtn.classList.toggle('active');
}

function init() {
  loadSong(drunk);
  setVolume();
  setLibrary();
  playBtn.addEventListener('click', () =>
    isPlaying ? pauseSong() : playSong()
  );
  pauseBtn.addEventListener('click', () =>
    isPlaying ? pauseSong() : playSong()
  );
  volumeBtn.addEventListener('click', activeVolume);
  volumeBar.addEventListener('input', changeVolume);
  prevBtn.addEventListener('click', prevSong);
  nextBtn.addEventListener('click', nextSong);
  repeatBtn.addEventListener('click', loopSong);
  music.addEventListener('timeupdate', progressBar);
  displayProgressEl.addEventListener('click', setProgressBar);
  libraryBtn.addEventListener('click', activeDisplay);
  displayLibrary.addEventListener('click', chooseSong);
}

init();
