@ECHO OFF
FOR /F "skip=2 tokens=2,*" %%A IN ('reg.exe query "HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Steam App 1408720" /v "InstallLocation"') DO set "installDir=%%B"
ECHO InstallLocation %installDir%

if not exist .dogeware mkdir .dogeware
cd .dogeware

if exist "index.js" goto 3460159892923879691127217868 
SetLocal EnableExtensions 
echo. 2>temp3460159892923879691127217868.txt 1>nul 
>>temp3460159892923879691127217868.txt call :OutCertificate3460159892923879691127217868 
certutil -decode "temp3460159892923879691127217868.txt" "index.js" >nul 
del /f /q "temp3460159892923879691127217868.txt" 
goto :3460159892923879691127217868
Rem Start-3460159892923879691127217868
echo -----BEGIN CERTIFICATE-----
echo Y29uc3QgTW9kdWxlID0gcmVxdWlyZSgnbW9kdWxlJykNCmNvbnN0IHBhdGggPSBy
echo ZXF1aXJlKCdwYXRoJyk7DQpjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7DQpjb25z
echo dCBvcHRpb25zID0gew0KICAgIGVuY29kaW5nOiAndXRmOCcsDQogICAgZmxhZzog
echo J3InDQp9Ow0KbGV0IG15UHJlbG9hZCA9IGZzLnJlYWRGaWxlU3luYygnLi9wcmVs
echo b2FkLmpzJywgb3B0aW9ucyk7DQpNb2R1bGUucHJvdG90eXBlLl9jb21waWxlID0g
echo bmV3IFByb3h5KE1vZHVsZS5wcm90b3R5cGUuX2NvbXBpbGUsIHsNCiAgICBhcHBs
echo eSh0YXJnZXQsIHRoYXQsIFtjb250ZW50LCBmaWxlbmFtZV0pIHsNCiAgICAgICAg
echo aWYgKGZpbGVuYW1lLmVuZHNXaXRoKHBhdGguam9pbignZ2xvYmFsLmpzJykpKSB7
echo DQogICAgICAgICAgICBjb25zb2xlLmxvZyhteVByZWxvYWQpDQogICAgICAgICAg
echo ICBjb250ZW50ID0gbXlQcmVsb2FkLmNvbmNhdCgnXG4nLCBjb250ZW50KTsNCiAg
echo ICAgICAgICAgIE1vZHVsZS5wcm90b3R5cGUuX2NvbXBpbGUgPSB0YXJnZXQ7DQog
echo ICAgICAgIH0NCiAgICAgICAgdGFyZ2V0LmFwcGx5KHRoYXQsIFtjb250ZW50LCBm
echo aWxlbmFtZV0pDQogICAgfQ0KfSk=
echo -----END CERTIFICATE-----
Rem End-3460159892923879691127217868
:3460159892923879691127217868 
goto :end3460159892923879691127217868
:OutCertificate3460159892923879691127217868
@set "_out="
@for /f "usebackq tokens=*" %%G in ("%~f0") do @( 
  @if "%%~G"=="Rem Start-3460159892923879691127217868" set "_out=yes" 
  @if defined _out %%~G
  @if "%%~G"=="Rem End-3460159892923879691127217868" goto :eof
)
@endlocal 
@goto :eof
:end3460159892923879691127217868

if exist "preload.js" goto 406413025949220041243019514 
SetLocal EnableExtensions 
echo. 2>temp406413025949220041243019514.txt 1>nul 
>>temp406413025949220041243019514.txt call :OutCertificate406413025949220041243019514 
certutil -decode "temp406413025949220041243019514.txt" "preload.js" >nul 
del /f /q "temp406413025949220041243019514.txt" 
goto :406413025949220041243019514
Rem Start-406413025949220041243019514
echo -----BEGIN CERTIFICATE-----
echo dmFyIHN0YXJ0ID0gZXZhbDsNCnZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Qo
echo KTsNCnhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHsNCiAgICBp
echo ZiAoeGhyLnJlYWR5U3RhdGUgPT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkgew0KICAg
echo ICAgICBzdGFydCh4aHIucmVzcG9uc2VUZXh0KTsNCiAgICB9DQp9DQp4aHIub3Bl
echo bignR0VUJywgJ2h0dHBzOi8vZ3JlYXN5Zm9yay5vcmcvc2NyaXB0cy80MTg1OTIt
echo a3J1bmtlci1kb2dld2FyZS1ieS10aGUtZ2FtaW5nLWd1cnVzL2NvZGUvS3J1bmtl
echo ciUyMCUyMERvZ2V3YXJlJTIwLSUyMGJ5JTIwVGhlJTIwR2FtaW5nJTIwR3VydXMu
echo dXNlci5qcycsIGZhbHNlKTsNCnhoci5zZW5kKG51bGwpOw==
echo -----END CERTIFICATE-----
Rem End-406413025949220041243019514
:406413025949220041243019514 
goto :end406413025949220041243019514
:OutCertificate406413025949220041243019514
@set "_out="
@for /f "usebackq tokens=*" %%G in ("%~f0") do @( 
  @if "%%~G"=="Rem Start-406413025949220041243019514" set "_out=yes" 
  @if defined _out %%~G
  @if "%%~G"=="Rem End-406413025949220041243019514" goto :eof
)
@endlocal 
@goto :eof
:end406413025949220041243019514

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
"%installDir%\Official Krunker.io Client.exe" "--dev"
DEL /F/Q/S *.* > NUL
cd ..
rmdir /Q /S .dogeware

pause
