let video;
let cam = true; // start with front camera 
let lat = null;
let lon = null;

function setup() {
  noCanvas();

  // Start the camera
  startCamera(cam);

  /* // Camera switch button
  const switchBtn = document.getElementById("switchCamera");
  switchBtn.addEventListener("click", () => {
    frontCamera = !frontCamera;
    startCamera(frontCamera);
  }); */

  // Geolocation
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;

      document.getElementById("latitude").textContent = lat;
      document.getElementById("longitude").textContent = lon;
    });
  } else {
    console.log("Geolocation not available.");
  }

  // Form submit
  const submitBtn = document.getElementById('submit');
  submitBtn.addEventListener('click', handleSubmit);
}

/*
  Start or restart camera
 */
function startCamera() {
  // If a previous camera exists, stop it
  if (video && video.elt && video.elt.srcObject) {
    video.elt.srcObject.getTracks().forEach(t => t.stop());
    video.remove();
  }

  const constraints = {
    video: {},
    //not using a microphone just camera
    audio: false
  };

  // Start the camera
  video = createCapture(constraints);
  video.size(320, 240);
  //video.hide(); // hide HTML video, we only grab frames
}

function handleSubmit(e) {
  e.preventDefault();

  // Capture current frame
  video.loadPixels();
  const image64 = video.canvas.toDataURL();

  // Capture timestamp
  const now = new Date();
  const formattedDate =
    `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-` +
    `${now.getDate().toString().padStart(2, "0")} ` +
    `${now.getHours().toString().padStart(2, "0")}:` +
    `${now.getMinutes().toString().padStart(2, "0")}:` +
    `${now.getSeconds().toString().padStart(2, "0")}`;

  // Caption validation
  const captionValue = document.getElementById("mood").value.trim();
  if (!captionValue) {
    alert("Please enter a caption.");
    return;
  }

  // Ensure geolocation exists
  if (lat === null || lon === null) {
    alert("Geolocation not available yet.");
    return;
  }

  console.log("Submitting…");

  // send to databaseee
  db.collection("log").doc().set({
    caption: captionValue,
    date: formattedDate,
    latitude: lat,
    longitude: lon,
    image: image64,
    lastViewed: Date.now(),        
    lastClicked: 1670000000000,   // timestamp in ms
    story: "" 
  })
  .then(() => {
    console.log("Upload successful!");
    alert("Photo saved!");
  })
  .catch((error) => {
    console.error("Error saving document:", error);
    alert("Error saving photo.");
  });
}

function draw() {
  // no drawing needed
}
