// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
	'use strict'
  
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.needs-validation')
  
	// Loop over them and prevent submission
	Array.from(forms).forEach(form => {
	  form.addEventListener('submit', event => {
		if (!form.checkValidity()) {
		  event.preventDefault()
		  event.stopPropagation()
		}
  
		form.classList.add('was-validated')
	  }, false)
	})
  })();


  // event to  hide the reviews-header(h4 tag) until 1st review card dint exists
  document.addEventListener("DOMContentLoaded", function() {
    const reviewsContainer = document.querySelector('.reviews-container');
    const reviewsHeader = document.getElementById('reviews-header');
	const reviewHr = document.getElementById('review-hr')
    // Check if there are any review cards
    if (reviewsContainer.querySelector('.review-card')) {
        reviewsHeader.style.display = 'block';
		reviewHr.style.display = 'block';
    } else {
        reviewsHeader.style.display = 'none';
		reviewHr.style.display = 'none';
    }
});