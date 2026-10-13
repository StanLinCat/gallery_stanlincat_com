照片工具說明
============

這兩個工具會幫照片「縮小、轉正、移除 GPS 位置等隱藏資訊」，
讓你可以放心把照片放上網站。

  photos-for-site.bat     照片要放在網站 repo 裡用
  photos-for-upload.bat   照片要上傳到 Flickr / Unsplash 用


一、使用步驟
------------

1. 把要處理的照片放進 photos-inbox 資料夾
   （第一次可以先雙擊任一個 .bat，它會幫你建好並打開這個資料夾）

2. 雙擊其中一個 .bat：

   ■ photos-for-site.bat
     處理好的照片會放在 src\assets\photos
     完成後會自動打開那個資料夾

   ■ photos-for-upload.bat
     處理好的照片會放在 photos-ready
     完成後會自動打開那個資料夾，把裡面的照片拿去上傳 Flickr / Unsplash

3. 看完結果，按任意鍵關閉視窗


二、工具會做什麼
----------------

- 移除照片裡的隱藏資訊：GPS 拍攝地點、相機型號、拍攝時間等
- 手機直拍的照片會自動轉正
- 長邊縮到最多 2400px，存成 JPG
- 檔名改成英文小寫、空白換成 -，中文字會被拿掉
  例：My Trip 台北.JPG → my-trip.jpg
  整個檔名都是中文的話，會變成 photo-一串英數字.jpg
- 同名的照片已經處理過，就會略過，不會覆蓋


三、把照片加到網站上
--------------------

照片處理好後，打開 src\data\gallery.json，在最前面加一筆：

【放在 repo 的照片】
  {
    "src": "../assets/photos/my-trip.jpg",
    "alt": "照片內容的文字描述",
    "title": "照片標題",
    "description": "比較長的說明",
    "categories": ["Travel"],
    "date": "2026-10-13",
    "photographer": "StanLinCat"
  },

【Flickr / Unsplash 的照片】
  src 改填圖片網址（在照片上按右鍵 →「複製圖片網址」）：
    "src": "https://live.staticflickr.com/.../xxxx_k.jpg",
  Flickr 的照片請加上連回 Flickr 照片頁的連結：
    "photographerLink": "https://www.flickr.com/photos/你的帳號/照片編號"

注意：每一筆之間要用逗號 , 隔開，最後一筆後面不要有逗號。


四、注意事項
------------

- 需要先安裝 Node.js（https://nodejs.org）
- 第一次使用會自動安裝需要的套件，要等一下，需要網路
- iPhone 的 HEIC 照片不支援，請先轉成 JPG
  （或 iPhone 設定 → 相機 → 格式 → 選「最相容」，以後就直接拍 JPG）
- photos-inbox 和 photos-ready 裡的照片不會被 commit 到 git，
  原始照片只留在你的電腦裡
- 想重新處理同一張照片：先刪掉輸出資料夾裡的舊檔，再執行一次
- 進階：也可以在終端機執行 yarn photos 或 yarn photos --out photos-ready
