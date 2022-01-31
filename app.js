const list = document.querySelector(".content");
// const btn = document.querySelector(".refresh");
let options = document.querySelectorAll(".option");
let optionLaunchYear = document.querySelector("#option-launch-year");
let optionRocketType = document.querySelector("#option-rocket-type");
let optionManned = document.querySelector("#option-manned");
let optionSuccess = document.querySelector("#option-success");
let optionMissionName = document.querySelector("#option-mission-name");
let missionCards = document.querySelectorAll(".flight-card");

// btn.addEventListener("click", getData);

const headerHTML = `<input
                type="text"
                id="option-mission-name"
                class="option-text"
                placeholder="Mission name (all)"
            />
            <select name="" class="option" id="option-rocket-type">
                <option value="">Rocket type (all)</option>
                <option value="Falcon 1">Falcon 1</option>
                <option value="Falcon 9">Falcon 9</option>
                <option value="Falcon Heavy">Falcon Heavy</option>
            </select>
            <select name="" class="option" id="option-launch-year">
                <option value="">Launch Year (all)</option>
                <option value="2006">2006</option>
                <option value="2007">2007</option>
                <option value="2008">2008</option>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
            </select>
            <select name="" class="option" id="option-success">
                <option value="">Success (all)</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
            <select name="" class="option" id="option-manned">
                <option value="">Crew (all)</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>`;

let optionsSelected = {
    selectedMissionName: "",
    selectedRocketType: "",
    selectedLaunchYear: "",
    selectedMissionSucces: "",
    selectedMissionCrew: "",
};

let flightsData = {};

const initData = () => {
    // btn.textContent = "Loading...";
    fetch("https://api.spacexdata.com/v3/launches", {
        method: "GET",
    })
        .then(res => res.json())
        .then(data => {
            flightsData = data;
            showAll();
            // btn.textContent = "Search";
        });
};

const createCard = flight => {
    let li = document.createElement("li");

    li.dataset.flight_number = flight.flight_number;
    li.dataset.mission_name = flight.mission_name;
    li.dataset.flight_date = flight.launch_date_unix;
    li.dataset.flight_success = flight.launch_success;
    li.dataset.flight_rocket = flight.rocket.rocket_name;
    li.dataset.description = flight.details;
    li.dataset.crew = flight.crew;

    li.innerHTML = frontString(li);

    li.classList.add("flight-card");
    addCard(li);
};

const addCard = card => {
    list.appendChild(card);
    card.addEventListener("click", event => {
        event.currentTarget.classList.toggle("card-turned");
        const x = event.currentTarget;
        const unixTime = x.dataset.flight_date;
        const date = new Date(unixTime * 1000).toLocaleString();
        if (event.currentTarget.classList.contains("card-turned")) {
            let description = x.dataset.description;
            if (x.dataset.description === "null") {
                description = "No additional info.";
            }
            x.innerHTML = backString(x);
        } else {
            x.innerHTML = frontString(x);
        }
    });
};

const frontString = x => {
    const unixTime = x.dataset.flight_date;
    const date = new Date(unixTime * 1000).toLocaleString();
    let success = x.dataset.flight_success;
    if (x.dataset.flight_success === "null") {
        success = "true";
    }
    let crew = "Crew";
    if (x.dataset.crew === "null") {
        crew = "NoCrew";
    }
    return `<div class="card-header">
            <h3 class="card-mission-title">Mission: ${x.dataset.mission_name}</h3>
            <h3 class="card-mission-number">#${x.dataset.flight_number}</h3>
            </div>
            <h4 class="card-mission-date">Date: ${date}</h4>
            <div class="card-footer">
            <img src="./img/${success}.png" class="icon icon-success" data-tooltip="Successfull launch">
            <img src="./img/${crew}.png" class="icon">
            <img src="./img/${x.dataset.flight_rocket}.png" class="icon">
            </div>`;
};

const backString = x => {
    let description = x.dataset.description;
    if (x.dataset.description === "null") {
        description = "No additional info.";
    }
    const unixTime = x.dataset.flight_date;
    const date = new Date(unixTime * 1000).toLocaleString();
    return `<div class="card-header">
            <h3 class="card-mission-title">Mission: ${x.dataset.mission_name}</h3>
            <h3 class="card-mission-number">#${x.dataset.flight_number}</h3>
            </div>
            <h4 class="card-mission-date">Date: ${date}</h4>
            <h3 class="card-mission-title">Description:</h3>
            <p class="card-description">${description}</p>`;
};

