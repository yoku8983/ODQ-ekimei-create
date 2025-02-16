document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('stationCanvas');
    const ctx = canvas.getContext('2d');

    // 背景画像のロード
    const bgImage = new Image();
    bgImage.src = 'assets/background.png';
    bgImage.onload = () => {
        const originalWidth = bgImage.width;
        const originalHeight = bgImage.height;

        const newWidth = 1200;
        const scaleFactor = newWidth / originalWidth;
        const newHeight = originalHeight * scaleFactor;

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    };

    // 非表示用フラグ
    let hideCurrentNumber = false;
    let hideNextNumber = false;





    // テキスト描画関数
    function drawText(ctx, text, x, y, fontSize, maxWidth, fontFamily, color = '#000000', align = 'center') {
        ctx.textAlign = align;
        ctx.fillStyle = color;

        let currentFontSize = fontSize;
        ctx.font = `${currentFontSize}px "${fontFamily}"`;

        while (ctx.measureText(text).width > maxWidth) {
            currentFontSize -= 1;
            ctx.font = `${currentFontSize}px "${fontFamily}"`;
        }

        ctx.fillText(text, x, y);
    }

    // 角丸矩形描画関数
    function drawRoundedRect(ctx, x, y, width, height, radius, bgColor, borderColor, lineWidth) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    // 角丸矩形内に2段のテキストを描画する関数
    function drawTwoLineTextInRoundedRect(ctx, x, y, width, height, radius, bgColor, borderColor, textColor, lineWidth, line1, line2, fontSize1, fontSize2, fontFamily) {
        drawRoundedRect(ctx, x, y, width, height, radius, bgColor, borderColor, lineWidth);

        // 上段テキスト
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize1}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.fillText(line1, x + width / 2, y + height / 2.9);

        // 下段テキスト
        ctx.font = `${fontSize2}px ${fontFamily}`;
        ctx.fillText(line2, x + width / 2, y + (2 * height) / 2.4);
    }

    // 駅名標の描画
    function drawStationName() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        const stationNameKanji = document.getElementById('stationNameKanji').value;
        const stationNameHiragana = document.getElementById('stationNameHiragana').value;
        const stationNameRomaji = document.getElementById('stationNameRomaji').value;
        const previousStationNameKanji = document.getElementById('previousStationNameKanji').value;
        const previousStationNameRomaji = document.getElementById('previousStationNameRomaji').value;
        const nextStationNameKanji = document.getElementById('nextStationNameKanji').value;
        const nextStationNameRomaji = document.getElementById('nextStationNameRomaji').value;
        const currentStationSymbol = document.getElementById('currentStationSymbol').value;
        const nextStationSymbol = document.getElementById('nextStationSymbol').value;
        const currentStationNumber = document.getElementById('currentStationNumber').value;
        const nextStationNumber = document.getElementById('nextStationNumber').value;

        // 駅名部分
        drawText(ctx, stationNameKanji, canvas.width / 2, 115, 100, 750, "Mplus2c", "#000000");
        const stationKanjiWidth = ctx.measureText(stationNameKanji).width; // 幅を直接取得
        drawText(ctx, stationNameHiragana, canvas.width / 2, 330, 55, 380, "Mplus2c", "#000000");
        drawText(ctx, stationNameRomaji, canvas.width / 2, 190, 60, 550, "VialogLT", "#000000");

        // 前駅名部分
        drawText(ctx, previousStationNameKanji, canvas.width / 40, 330, 42, 170, "Mplus2c", "#000000", 'left');
        const prevKanjiWidth = ctx.measureText(previousStationNameKanji).width; // 幅を直接取得
        drawText(ctx, previousStationNameRomaji, canvas.width / 28 + prevKanjiWidth + 12, 330, 23, 170, "VialogLT, sans-serif", "#000000", 'left');
        
        // 次駅名部分
        drawText(ctx, nextStationNameKanji, canvas.width - canvas.width / 40, 330, 42, 170, "Mplus2c", "#000000", 'right');
        const nextKanjiWidth = ctx.measureText(nextStationNameKanji).width; // 幅を直接取得
        drawText(ctx, nextStationNameRomaji, canvas.width - canvas.width / 28 - nextKanjiWidth - 12, 330, 23, 170, "VialogLT, sans-serif", "#000000", 'right');

        const stationNumberColor = '#028CD4';

        // 現在駅ナンバリング
        if (!hideCurrentNumber) {
            drawTwoLineTextInRoundedRect(
                ctx,
                canvas.width / 2 - stationKanjiWidth / 1.8 - 120,
                70, // Y座標
                110, // 矩形の幅
                110,
                50,
                "#FFFFFF",
                stationNumberColor,
                stationNumberColor,
                9,
                currentStationSymbol,
                currentStationNumber,
                35,
                54,
                "FrutigerBold"
            );
        }

        // 次駅ナンバリング
        if (!hideNextNumber) {
            drawTwoLineTextInRoundedRect(
                ctx,
                canvas.width - 120, // X座標
                125, // Y座標
                80, // 矩形の幅
                80,  // 矩形の高さ
                37,  //矩形のラジアン
                "#FFFFFF",  // 矩形の塗りつぶしの色
                stationNumberColor,
                stationNumberColor,
                6,  // 矩形の枠線の太さ
                nextStationSymbol,
                nextStationNumber,
                25,  // 矩形の上段文字サイズ
                38,  // 矩形の下段文字サイズ
                "FrutigerBold"
            );
        }
    }

    // --- 追加機能: 駅名パターン自動補完 ---
    const stationPatternSelect = document.getElementById('stationPatternSelect');
    // stationPatterns 配列からプルダウンの option を生成
    stationPatterns.forEach((pattern, index) => {
    const option = document.createElement('option');
    option.value = index; // インデックスを値として使用
    option.textContent = pattern.stationNameKanji; // 表示は漢字駅名
    stationPatternSelect.appendChild(option);
    });

    // 補完ボタンのクリックイベントを追加
    document.getElementById('completeButton').addEventListener('click', function() {
    const selectedIndex = stationPatternSelect.value;
    if (selectedIndex !== "") {
        const pattern = stationPatterns[selectedIndex];
        document.getElementById('stationNameKanji').value = pattern.stationNameKanji;
        document.getElementById('stationNameHiragana').value = pattern.stationNameHiragana;
        document.getElementById('stationNameRomaji').value = pattern.stationNameRomaji;
        document.getElementById('previousStationNameKanji').value = pattern.previousStationNameKanji;
        document.getElementById('previousStationNameRomaji').value = pattern.previousStationNameRomaji;
        document.getElementById('nextStationNameKanji').value = pattern.nextStationNameKanji;
        document.getElementById('nextStationNameRomaji').value = pattern.nextStationNameRomaji;
        document.getElementById('currentStationSymbol').value = pattern.currentStationSymbol;
        document.getElementById('currentStationNumber').value = pattern.currentStationNumber;
        document.getElementById('nextStationSymbol').value = pattern.nextStationSymbol;
        document.getElementById('nextStationNumber').value = pattern.nextStationNumber;

        // 補完後、キャンバスを再描画（任意）
        drawStationName();
    }
    });

    document.getElementById('generateButton').addEventListener('click', drawStationName);

    // 初回描画を自動実行
    drawStationName(); // 初回描画関数を呼び出し

    // 描画をクリアして背景画像を再描画する関数
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); // 背景画像を再描画
    }



    document.getElementById('hideCurrentNumber').addEventListener('change', function () {
        hideCurrentNumber = this.checked;
        drawStationName(); // 再描画
    });

    document.getElementById('hideNextNumber').addEventListener('change', function () {
        hideNextNumber = this.checked;
        drawStationName(); // 再描画
    });


    // クリアボタンのイベントリスナーを追加
    document.getElementById('clearButton').addEventListener('click', clearCanvas);

    function saveCanvas() {
        const link = document.createElement('a');
        link.download = 'station-sign.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    document.getElementById('saveButton').addEventListener('click', saveCanvas);
});
