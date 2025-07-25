function getLocationElement(item) {
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

    return locationElement;
}

function getAqcquiredElement(item, savedItem, row) {
    const acquiredElement = document.createElement('td');
    acquiredElement.classList.add('checkboxContainer')

    const acquiredCheckbox = document.createElement('input');
    acquiredCheckbox.type = 'checkbox';

    if (savedItem) acquiredCheckbox.checked = savedItem.acquired

    acquiredCheckbox.onclick = () => onAcquiredCheckboxToggle(item, acquiredCheckbox.checked, row)

    acquiredElement.appendChild(acquiredCheckbox);

    return acquiredElement;
}

function onAcquiredCheckboxToggle(item, state, row) {
    let savedData = getSavedData();

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

function getMasteredElement(item, savedItem, row) {
    const masteredElement = document.createElement('td');
    masteredElement.classList.add('checkboxContainer')

    const masteredCheckbox = document.createElement('input');
    masteredCheckbox.type = 'checkbox';

    if (savedItem) masteredCheckbox.checked = savedItem.mastered

    masteredCheckbox.onclick = () => onMasteredCheckboxToggle(item, masteredCheckbox.checked, row)
    masteredElement.appendChild(masteredCheckbox);

    return masteredElement;
}

function onMasteredCheckboxToggle(item, state, row) {
    let savedData = getSavedData();

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