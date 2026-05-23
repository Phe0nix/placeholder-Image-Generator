(function () {
    const MAX_SIZE = 4000;
    const MIN_SIZE = 1;

    const form = document.getElementById("placeholderForm");
    const widthInput = document.querySelector(".width");
    const heightInput = document.querySelector(".height");
    const bgInput = document.querySelector(".bgColor");
    const textColorInput = document.querySelector(".textColor");
    const labelInput = document.querySelector(".labelText");
    const filenameInput = document.querySelector(".fileName");
    const imageType = document.getElementById("imageType");
    const qualityWrap = document.getElementById("qualityWrap");
    const qualityInput = document.getElementById("quality_value");
    const qualityOutput = document.getElementById("qualityOutput");
    const lockAspect = document.getElementById("lockAspect");
    const swapDimensions = document.getElementById("swapDimensions");
    const presetSection = document.getElementById("presetSection");
    const presetButtons = document.querySelectorAll(".chip[data-size]");
    const presetCards = document.querySelectorAll(".preset-card[data-preset]");
    const togglePresets = document.getElementById("togglePresets");
    const randomPalette = document.getElementById("randomPalette");
    const downloadArea = document.getElementById("downloadArea");
    const downloadBtn = document.getElementById("downloadBtn");
    const copyDataUrl = document.getElementById("copyDataUrl");
    const copyShareUrl = document.getElementById("copyShareUrl");
    const errorMessage = document.getElementById("errorMessage");
    const metaInfo = document.getElementById("metaInfo");
    const canvas = document.getElementById("previewCanvas");

    const ctx = canvas.getContext("2d");
    const defaultState = {
        width: 1200,
        height: 628,
        bg: "#2f80ed",
        fg: "#ffffff",
        label: "",
        file: "placeholder-image",
        format: "png",
        quality: 85,
        lock: true
    };
    const namedPresets = {
        "og-image": {
            width: 1200,
            height: 630,
            bg: "#0f172a",
            fg: "#f8fafc",
            label: "Open Graph",
            file: "og-image",
            format: "webp",
            quality: 90,
            lock: true
        },
        "avatar-128": {
            width: 128,
            height: 128,
            bg: "#334155",
            fg: "#f8fafc",
            label: "Avatar",
            file: "avatar-128",
            format: "png",
            quality: 85,
            lock: true
        },
        "card-thumb": {
            width: 800,
            height: 450,
            bg: "#2563eb",
            fg: "#eff6ff",
            label: "Card Thumbnail",
            file: "card-thumbnail",
            format: "jpeg",
            quality: 85,
            lock: true
        },
        "hero-banner": {
            width: 1440,
            height: 720,
            bg: "#0f766e",
            fg: "#ecfeff",
            label: "Hero Banner",
            file: "hero-banner",
            format: "png",
            quality: 85,
            lock: true
        },
        "mobile-screen": {
            width: 390,
            height: 844,
            bg: "#7c3aed",
            fg: "#faf5ff",
            label: "Mobile Screen",
            file: "mobile-screen",
            format: "png",
            quality: 85,
            lock: true
        },
        "video-thumb": {
            width: 1280,
            height: 720,
            bg: "#be123c",
            fg: "#fff1f2",
            label: "Video Thumbnail",
            file: "video-thumbnail",
            format: "webp",
            quality: 90,
            lock: true
        }
    };
    let dataUrl = "";
    let aspectRatio = 1200 / 628;
    let selectedPreset = "";

    const setError = (message = "") => {
        errorMessage.textContent = message;
    };

    const parseDimension = (value, name) => {
        const numeric = Number(value);

        if (!Number.isFinite(numeric) || !Number.isInteger(numeric)) {
            throw new Error(`${name} must be a whole number.`);
        }

        if (numeric < MIN_SIZE || numeric > MAX_SIZE) {
            throw new Error(`${name} must be between ${MIN_SIZE} and ${MAX_SIZE} pixels.`);
        }

        return numeric;
    };

    const getQualityValue = () => Number(qualityInput.value) / 100;
    const getMimeType = () => `image/${imageType.value}`;

    const isValidHexColor = (value) => /^#[0-9a-f]{6}$/i.test(value);

    const getNormalizedFormat = (value) => {
        const format = (value || "").toLowerCase();

        if (["png", "jpeg", "webp"].includes(format)) {
            return format;
        }

        if (format === "jpg") {
            return "jpeg";
        }

        return defaultState.format;
    };

    const getCurrentState = () => ({
        width: widthInput.value.trim(),
        height: heightInput.value.trim(),
        bg: bgInput.value,
        fg: textColorInput.value,
        label: labelInput.value.trim(),
        file: filenameInput.value.trim(),
        format: imageType.value,
        quality: qualityInput.value,
        lock: lockAspect.checked
    });

    const getCollapsedPresetCount = () => (window.matchMedia("(max-width: 560px)").matches ? 1 : 2);

    const updatePresetToggleText = () => {
        togglePresets.textContent = presetSection.classList.contains("is-expanded") ? "View fewer presets" : "View more presets";
        togglePresets.setAttribute("aria-expanded", String(presetSection.classList.contains("is-expanded")));
    };

    const setPresetExpansion = (isExpanded) => {
        presetSection.classList.toggle("is-expanded", isExpanded);
        updatePresetToggleText();
    };

    const updatePresetSelection = (presetKey = "") => {
        selectedPreset = presetKey;
        presetCards.forEach((card) => {
            card.classList.toggle("is-active", card.dataset.preset === presetKey);
        });

        if (!presetKey) {
            return;
        }

        const selectedIndex = Array.from(presetCards).findIndex((card) => card.dataset.preset === presetKey);
        if (selectedIndex >= getCollapsedPresetCount()) {
            setPresetExpansion(true);
        }
    };

    const buildShareUrl = () => {
        const width = parseDimension(widthInput.value, "Width");
        const height = parseDimension(heightInput.value, "Height");
        const url = new URL(window.location.href);
        const state = getCurrentState();

        url.search = "";
        url.searchParams.set("w", String(width));
        url.searchParams.set("h", String(height));
        url.searchParams.set("bg", state.bg);
        url.searchParams.set("fg", state.fg);
        url.searchParams.set("format", state.format);
        url.searchParams.set("q", String(state.quality));
        url.searchParams.set("lock", state.lock ? "1" : "0");

        if (state.label) {
            url.searchParams.set("label", state.label);
        }

        if (state.file) {
            url.searchParams.set("file", state.file);
        }

        if (selectedPreset) {
            url.searchParams.set("preset", selectedPreset);
        }

        return url;
    };

    const syncUrlFromState = () => {
        try {
            const shareUrl = buildShareUrl();
            window.history.replaceState({}, "", shareUrl);
            copyShareUrl.disabled = false;
        } catch (_error) {
            // Skip URL sync while the form is incomplete or invalid.
            copyShareUrl.disabled = true;
        }
    };

    const applyState = (state) => {
        setDimensions(state.width, state.height);
        bgInput.value = state.bg;
        textColorInput.value = state.fg;
        labelInput.value = state.label;
        filenameInput.value = state.file;
        imageType.value = state.format;
        qualityInput.value = String(state.quality);
        lockAspect.checked = state.lock;
        qualityOutput.textContent = `${qualityInput.value}%`;
        updateQualityVisibility();
    };

    const applyPreset = (presetKey) => {
        const preset = namedPresets[presetKey];

        if (!preset) {
            return;
        }

        applyState(preset);
        updatePresetSelection(presetKey);
        generatePlaceholder();
    };

    const applyUrlConfig = () => {
        const params = new URLSearchParams(window.location.search);

        if (!params.toString()) {
            applyState(defaultState);
            return false;
        }

        const nextState = { ...defaultState };
        const width = params.get("w");
        const height = params.get("h");
        const bg = params.get("bg");
        const fg = params.get("fg");
        const label = params.get("label");
        const file = params.get("file");
        const format = params.get("format");
        const quality = params.get("q");
        const lock = params.get("lock");
        const preset = params.get("preset");

        if (preset && namedPresets[preset]) {
            Object.assign(nextState, namedPresets[preset]);
            updatePresetSelection(preset);
        } else {
            updatePresetSelection("");
        }

        if (width) {
            nextState.width = parseDimension(width, "Width");
        }

        if (height) {
            nextState.height = parseDimension(height, "Height");
        }

        if (bg && isValidHexColor(bg)) {
            nextState.bg = bg;
        }

        if (fg && isValidHexColor(fg)) {
            nextState.fg = fg;
        }

        if (label !== null) {
            nextState.label = label;
        }

        if (file !== null) {
            nextState.file = file;
        }

        nextState.format = getNormalizedFormat(format);

        if (quality !== null) {
            const qualityNumber = Number(quality);
            if (Number.isFinite(qualityNumber)) {
                nextState.quality = Math.min(100, Math.max(10, Math.round(qualityNumber)));
            }
        }

        if (lock !== null) {
            nextState.lock = lock !== "0" && lock !== "false";
        }

        applyState(nextState);
        return true;
    };

    const updateQualityVisibility = () => {
        const useQuality = imageType.value !== "png";
        qualityWrap.style.visibility = useQuality ? "visible" : "hidden";
    };

    const updateMeta = (width, height) => {
        const kbSize = Math.round((dataUrl.length * 3) / 4 / 1024);
        metaInfo.textContent = `${width}x${height} | ${imageType.value.toUpperCase()} | ~${kbSize}KB`;
    };

    const generateDataUrl = () => {
        const mimeType = getMimeType();
        const quality = getQualityValue();
        dataUrl = mimeType === "image/png" ? canvas.toDataURL(mimeType) : canvas.toDataURL(mimeType, quality);
    };

    const autoLabel = (width, height) => `${width} x ${height}`;

    const drawPlaceholder = (width, height) => {
        const label = (labelInput.value || "").trim() || autoLabel(width, height);
        const fontSize = Math.max(18, Math.round(Math.min(width, height) / 8));

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = bgInput.value;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = textColorInput.value;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `600 ${fontSize}px 'Space Mono', monospace`;
        ctx.fillText(label, width / 2, height / 2);

        generateDataUrl();
        updateMeta(width, height);
    };

    const setDownloadEnabled = (enabled) => {
        downloadBtn.disabled = !enabled;
        copyDataUrl.disabled = !enabled;
    };

    const generatePlaceholder = () => {
        try {
            const width = parseDimension(widthInput.value, "Width");
            const height = parseDimension(heightInput.value, "Height");

            aspectRatio = width / height;
            drawPlaceholder(width, height);
            setError();
            downloadArea.style.display = "flex";
            setDownloadEnabled(true);
            syncUrlFromState();
        } catch (error) {
            setError(error.message);
            setDownloadEnabled(false);
            metaInfo.textContent = "No image generated yet";
        }
    };

    const sanitizeFilename = (name) => {
        const baseName = (name || "").trim() || "placeholder-image";
        return baseName.replace(/[\\/:*?"<>|]+/g, "-");
    };

    const triggerDownload = () => {
        if (!dataUrl) {
            setError("Generate an image before download.");
            return;
        }

        const a = document.createElement("a");
        const extension = imageType.value === "jpeg" ? "jpg" : imageType.value;

        a.href = dataUrl;
        a.download = `${sanitizeFilename(filenameInput.value)}.${extension}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const copyUrl = () => {
        if (!dataUrl) {
            setError("Generate an image before copying data URL.");
            return;
        }

        if (!navigator.clipboard) {
            setError("Clipboard is not available in this browser.");
            return;
        }

        navigator.clipboard
            .writeText(dataUrl)
            .then(() => {
                setError("Data URL copied to clipboard.");
            })
            .catch(() => {
                setError("Could not copy data URL.");
            });
    };

    const copyShareableUrl = () => {
        if (!navigator.clipboard) {
            setError("Clipboard is not available in this browser.");
            return;
        }

        try {
            const shareUrl = buildShareUrl();
            window.history.replaceState({}, "", shareUrl);
            navigator.clipboard
                .writeText(shareUrl.toString())
                .then(() => {
                    setError("Share URL copied to clipboard.");
                })
                .catch(() => {
                    setError("Could not copy share URL.");
                });
        } catch (error) {
            setError(error.message);
        }
    };

    const setDimensions = (width, height) => {
        widthInput.value = String(width);
        heightInput.value = String(height);
        aspectRatio = width / height;
    };

    const handleDimensionSync = (changed) => {
        if (!lockAspect.checked) {
            return;
        }

        const width = Number(widthInput.value);
        const height = Number(heightInput.value);

        if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
            return;
        }

        if (changed === "width") {
            heightInput.value = String(Math.max(1, Math.round(width / aspectRatio)));
            return;
        }

        widthInput.value = String(Math.max(1, Math.round(height * aspectRatio)));
    };

    const randomHexColor = () => {
        const random = Math.floor(Math.random() * 16777215).toString(16);
        return `#${random.padStart(6, "0")}`;
    };

    const applyRandomPalette = () => {
        bgInput.value = randomHexColor();
        textColorInput.value = randomHexColor();
        if (dataUrl) {
            generatePlaceholder();
        }
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        generatePlaceholder();
    });

    widthInput.addEventListener("input", () => {
        updatePresetSelection("");
        handleDimensionSync("width");
        syncUrlFromState();
    });

    heightInput.addEventListener("input", () => {
        updatePresetSelection("");
        handleDimensionSync("height");
        syncUrlFromState();
    });

    imageType.addEventListener("change", () => {
        updatePresetSelection("");
        updateQualityVisibility();
        syncUrlFromState();
        if (dataUrl) {
            generatePlaceholder();
        }
    });

    qualityInput.addEventListener("input", () => {
        updatePresetSelection("");
        qualityOutput.textContent = `${qualityInput.value}%`;
        syncUrlFromState();
        if (dataUrl && imageType.value !== "png") {
            generatePlaceholder();
        }
    });

    swapDimensions.addEventListener("click", () => {
        updatePresetSelection("");
        const width = widthInput.value;
        widthInput.value = heightInput.value;
        heightInput.value = width;
        syncUrlFromState();

        if (dataUrl) {
            generatePlaceholder();
        }
    });

    lockAspect.addEventListener("change", () => {
        if (!lockAspect.checked) {
            updatePresetSelection("");
            syncUrlFromState();
            return;
        }

        const width = Number(widthInput.value);
        const height = Number(heightInput.value);
        if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
            aspectRatio = width / height;
        }

        syncUrlFromState();
    });

    presetButtons.forEach((button) => {
        button.addEventListener("click", () => {
            updatePresetSelection("");
            const size = button.getAttribute("data-size").split("x");
            const width = Number(size[0]);
            const height = Number(size[1]);

            setDimensions(width, height);
            syncUrlFromState();
            if (dataUrl) {
                generatePlaceholder();
            }
        });
    });

    presetCards.forEach((card) => {
        card.addEventListener("click", () => {
            applyPreset(card.dataset.preset);
        });
    });

    togglePresets.addEventListener("click", () => {
        setPresetExpansion(!presetSection.classList.contains("is-expanded"));
    });

    window.addEventListener("resize", () => {
        if (selectedPreset) {
            updatePresetSelection(selectedPreset);
        }
    });

    randomPalette.addEventListener("click", applyRandomPalette);
    downloadBtn.addEventListener("click", triggerDownload);
    copyDataUrl.addEventListener("click", copyUrl);
    copyShareUrl.addEventListener("click", copyShareableUrl);

    [bgInput, textColorInput, labelInput, filenameInput].forEach((field) => {
        field.addEventListener("input", () => {
            updatePresetSelection("");
            syncUrlFromState();
        });
    });

    // Quick-generate using Enter while editing fields.
    [widthInput, heightInput, labelInput, filenameInput].forEach((field) => {
        field.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                generatePlaceholder();
            }
        });
    });

    setPresetExpansion(false);
    downloadArea.style.display = "flex";
    setDownloadEnabled(false);
    copyShareUrl.disabled = false;

    try {
        const hasUrlConfig = applyUrlConfig();
        if (hasUrlConfig) {
            generatePlaceholder();
        } else {
            syncUrlFromState();
        }
    } catch (error) {
        applyState(defaultState);
        setError(error.message);
        syncUrlFromState();
    }
})();
