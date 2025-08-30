initAndStart();

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//
// init function, listen to clicks on tab (to change data respectively)
async function initAndStart() {
  const dataArray = await getData();
  if (!dataArray) return;

  const activeTabValue = document.querySelector("[data-tab-active]");
  const activeTabTimeframe = activeTabValue.dataset.timeframe;

  populateData(dataArray, activeTabTimeframe);

  const tabsList = document.querySelectorAll("[data-timeframe]");
  tabsList.forEach((tabItem) => {
    tabItem.addEventListener("click", (event) => {
      document
        .querySelector("[data-tab-active]")
        .removeAttribute("data-tab-active");

      tabItem.setAttribute("data-tab-active", "");

      const activeTabValue = document.querySelector("[data-tab-active]");
      const activeTabTimeframe = activeTabValue.dataset.timeframe;

      populateData(dataArray, activeTabTimeframe);
    });
  });
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//
// get data from JSON
async function getData() {
  const dataJSON = "../data.json";
  const request = new Request(dataJSON);

  try {
    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//
// populate data from JSON to webpage
function populateData(array, timeframe) {
  const activityElements = document.querySelectorAll("[data-activity]");

  const dataMap = new Map(
    array.map((obj) => [obj.title, obj.timeframes[timeframe]])
  );

  activityElements.forEach((element) => {
    const activity = element.dataset.activity;
    const times = dataMap.get(activity);

    if (!times) return;

    if (element.hasAttribute("data-current")) {
      element.textContent = times.current + (times.current > 1 ? "hrs" : "hr");
    }

    if (element.hasAttribute("data-previous")) {
      element.textContent =
        times.previous + (times.previous > 1 ? "hrs" : "hr");
    }
  });
}
