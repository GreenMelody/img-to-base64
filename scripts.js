// img-to-base64 기능
document.getElementById('convert-to-base64').addEventListener('click', function() {
    const imgContainer = document.getElementById('paste-img');
    const exportBase64 = document.getElementById('export-base64');

    if (imgContainer.querySelector('img')) {
        const img = imgContainer.querySelector('img');

        // 이미지가 로드된 후에 캔버스에 그리기
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const base64String = canvas.toDataURL('image/png');
            exportBase64.textContent = base64String;
        };

        // 이미지가 이미 로드된 경우에도 onload가 호출되도록 함
        if (img.complete) {
            img.onload();
        }
    } else {
        showToast('No image found or invalid content!');
    }
});

// img-to-base64 탭 Clear 기능
document.getElementById('clear-img-to-base64').addEventListener('click', function() {
    document.getElementById('paste-img').innerHTML = 'Paste image here';
    document.getElementById('export-base64').textContent = '';
});

// base64 복사 기능
document.getElementById('base64-copy').addEventListener('click', function() {
    const exportBase64 = document.getElementById('export-base64');
    const textArea = document.createElement('textarea');
    textArea.value = exportBase64.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // Toast 알림 표시
    showToast('Base64 copied to clipboard');
});

// base64-to-img 기능
document.getElementById('convert-to-img').addEventListener('click', function() {
    const pasteBase64 = document.getElementById('paste-base64');
    const exportImg = document.getElementById('export-img');
    const base64String = pasteBase64.textContent.trim();

    if (base64String.startsWith('data:image/')) {
        const img = new Image();
        img.src = base64String;
        exportImg.innerHTML = ''; // 이전 이미지 삭제
        exportImg.appendChild(img);
    } else {
        showToast('Invalid Base64 string!');
    }
});

// base64-to-img 탭 Clear 기능
document.getElementById('clear-base64-to-img').addEventListener('click', function() {
    document.getElementById('paste-base64').textContent = 'Paste base64 here';
    document.getElementById('export-img').innerHTML = '';
});

// 기존 내용 삭제 후 새로 붙여넣기 (이미지 붙여넣기 전용, 타이핑 불가)
document.getElementById('paste-img').addEventListener('paste', function(e) {
    e.preventDefault();
    const clipboardData = (e.clipboardData || window.clipboardData);
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                document.getElementById('paste-img').innerHTML = ''; // Clear previous content
                document.getElementById('paste-img').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
});


document.getElementById('paste-base64').addEventListener('paste', function(e) {
    e.preventDefault();
    const clipboardData = (e.clipboardData || window.clipboardData);
    const pastedData = clipboardData.getData('Text');
    document.getElementById('paste-base64').innerHTML = ''; // Clear previous content
    document.getElementById('paste-base64').textContent = pastedData;
});

// Toast 알림 표시 함수
function showToast(message) {
    const toastElement = document.getElementById('custom-toast');
    const toastBody = toastElement.querySelector('.toast-body');
    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}
