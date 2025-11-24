# Cómo generar el APK sin usar el emulador

## Opción 1: Desde Android Studio
1. Ve a `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Espera a que termine la compilación
3. El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Opción 2: Desde la línea de comandos
```bash
cd android
./gradlew assembleDebug
```
El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

