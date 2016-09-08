<!-- Using fakeLoader -->
    <script type="text/javascript">
        $("#fakeLoader").fakeLoader({
            // imagePath:"yourPath/customizedImage.gif", //If you want can you insert your custom image
            timeToHide: 1000,        // Animation lasts 1000 ms
            zIndex: 999,            // Make sure that the loader is always on top of any other elements
            spinner: "spinner2",    // Change spinner animation
            bgColor: "#5c2d91"        // Custom background colour
        });
    </script>
    <!-- Using sweetalert -->
    <script>
        $("#sweetalert").click(function () {
            swal({
                title: "Are you sure?",
                text: "you want to go back?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#5c2d91",
                confirmButtonText: "Yes",
                closeOnConfirm: false
            },
				function () {
				    swal("Success",
						"You have successfully go back.",
						"success");
				});
        });