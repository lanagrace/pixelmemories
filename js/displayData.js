document.addEventListener("DOMContentLoaded", () => {
  const dataContainer = document.getElementById("data");

  let activeDocId = null;

  // =========================
  // AUTH GUARD
  // =========================
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    loadData(user.uid);
  });

  // =========================
  // LOAD DATA (FIXED TO USE PIXELATION)
  // =========================
  function loadData(uid) {
    db.collection("users")
      .doc(uid)
      .collection("log")
      .orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        console.log("Docs found:", snapshot.size);

        dataContainer.innerHTML = "";

        snapshot.forEach((doc) => {
          const data = doc.data();

          const card = document.createElement("div");
          card.className = "photo-card";

          // =========================
          // IMAGE (PIXELATION FIX APPLIED HERE)
          // =========================
          const img = document.createElement("img");
            img.alt = "photo";

            img.src = data.image; // show original first

            img.onload = () => {
              const pixelAmount = calculatePixelation(data.lastClicked || data.lastViewed || data.date)

              if (pixelAmount > 3) {
                const tempImg = new Image();
                tempImg.crossOrigin = "anonymous";

                tempImg.onload = () => {
                  img.src = pixelateImage(tempImg, pixelAmount);
                };

                tempImg.src = data.image;
              }
            };

          // =========================
          // CAPTION
          // =========================
          const caption = document.createElement("p");
          caption.textContent = data.caption || "";

          // =========================
          // DATE
          // =========================
          const dateEl = document.createElement("p");
          dateEl.textContent = data.date
            ? new Date(
                data.date.toDate ? data.date.toDate() : data.date
              ).toString()
            : "";

          // =========================
          // LOCATION
          // =========================
          const loc = document.createElement("p");
          loc.textContent = data.latitude
            ? `Location: ${data.latitude}, ${data.longitude}`
            : "";

          // =========================
          // LAST CLICKED
          // =========================
          const lastClicked = document.createElement("p");

          if (data.lastClicked) {
            const diff = Date.now() - data.lastClicked;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(minutes / 60);

            lastClicked.textContent =
              hours > 0
                ? `Last Clicked: ${hours}h ${minutes % 60}m ago`
                : `Last Clicked: ${minutes}m ago`;
          } else {
            lastClicked.textContent = "Last Clicked: never";
          }

          // =========================
          // CLICK EVENT
          // =========================
          card.addEventListener("click", () => {
            db.collection("users")
              .doc(uid)
              .collection("log")
              .doc(doc.id)
              .update({
                lastClicked: Date.now(),
              });

            const pixelAmount = calculatePixelation(
              data.lastClicked || data.lastViewed || data.date
            );

            if (pixelAmount >= 2) {
              openStoryModal(doc.id, uid);
            }
          });

          // =========================
          // DELETION TIMER (FIXED)
          // =========================
          let last = data.lastClicked;

          if (!last) {
            if (data.date?.toMillis) {
              last = data.date.toMillis();
            } else if (data.date?.seconds) {
              last = data.date.seconds * 1000;
            } else {
              last = new Date(data.date).getTime();
            }
          }

          const DELETION_MINUTES = 26 * 60;
          const minutesPassed = (Date.now() - last) / 60000;
          const minutesLeft = Math.ceil(DELETION_MINUTES - minutesPassed);

          const deletionInfo = document.createElement("p");

          if (minutesLeft > 0) {
            deletionInfo.textContent = `Minutes until deletion: ${minutesLeft}`;
          } else {
            deletionInfo.textContent = "Ready for deletion!";
          }

          // COLORS
          if (minutesLeft <= 10) {
            deletionInfo.style.color = "red";
          } else if (minutesLeft <= 70) {
            deletionInfo.style.color = "orange";
          } else {
            deletionInfo.style.color = "green";
          }

          // =========================
          // APPEND ALL
          // =========================
          card.appendChild(img);
          card.appendChild(loc);
          card.appendChild(lastClicked);
          card.appendChild(deletionInfo);

          dataContainer.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("DISPLAY ERROR:", err);
      });
  }
  
//calculates time passed since the card has last been clicked on
function calculatePixelation(lastViewedTimestamp) {
  const then = new Date(lastViewedTimestamp).getTime();
  const now = Date.now();
  const minutes = (now - then) / (1000 * 60); // turns it into minutes bc in ms

  if (minutes < 5) return 1;
  if (minutes < 15) return 10;    // clear for 1 min
  if (minutes < 30) return 55;   // light pixelation
  if (minutes < 120) return 90;   // medium pixelation
  return 120;                   // maximum pixelation
}

function pixelateImage(img, pixelSize) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const w = img.width;
  const h = img.height;
  canvas.width = w;
  canvas.height = h;

  // redraws image in smaller size
  ctx.drawImage(img, 0, 0, w / pixelSize, h / pixelSize);
  // makes it pixelated
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, w / pixelSize, h / pixelSize, 0, 0, w, h);

  return canvas.toDataURL();
}

});



