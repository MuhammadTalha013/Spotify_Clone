let currentSong = new Audio();
let songs;
let currFolder;
function convertSecondsToMMSS(seconds) {
  // Ensure the input is a non-negative integer
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds with leading zeros
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
//1st get songs from folder and store in songs variable
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as); //It gives HTML collection
  songs = [];
  // console.log(songs);
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // return songs; "No need to write return songs"

  //Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
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
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

const playMusic = (track) => {
  currentSong.src = `/${currFolder}/` + track;
  currentSong.play();
  play.src = "pause.svg";
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //Get the list of all songs
  await getSongs("songs/ncs");
  // playMusic(songs[0], true);

  //Display all the albums on the page

  
  //Attach an event listener to play
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  //Listen for timeupdate event
  // timeupdate: Triggered as the audio plays, allowing us to track the current time.
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${convertSecondsToMMSS(
      currentSong.currentTime
    )} / ${convertSecondsToMMSS(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Add an event listener to previous
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    // console.log(currentSong);
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");
    // console.log(currentSong)
    // console.log(currentSong.src);
    // console.log(currentSong.src.split('/'));
    // console.log(currentSong.src.split('/').slice(-1));
    // console.log(currentSong.src.split('/').slice(-1)[0]);
    // console.log(songs.indexOf(currentSong.src.split('/').slice(-1)[0]));
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
    // console.log(songs,index);
  });

  //Add an event to volume
  //  console.log(document.querySelector('.range').getElementsByTagName('input'));
  //  console.log(document.querySelector('.range').getElementsByTagName('input')[0]);
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e, e.target, e.target.value, "/100");
      // console.log((currentSong.volume = parseInt(e.target.value) / 100));
      //parseInt is applied because e.target.value is a string value, it converts to integer
      currentSong.volume = parseInt(e.target.value) / 100;
    });

    //Add an event listener to mute the track
    document.querySelector('.volume>img').addEventListener('click', e=>{
      console.log(e.target)
      console.log('changing', e.target.src)
      if (e.target.src.includes('volume.svg')) {
        e.target.src = e.target.src.replace('volume.svg','mute.svg')
        currentSong.volume = 0;
        document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
      }
      else{
        e.target.src = e.target.src.replace('mute.svg','volume.svg')
        currentSong.volume = .10;
        document.querySelector('.range').getElementsByTagName('input')[0].value = 50;

      }
    })

  //Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      // console.log(item);
      // console.log(item.currentTarget);
      // console.log(item, item.currentTarget.dataset);
      // console.log(item, item.currentTarget.dataset.folder);
      // console.log(item, item.currentTarget.dataset);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });

}
main();
