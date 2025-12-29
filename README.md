# 📱 Lista de Tareas - To-Do App

Aplicación móvil desarrollada con **Ionic** y **Angular** para la gestión eficiente de tareas con un sistema avanzado de categorías personalizables.

## 📋 Descripción

**Lista de Tareas** es una aplicación móvil multiplataforma que permite a los usuarios:

- ✅ Crear y gestionar tareas diarias
- 🏷️ Organizar tareas mediante categorías personalizables con colores
- 🔍 Filtrar tareas por categoría
- 💾 Persistencia local de datos con Ionic Storage
- 🌓 Soporte para modo claro y oscuro
- 📱 Interfaz moderna y responsiva

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

### Requisitos Generales
- **Node.js** (versión 18.x o superior)
  - Descarga: [nodejs.org](https://nodejs.org/)
  - Verificar: `node --version`
- **npm** (viene con Node.js)
  - Verificar: `npm --version`
- **Ionic CLI** (versión 7.x o superior)
  - Instalar: `npm install -g @ionic/cli`
  - Verificar: `ionic --version`

### Para Android
- **Java JDK 17** o superior
  - Descarga: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) o [OpenJDK](https://adoptium.net/)
  - Verificar: `java -version`
- **Android Studio** (versión más reciente)
  - Descarga: [developer.android.com/studio](https://developer.android.com/studio)
  - Configurar las variables de entorno:
    - `ANDROID_HOME`: Ruta al SDK de Android (ej: `C:\Users\TuUsuario\AppData\Local\Android\Sdk`)
    - Agregar a `PATH`: `%ANDROID_HOME%\platform-tools` y `%ANDROID_HOME%\tools`
- **Android SDK** (instalado a través de Android Studio)
  - API Level 24 (Android 7.0) mínimo
  - API Level 34 (Android 14) recomendado

### Para iOS (solo macOS)
- **Xcode** (versión 14.0 o superior)
  - Descarga desde la App Store
  - Verificar: `xcodebuild -version`
- **Xcode Command Line Tools**
  - Instalar: `xcode-select --install`
- **CocoaPods** (gestor de dependencias de iOS)
  - Instalar: `sudo gem install cocoapods`
  - Verificar: `pod --version`
- **Apple Developer Account** (para firmar la app en dispositivos físicos)

## 📦 Instalación

1. **Clonar el repositorio** (si aplica):
   ```bash
   git clone <url-del-repositorio>
   cd todo-app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Instalar plugins de Cordova** (si no están instalados):
   ```bash
   ionic cordova prepare
   ```

## 🚀 Ejecución en Desarrollo

### Desarrollo Web (Navegador)
Para ejecutar la aplicación en el navegador durante el desarrollo:

```bash
ionic serve
```

O con live reload automático:

```bash
ionic serve --lab
```

La aplicación estará disponible en: `http://localhost:8100`

### Desarrollo en Dispositivo (Live Reload)

**Android:**
```bash
ionic cordova run android -l
```

**iOS:**
```bash
ionic cordova run ios -l
```

## 📱 Compilación para Producción

### Android

#### 1. Preparar la Plataforma

Si la plataforma Android no está añadida:

```bash
ionic cordova platform add android
```

#### 2. Construir APK de Depuración (Debug)

Para generar un APK de depuración sin firmar:

```bash
ionic cordova build android
```

O explícitamente:

```bash
ionic cordova build android --debug
```

**Ubicación del APK generado:**
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

#### 3. Construir APK de Producción (Release)

Para generar un APK de producción firmado:

```bash
ionic cordova build android --prod --release
```

**Ubicación del APK generado:**
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

> **Nota:** El APK generado estará sin firmar. Para firmarlo, consulta la sección de [Firmado de APK](#firmado-de-apk-android) más abajo.

#### 4. Verificar el Build

Puedes verificar que el build se completó correctamente revisando la carpeta de salida:

```bash
# Windows
dir platforms\android\app\build\outputs\apk\release

# macOS/Linux
ls -la platforms/android/app/build/outputs/apk/release
```

### iOS

#### 1. Preparar la Plataforma

Si la plataforma iOS no está añadida:

```bash
ionic cordova platform add ios
```

#### 2. Instalar Dependencias de CocoaPods

```bash
cd platforms/ios
pod install
cd ../..
```

#### 3. Construir el Proyecto

```bash
ionic cordova build ios --prod --release
```

#### 4. Abrir en Xcode

```bash
open platforms/ios/App.xcworkspace
```

> **Importante:** Abre el archivo `.xcworkspace`, NO el `.xcodeproj`

#### 5. Configurar el Proyecto en Xcode

1. **Seleccionar el Target:**
   - En el panel izquierdo, selecciona el proyecto "App"
   - Selecciona el target "App" en el panel central

2. **Configurar Signing & Capabilities:**
   - Ve a la pestaña "Signing & Capabilities"
   - Marca "Automatically manage signing"
   - Selecciona tu **Team** (Apple Developer Account)
   - Xcode generará automáticamente los certificados y perfiles

3. **Configurar el Bundle Identifier:**
   - Asegúrate de que el Bundle ID sea único (ej: `com.todoapp.listatareas`)
   - Debe coincidir con el `id` en `config.xml`

4. **Seleccionar el Dispositivo:**
   - En la barra superior, selecciona un dispositivo o simulador
   - Para dispositivos físicos, conéctalo y selecciónalo

#### 6. Generar el Archivo .ipa

**Opción A: Desde Xcode (Recomendado)**

1. Selecciona **Product > Archive** (o presiona `Cmd + B` seguido de `Cmd + Shift + B`)
2. Se abrirá el **Organizer**
3. Selecciona el archive y haz clic en **Distribute App**
4. Elige el método de distribución:
   - **App Store Connect**: Para publicar en la App Store
   - **Ad Hoc**: Para distribución limitada
   - **Enterprise**: Para distribución empresarial
   - **Development**: Para testing en dispositivos registrados
5. Sigue el asistente para generar el `.ipa`

**Opción B: Desde la Línea de Comandos**

```bash
xcodebuild -workspace platforms/ios/App.xcworkspace \
           -scheme App \
           -configuration Release \
           -archivePath platforms/ios/build/App.xcarchive \
           archive

xcodebuild -exportArchive \
           -archivePath platforms/ios/build/App.xcarchive \
           -exportPath platforms/ios/build/ipa \
           -exportOptionsPlist exportOptions.plist
```

**Ubicación del IPA generado:**
```
platforms/ios/build/ipa/App.ipa
```

## 🔐 Firmado de APK (Android)

Para distribuir tu aplicación en Google Play Store, necesitas firmar el APK.

### 1. Generar una Keystore

```bash
keytool -genkey -v -keystore todo-app-release.keystore -alias todo-app -keyalg RSA -keysize 2048 -validity 10000
```

Guarda el archivo `todo-app-release.keystore` en un lugar seguro y **nunca lo compartas**.

### 2. Crear archivo de propiedades

Crea `platforms/android/release-signing.properties`:

```properties
storeFile=../../todo-app-release.keystore
storeType=jks
keyAlias=todo-app
storePassword=TU_PASSWORD
keyPassword=TU_PASSWORD
```

### 3. Firmar el APK

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore todo-app-release.keystore \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  todo-app
```

### 4. Alinear el APK

```bash
zipalign -v 4 \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  platforms/android/app/build/outputs/apk/release/app-release.apk
```

El APK firmado estará en: `platforms/android/app/build/outputs/apk/release/app-release.apk`

## 🔧 Troubleshooting

### Errores Comunes

#### Error: "ANDROID_HOME is not set"

**Solución:**
1. Encuentra la ruta de tu Android SDK (normalmente en `C:\Users\TuUsuario\AppData\Local\Android\Sdk` en Windows)
2. Configura la variable de entorno:
   - **Windows:**
     ```cmd
     setx ANDROID_HOME "C:\Users\TuUsuario\AppData\Local\Android\Sdk"
     ```
   - **macOS/Linux:**
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.bash_profile
     ```

#### Error: "Gradle version incompatible"

**Solución:**
1. Verifica la versión de Gradle en `platforms/android/gradle/wrapper/gradle-wrapper.properties`
2. Actualiza a una versión compatible (recomendado: 8.0+)
3. Limpia el proyecto:
   ```bash
   ionic cordova clean android
   ionic cordova build android
   ```

#### Error: "SDK location not found"

**Solución:**
Crea o edita `platforms/android/local.properties`:

```properties
sdk.dir=C:\\Users\\TuUsuario\\AppData\\Local\\Android\\Sdk
```

#### Error: "No signing certificate found"

**Solución iOS:**
1. Abre Xcode
2. Ve a **Preferences > Accounts**
3. Agrega tu Apple ID
4. Selecciona tu Team en **Signing & Capabilities**

#### Error: "CocoaPods not found"

**Solución:**
```bash
sudo gem install cocoapods
cd platforms/ios
pod install
```

#### Error de Permisos en macOS

**Solución:**
```bash
sudo chmod -R 777 platforms/ios
```

### Limpiar el Proyecto

Si experimentas problemas de compilación, limpia el proyecto:

```bash
# Limpiar todas las plataformas
ionic cordova clean

# Limpiar solo Android
ionic cordova clean android

# Limpiar solo iOS
ionic cordova clean ios

# Reconstruir
ionic cordova build android --prod --release
```

### Verificar Versiones

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Ionic CLI
ionic --version

# Verificar Cordova
ionic cordova --version

# Verificar Java (Android)
java -version

# Verificar Android SDK
echo $ANDROID_HOME

# Verificar Xcode (iOS)
xcodebuild -version
```

## 📚 Estructura del Proyecto

```
todo-app/
├── config.xml              # Configuración de Cordova
├── package.json            # Dependencias del proyecto
├── ionic.config.json       # Configuración de Ionic
├── angular.json            # Configuración de Angular
├── src/                    # Código fuente
│   ├── app/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # Servicios (lógica de negocio)
│   │   ├── interfaces/     # Interfaces TypeScript
│   │   └── home/           # Página principal
│   ├── assets/             # Recursos estáticos
│   └── theme/              # Estilos globales
├── platforms/              # Plataformas nativas (generado)
│   ├── android/
│   └── ios/
├── plugins/                # Plugins de Cordova
└── resources/              # Iconos y splash screens
    ├── android/
    └── ios/
```

## 🧪 Testing

### Ejecutar Tests Unitarios

```bash
npm test
```

### Ejecutar Tests E2E

```bash
npm run e2e
```

## 📄 Licencia

Este proyecto es privado y está protegido por derechos de autor.

## 👥 Contribución

Este es un proyecto privado. Para contribuciones, contacta al equipo de desarrollo.

## 📞 Soporte

Para problemas o preguntas:
- Email: dev@todoapp.com
- Documentación: [Ionic Framework Docs](https://ionicframework.com/docs)
- Cordova Docs: [Cordova Documentation](https://cordova.apache.org/docs/)

---

**Desarrollado con ❤️ usando Ionic, Angular y Cordova**

