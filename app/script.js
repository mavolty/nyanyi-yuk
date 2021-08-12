// Color Thief
import ColorThief from './dist/color-thief.mjs';

const colorThief = new ColorThief();
const displayImg = document.querySelector('img');

// Get Element
const music = document.querySelector('audio');
const playBtn = document.getElementById('js-play');
const pauseBtn = document.getElementById('js-pause');
const prevBtn = document.getElementById('js-prev');
const nextBtn = document.getElementById('js-next');
const libraryBtn = document.getElementById('js-btn-lib');
const displayBackground = document.querySelector('body');
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
let tooSoon = new Songs('2 soon', '2 soon', 'Keshi');
let blue = new Songs('blue', 'blue', 'Keshi');
let itKillsMe = new Songs('it kills me', 'it kills me', 'Keshi');
let bandaids = new Songs('bandaids', 'bandaids', 'Keshi');

let songs = [drunk, tooSoon, blue, itKillsMe, bandaids];

let startIndex = 0;

function playSong() {
  isPlaying = true;
  pauseBtn.classList.add('show');
  playBtn.classList.add('hide');
  music.play();
}

function pauseSong() {
  isPlaying = false;
  pauseBtn.classList.remove('show');
  playBtn.classList.remove('hide');
  music.pause();
}

function loadSong(song) {
  displayImg.setAttribute('src', `img/${song.name}.jpg`);
  music.setAttribute('src', `music/${song.name}.mp3`);
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
}

function nextSong() {
  startIndex++;
  if (startIndex > songs.length - 1) {
    startIndex = 0;
  }
  loadSong(songs[startIndex]);
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

playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
pauseBtn.addEventListener('click', () =>
  isPlaying ? pauseSong() : playSong()
);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('timeupdate', progressBar);
displayProgressEl.addEventListener('click', setProgressBar);
songs.map(el =>
  displayLibrary.insertAdjacentHTML(
    'beforeend',
    `<div class="song">
          <img class="song__img" src="img/${el.name}.jpg" alt="Drunk">
          <div class="song__details">
              <h2 class="song__title">${el.title}</h2>
              <span class="song__artist">${el.artist}</span>
          </div>
      </div>`
  )
);
libraryBtn.addEventListener('click', function () {
  displayLibrary.classList.toggle('active');
  app.classList.toggle('active');
});
