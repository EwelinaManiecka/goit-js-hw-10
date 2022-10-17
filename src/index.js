import './css/styles.css';
import debounce from "lodash.debounce";
// import Notiflix, { Notify } from "notiflix";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {fetchCountries} from "./fetchCountries";

const DEBOUNCE_DELAY = 300;

const inputCountry = document.querySelector("#search-box");
const listCountry = document.querySelector(".country-list");
const infoCountry = document.querySelector(".country-info");

inputCountry.addEventListener("input", debounce(onInputWrite, DEBOUNCE_DELAY));

function onInputWrite(event) {
    let nameCountry = event.target.value.trim();
    if (!nameCountry) {
        return;
    }
    fetchCountries(nameCountry)
    .then(more => {
        if (more.length > 10) {
            infoCountry.innerHTML = "";
            listCountry.innerHTML = "";
            return Notify.info(
                `Too many matches found. Please enter a more specific name.`
            );
        }
        if (more.length === 1) {
            listCountry.innerHTML = "";
            return (infoCountry.innerHTML = onRenderCountryCard(more));
        }
        infoCountry.innerHTML = "";
        listCountry.innerHTML = onRenderList(more);
    })
    .catch(error => {
        infoCountry.innerHTML = "";
        listCountry.innerHTML = "";
    });
}

function onRenderList(array) {
    return array
    .map(
        ({name, flags}) => 
        `<li class="country-item"><img src="${flags.svg}"
        alt="${name.official}" width="32" height="20">
        <p class="country-text">${name.official}</p></li>`
    )
    .join("");
}

function onRenderCountryCard(array) {
    return array
    .map(
        ({name, capital, population, flags, languages}) =>
        `<div class = "country-item"><img src="${flags.svg}" 
        alt="${"name.official"} width = "64" height = "40">
        <h1 class="country-text">${name.official}</h1></div>
        <p class="country-text-info">Capital: ${capital}</p>
        <p class="country-text-info">Population: ${population}</p>
        <p class="country-text-info">Languages: ${Object.values(languages)}</p>`
    )
    .join();
}