function getNameElement(item) {
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

    return nameContainer
}

function getUrl(item) {
    const path = item.redirect ? item.redirect : item.name.replace(/ /g, "_");
    return baseUrl + path
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

        needsIngredient = getIngredientsList(item.needsIngredient)
        tooltipText.appendChild(needsIngredient);
    }

    if (Array.isArray(item.isIngredient)) {
        const isIngredientIcon = document.createElement('img');
        isIngredientIcon.src = './assets/icons/is-ingredient.svg'
        ingredientsElement.appendChild(isIngredientIcon);

        const isIngredientTitle = document.createElement('div')
        isIngredientTitle.textContent = 'Used for:'
        tooltipText.appendChild(isIngredientTitle);

        isIngredientFor = getIngredientsList(item.isIngredient)
        tooltipText.appendChild(isIngredientFor);
    }

    ingredientsElement.appendChild(tooltipText);

    return ingredientsElement;
}

function getIngredientsList(items) {
    const list = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');

        const liContainer = document.createElement('div');
        liContainer.className = 'liContainer';

        const itemName = document.createElement('p');
        itemName.textContent = item;
        liContainer.appendChild(itemName);

        const masteryIcon = document.createElement('img');
        masteryIcon.src = getSavedData().get(item)?.mastered ? './assets/icons/warframe_green.svg' : './assets/icons/warframe_red.svg';
        liContainer.appendChild(masteryIcon);

        li.appendChild(liContainer);

        list.appendChild(li);
    });
    return list
}