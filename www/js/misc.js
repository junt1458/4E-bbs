window.addEventListener('load', () => {
    const urlsp = new URLSearchParams(location.search);
    if(urlsp.has('order') && urlsp.get('order') == "desc")
        document.getElementById('order').value = "desc";
});

function change() {
    const order = document.getElementById('order').value;
    location.href = location.protocol + "//" + location.host + location.pathname + (order == "" ? "" : "?order=" + order);
}