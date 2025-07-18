function openModal() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function downloadBackup() {
    const data = localStorage.getItem(`data_v${STORAGE_VERSION}`)
    if (data) {
        navigator.clipboard.writeText(data)
            .then(() => alert('Copied to clipboard!'))
            .catch(err => alert('Failed to copy: ' + err));
    } else {
        alert('No data found in localStorage for key "myData".');
    }
}

function restoreBackup() {
    const input = document.getElementById('backupInput').value;
    if (input) {
        localStorage.setItem(`data_v${STORAGE_VERSION}`, input);
        alert('Backup restored successfully!');
        location.reload(); // Reload to apply changes
    } else {
        alert('Please enter a valid backup data.');
    }
}