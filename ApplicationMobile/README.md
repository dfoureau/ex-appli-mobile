# Projet application mobile

## Compilation et lancement

Pour installer les dépendances : 

```bash
npm install
```

Puis lancer l’émulateur Android ou brancher un téléphone Android (avec déboguage USB activé) et :

```bash
react-native run-android
```

Dans le cas d’un téléphone Android physique branché en USB, pensez également à configurer le proxy avec la commande suivante :

```bash
adb reverse tcp:8081 tcp:8081
```

Celà permet alors de dire au téléphore de rediriger les appels à des services localhost vers le PC.