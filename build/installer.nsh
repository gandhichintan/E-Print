RequestExecutionLevel admin
!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\ePrinter"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\ePrinter"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\ePrinter"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\ePrinter"
 !macroend

 !macro unregisterFileAssociations
    ExecWait "$INSTDIR\resources\app\assets\RunAsAdmin.cmd"    
	Sleep 4000	
 !macroend