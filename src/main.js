import { gsap } from "gsap";

initAndStart();

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//
// init function, listen to clicks on tab (to change data respectively)
async function initAndStart() {
  const dataArray = await getData();
  if (!dataArray) return;

  const activeTabTimeframe =
    document.querySelector("[data-tab-active]").dataset.timeframe;

  populateData(dataArray, activeTabTimeframe);

  const tabsList = document.querySelectorAll("[data-timeframe]");
  tabsList.forEach((tabItem) => {
    tabItem.addEventListener("click", () => {
      document
        .querySelector("[data-tab-active]")
        .removeAttribute("data-tab-active");

      tabItem.setAttribute("data-tab-active", "");

      const activeTabTimeframe = tabItem.dataset.timeframe;

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
  const dataJSON = "/public/data.json";
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

    // define new value (to pass it into animation)
    let newValue;
    let isCurrent = false;
    if (element.hasAttribute("data-current")) {
      newValue = times.current;
      isCurrent = true;
    } else if (element.hasAttribute("data-previous")) {
      newValue = times.previous;
    } else return;

    // numbers animation
    const oldText = element.textContent.replace(/[^\d]/g, "");
    const oldValue = parseInt(oldText, 10) || 0;

    const obj = { val: oldValue };

    gsap.to(obj, {
      val: newValue,
      duration: 1,
      ease: "circ.inOut",
      onUpdate: () => {
        const rounded = Math.round(obj.val);
        element.textContent = rounded + (rounded > 1 ? "hrs" : "hr");
      },
    });
  });
}
