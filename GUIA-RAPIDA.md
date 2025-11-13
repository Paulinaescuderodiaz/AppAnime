# 🚀 GUÍA DE INICIO RÁPIDO - AnimeReview App

## ⚡ Ejecutar en 5 Pasos

### Paso 1: Instalar Node.js
Descarga e instala desde: https://nodejs.org/ (versión LTS recomendada)

### Paso 2: Instalar Ionic CLI
Abre tu terminal y ejecuta:
```bash
npm install -g @ionic/cli
```

### Paso 3: Instalar dependencias del proyecto
Navega a la carpeta del proyecto y ejecuta:
```bash
cd anime-review-app
npm install
```

### Paso 4: Ejecutar la aplicación
```bash
ionic serve
```

La app se abrirá automáticamente en tu navegador en `http://localhost:8100`

### Paso 5: ¡Listo! 🎉
Puedes navegar por la aplicación:
- Crea una cuenta o inicia sesión
- Explora el Top 10 de animes
- Deja reseñas y comentarios
- Edita tu perfil

---

## 📱 Generar APK (Opcional)

Si quieres instalar la app en tu teléfono Android:

### 1. Instalar Android Studio
Descarga desde: https://developer.android.com/studio

### 2. Agregar plataforma Android
```bash
ionic capacitor add android
```

### 3. Compilar el proyecto
```bash
ionic build --prod
```

### 4. Sincronizar
```bash
npx cap sync android
```

### 5. Abrir en Android Studio
```bash
npx cap open android
```

### 6. Generar APK
En Android Studio:
- Ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)**
- Espera a que compile
- El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔐 Credenciales de Prueba

Para agilizar las pruebas, usa estas credenciales:

**Email**: `usuario@test.com`
**Contraseña**: `password123`

O crea tu propia cuenta con el botón "Registrarse"

---

## ❓ Problemas Comunes

### "Command not found: ionic"
Solución: Instala Ionic CLI
```bash
npm install -g @ionic/cli
```

### "Module not found"
Solución: Reinstala dependencias
```bash
rm -rf node_modules
npm install
```

### La aplicación no carga datos
Solución: Verifica tu conexión a internet (la app usa Jikan API en línea)

---

## 📞 Contacto

Si tienes problemas, consulta el README.md completo o contacta al equipo de desarrollo.

---

¡Disfruta explorando el mundo del anime! 🎌
