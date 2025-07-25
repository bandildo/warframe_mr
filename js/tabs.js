function createTab(tabName, data, isFirst) {
    const tabId = `tab-${tabName}`;

    createTabButton(tabName, tabId, isFirst);

    const content = createTabContent(tabId, isFirst)

    const table = document.createElement('table');

    fetchHTML('table-headers.html').then(html => {
        const thead = document.createElement('thead');
        thead.innerHTML = html;
        table.appendChild(thead);
    })

    const tbody = document.createElement('tbody');

    let savedData = getSavedData();

    data.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('data-row');

        let savedItem = savedData.get(item.name)

        if (savedItem?.acquired) row.classList.add('acquired')
        if (savedItem?.mastered) row.classList.add('mastered')

        const nameContainer = getNameElement(item);
        row.appendChild(nameContainer)

        const locationElement = getLocationElement(item);
        row.appendChild(locationElement);

        const acquiredElement = getAqcquiredElement(item, savedItem, row);
        row.appendChild(acquiredElement);

        const masteredElement = getMasteredElement(item, savedItem, row);
        row.appendChild(masteredElement);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    content.appendChild(table);
}

function createTabButton(tabName, tabId, isFirst) {
    const button = document.createElement('button');

    button.textContent = tabName;
    button.onclick = () => activateTab(tabId);

    if (isFirst) button.classList.add('active');

    document.getElementById('tabButtons').appendChild(button);
}

function createTabContent(tabId, isFirst) {
    const content = document.createElement('div');
    content.id = tabId;
    content.className = 'tab-content';

    if (isFirst) content.classList.add('active');

    document.getElementById('tabContents').appendChild(content);

    return content;
}

function activateTab(tabId) {
    document.querySelectorAll('.tab-buttons button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    document.getElementById(tabId)?.classList.add('active');

    document.querySelectorAll('.tab-buttons button').forEach(btn => {
        if (`tab-${btn.textContent}` === tabId) {
            btn.classList.add('active');
        }
    });

    filterTables();
}