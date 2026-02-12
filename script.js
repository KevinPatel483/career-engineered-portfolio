document.addEventListener("DOMContentLoaded", () => {

    const btn1 = document.getElementById("resumeBtn");
    const btn2 = document.getElementById("resumeBtn2");

    function showContact(e){
        e.preventDefault();
        alert("Recruiters: Email Kevin Patel at pk6125626@gmail.com to request my Technical Resume.");
    }

    if(btn1) btn1.addEventListener("click", showContact);
    if(btn2) btn2.addEventListener("click", showContact);

});
