const folders = [
  { path: 'warframe', tabName: 'Warframe' },
  { path: 'primary', tabName: 'Primary' },
  { path: 'secondary', tabName: 'Secondary' },
  { path: 'melee', tabName: 'Melee' },
  { path: 'companion', tabName: 'Companion' },
  { path: 'vehicle', tabName: 'Vehicle' },
  { path: 'amp', tabName: 'Amp' }
];

const baseUrl = "https://wiki.warframe.com/w/"

const STORAGE_VERSION = 1

let savedData = new Map(
  JSON.parse(localStorage.getItem(`data_v${STORAGE_VERSION}`)) || []
);

window.onload = async () => {
  const tabButtons = document.getElementById('tabButtons');
  const tabContents = document.getElementById('tabContents');

  const allData = [];

  const folderData = await Promise.all(
    folders.map(async ({ path, tabName }) => {
      const files = await getJsonFiles(path);
      const data = await Promise.all(
        files.map(({ fullPath, type, subtype }) =>
          fetch(fullPath)
            .then(res => res.json())
            .then(items => items.map(item => ({ ...item, type, subtype })))
            .catch(err => {
              console.error(`Error loading ${fullPath}:`, err);
              return [];
            })
        )
      );

      const combined = data.flat();
      allData.push(...combined);
      return { tabName, data: combined };
    })
  );

  createTab('All', allData, true);
  folderData.forEach(({ tabName, data }) => createTab(tabName, data, false));
};


