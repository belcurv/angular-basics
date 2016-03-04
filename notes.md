What problem is Angular trying to solve?
1) How jQuery would have done it...

    $(document).ready(function() {

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
    
That doesn't look bad, but what it there were 20 steps?  The problem is we spend a ton of time manually manipulating the DOM.  After a while this gets overwhelming to maintain.