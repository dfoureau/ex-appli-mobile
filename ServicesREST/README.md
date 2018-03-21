# Services REST de l'application mobile

Les services REST sont développé avec le framework Symfony 2.5.

La documentation des services REST sous format OpenAPI avec Swagger est disponible dans le répertoire : Documentation-API-REST.

## Installation

Il est nécessaire d'installer un serveur Apache/PHP/MySQL pour pouvoir tester les services REST.

Pour être en conformité avec l'environnement de production, il faut avoir :
```
MySQL 5.1.73
PHP 5.3.3
```

Dans le répertoire Symfony, il suffit d'installer les dépendances avec ```composer``` :
```
composer install
ou
composer update
```

## Lancement

Il suffit de lancer le serveur Apache et l'accès à Symfony est opérationnel.