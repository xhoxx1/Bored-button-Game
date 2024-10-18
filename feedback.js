document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Here you would typically send the data to a server
        // For this example, we'll just log it to the console
        console.log('Feedback submitted:', data);

        // Show a thank you message
        alert('Thank you for your feedback!');

        // Reset the form
        form.reset();
    });
});
