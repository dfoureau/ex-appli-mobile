<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \DateTime;

class StatsController extends Controller
{
    /**
     * Ajouter les détails d'un appel à l'API REST au fichier de statistiques
     *
     * @param     string     $utilisateur         Login de l'utilisateur
     * @param     string     $serviceREST         Service REST appelé
     * @param     int     $timestamp         Date, heure et minute de l'appel (Unix timestamp)
     */
    public static function ajouterStats($utilisateur, $serviceREST, $timestamp)
    {
        $fichier = fopen("../app/logs/stats.txt", "a");
        if (! $fichier) {
            // Erreur d'ouverture du fichier de stats
            return;
        } else {
            $datetimeFormat = 'd/m/Y H:i:s';
            $date = new \DateTime('now', new \DateTimeZone('Europe/Paris'));
            $date->setTimestamp($timestamp);
            $formattedDate = $date->format($datetimeFormat);

            $donnees = $utilisateur . ";" . $serviceREST . ";" . $timestamp . ";" . $formattedDate . "\n";
            fwrite($fichier, $donnees);
            fclose($fichier);
            return;
        }
    }
}