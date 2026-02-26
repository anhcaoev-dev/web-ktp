@echo off
echo =======================================================
echo DANG DONG BO THAY DOI LEN GITHUB...
echo =======================================================
echo.

echo Bước 1: Kiem tra cac file thay doi...
git status
echo.

echo Bước 2: Them file vao phien ban luu tru...
git add .
echo.

echo Bước 3: Tao commit...
git commit -m "Cap nhat duong dan slug thanh thung-carton"
echo.

echo Bước 4: Day code len github...
git push
echo.

echo Hoan tat! Neu thay thong bao loi mau do, vui long kiem tra lai ket noi hoac quyen Git.
pause