const showAll = () => {
    flightsData.forEach(flight => {
        createCard(flight);
    });
};

const showNone = () => {
    list.innerHTML = "";
};

initData();

options.forEach(option => {
    option.addEventListener("change", () => {
        if (Object.keys(flightsData).length !== 0) {
            filter();
        }
    });
});

const filter = () => {
    showNone();

    let array = [];
    for (flight in flightsData) {
        array.push(flightsData[flight]);
    }

    if (
        optionLaunchYear.value === "" &&
        optionManned.value === "" &&
        optionMissionName.value === "" &&
        optionRocketType.value === "" &&
        optionSuccess.value === ""
    ) {
        array.forEach(flight => {
            createCard(flight);
        });
        return;
    }

    if (optionManned.value !== "") {
        if (optionManned.value === "false") {
            array = array.filter(flight => flight.crew === null);
        } else if (optionManned.value === "true") {
            array = array.filter(flight => flight.crew !== null);
        }
    }

    if (optionLaunchYear.value !== "") {
        array = array.filter(
            flight => flight.launch_year.toString() === optionLaunchYear.value
        );
    }

    if (optionRocketType.value !== "") {
        array = array.filter(
            flight => flight.rocket.rocket_name === optionRocketType.value
        );
    }

    if (optionSuccess.value !== "") {
        const bool = optionSuccess.value === "true";
        array = array.filter(flight => flight.launch_success === bool);
    }

    if (optionMissionName.value !== "") {
        array = array.filter(flight =>
            flight.mission_name
                .toLowerCase()
                .includes(optionMissionName.value.toLowerCase())
        );
    }
    array.forEach(flight => {
        createCard(flight);
    });
};

const mobileHeaderDecreasedHTML = () => {
    document.querySelector(".header-default").innerHTML = "";
    document.querySelector(
        ".header-mobile"
    ).innerHTML = `<img src="./img/Hamburger.png" class="mobile-button" alt="" />`;
    document
        .querySelector(".mobile-button")
        .addEventListener("click", event => {
            mobileHeaderExpandedHTML();
        });
    document.querySelector(".header-mobile").classList.remove("open");
};

const mobileHeaderExpandedHTML = () => {
    document.querySelector(".header-default").innerHTML = "";
    document.querySelector(".header-mobile").innerHTML = `${headerHTML}
            <img src="./img/Hamburger.png" class="mobile-button" alt="" />`;
    document
        .querySelector(".mobile-button")
        .addEventListener("click", event => {
            selectCorrect();
            mobileHeaderDecreasedHTML();
        });
    document.querySelector(".header-mobile").classList.add("open");
    refreshVariables();
    activateSelection();
};

const defaultHeaderHTML = () => {
    document.querySelector(".header-mobile").innerHTML = "";
    document.querySelector(".header-default").innerHTML = `${headerHTML}
            <button class="refresh">refresh</button>`;
    refreshVariables();
};

window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
        mobileHeaderDecreasedHTML();
    } else {
        defaultHeaderHTML();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 768) {
        mobileHeaderDecreasedHTML();
    } else {
        defaultHeaderHTML();
    }
});

const refreshVariables = () => {
    const list = document.querySelector(".content");
    options = document.querySelectorAll(".option");
    optionLaunchYear = document.querySelector("#option-launch-year");
    optionRocketType = document.querySelector("#option-rocket-type");
    optionManned = document.querySelector("#option-manned");
    optionSuccess = document.querySelector("#option-success");
    optionMissionName = document.querySelector("#option-mission-name");
    missionCards = document.querySelectorAll(".flight-card");
    options.forEach(option => {
        option.addEventListener("input", () => {
            if (Object.keys(flightsData).length !== 0) {
                filter();
            }
        });
    });
    document.querySelector(".option-text").addEventListener("keyup", () => {
        if (Object.keys(flightsData).length !== 0) {
            filter();
        }
    });
};

const selectCorrect = () => {
    optionsSelected = {
        selectedMissionName: optionMissionName.value,
        selectedRocketType: optionRocketType.value,
        selectedLaunchYear: optionLaunchYear.value,
        selectedMissionSucces: optionSuccess.value,
        selectedMissionCrew: optionManned.value,
    };
};

const activateSelection = () => {
    optionMissionName.value = optionsSelected.selectedMissionName;
    optionRocketType.value = optionsSelected.selectedRocketType;
    optionLaunchYear.value = optionsSelected.selectedLaunchYear;
    optionSuccess.value = optionsSelected.selectedMissionSucces;
    optionManned.value = optionsSelected.selectedMissionCrew;
};
