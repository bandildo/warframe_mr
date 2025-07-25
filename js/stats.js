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

    let totalAcquired = 0;
    let totalMastered = 0;

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

    savedData.forEach((itemStatus, itemName) => {
        if (itemStatus.mastered) {
            totalMastered++;
        }
        if (itemStatus.acquired) {
            totalAcquired++;
        }

        warframeStats.processItem(allDataMap[itemName], itemStatus);
        primaryStats.processItem(allDataMap[itemName], itemStatus);
        secondaryStats.processItem(allDataMap[itemName], itemStatus);
        meleeStats.processItem(allDataMap[itemName], itemStatus);
        companionStats.processItem(allDataMap[itemName], itemStatus);
        vehicleStats.processItem(allDataMap[itemName], itemStatus);
        ampStats.processItem(allDataMap[itemName], itemStatus);
    });

    let totalElement = document.getElementById('totalStats');
    let totalAcquiredPercentage = ((totalAcquired / allData.length) * 100).toFixed(2)
    let totalMasteredPercentage = ((totalMastered / allData.length) * 100).toFixed(2)
    totalElement.innerHTML = `Total: ${totalAcquired} (${totalAcquiredPercentage}%) / ${totalMastered} (${totalMasteredPercentage}%) / ${allData.length}`;

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

    constructor(total, type) {
        this.total = total;
        this.type = type;
    }

    processItem(item, itemStatus) {
        if (item.type === this.type) {
            if (itemStatus.mastered) this.mastered++;
            if (itemStatus.acquired) this.acquired++;
        }
    }


    get masteredPercentage() {
        return ((this.mastered / this.total) * 100).toFixed(2);
    }

    get acquiredPercentage() {
        return ((this.acquired / this.total) * 100).toFixed(2);
    }

    get contentElements() {
        const contentElements = document.createElement('span');
        contentElements.innerHTML = `${this.type}: ${this.acquired} (${this.acquiredPercentage}%) / ${this.mastered} (${this.masteredPercentage}%) / ${this.total}`
        return contentElements
    }
}