# Proceso de Desarrollo y Actualización de la App

## Flujo de Trabajo para Reflejar Cambios

### Opción 1: Desarrollo con Live Reload (MÁS RÁPIDO)

1. **Conectar el teléfono por USB**
   - Conecta tu Huawei al computador
   - Activa "Depuración USB" en el teléfono

2. **Ejecutar con Live Reload**
   ```bash
   ionic cap run android
   ```
   O desde Android Studio:
   - Conecta el teléfono
   - Haz clic en el botón "Run" (▶️)
   - Selecciona tu dispositivo

3. **Los cambios se reflejan automáticamente**
   - Cada vez que guardas un archivo, la app se recarga
   - No necesitas reinstalar el APK

### Opción 2: Recompilar y Reinstalar (MÁS LENTO pero más estable)

1. **Hacer cambios en el código**
   - Edita archivos en `src/`

2. **Recompilar la app web**
   ```bash
   npm run build
   ```
   O desde Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`

3. **Sincronizar con Capacitor**
   ```bash
   npx cap sync android
   ```

4. **Generar nuevo APK**
   - Desde Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`

5. **Instalar el nuevo APK en el teléfono**
   - Transfiere el nuevo APK
   - Instálalo (reemplazará la versión anterior)

### Opción 3: Solo Cambios de Estilos/HTML (SIN RECOMPILAR)

Si solo cambias estilos CSS/SCSS o HTML:

1. **Hacer cambios en los archivos**
   - Edita `.scss` o `.html`

2. **Recompilar solo la parte web**
   ```bash
   npm run build
   ```

3. **Copiar archivos al proyecto Android**
   ```bash
   npx cap copy android
   ```

4. **En Android Studio:**
   - Solo necesitas hacer "Run" (▶️) - no necesitas generar APK nuevo
   - Los cambios se reflejarán inmediatamente

## Recomendaciones

### Para Desarrollo Activo:
- Usa **Opción 1** (Live Reload) - es la más rápida
- Conecta el teléfono por USB
- Los cambios se ven en tiempo real

### Para Pruebas Finales:
- Usa **Opción 2** (Recompilar completo)
- Genera un APK nuevo
- Prueba como lo haría un usuario final

### Para Cambios Rápidos de UI:
- Usa **Opción 3** (Solo copiar)
- Más rápido para ajustes visuales

## Nota Importante:
- Si cambias código TypeScript o lógica, necesitas recompilar
- Si solo cambias estilos/HTML, puedes usar `npx cap copy`
- Siempre que generes un nuevo APK, debes reinstalarlo en el teléfono

