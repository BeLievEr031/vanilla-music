document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('preview-container');

    dropArea.addEventListener("dragenter", (e) => {
        preventDefaults(e)
        isHighlight(true)
    })

    dropArea.addEventListener("dragover", (e) => {
        preventDefaults(e)
        isHighlight(true)
    })

    dropArea.addEventListener("dragleave", (e) => {
        preventDefaults(e)
        isHighlight(false)
    })

    dropArea.addEventListener("drop", (e) => {
        preventDefaults(e)
        isHighlight(false)
        handleDrop(e)
    })

    dropArea.addEventListener("click", () => {
        fileInput.click();
    })
    
    // Handle file input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files)
    }, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function isHighlight(isHighlight) {
        if (isHighlight) {
            dropArea.classList.add('highlight');
            return;
        }
        dropArea.classList.remove('highlight');
        return;
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        console.log(files);
        handleFiles(files);
    }

    function handleFiles(files) {
        files = [...files];
        files.forEach(previewFile);
    }

    function previewFile(file) {
        const reader = new FileReader();//BOM FileReader

        reader.readAsDataURL(file);
        reader.onloadend = function () {
            const audio = document.createElement('audio');
            audio.setAttribute("controls", "")
            const source = document.createElement('source');
            source.setAttribute("type", "audio/mpeg")

            source.src = reader.result;
            console.log(reader);

            audio.appendChild(source)
            previewContainer.appendChild(audio);
        };
    }
});
