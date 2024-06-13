var rootVar = 'https://app-node.enterprisetalk.com:3000';

$(function () {
    "use strict";

    var fullHeight = function () {
      $('.js-fullheight').css('height', $(window).height());
      $(window).on('resize', function () {
        $('.js-fullheight').css('height', $(window).height());
      });
    };

    fullHeight();

    // $('#sidebarCollapse').on('click', function () {
    //   $('#sidebar').toggleClass('active');
    //   console.log('clicked');
    // });
  });

  var getDateTime = function () {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


     

  $("#logoutBtn").click(function(e){

  // Prevent button default action
  e.preventDefault();
  console.log('logout pressed');

  Swal.fire({
    // text: "Are you sure to Delete",
    // title: `${deleteCat}`,
    // text: "You won't be able to revert this!",
    icon: "warning",
    text: 'Are you sure you want to Sign-Out?',
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Sign-out!"

  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log('logout confiemd');

      try {
        const response = await fetch(`${rootVar}/api/users/logout`,
          {
            method: "POST",
          }).then(response => {
            if (!response.ok) {
              throw new error(`Logout Error`);
            }
            return response.json();
          }).then(data => {
           // Navigate to the home page
           
           // Replace the current history entry with the home page
           window.location.replace(`${rootVar}/login`);
           history.replaceState(null, null, `${rootVar}/login`);
            // window.location.replace(`${rootVar}/login`)


          })
      } catch (error) {
        console.log(error);
      }
    }
    })
  
  })