let currentSong = new Audio();
let songs;

function convertSecondsToMMSS(seconds) {
  // Ensure the input is a non-negative integer
  if (isNaN(seconds) || seconds<0) {
    return "Invalid Input"
    }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor (seconds % 60);

  // Format minutes and seconds with leading zeros
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
  }
async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as); //It gives HTML collection
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track) => {
  currentSong.src = "/songs/" + track;
  currentSong.play();
  play.src = "pause.svg"
  document.querySelector('.songinfo').innerHTML = track 
  document.querySelector('.songtime').innerHTML = "00:00 / 00:00"
};

async function main() {
  //Get the list of all songs
  songs = await getSongs();
  //Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Mallu</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="play.svg" alt="" class="invert">
                </div></li>`;
  }
  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  //Attach an event listener to play, next & previous
  play.addEventListener('click', ()=>{
    if (currentSong.paused) {
      currentSong.play()
      play.src = 'pause.svg'
    }
    else{
      currentSong.pause()
      play.src = 'play.svg'
    }
  })
  //Listen for timeupdate event
  currentSong.addEventListener('timeupdate', ()=>{
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector('.songtime').innerHTML = `${convertSecondsToMMSS(currentSong.currentTime)} / ${convertSecondsToMMSS(currentSong.duration)}`
    document.querySelector('.circle').style.left = (currentSong.currentTime/currentSong.duration)*100+"%"
  })
  //Add an event listener to seekbar 
  document.querySelector('.seekbar').addEventListener('click', (e)=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
  document.querySelector('.circle').style.left = percent+"%";
  currentSong.currentTime = (currentSong.duration * percent)/100
  })
  //Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "0"
  })
  //Add an event listener for close button
  document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-120%"
  })
  //Add an event listener to previous
   previous.addEventListener('click', ()=>{
    console.log('Previous clicked');
    console.log(currentSong);
   })
   //Add an event listener to next
   next.addEventListener('click', ()=>{
    console.log('Next clicked');
    console.log(currentSong.src);
    console.log(songs);
   })


}
main();
