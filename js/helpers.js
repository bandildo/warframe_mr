function fetchHTML(path) {
    return fetch('./html/' + path)
        .then(response => {
            return response.text();
        })
}