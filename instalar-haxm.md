# Instalar Intel HAXM Manualmente

## Pasos:

1. **Descargar HAXM:**
   - Ve a: https://github.com/intel/haxm/releases
   - Descarga la última versión (haxm-windows_vX.X.X.zip)

2. **Extraer y ejecutar:**
   - Extrae el archivo ZIP
   - Busca el archivo `silent_install.bat` o `intelhaxm-android.exe`
   - Clic derecho > "Ejecutar como administrador"

3. **Verificar instalación:**
   - Abre Android Studio
   - Ve a `Tools > SDK Manager > SDK Tools`
   - Verifica que "Intel x86 Emulator Accelerator (HAXM installer)" esté marcado

4. **Reiniciar Android Studio**

