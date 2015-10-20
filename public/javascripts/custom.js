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