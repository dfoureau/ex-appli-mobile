# Projet application mobile

## Dépendances

L'application mobile est codée avec le framework React Native. De ce faite, il est nécessaire de l'installer avec ses dépendances.

Sur un environnement vierge, le plus simple est d'installer :

* Chocolatey (sur Windows), ou utiliser le système de packaging Linux. Par exemple, sur Windows, lancer une invite de commande en mode administrateur et copier :
```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

* Node JS, Pyhton 2, Yarn, Java JDK (Sur Windows avec Choco :
```
choco install -y nodejs.install python2 jdk8 yarn
```

* React Native CLI : 
```
npm install -g react-native-cli
```

### Configuration Android Studio

Installer Android Studio : https://developer.android.com/studio/index.html

Android Studio installe la dernière version d'Android SDK, cependant nous avons besoin de la version pour Android 6.0
Ainsi, dans Android Studio, ouvrir les options de configuration, puis le manager SDK et choisir les options suivantes :

Onglet SDK Platforms :
* Google APIs
* Android SDK Platform 23
* Intel x86 Atom_64 System Image
* Google APIs Intel x86 Atom_64 System Image

Onglet SDK Tools :
* Sélectionner l'option de choisir le détail des package, puis choisir 23.0.1

Puis :

* Ajouter une variable d'environnement dans windows avec le nom ANDROID_HOME qui pointe vers le lieu d'installation du SDK Android. Par déaut c'est dans : ```c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk```

### Création d'un émulateur Android (optionnel)

Dans Android Studio, lancer le gestionnaire Android Virtual Devices (AVDs). Créer une nouvelle AVD (Si dans le champs "tools" vous ne voyez pas Android > AVD Manager, cliquez en bas à gauche sur le champs "Terminal" et cliquez sur les liens proposés afin de télécharger les modules (le téléchargement des modules se fait de manière automatique)), et choisir les options :

* x86 image, Marshmallow API Level 23, x86_64 ABI image avec Android 6.0 (Google APIs) en target

Si Intel HAXM n'est pas installé et qu'il est supporté par la machine, alors installation : https://software.intel.com/en-us/android/articles/installation-instructions-for-intel-hardware-accelerated-execution-manager-windows

### Lancement sur un smartphone Android

Aucune configuration supplémentaire à faire.


## Compilation

Pour installer les dépendances : 

```
npm install
ou
yarn install
```

## Lancement

Puis lancer l’émulateur Android ou brancher un téléphone Android (avec déboguage USB activé) et :

```
react-native run-android
```

Pour débogguer l'application, sur un autre terminal :
```
react-native log-android
```

## Cas particuliers

Dans la majorité des cas, l'application se lance automatiquement sur le téléphone Android. Néanmoins, dans certains cas, il serait nécessaire  de configurer le proxy avec la commande suivante :

```
adb reverse tcp:8081 tcp:8081
```

Celà permet alors de dire au téléphore de rediriger les appels à des services localhost vers le PC.

## Outils supplémentaires

Installer Git et Git Flow pour faciliter la création de branches.

## Qualité du code

Prettier (https://prettier.io/) est utilisé pour le formattage du code source.
La commande utilisé pour le projet est :
```
prettier --trailing-comma es5 --write "{app,__{tests,mocks}__}/**/*.js"
```