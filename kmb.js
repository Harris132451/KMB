// // fetch
// https: //data.etabus.gov.hk/
// // bus name
// // line /v1/transport/kmb/route/{route}/{direction}/{service_type}
// findsta /v1/transport/kmb/routestop/{route}/{direction}/{service_type}
// // sta name /v1/transport/kmb/stop/{stop_id}
function inputBusName() {
  const input = document.getElementById("findname");
  input.addEventListener("input", function (v) {
    clearResult();
    clearData();
  });
  input.addEventListener("input", async function (v) {
    try {
      const response = await fetch(
        `https://data.etabus.gov.hk/v1/transport/kmb/route/`
      );
      const result = await response.json();
      result.data.forEach((d) => {
        if (
          d.route.indexOf(v.target.value) !== -1 &&
          d.bound === "I" &&
          d["service_type"] === "1" &&
          v.target.value !== ""
        ) {
          addLineContainer(d.route);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
} // English upper form
inputBusName();

function addLineContainer(route) {
  const headcontainer = document.querySelector(".container");
  const titlecontainer = document.createElement("div");
  const title = document.createElement("h2");
  const todirction = document.createElement("div");
  const buttoncontainer = document.createElement("div");
  const resultcontainer = document.createElement("div");
  title.textContent = `${route}`;
  todirction.textContent = "Choose Direction : ";
  resultcontainer.id = `${route}`;
  headcontainer.appendChild(titlecontainer);
  titlecontainer.appendChild(title);
  titlecontainer.appendChild(todirction);
  titlecontainer.appendChild(buttoncontainer);
  titlecontainer.appendChild(resultcontainer);
  searchResult(resultcontainer, buttoncontainer, route, "outbound");
  searchResult(resultcontainer, buttoncontainer, route, "inbound");
}

async function searchResult(
  resultcontainer,
  buttoncontainer,
  route,
  direction
) {
  try {
    const lineResponse = await fetch(
      `https://data.etabus.gov.hk/v1/transport/kmb/route/${route}/${direction}/1`
    );
    const lineResult = await lineResponse.json();
    const stopResponse = await fetch(
      `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${direction}/1`
    );
    const stopResult = await stopResponse.json();
    let stopData = stopResult.data;
    let lineData = lineResult.data;
    addLineButton(resultcontainer, buttoncontainer, lineData, stopData, route);
  } catch (error) {
    console.error(error);
  }
}

function addLineButton(
  resultcontainer,
  buttoncontainer,
  lineData,
  stopData,
  route
) {
  const selebtn = document.createElement("button");
  selebtn.className = "selebtnstyle";
  selebtn.textContent = `${lineData["orig_tc"]} to ${lineData["dest_tc"]}`;
  buttoncontainer.appendChild(selebtn);
  selebtn.addEventListener("click", function () {
    clearSta(route);
    stopData.forEach((s) => {
      showSta(s, resultcontainer, route);
    });
  });
}

async function showSta(stopid, resultcontainer) {
  try {
    const stopNameResponse = await fetch(
      `https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopid.stop}`
    );
    const stopNameResult = await stopNameResponse.json();
    const stopName = document.createElement("div");
    stopName.textContent = stopNameResult.data["name_tc"];
    resultcontainer.appendChild(stopName);
  } catch (error) {
    console.error(error);
  }
}

function clearResult() {
  const headcontainer = document.querySelector(".container");
  headcontainer.innerHTML = "";
}

function clearData() {
  const maincontainer = document.querySelector(".maincontainer");
  maincontainer.innerHTML = "";
}

function clearSta(route) {
  const staContainer = document.getElementById(`${route}`);
  staContainer.innerHTML = "";
}

//for input function
// const input = document.querySelector("input");
// const log = document.getElementById("values");

// input.addEventListener("input", updateValue);

// function updateValue(e) {
//   log.textContent = e.target.value;
// }
