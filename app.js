// Array => alltrains, upcomingTrains, trainInNext1hr
var url = new URL(window.location);
var from = url.searchParams.get("from");
var to = url.searchParams.get("to");
var isIntersection = false;
const intersection = "Sitabuldi";
const line_1 = [
  "Automotive_Square",
  "Nari_Road",
  "Kadvi_Chowk",
  "Gaddi_Godam_square",
  "Kasturchand_Park",
  "Zero_Miles",
  "Sitabuldi",
  "Congress_Nagar",
  "Rahate_Colony",
  "Ajni_Square",
  "Chhatrapati_square",
  "Jaiprakash_Nagar",
  "Ujjwal_Nagar",
  "Airport",
  "Airport_South",
  "New_Airport",
  "Khapri",
];

const line_2 = [
  "Prajapati_nagar",
  "Vaisnodevi_Chowk",
  "Ambedkar_Chowk",
  "Telephone_Exchng",
  "Chitroli_Chowk",
  "Agrasen_Chowk",
  "Dosar_Vaisya_Chowk",
  "Nagpur_Railway_Station",
  "Sitabuldi",
  "Jhansi_Rani_Square",
  "IOE",
  "Shanker_Nagar",
  "LAD_Square",
  "Ambazari_Lake_view",
  "Subhash_Nagar",
  "Rachna_Ring_Road",
  "Vasudev_Nagar",
  "Bansi_Nagar",
  "Lokmanya",
];

const findSuitableTrains = (source, destination) => {
  const trains = [];

  // Check if source and destination are on the same track.
  if (line_1.includes(source) && line_1.includes(destination)) {
    trains.push(findTrainsOnPath(source, destination, pathA, line_1, "PathA"));
  } else if (line_2.includes(source) && line_2.includes(destination)) {
    trains.push(findTrainsOnPath(source, destination, pathB, line_2, "PathB"));
  } else if (line_1.includes(source) && line_2.includes(destination)) {
    // Source and destination are on different tracks, so we need to change trains at C.
    isIntersection = true;
    const trainsA = findTrainsOnPath(
      source,
      intersection,
      pathA,
      line_1,
      "pathA"
    );
    const trainsB = findTrainsOnPath(
      intersection,
      destination,
      pathB,
      line_2,
      "pathB"
    );
    trains.push(trainsA.concat(trainsB));
  } else if (line_2.includes(source) && line_1.includes(destination)) {
    isIntersection = true;
    const trainsA = findTrainsOnPath(
      source,
      intersection,
      pathB,
      line_2,
      "pathB"
    );
    const trainsB = findTrainsOnPath(
      intersection,
      destination,
      pathA,
      line_1,
      "pathA"
    );
    trains.push(trainsA.concat(trainsB));
  } else {
    alert("Error! Please Search Metro Again.");
    document.location.href = "./index.html";
  }
  return trains;
};

function findTrainsOnPath(source, destination, path, line, nameofpath) {
  const trains = [];
  let way = "UP";
  let thisPath = path[0];
  if (line.indexOf(source) > line.indexOf(destination)) {
    way = "DOWN";
    thisPath = path[1];
  }
  for (const train of thisPath) {
    const journeyStartTime = train.schedule[source];
    const journeyEndTime = train.schedule[destination];
    const journeyWay = train.way;
    if (journeyStartTime && journeyEndTime && journeyWay == way) {
      trains.push({
        tN: train.trainNumber,
        src: source,
        dst: destination,
        jST: journeyStartTime,
        jET: journeyEndTime,
        jW: journeyWay,
        p: nameofpath,
      });
    }
  }

  return trains;
}

document
  .querySelectorAll(".fromText")
  .forEach((e) => (e.innerText = from.replaceAll("_", " ")));
document
  .querySelectorAll(".toText")
  .forEach((e) => (e.innerText = to.replaceAll("_", " ")));
if (isIntersection) {
  document
    .querySelectorAll(".intersectionText")
    .forEach((e) => (e.innerText = intersection.replaceAll("_", " ")));
} else {
  document.querySelector(".breakJourney").remove();
}

document.querySelector("#showMetroFilter").addEventListener("change", (e) => {
  generateResults();
});

function generateResults(arr) {
  let msg = "";
  switch (document.querySelector("#showMetroFilter").value) {
    case "all":
      arr = allTrains[0];
      msg = "No Metros found between the given Stations.";
      break;
    case "next2hr":
      arr = trainInNext1hr;
      msg = "No Metros found between the given Stations in next 2 hours.";
      break;
    case "allup":
      arr = upcomingTrains;
      msg = "No upcoming Metros found.";
      break;

    default:
      break;
  }
  if (arr.length) generateCard(arr);
  else document.querySelector(".showMetros").innerText = msg;
  setTimeout(() => {
    document.querySelector("title").innerText = document
      .querySelector("#fromTo")
      .innerText.slice(2);
  }, 100);
}

function generateCard(arr) {
  document.querySelector(".showMetros").innerHTML = "";
  let path = arr[0].p;

  function fromTo(a, i) {
    if (a[i].p != a[a.length - 1].p) {
      let html = document.createElement("div");
      html.className = "metro";
      html.innerText =
        a[i].src.replaceAll("_", " ") +
        " →  " +
        a[i].dst.replaceAll("_", " ") +
        "🔁";
      document.querySelector(".showMetros").append(html);
    }
  }

  fromTo(arr, "0");

  let temp = document.querySelector("template").content;
  arr.forEach((e, i) => {
    if (e.p != path) {
      path = e.p;
      let html = document.createElement("div");
      html.className = "metro";
      html.innerText =
        e.src.replaceAll("_", " ") + "🔁" + " →  " + e.dst.replaceAll("_", " ");
      document.querySelector(".showMetros").append(html);
    }
    var copyHTML = document.importNode(temp, true);
    copyHTML.querySelector(".tN").innerText = e.tN.split("_")[1];
    copyHTML.querySelector(".src").innerText = e.src.replaceAll("_", " ");
    copyHTML.querySelector(".dst").innerText = e.dst.replaceAll("_", " ");
    copyHTML.querySelector(".jST").innerText = e.jST.slice(0, -3);
    copyHTML.querySelector(".jET").innerText = e.jET.slice(0, -3);
    copyHTML.querySelector(".totalDur").innerText =
      parseInt(
        (parseFloat(toSeconds(e.jET)) - parseFloat(toSeconds(e.jST))) / 60
      ) + " Mins";

    document.querySelector(".showMetros").append(copyHTML);
  });
}

function toSeconds(a) {
  let time = a.split(":");
  if (time[0] > 23) {
    time[0] = time[0] - 24;
  }
  return time[0] * 3600 - -1 * time[1] * 60 - -1 * time[2];
}
let currtime, allTrains, upcomingTrains, trainInNext1hr;
function init() {
  currtime = new Date().toLocaleTimeString("en-US", { hour12: false });
  allTrains = findSuitableTrains(from, to);
  upcomingTrains = [];
  upcomingTrains = allTrains[0].filter((train) => {
    return parseInt(toSeconds(train.jST)) >= parseInt(toSeconds(currtime));
  });
  trainInNext1hr = [];
  trainInNext1hr = upcomingTrains.filter((train) => {
    return (
      parseInt(toSeconds(train.jST)) <
      parseInt(toSeconds(currtime)) - -1 * parseInt(toSeconds("01:00:00"))
    );
  });
  generateResults();
}
init();
setInterval(() => {
  init();
  console.log("hello");
}, 15000);
