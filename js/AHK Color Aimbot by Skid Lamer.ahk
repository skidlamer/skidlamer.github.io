; Ahk Color Aimbot for Krunker - brought to you by Skid Lamer

; Configurable Values
TargetWindow := "Krunker"
Speed := 0 ; The speed to move the mouse in the range 0 (fastest) to 100 (slowest).
ScanSizeW := 500 ; The Box scan area Width in pixels
ScanSizeH := 90 ; The Box scan area Height in pixels
ColorID := 0xEB5656 ; The RGB Hex Color to Scan For NameTagColor
AimOffsetX := 42 ; this is the offset from the very left of the nametag color red to the centre of it (if its not aiming in the centre adjust this)
AimOffsetY := 19 ; Use this to offset the aim pitch (Aiming to high? increase this value) of (Aiming to low? decrease this value)
; https://i.imgur.com/d7E8Vph.png this will explain what pitch is if you dont know
Variation := 1 ; the variation of color shades to scan for

; Initialization 
SetBatchLines, -1
SetWinDelay, -1
Box_Init("FFFFFF") ; edit this RGBcolor string for the aimbox (currently white)
MsgBox, "AHK Color Aimbot by Skid Lamer" ; remove this line if it becomes obnoxious

; OnTick
while (True) {
	WinGetActiveTitle, windowTitle
	IfInString, windowTitle, %TargetWindow%
	{
		X1 := (A_ScreenWidth / 2) - (ScanSizeW / 2)
		Y1 := (A_ScreenHeight / 2) - (ScanSizeH / 2)
		X2 := (A_ScreenWidth / 2) + (ScanSizeW / 2)
		Y2 := (A_ScreenHeight / 2) + (ScanSizeH / 2)

		Box_Draw(X1, Y1, ScanSizeW, ScanSizeH)

		; AimOffsetY increase
		if ( GetKeyState("NumpadAdd") ) {
			AimOffsetY += 1
			Sleep 10
			SplashTextOn, 21, , % AimOffsetY
			Sleep 600
			SplashTextOff
		}

		; AimOffsetY decrease
		if ( GetKeyState("NumpadSub") ) {
			AimOffsetY -= 1
			Sleep 10
			SplashTextOn, 21, , % AimOffsetY
			Sleep 600
			SplashTextOff
		}

		; Search The Box scan area for the NameTag Color
		PixelSearch, OutputVarX, OutputVarY, X1, Y1, X2, Y2, ColorID , Variation, Fast RGB
		if ErrorLevel = 0
		{
			if ( GetKeyState("RButton") )
			{
				MouseMove, (OutputVarX + AimOffsetX) - (A_ScreenWidth // 2), (OutputVarY - (A_ScreenHeight // 2)) + AimOffsetY, Speed, R
			}
		}
	}
	else {
		Sleep, 10
		Box_Hide()
	}
}
return

; Box Drawing - Wicked - AHK Forums
Box_Init(colorRGB) {
	Gui, 96: +ToolWindow -Caption +AlwaysOnTop +LastFound
	Gui, 96: Color, % colorRGB
	Gui, 97: +ToolWindow -Caption +AlwaysOnTop +LastFound
	Gui, 97: Color, % colorRGB
	Gui, 98: +ToolWindow -Caption +AlwaysOnTop +LastFound
	Gui, 98: Color, % colorRGB
	Gui, 99: +ToolWindow -Caption +AlwaysOnTop +LastFound
	Gui, 99: Color, % colorRGB
}

; X - The X coord, Y - The Y coord, W - The width of the box, H - The height of the box, T - The thickness of the borders, O - The offset. O - Outside. C - Centered. I - Inside.
Box_Draw(X, Y, W, H, T="1", O="I") {
	If(W < 0)
		X += W, W *= -1
	If(H < 0)
		Y += H, H *= -1
	If(T >= 2)
	{
		If(O == "O")
			X -= T, Y -= T, W += T, H += T
		If(O == "C")
			X -= T / 2, Y -= T / 2
		If(O == "I")
			W -= T, H -= T
	}
	Gui, 96: Show, % "x" X " y" Y " w" W " h" T " NA", Horizontal 1
	Gui, 98: Show, % "x" X " y" Y + H " w" W " h" T " NA", Horizontal 2
	Gui, 97: Show, % "x" X " y" Y " w" T " h" H " NA", Vertical 1
	Gui, 99: Show, % "x" X + W " y" Y " w" T " h" H " NA", Vertical 2
}
; Box_Destroy - Destroys the 4 GUIs.
Box_Destroy() {
	Loop, 4
	Gui, % A_Index + 95 ":  Destroy"
}

; Box_Hide - Hides the 4 GUIs.
Box_Hide() {
	Loop, 4
	Gui, % A_Index + 95 ":  Hide"
}