console.log('hoa mundo')
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    const fileInput = document.getElementById('docs');
    const errorMessage = document.getElementById('error-message');

    // Check the number of selected files
    if (fileInput.files.length < 3) {
        // Prevent form submission
        event.preventDefault();
        // Show error message
        errorMessage.style.display = 'inline';
    } else {
        // Hide error message
        errorMessage.style.display = 'none';
    }
});
