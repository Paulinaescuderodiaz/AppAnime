# Generar APK de Release (Producción)

## Paso 1: Crear un Keystore (solo la primera vez)

Abre la terminal en Android Studio y ejecuta:

```bash
cd android/app
keytool -genkey -v -keystore neko-rate-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias neko-rate
```

Te pedirá:
- Contraseña del keystore (guárdala bien)
- Información personal (nombre, organización, etc.)
- Contraseña de la clave (puede ser la misma)

## Paso 2: Crear archivo key.properties

Crea un archivo `android/key.properties` con:

```properties
storePassword=TU_CONTRASEÑA_DEL_KEYSTORE
keyPassword=TU_CONTRASEÑA_DE_LA_CLAVE
keyAlias=neko-rate
storeFile=app/neko-rate-release.jks
```

## Paso 3: Configurar build.gradle para release

Edita `android/app/build.gradle` y agrega antes de `android {`:

```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Y dentro de `android {`, antes de `buildTypes`, agrega:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
```

Y modifica `buildTypes`:

```gradle
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

## Paso 4: Generar APK de Release

En Android Studio:
- `Build > Build Bundle(s) / APK(s) > Build APK(s)`
- O desde terminal: `./gradlew assembleRelease`

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

## Importante:
- **NO compartas el archivo .jks** - es tu firma digital
- **Guarda bien las contraseñas** - sin ellas no podrás actualizar la app
- Agrega `key.properties` y `*.jks` al `.gitignore`

