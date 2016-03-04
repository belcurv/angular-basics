(function () {
    'use strict';

    $(document).ready(function () {

        var currentStep = 0;

        $("#step1").hide();
        $("#step2").hide();

        $("#btnStep1").click(function () {

            $("#step1").show();
            $("#step2").hide();

            // update the database...
            currentStep = 1;
        });

        $("#btnStep2").click(function () {

            $("#step1").hide();
            $("#step2").show();

            // update the database...
            currentStep = 2;
        });
    });
}());
