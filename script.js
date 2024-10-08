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
  //It li>div with Loop and populate songs from default songs folder
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="img/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Artist</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="img/play.svg" alt="" class="invert">
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
  return songs
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  currentSong.play();
  play.src = "img/pause.svg";
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  console.log("displaying albums")
  //Fetching folders in song folder
  let a = await fetch(`http://127.0.0.1:3000/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  // console.log(div)
  let anchors = div.getElementsByTagName("a")
  // console.log(anchors)
  let cardContainer = document.querySelector(".cardContainer")
  //Looping for folders and get folder's name from each folder
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
      const e = array[index]; 

      if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
          let folder = e.href.split("/").slice(-2)[0] //It provides each folder's name from song folder
          console.log(e.href.split("/").slice(-2)[0]) 

          // Get the metadata of the folder
          let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
          let response = await a.json();
          // console.log(response) //It provides json data from each folder
          //It creates card with Loop and populate songs, cover-photo and json file from each folder
          cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
          <div class="play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                      stroke-linejoin="round" />
              </svg>
          </div>

          <img src="/songs/${folder}/cover.jpg" alt="">
          <h2>${response.title}</h2>
          <p>${response.description}</p>
      </div>`
      }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        // console.log(item)
        // console.log(item.currentTarget)
        // console.log(item.currentTarget.dataset)
        // console.log(item.currentTarget.dataset.folder)
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`) 
        playMusic(songs[0].replaceAll("%20", " "))

    })
})
}

async function main() {
  //Get the list of all songs
  await getSongs("songs/5-English_(mood)");
  // playMusic(songs[0], true);

  //Display all the albums on the page
  displayAlbums()
  
  //Attach an event listener to play
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
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
      playMusic(songs[index - 1].replaceAll("%20", " "));
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
      playMusic(songs[index + 1].replaceAll("%20", " "));
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
      if (currentSong.volume>0) {
        document.querySelector('.volume>img').src = document.querySelector('.volume>img').src.replace('mute.svg','volume.svg')
      }
    });

    //Add an event listener to mute the track
    document.querySelector('.volume>img').addEventListener('click', e=>{
      console.log(e.target)
      console.log('changing', e.target.src)
      //After click, havng three actions, 1. changing svg, mute song, volume slider value turn to 0.
      if (e.target.src.includes('volume.svg')) {
        e.target.src = e.target.src.replace('volume.svg','mute.svg')
        currentSong.volume = 0;
        document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
      }
      else{
        e.target.src = e.target.src.replace('mute.svg','volume.svg')
        currentSong.volume = .50;
        document.querySelector('.range').getElementsByTagName('input')[0].value = 50;

      }
    })


}
main();
