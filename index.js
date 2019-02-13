!(function() {
    // Placeholder image generator script start form here
    var w = document.querySelector(".width"),
        h = document.querySelector(".height"),
        r = document.querySelector(".result"),
        bg = document.querySelector(".bgColor"),
        block,
        genBtn = document.querySelector(".gen"),
        dl = document.querySelector(".download"),
        canva = document.querySelector(".block"),
        typeAndDownloadImage = document.querySelector(".type_and_download_image"),
        imageType = document.querySelector("#imageType"),
        quality = document.querySelector(".quality"),
        quality_value = document.querySelector("#quality_value"),
        c, url;

    // function execute after click the "Generate Image" button

    function createCanvas() {
        if (w.value === '' || w.value.match(/\s{1,}/)) {
            r.innerHTML = `<span>Please insert width of the image.</span>`;
            w.focus();
            typeAndDownloadImage.style.display = "none";
        } else if (isNaN(w.value)) {
            r.innerHTML = `<span>"${w.value}" is not a correct width value. Try - 45 / 50 / 85. kiddo!!</span>`;
            w.focus();
            typeAndDownloadImage.style.display = "none";
        } else if (h.value === '' || h.value.match(/\s{1,}/)) {
            r.innerHTML = `<span>Please insert height of the image.</span>`;
            h.focus();
            typeAndDownloadImage.style.display = "none";
        } else if (isNaN(h.value)) {
            r.innerHTML = `<span>"${h.value}" is not a correct height value. Try - 45 / 50 / 85. kiddo!!</span>`;
            h.focus();
            typeAndDownloadImage.style.display = "none";
        } else {
            r.innerHTML = "";
            canva.style.display = "block";
            canva.setAttribute("width", parseInt(w.value) + "px");
            canva.setAttribute("height", parseInt(h.value) + "px");
            c = canva.getContext("2d");
            c.fillStyle = bg.value;
            c.fillRect(0, 0, w.value, h.value);
            c.font = w.value / 15 + "px Helvetica";
            c.fillStyle = "#fff";
            c.textAlign = "center";
            c.fillText("" + w.value + "px / " + h.value + "px", (w.value / 2), (h.value / 2));
            r.appendChild(canva);
            typeAndDownloadImage.style.display = "block";
            url = canva.toDataURL();
        }
    }

    imageType.addEventListener("input", function() {
        if (this.value === "png") {
            quality.style.display = "none";
        } else {
            url = canva.toDataURL("image/jpeg");
            quality.style.display = "block";
        }
    });

    quality_value.addEventListener("input", function() {
        if (this.value === "low") {
            url = canva.toDataURL("image/jpeg", 0.1);
        } else if (this.value === "med") {
            url = canva.toDataURL("image/jpeg", 0.6);
        } else {
            url = canva.toDataURL("image/jpeg", 1.0);
        }
    });

    function downloadImage() {
        if (url) {
            this.setAttribute("href", url);
            this.setAttribute("download", "new-generate-image-kiddo");
        } else {
            alert("Please choose a image format first.");
        }

    }

    genBtn.addEventListener("click", createCanvas);

    dl.addEventListener("click", downloadImage);

    // Placeholder image generator script ends here
})();
