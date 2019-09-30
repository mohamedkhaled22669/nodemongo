function deleteEvent() {

    var btn = document.getElementById('deleteBtn');
    var id = btn.getAttribute('data-id');


    axios.delete('/events/delete/' + id)
        .then(function(res) {

            console.log(res.data);
            alert('event was deleted');
            window.location.href = '/events';
        })
        .catch(function(err) {

            console.log(err);
        });
}

//upload avatar
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var image = document.getElementById('imagePlaceholder');
            image.style.display = 'block';
            image.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }

}