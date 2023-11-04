function copyToClipboard(shortUrl) {
    var input = document.createElement('input');
    input.setAttribute('value', shortUrl);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    if(result) { // if the result is true, the copy was successful
        // Assuming you have an element with the ID "success" in your HTML
        var success = $("#success"); // Use jQuery to select the element with the ID "success"
        success.fadeIn('slow').delay(1000).fadeOut('slow'); // Chain the fadeIn and fadeOut with a delay
    }
}