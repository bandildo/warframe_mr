const allElement = document.getElementById('allStats');
const warframeElement = document.getElementById('warframeStats');
const primaryElement = document.getElementById('primaryStats');
const secondaryElement = document.getElementById('secondaryStats');
const meleeElement = document.getElementById('meleeStats');
const companionElement = document.getElementById('companionStats');
const vehicleElement = document.getElementById('vehicleStats');
const ampElement = document.getElementById('ampStats');

const statsModal = document.getElementById('statsModal')

function openStatsModal() {
    calculateStatistics();

    statsModal.style.display = 'block';
}

window.addEventListener('click', function (event) {
    if (event.target === statsModal) {
        allElement.innerHTML = '';
        warframeElement.innerHTML = '';
        primaryElement.innerHTML = '';
        secondaryElement.innerHTML = '';
        meleeElement.innerHTML = '';
        companionElement.innerHTML = '';
        vehicleElement.innerHTML = '';
        ampElement.innerHTML = '';

        statsModal.style.display = 'none';
        return
    }
});

function calculateStatistics() {
    var allDataMap = {}
    allData.forEach(item => allDataMap[item.name] = item);

    let allAcquired = 0;
    let allMastered = 0;

    let warframeStats = new StatisticsEntry(
        allData.filter(item => item.type === 'Warframe').length,
        'Warframe'
    );

    let primaryStats = new StatisticsEntry(
        allData.filter(item => item.type === 'Primary').length,
        'Primary'
    );

    let secondaryStats = new StatisticsEntry(
        allData.filter(item => item.type === 'Secondary').length,
        'Secondary'
    );

    let meleeStats = new StatisticsEntry(
        allData.filter(item => item.type === 'Melee').length,
        'Melee'
    );

    let companionStats = new StatisticsEntry(
        allData.filter(item => item.type === 'Companion').length,
        'Companion'
    );

    let vehicleStats = new StatisticsEntry(
        allData.filter(item => item.type === 'Vehicle').length,
        'Vehicle'
    );

    let ampStats = new StatisticsEntry(
        allData.filter(item => item.type === 'Amp').length,
        'Amp'
    );

    getSavedData().forEach((itemStatus, itemName) => {
        if (itemStatus.mastered) {
            allMastered++;
        }
        if (itemStatus.acquired) {
            allAcquired++;
        }

        warframeStats.processItem(allDataMap[itemName], itemStatus);
        primaryStats.processItem(allDataMap[itemName], itemStatus);
        secondaryStats.processItem(allDataMap[itemName], itemStatus);
        meleeStats.processItem(allDataMap[itemName], itemStatus);
        companionStats.processItem(allDataMap[itemName], itemStatus);
        vehicleStats.processItem(allDataMap[itemName], itemStatus);
        ampStats.processItem(allDataMap[itemName], itemStatus);
    });

    let allStats = new StatisticsEntry(
        allData.length,
        'All',
        allAcquired,
        allMastered,
    );

    allElement.appendChild(allStats.contentElements);
    warframeElement.appendChild(warframeStats.contentElements);
    primaryElement.appendChild(primaryStats.contentElements);
    secondaryElement.appendChild(secondaryStats.contentElements);
    meleeElement.appendChild(meleeStats.contentElements);
    companionElement.appendChild(companionStats.contentElements);
    vehicleElement.appendChild(vehicleStats.contentElements);
    ampElement.appendChild(ampStats.contentElements);
}

class StatisticsEntry {

    type = "";

    acquired = 0;
    mastered = 0;
    total = 0;

    constructor(total, type, acquired = 0, mastered = 0) {
        this.total = total;
        this.acquired = acquired;
        this.mastered = mastered;
        this.type = type;
    }

    processItem(item, itemStatus) {
        if (item.type === this.type) {
            if (itemStatus.mastered) this.mastered++;
            if (itemStatus.acquired) this.acquired++;
        }
    }


    get masteredPercentage() {
        return ((this.mastered / this.total) * 100).toFixed(1);
    }

    get acquiredPercentage() {
        return ((this.acquired / this.total) * 100).toFixed(1);
    }

    get contentElements() {
        const contentElements = document.createDocumentFragment()

        const typeCell = document.createElement('td')
        typeCell.innerHTML = this.type;
        contentElements.appendChild(typeCell);

        const acquiredCell = document.createElement('td');
        acquiredCell.innerHTML = `${this.acquired} (${this.acquiredPercentage}%)`
        contentElements.appendChild(acquiredCell);

        const masteredCell = document.createElement('td');
        masteredCell.innerHTML = `${this.mastered} (${this.masteredPercentage}%)`
        contentElements.appendChild(masteredCell);

        const totalCell = document.createElement('td');
        totalCell.innerHTML = `${this.total}`
        contentElements.appendChild(totalCell);

        // contentElements.innerHTML = `${this.type}: ${this.acquired} (${this.acquiredPercentage}%) / ${this.mastered} (${this.masteredPercentage}%) / ${this.total}`

        return contentElements
    }
}