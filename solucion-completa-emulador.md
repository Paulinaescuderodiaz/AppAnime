# Solución Completa para el Error del Emulador Android

## Paso 1: Instalar HAXM desde Android Studio
1. Abre Android Studio
2. Ve a `Tools > SDK Manager`
3. Pestaña "SDK Tools"
4. Marca "Intel x86 Emulator Accelerator (HAXM installer)"
5. Haz clic en "Apply"
6. Si aparece el error, continúa con el Paso 2

## Paso 2: Instalar HAXM Manualmente
1. Descarga HAXM desde: https://github.com/intel/haxm/releases
2. Descarga la última versión (ej: haxm-windows_v7.8.0.zip)
3. Extrae el archivo
4. Busca `intelhaxm-android.exe` o `silent_install.bat`
5. **Clic derecho > Ejecutar como administrador**
6. Sigue las instrucciones del instalador
7. Reinicia Android Studio

## Paso 3: Verificar la Instalación
Abre PowerShell como Administrador y ejecuta:
```powershell
sc query intelhaxm
```

Si el servicio está instalado, deberías ver información del servicio.

## Paso 4: Crear Emulador con Configuración Correcta
1. En Android Studio, ve a `Tools > Device Manager`
2. Haz clic en "Create Device"
3. Selecciona un dispositivo (ej: Pixel 5)
4. Al elegir la imagen del sistema:
   - Si tienes problemas, elige una imagen ARM (más lento pero funciona sin HAXM)
   - O elige x86_64 pero luego configura Graphics como "Software"
5. En "Advanced Settings":
   - Graphics: "Software - GLES 2.0" (si HAXM no funciona)
   - O "Hardware - GLES 2.0" (si HAXM funciona)

## Paso 5: Si Nada Funciona - Usar Emulador ARM
1. En Device Manager, crea un nuevo dispositivo
2. Al seleccionar System Image, busca imágenes ARM (no x86)
3. Estas funcionan sin aceleración de hardware pero son más lentas

## Alternativa: Usar Emulador con Software Rendering
1. Crea tu emulador normalmente
2. En Device Manager, haz clic en el ícono de edición (lápiz) del emulador
3. En "Show Advanced Settings"
4. Cambia "Graphics" a "Software - GLES 2.0"
5. Guarda y ejecuta

