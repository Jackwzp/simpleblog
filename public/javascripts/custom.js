// $('.del-cat-btn').on('click', function(){
//     var id = $(this).attr('data-button');

// });

//============================
//  Category PUT and DELETE Modal
//============================       

$('#del-category').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget); //Button that triggered the modal
    var id = button.data('id') // Extract data-id attr of button

    // update the form's action path for the id
    var modal = $(this);
    modal.find('#del-cat-form').attr('action', '/categories/'+id);
});


$('#edit-category').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget); //Button that triggered the modal
    var id = button.data('id') // Extract data-id attr of button

    // update the form's action path for the id
    var modal = $(this);
    modal.find('#edit-cat-form').attr('action', '/categories/'+id);

    // set the form field to current title
    $('#edit-cat-form input[name=newtitle]').val(id);
});


//============================
//  Delete Posts
//============================       

// Set the data attribute of modal del button
$('#del-post').on('show.bs.modal', function(event) {
    var postTitle = $(event.relatedTarget).data('id');
    $(this).find('#del-post-btn').attr('data-id', postTitle);
});

// Delete post by DELETE request directly through ajax
$('#del-post-btn').on('click', function() {
    // get the post title to be deleted
    var postTitle = $(this).data('id');

    $.ajax({
      url: "/posts/" + postTitle,
      method: "DELETE"
    });

    // redirect to posts page
    window.location.replace('/posts');
});