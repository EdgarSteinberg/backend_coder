// document.getElementById('uploadForm').addEventListener('submit', function (event) {
//     const fileInput = document.getElementById('docs');
//     const errorMessage = document.getElementById('error-message');

//     // Check the number of selected files
//     if (fileInput.files.length < 3) {
//         // Prevent form submission
//         event.preventDefault();
//         // Show error message
//         errorMessage.style.display = 'inline';
//     } else {
//         // Hide error message
//         errorMessage.style.display = 'none';
//     }
// });
document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const form = event.target;
    const fileInput = document.getElementById('docs');
    const userId = document.getElementById('userId').value;
    const errorMessage = document.getElementById('error-message');

    // Check the number of selected files
    if (fileInput.files.length < 3) {
        // Show error message
        errorMessage.style.display = 'inline';
        return;
    } else {
        // Hide error message
        errorMessage.style.display = 'none';
    }

    // Prepare form data
    const formData = new FormData(form);
    
    // Use fetch to submit the form
    try {
        const response = await fetch(`/api/users/${userId}/documents`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Handle success (e.g., redirect or show a success message)
            alert('Documents uploaded successfully');
            window.location.href = '/profile'; // Adjust based on desired behavior
        } else {
            // Handle error
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        alert('An unexpected error occurred.');
    }
});
