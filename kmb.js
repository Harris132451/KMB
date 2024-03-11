document.addEventListener("DOMContentLoaded", function () {
  inputBusName();
});
function inputBusName() {
  const input = document.getElementById("findname");
  input.addEventListener("input", function (v) {
    clearData();
  });
  input.addEventListener("input", async function (v) {
    try {
      const response = await fetch(
        `https://data.etabus.gov.hk/v1/transport/kmb/route/`
      );
      const result = await response.json();
      const routeKeys = {};
      result.data.forEach((d) => {
        if (d.route.indexOf(v.target.value) !== -1 && v.target.value !== "") {
          routeKeys[d.route] = {};
          routeKeys[d.route].orig = [];
          routeKeys[d.route].dest = [];
          routeKeys[d.route].data = [];
        }
      });
      result.data.forEach((d) => {
        if (
          d.route.indexOf(v.target.value) !== -1 &&
          (!routeKeys[d.route]["orig"].includes(`${d["orig_tc"]}`) ||
            !routeKeys[d.route]["dest"].includes(`${d["dest_tc"]}`))
        ) {
          routeKeys[d.route]["orig"].push(`${d["orig_tc"]}`);
          routeKeys[d.route]["dest"].push(`${d["dest_tc"]}`);
          routeKeys[d.route]["data"].push(d);
        }
      });
      Object.keys(routeKeys).forEach((d) => {
        const routeData = routeKeys[d].data;
        addLineContainer(d, routeData);
      });
    } catch (error) {
      console.error(error);
    }
  });
}

function addLineContainer(route, routeData) {
  const headcontainer = document.querySelector(".container");
  const titlecontainer = document.createElement("div");
  const title = document.createElement("h2");
  const todirction = document.createElement("div");
  const buttoncontainer = document.createElement("div");
  const resultcontainer = document.createElement("ol");
  title.textContent = `${route}`;
  todirction.textContent = "Choose Direction : ";
  resultcontainer.id = `${route}`;
  headcontainer.appendChild(titlecontainer);
  titlecontainer.appendChild(title);
  titlecontainer.appendChild(todirction);
  titlecontainer.appendChild(buttoncontainer);
  titlecontainer.appendChild(resultcontainer);
  routeData.forEach((d) => {
    if (d.bound === "O") {
      searchResult(resultcontainer, buttoncontainer, route, "outbound", d);
    } else if (d.bound === "I") {
      searchResult(resultcontainer, buttoncontainer, route, "inbound", d);
    }
  });
}

async function searchResult(
  resultcontainer,
  buttoncontainer,
  route,
  direction,
  routeda
) {
  try {
    const stopResponse = await fetch(
      `https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${direction}/${routeda["service_type"]}`
    );
    const stopResult = await stopResponse.json();
    const staARR = [];
    stopResult.data.forEach((s) => {
      staARR.push(s);
    });
    addLineButton(resultcontainer, buttoncontainer, routeda, staARR);
  } catch (error) {
    console.error(error);
  }
}

function addLineButton(resultcontainer, buttoncontainer, routeda, staARR) {
  const selebtn = document.createElement("button");
  selebtn.className = "selebtnstyle";
  selebtn.textContent = `${routeda["orig_tc"]} to ${routeda["dest_tc"]}`;
  let resultARR = [];
  staARR.forEach((s) => {
    getSta(s, resultARR);
  });
  buttoncontainer.appendChild(selebtn);
  selebtn.addEventListener("click", function () {
    clearSta(routeda.route);
    resultARR.forEach((s) => {
      showSta(s, resultcontainer);
    });
  });
}

async function getSta(stopid, ARR) {
  try {
    const stopNameResponse = await fetch(
      `https://data.etabus.gov.hk/v1/transport/kmb/stop/${stopid.stop}`
    );
    const stopNameResult = await stopNameResponse.json();
    return ARR.push(stopNameResult.data["name_tc"]);
  } catch (error) {
    console.error(error);
  }
}

function showSta(stop, resultcontainer) {
  try {
    const stopName = document.createElement("li");
    stopName.textContent = `${stop}`;
    resultcontainer.appendChild(stopName);
  } catch (error) {
    console.error(error);
  }
}

function clearData() {
  const headcontainer = document.querySelector(".container");
  headcontainer.innerHTML = "";
}

function clearSta(route) {
  const stacontainer = document.getElementById(`${route}`);
  stacontainer.innerHTML = "";
}