function createTab(tabName, data, isFirst) {
  const tabId = `tab-${tabName.replace(/\W+/g, '-')}`;

  // Create tab button
  const button = document.createElement('button');
  button.textContent = tabName;
  button.onclick = () => activateTab(tabId);
  if (isFirst) button.classList.add('active');
  document.getElementById('tabButtons').appendChild(button);

  // Create tab content
  const content = document.createElement('div');
  content.id = tabId;
  content.className = 'tab-content';
  if (isFirst) content.classList.add('active');
  document.getElementById('tabContents').appendChild(content);

  // Build table
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const headers = ['Name', '🌐', '🛠️', '👑'];
  const headerRow = document.createElement('tr');
  headers.forEach(key => {
    const tableHeader = document.createElement('th');
    tableHeader.textContent = key;
    headerRow.appendChild(tableHeader);
  });
  thead.appendChild(headerRow);

  data.forEach(item => {
    const row = document.createElement('tr');
    row.classList.add('data-row');

    let savedItem = savedData.get(item.name)

    if (savedItem?.acquired) row.classList.add('acquired')
    if (savedItem?.mastered) row.classList.add('mastered')

    // Name
    const nameContainer = document.createElement('td');
    nameContainer.classList.add('nameContainer')

    const nameLeftDivElement = document.createElement('div');

    const nameElement = document.createElement('a');
    nameElement.textContent = item.name;
    nameElement.href = getUrl(item)
    nameElement.target = '_blank';
    nameElement.rel = 'noopener noreferrer';
    nameLeftDivElement.appendChild(nameElement)

    const typeElement = document.createElement('span')
    typeElement.textContent = `${item.type} - ${item.subtype}`
    nameLeftDivElement.appendChild(typeElement)
    nameContainer.appendChild(nameLeftDivElement)

    if (Array.isArray(item.isIngredient) || Array.isArray(item.needsIngredient)) {
      ingredientElement = createIngredientElements(item)
      nameContainer.appendChild(ingredientElement)
    }

    row.appendChild(nameContainer)

    // Location
    const locationElement = document.createElement('td');
    locationElement.classList.add('locationContainer')

    const location = item.location.split("-");

    const locationContainer = document.createElement('div');

    const mainLocationElement = document.createElement('div');
    mainLocationElement.textContent = location[0];
    locationContainer.appendChild(mainLocationElement)

    if (location.length > 1) {
      const secondaryLocationElement = document.createElement('span')
      secondaryLocationElement.textContent = location[1]
      locationContainer.appendChild(secondaryLocationElement)
    }

    locationElement.appendChild(locationContainer);
    row.appendChild(locationElement);


    // Acquired checkbox
    const acquiredTd = document.createElement('td');
    acquiredTd.classList.add('checkboxContainer')
    const acquiredCheckbox = document.createElement('input');
    acquiredCheckbox.type = 'checkbox';
    if (savedItem) acquiredCheckbox.checked = savedItem.acquired
    acquiredCheckbox.onclick = () => onAcquiredCheckboxToggle(item, acquiredCheckbox.checked, row)
    acquiredTd.appendChild(acquiredCheckbox);
    row.appendChild(acquiredTd);

    // Mastered checkbox
    const masteredTd = document.createElement('td');
    masteredTd.classList.add('checkboxContainer')
    const masteredCheckbox = document.createElement('input');
    masteredCheckbox.type = 'checkbox';
    if (savedItem) masteredCheckbox.checked = savedItem.mastered
    masteredCheckbox.onclick = () => onMasteredCheckboxToggle(item, masteredCheckbox.checked, row)
    masteredTd.appendChild(masteredCheckbox);
    row.appendChild(masteredTd);

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  content.appendChild(table);
}

function activateTab(tabId) {
  // Deactivate all tabs and buttons
  document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

  // Activate the selected tab
  document.getElementById(tabId)?.classList.add('active');

  // Activate the corresponding button
  document.querySelectorAll('.tab-buttons button').forEach(btn => {
    if (`tab-${btn.textContent.replace(/\W+/g, '-')}` === tabId) {
      btn.classList.add('active');
    }
  });

  filterTables();
}


function filterTables() {
  const searchFilter = document.getElementById('searchInput').value.toLowerCase();
  const locationFilter = document.getElementById('locationDropdown').value;

  document.querySelectorAll('.tab-content.active table tbody tr').forEach(row => {
    const itemName = row.cells[0].textContent.toLowerCase();
    const itemLocation = row.cells[1].textContent.toLowerCase();

    if (locationFilter != 'all') {
      row.style.display = (itemName.includes(searchFilter) && itemLocation.startsWith(locationFilter)) ? '' : "None";
    }
    else {
      row.style.display = itemName.includes(searchFilter) ? '' : "None";
    }
  });
}

function createIngredientElements(item) {
  const ingredientsElement = document.createElement('div');
  ingredientsElement.className = 'tooltip';

  const tooltipText = document.createElement('div');
  tooltipText.className = 'tooltip-text';

  if (Array.isArray(item.needsIngredient)) {
    const needsIngredientIcon = document.createElement('img');
    needsIngredientIcon.src = './assets/icons/needs-ingredient.svg'
    ingredientsElement.appendChild(needsIngredientIcon);

    const needsIngredientTitle = document.createElement('div')
    needsIngredientTitle.textContent = 'Needs:'
    tooltipText.appendChild(needsIngredientTitle);

    needsIngredient = getItemsList(item.needsIngredient)
    tooltipText.appendChild(needsIngredient);
  }

  if (Array.isArray(item.isIngredient)) {
    const isIngredientIcon = document.createElement('img');
    isIngredientIcon.src = './assets/icons/is-ingredient.svg'
    ingredientsElement.appendChild(isIngredientIcon);

    const isIngredientTitle = document.createElement('div')
    isIngredientTitle.textContent = 'Used for:'
    tooltipText.appendChild(isIngredientTitle);

    isIngredientFor = getItemsList(item.isIngredient)
    tooltipText.appendChild(isIngredientFor);
  }

  ingredientsElement.appendChild(tooltipText);

  return ingredientsElement;
}

function getItemsList(items) {
  const list = document.createElement('ul');
  items.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
  return list
}


function onAcquiredCheckboxToggle(item, state, row) {
  const itemStatus = savedData.get(item.name);
  const newData = {
    acquired: state,
    mastered: itemStatus ? itemStatus.mastered : false
  };
  savedData.set(item.name, newData);

  state ? row.classList.add('acquired') : row.classList.remove('acquired')

  window.localStorage.setItem(
    `data_v${STORAGE_VERSION}`,
    JSON.stringify(Array.from(savedData.entries()))
  );
}


function onMasteredCheckboxToggle(item, state, row) {
  const itemStatus = savedData.get(item.name);
  const newData = {
    acquired: itemStatus ? itemStatus.acquired : false,
    mastered: state
  };
  savedData.set(item.name, newData);

  state ? row.classList.add('mastered') : row.classList.remove('mastered')

  window.localStorage.setItem(
    `data_v${STORAGE_VERSION}`,
    JSON.stringify(Array.from(savedData.entries()))
  );
}

function getUrl(item) {
  const path = item.redirect ? item.redirect : item.name.replace(/ /g, "_");
  return baseUrl + path
}

async function getJsonFiles(path) {
  const map = {
    'warframe': [
      'Simple.json',
      'Prime.json'
    ],
    'primary': [
      "Bow.json",
      "Kuva.json",
      "Launcher.json",
      "MK1.json",
      "Prime.json",
      "Rifle.json",
      "Shotgun.json",
      "Sniper.json",
      "Tenet.json"
    ],
    'secondary': [
      "Dual.json",
      "Kitgun.json",
      "Kuva.json",
      "MK1.json",
      "Prime.json",
      "Single.json",
      "Tenet.json",
      "Thrown.json"
    ],
    'melee': [
      "Assault Saw.json",
      "Claws.json",
      "Dagger.json",
      "Dual Daggers.json",
      "Dual Swords.json",
      "Fist.json",
      "Glaive.json",
      "Gunblade.json",
      "Hammer.json",
      "Heavy Blade.json",
      "Heavy Scythe.json",
      "Kuva.json",
      "Machete.json",
      "MK1.json",
      "Polearm.json",
      "Prime.json",
      "Rapier.json",
      "Scythe.json",
      "Sword-Shield.json",
      "Sword.json",
      "Tenet.json",
      "Tonfa.json",
      "Warfan.json",
      "Whip.json",
      "Zaw.json"
    ],
    'companion': [
      'Sentinel.json',
      'Robotic Weapon.json',
      'Prime Sentinel.json',
      'Prime Robotic Weapon.json',
      'Kubrow.json',
      'Kavat.json',
      'Moa.json',
      'Predasite.json',
      'Vulpaphyla.json',
      'Hound.json'
    ],
    'vehicle': [
      'Archwing.json',
      'Prime.json',
      'Arch-gun.json',
      'Arch-melee.json',
      'K-drive.json',
      'Necramech.json'
    ],
    'amp': ['Amp.json'],
  };

  return (map[path] || []).map(filename => ({
    fullPath: `assets/${path}/${filename}`,
    type: path.charAt(0).toUpperCase() + path.slice(1),
    subtype: filename.replace('.json', ''),
  }));
}