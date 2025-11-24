# Solución para el error del Hypervisor del Emulador Android

## Error que aparece:
- ControlService ERROR 1062: "No se ha iniciado el servicio"
- StartService con error 4294967201

## Soluciones:

### 1. Ejecutar Android Studio como Administrador
- Cierra Android Studio completamente
- Clic derecho en el icono de Android Studio
- Selecciona "Ejecutar como administrador"
- Intenta crear/iniciar el emulador de nuevo

### 2. Verificar Hyper-V (Windows)
Abre PowerShell como Administrador y ejecuta:
```powershell
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
```

Si está habilitado, puedes desactivarlo temporalmente:
```powershell
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
```
**Nota:** Esto requiere reiniciar la computadora.

### 3. Usar Emulador sin Aceleración (más lento pero funciona)
En Android Studio:
1. Ve a `Tools > Device Manager`
2. Crea un nuevo dispositivo
3. Al seleccionar la imagen del sistema, elige una que NO tenga "x86_64" acelerado
4. O usa "System Images" sin aceleración

### 4. Instalar HAXM manualmente
1. Descarga Intel HAXM desde: https://github.com/intel/haxm/releases
2. Ejecuta el instalador como administrador
3. Reinicia Android Studio

### 5. Alternativa: Usar Emulador con Software Rendering
Edita el AVD y en "Graphics" selecciona "Software - GLES 2.0"

## IMPORTANTE:
**No necesitas el emulador para generar el APK.** Puedes generar el APK directamente desde:
- `Build > Build Bundle(s) / APK(s) > Build APK(s)`

El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

