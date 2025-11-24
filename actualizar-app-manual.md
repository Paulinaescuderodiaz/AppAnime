# Guía: Actualizar App Manualmente (Proceso Estable)

## Proceso Completo Paso a Paso

### 1. Hacer Cambios en el Código
- Edita los archivos que necesites en `src/`
- Guarda todos los cambios

### 2. Recompilar la App Web
Abre la terminal en la raíz del proyecto y ejecuta:
```bash
npm run build
```
Esto compila tu código Angular/Ionic y genera los archivos en la carpeta `www/`

### 3. Sincronizar con Android
Ejecuta:
```bash
npx cap sync android
```
Esto copia los archivos compilados al proyecto Android.

### 4. Generar Nuevo APK
En Android Studio:
1. Abre el proyecto (carpeta `android`)
2. Ve a `Build > Build Bundle(s) / APK(s) > Build APK(s)`
3. Espera a que termine la compilación
4. El nuevo APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Transferir APK al Teléfono
- **Opción A (USB):** Conecta el teléfono, copia el APK a la carpeta Descargas
- **Opción B (Cloud):** Sube el APK a Google Drive/Email y descárgalo en el teléfono

### 6. Instalar en el Teléfono
1. Abre el Gestor de Archivos
2. Busca el APK en Descargas
3. Toca el archivo `app-debug.apk`
4. Si aparece advertencia, toca "Instalar de todas formas"
5. Espera a que termine la instalación
6. La nueva versión reemplazará la anterior automáticamente

## Resumen del Comando Completo
```bash
# 1. Recompilar
npm run build

# 2. Sincronizar
npx cap sync android

# 3. Luego en Android Studio: Build > Build APK(s)
```

## Tips
- **Siempre verifica** que `npm run build` termine sin errores
- **Espera** a que `npx cap sync` termine completamente
- El APK nuevo **reemplazará** la versión anterior en tu teléfono
- No necesitas desinstalar la app antes, se actualiza automáticamente

