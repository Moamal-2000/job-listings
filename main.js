"use strict";

const filtersLabel = document.querySelector("main .filter-label"),
  filtersHolder = document.querySelector("main .filter-label .filters "),
  clearButton = document.querySelector("main .filter-label .clear-button"),
  listings = document.querySelector("main .listings");





let languages = [],
  activeFilters = [],
  showLabelsTime = 0;




(async function getData() {
  const res = await fetch("data.json");
  const data = await res.json();

  // Get names filters
  for (const obj of data) languages = new Set([...languages, ...obj.languages]);
  createFilters();

  for (const obj of data) jobsLabelsStructure(obj);
})();





function jobsLabelsStructure(data) {
  // Job label container
  const jobLabel = document.createElement("div");
  jobLabel.classList.add("job-label");
  if (data.featured) jobLabel.classList.add("featured");
  listings.appendChild(jobLabel);
  setTimeout(() => {
    jobLabel.classList.add("active");
  }, showLabelsTime += 150);

  // Info side
  const infoSide = document.createElement("div");
  infoSide.classList.add("info-side");
  jobLabel.appendChild(infoSide);

    // <hr> Line inside Job label
    const line = document.createElement("hr");
    line.classList.add("line");
    jobLabel.appendChild(line);

  // company img container
  const imgContainer = document.createElement("div");
  imgContainer.classList.add("img");
  infoSide.appendChild(imgContainer);

  // company img
  const img = document.createElement("img");
  img.src = data.logo;
  img.alt = "";
  imgContainer.appendChild(img);

  // Content container
  const content = document.createElement("div");
  content.classList.add("content");
  infoSide.appendChild(content);

  // Line one container
  const lineOne = document.createElement("div");
  lineOne.classList.add("line-one");
  content.appendChild(lineOne);

  // Name Company
  const nameCompany = document.createElement("span");
  nameCompany.classList.add("company-name");
  nameCompany.innerHTML = data.company;
  lineOne.appendChild(nameCompany);

  // Events container
  const events = document.createElement("div");
  events.classList.add("events");
  lineOne.appendChild(events);

  // New event
  if (data.new) {
    const newEvent = document.createElement("span");
    newEvent.classList.add("new");
    newEvent.innerHTML = "NEW!";
    events.appendChild(newEvent);
  }

  // Featured event
  if (data.featured) {
    const featuredEvent = document.createElement("span");
    featuredEvent.classList.add("featured");
    featuredEvent.innerHTML = "Featured";
    events.appendChild(featuredEvent);
  }

  // Line two container
  const lineTwo = document.createElement("div");
  lineTwo.classList.add("line-two");
  content.appendChild(lineTwo);

  // Job Title
  const jobTitle = document.createElement("h2");
  jobTitle.classList.add("job-title");
  jobTitle.innerHTML = data.position;
  lineTwo.appendChild(jobTitle);

  // Line three container
  const lineThree = document.createElement("div");
  lineThree.classList.add("line-three");
  content.appendChild(lineThree);

  // Posted At
  const postedAt = document.createElement("span");
  postedAt.classList.add("posted-at");
  postedAt.innerHTML = data.postedAt;
  lineThree.appendChild(postedAt);

  // Dot span
  const dot = document.createElement("span");
  dot.classList.add("dot");
  dot.innerHTML = ".";
  lineThree.appendChild(dot);

  // Contract
  const contract = document.createElement("span");
  contract.classList.add("contract");
  contract.innerHTML = data.contract;
  lineThree.appendChild(contract);

  // Dot 2 span
  const dotTwo = document.createElement("span");
  dotTwo.classList.add("dot");
  dotTwo.innerHTML = ".";
  lineThree.appendChild(dotTwo);

  // Location
  const location = document.createElement("span");
  location.classList.add("location");
  location.innerHTML = data.location;
  lineThree.appendChild(location);

  // Skills container
  const skills = document.createElement("div");
  skills.classList.add("skills");
  jobLabel.appendChild(skills);

  // Create Language spans
  for (let i = 0; i < data.languages.length; i++) {
    const langSpan = document.createElement("span");
    langSpan.classList.add("language");
    langSpan.innerHTML = data.languages[i];
    skills.appendChild(langSpan);
    addFilter(langSpan)
  }
}






// Add filter
function addFilter(skill) {
  let isFilterExist = false
  const filters = document.querySelectorAll(".filter-label .filters .filter");
  skill.addEventListener('click', () => {
    filters.forEach(filter => {
      if (filter.children[0].textContent === skill.textContent)
        filter.classList.add("active");
    })

    // Check if filter is already exist in active filters array
    activeFilters.forEach(actFilter => {
      if (actFilter === skill.textContent) isFilterExist = true
    })

    // add filter if its not exist in active filters array
    if (!isFilterExist) {
      filterLabels()
      showLabelsTime = 0
      isFilterExist = false
    }
  })
}


// Delete filter
function delFilter(skill) {
  skill.addEventListener('click', () => {
    let nameFilter = skill.parentElement.children[0].textContent

    skill.parentElement.classList.remove('active')
    // Remove clicked filter from active filters list
    activeFilters = activeFilters.filter(actFilter =>  actFilter !== nameFilter)
    filterLabels()
    showLabelsTime = 0
  })
}






function createFilters() {
  languages.forEach((lang) => {
    // Create filter container
    const filter = document.createElement("div");
    filter.classList.add("filter");
    filtersHolder.appendChild(filter);

    // filter name
    const filterName = document.createElement("span");
    filterName.innerHTML = lang
    filter.appendChild(filterName);

    const delFilterButton = document.createElement("i");
    delFilterButton.className = "fa-solid fa-xmark";
    filter.appendChild(delFilterButton);

    delFilter(delFilterButton)
  });
}





function filterLabels() {
  const filters = document.querySelectorAll(".filter-label .filters .filter");


  setTimeout(() => {
    (activeFilters.length > 0) 
    ? filtersLabel.classList.add('active')
    : filtersLabel.classList.remove('active')
  }, 100);


  filters.forEach(filter => {
    if (filter.classList.contains('active'))
      activeFilters.push(filter.children[0].textContent)
  })

  // Delete repeated names
  activeFilters = Array.from(new Set([...activeFilters]))

  listings.innerHTML = '';

  (async function getData() {
    const res = await fetch("data.json");
    const data = await res.json();

    // Loop on data objects
    for (const obj of data) {
      let skillsExist = 0

      // Loop on data inside the object
      Array.from(obj.languages).forEach(lang => {
        // Loop on active filters
        activeFilters.forEach(actFilter => {
          /* add one if active filters array includes
             one of the languages in the obj */
          if (actFilter.includes(lang)) skillsExist++
        })
        
      })
      // Needed obj has found
      if (skillsExist === activeFilters.length) jobsLabelsStructure(obj)
      skillsExist = 0
    }
  })();
}





clearButton.addEventListener('click', () => {
  const filters = document.querySelectorAll(".filter-label .filters .filter");
  activeFilters = []

  filters.forEach(filter => {
    if (filter.classList.contains('active')) filter.classList.remove('active')
  })

  filterLabels()
})