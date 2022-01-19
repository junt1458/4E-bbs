function close_overlay() {
    const overlay = document.getElementById('overlay');
    overlay.style = "display: none;";
}

function edit(id) {
    const overlay = document.getElementById('overlay');
    const overlay_title = document.getElementById('overlay_title');
    const overlay_name = document.getElementById('overlay_name');
    const overlay_content = document.getElementById('overlay_content');
    const overlay_edit = document.getElementById('overlay_edit');
    const overlay_postid = document.getElementById('overlay_postid');

    overlay.style = "display: flex;";
    overlay_title.innerText = id;
    overlay_edit.value = "";
    overlay_postid.value = id;

    overlay_name.value = document.getElementById('name__' + id).innerText;
    overlay_content.value = document.getElementById('content__' + id).innerText;
}