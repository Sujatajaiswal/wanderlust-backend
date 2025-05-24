// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      // Check if the form is valid
      if (!form.checkValidity()) {
        event.preventDefault(); // Prevent form submission
        event.stopPropagation(); // Stop event propagation
      }

      form.classList.add("was-validated"); // Add Bootstrap validation class
    });
  });
})();
