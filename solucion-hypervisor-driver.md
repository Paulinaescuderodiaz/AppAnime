# Solución para el Error del Hypervisor Driver (ERROR 1062)

## El problema:
- ControlService ERROR 1062: "No se ha iniciado el servicio"
- StartService con error 4294967201

Esto significa que el driver se instaló pero el servicio no puede iniciarse.

## Solución 1: Ejecutar el instalador manualmente como Administrador

1. Ve a la carpeta donde se instaló el driver:
   `C:\Users\Equipo\AppData\Local\Android\Sdk\extras\google\Android_Emulator_Hypervisor_Driver`

2. Busca el archivo `silent_install.bat` o `install.bat`

3. **Clic derecho > Ejecutar como administrador**

4. Si no hay archivo .bat, busca `aehd.exe` y ejecútalo como administrador

## Solución 2: Usar el emulador sin aceleración (FUNCIONA SIEMPRE)

Esta es la solución más confiable si el hypervisor no funciona:

1. En Android Studio, ve a `Tools > Device Manager`
2. Crea un nuevo dispositivo o edita uno existente
3. Haz clic en el ícono de edición (lápiz) del dispositivo
4. Haz clic en "Show Advanced Settings"
5. En "Graphics", cambia a **"Software - GLES 2.0"**
6. Guarda los cambios
7. Inicia el emulador - funcionará sin aceleración de hardware

## Solución 3: Verificar permisos del servicio

Abre PowerShell como Administrador y ejecuta:
```powershell
sc query aehd
```

Si el servicio existe pero no está corriendo, intenta iniciarlo:
```powershell
sc start aehd
```

## Solución 4: Instalar usando el SDK Manager con permisos de admin

1. Cierra Android Studio
2. Ejecuta Android Studio como Administrador
3. Ve a `Tools > SDK Manager > SDK Tools`
4. Desmarca "Android Emulator hypervisor driver"
5. Aplica los cambios
6. Vuelve a marcarlo
7. Aplica los cambios de nuevo (esto reinstalará el driver)

