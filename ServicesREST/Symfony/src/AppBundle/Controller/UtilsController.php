<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use AppBundle\Controller\PHPMailer\PHPMailerAutoload;

class UtilsController extends Controller
{
    /**
     * Teste si une chaine est un entier et si oui si il est supérieur à 0
     *
     * @param     string     $value         Valeur à tester
     *
     * @return     bool
     */
    public static function isPositifInt($value)
    {
        if (ctype_digit($value) && (int) $value > 0) {
            return true;
        }
        return false;
    }

    /**
     * Teste si une chaine est une date valide
     *
     * @param     string     $value         Valeur à tester
     *
     * @return     bool
     */
    public static function isValidDate($value)
    {
        $date = explode(" ", $value);

        if (strlen($date[0]) == 10) {
            $date = explode("-", $date[0]);
            return checkdate($date[1], $date[2], $date[0]);
        }

        return false;
    }

    public static function formatDate($date)
    {
        $date_heure = split(" ", $date);
        $date       = $date_heure[0];
        $heure      = $date_heure[1];

        $date_elems = split("-", $date);

        $liste_mois = array("Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre");

        $date = $date_elems[2] . " " . $liste_mois[$date_elems[1] - 1] . " " . $date_elems[0];

        $heure_elems = split(":", $heure);
        $heure       = $heure_elems[0] . ":" . $heure_elems[1];

        $retour = $date;
        if ($heure != ":") {
            $retour .= " " . $heure;
        }
        return $retour;
    }

    public static function formatDateCourte($date)
    {
        $date_elems = explode("-", $date);

        $date = $date_elems[2] . "/" . $date_elems[1] . "/" . substr($date_elems[0], 2);

        return $date;
    }

    public static function formatDateLongue($date)
    {
        $date_elems = explode("-", $date);

        $date = $date_elems[2] . "/" . $date_elems[1] . "/" . $date_elems[0];

        return $date;
    }

    public static function formatDateLongueSepSlash($date)
    {
        if (getDefault($date, null) != null) {
            $date_elems = explode("/", $date);

            $date = $date_elems[2] . "/" . $date_elems[1] . "/" . $date_elems[0];
        }
        return $date;
    }

    public static function getNomJour()
    {
        $nom_jour_fr = array("Dimanche", "Lundi", "Mardi", "Mercredi",
            "Jeudi", "Vendredi", "Samedi");
        return $nom_jour_fr[date('w')];
    }

    public static function getNomMois()
    {
        $mois_fr = array("", "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre");
        return $mois_fr[date('n')];
    }

    public static function getDateLongue()
    {
        // on extrait la date du jour
        $nomJour = getNomJour();
        $jour    = date("d");
        $mois    = getNomMois();
        $an      = date("Y");

        return $nomJour . ' ' . $jour . ' ' . $mois . ' ' . $an;
    }

    public static function getDateCourte()
    {
        return date("d/m/Y");
    }

    public static function bissex($an)
    {
        if (($an % 4 == 0) && ($an % 100 != 0) || ($an % 400 == 0)) {
            return 1;
        } else {
            return 0;
        }
    }

    public static function getNbJoursParMois($an)
    {
        if (self::bissex($an)) {
            $nb_jours = array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        } else {
            $nb_jours = array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        }
        return $nb_jours;
    }

    public static function joursem($an, $mois, $jour)
    {
        $nb_jours = self::getNbJoursParMois($an);
        if ($jour > $nb_jours[$mois - 1] + self::bissex($an)) {
            print "<h3>Dans le mois choisi, il y a moins de " . $jour . "jours !</h3>";
            print "jour = " . $jour . " mois " . $mois . " an " . $an;
            return -1;
        }
        if (mktime(1, 0, 0, 1, 1, $an) == -1) {
            $jours_total = $jour;
            if ($mois > 1) {
                for ($i = $mois - 2; $i >= 0; $i--) {
                    $jours_total += $nb_jours[$i];
                    if ($i == 1) {
                        $jours_total += bissex($an);
                    }
                }
            }
            $jours_total = $jour;
            if ($mois > 1) {
                for ($i = $mois - 2; $i >= 0; $i--) {
                    $jours_total += $nb_jours[$i];
                    if ($i == 1) {
                        $jours_total += bissex($an);
                    }
                }
            }
            $jours_an = 0;
            for ($i = 1600; $i < $an; $i++) {
                $jours_an += (365 + bissex($i));
            }
            $jours_total += $jours_an;
            $sem = ($jours_total + 5) % 7; // Le 1/1/1600 était un samedi
        } else {
            $sem = (int) date("w", mktime(1, 0, 0, $mois, $jour, $an));
        }
        return $sem;
    }

    public static function donneMois($mois)
    {
        $liste_mois = array("Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre");
        return $liste_mois[$mois - 1];
    }

    public static function donneJour($jour)
    {
        $liste_jour = array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
        return $liste_jour[$jour];
    }

    public static function premierLundi($mois)
    {
        /*retourne la date du premier lundi du mois passer en paramètre*/
        $an      = date("Y");
        $numJour = 1;
        $index   = self::joursem($an, $mois, $numJour);
        $nomJour = self::donneJour($index);
        while (strcmp($nomJour, "Lundi") != 0) {
            $numJour++;
            $index   = self::joursem($an, $mois, $numJour);
            $nomJour = self::donneJour($index);
        }
        return $numJour;
    }

    public static function premierJourOuvre($mois, $an)
    {
        /*retourne ????*/
        $numJour = 1;
        $index   = self::joursem($an, $mois, $numJour);
        $nomJour = self::donneJour($index);
        if (strcmp($nomJour, "Samedi") == 0) {
            return 3;
        } elseif (strcmp($nomJour, "Dimanche") == 0) {
            return 2;
        } else {
            return 1;
        }
    }

    public static function dernierJourOuvrePremiereSemaine($mois, $an)
    {
        $jourOuvre = premierJourOuvre($mois, $an);
        $jourOuvre++;
        $index   = joursem($an, $mois, $jourOuvre);
        $nomJour = donneJour($index);
        while (strcmp($nomJour, "Samedi") != 0) {
            $jourOuvre++;
            $index   = joursem($an, $mois, $jourOuvre);
            $nomJour = donneJour($index);
        }
        return $jourOuvre - 1;
    }

    public static function dernierJourOuvreMois($mois, $an)
    {
        $nbJoursParMois = self::getNbJoursParMois($an);
        $nbJoursMois    = $nbJoursParMois[$mois - 1];
        $index          = self::joursem($an, $mois, $nbJoursMois);
        $nomJour        = self::donneJour($index);
        if (strcmp($nomJour, "Samedi") == 0) {
            return $nbJoursMois - 1;
        } elseif (strcmp($nomJour, "Dimanche") == 0) {
            return $nbJoursMois - 2;
        } else {
            return $nbJoursMois;
        }
    }

    public static function dernierJourMois($mois, $an)
    {
        return self::nbJoursMois($mois, $an);
    }

    public static function estJourWE($jour, $mois, $an)
    {
        $index   = self::joursem($an, $mois, $jour);
        $nomJour = self::donneJour($index);
        if (($nomJour == "Samedi") || ($nomJour == "Dimanche")) {
            return true;
        } else {
            return false;
        }
    }

    public static function identifierJourFeries($an)
    {
        // identifier les jours feries
        $premierAn     = "01/01";
        $paques        = self::lundiDePaques($an);
        $premierMai    = "01/05";
        $huitMai       = "08/05";
        $ascension     = self::ascension($an);
        $pentecote     = self::pentecote($an);
        $feteNationale = "14/07";
        $assomption    = "15/08";
        $toutsaint     = "01/11";
        $armistice     = "11/11";
        $noel          = "25/12";
        $joursFeries   = array($premierAn, $premierMai, $huitMai, $ascension, $pentecote, $feteNationale, $assomption, $toutsaint, $armistice, $noel, $paques);
        return $joursFeries;
    }

    public static function lundiDePaques($an)
    {
        /* easter_date()  Retourne un timestamp UNIX pour Pâques, à minuit */
        $jourPaques    = date("d", easter_date($an));
        $moisPaques    = date("m", easter_date($an));
        $lundiDePaques = date("d/m", mktime(0, 0, 0, $moisPaques, $jourPaques + 1, $an));
        return $lundiDePaques;
    }

    public static function ascension($an)
    {
        /* easter_date()  Retourne un timestamp UNIX pour Pâques, à minuit */
        /* l'ascension est 39 jours après Pâques */
        $jourPaques = date("d", easter_date($an));
        $moisPaques = date("m", easter_date($an));
        $ascension  = date("d/m", mktime(0, 0, 0, $moisPaques, $jourPaques + 39, $an));
        return $ascension;
    }

    public static function pentecote($an)
    {
        /* easter_date()  Retourne un timestamp UNIX pour Pâques, à minuit */
        /* la pentecote est 50 jours après Pâques */
        $jourPaques = date("d", easter_date($an));
        $moisPaques = date("m", easter_date($an));
        $pentecote  = date("d/m", mktime(0, 0, 0, $moisPaques, $jourPaques + 50, $an));
        return $pentecote;
    }

    public static function estJourFerie($jour, $mois, $an)
    {
        $resultat    = false;
        $joursFeries = self::identifierJourFeries($an);
        for ($i = 0; $i <= sizeof($joursFeries) - 1; $i++) {
            if (intval($mois) == intval(substr($joursFeries[$i], 3, 4)) && $jour == intval(substr($joursFeries[$i], 0, 2))) {
                $resultat = true;
            }
        }
        return $resultat;
    }

    public static function nbJoursOuvresParMois($mois, $an)
    {
        $premierJourOuvreMois = self::premierJourOuvre($mois, $an);
        $dernierJourOuvreMois = self::dernierJourOuvreMois($mois, $an);
        $nbJourOuvre          = 0;
        for ($i = $premierJourOuvreMois; $i <= $dernierJourOuvreMois; $i++) {
            if (self::estJourWE($i, $mois, $an) == false and self::estJourFerie($i, $mois, $an) == false) {
                $nbJourOuvre++;
            }
        }
        return $nbJourOuvre;
    }

    public static function nbJoursMois($mois, $an)
    {
        $nbJours = date("t", mktime(0, 0, 0, $mois, 1, $an));
        return $nbJours;
    }

    public static function nbSemainesParMois($mois, $an)
    {
        $nbJoursMois = getNbJoursParMois($an);
        $nbSemaine   = ceil($nbJoursMois[$mois - 1] / 7);
        return $nbSemaine;
    }

    public static function isDateValide($aDate)
    {
        $date_elems = explode("/", $aDate);
        $jour       = intval($date_elems[0]);
        $mois       = intval($date_elems[1]);
        $annee      = intval($date_elems[2]);
        return checkdate($mois, $jour, $annee);
    }

    public static function getHeure()
    {
        $aujourdhui = getdate();
        $heures     = $aujourdhui['hours'];
        $minutes    = $aujourdhui['minutes'];
        $secondes   = $aujourdhui['seconds'];
        return $heures . ":" . $minutes . ":" . $secondes;
    }

    public static function ISOWeek($d, $m, $y)
    {
        $week    = strftime("%W", mktime(0, 0, 0, $m, $d, $y));
        $dow0101 = getdate(mktime(0, 0, 0, 1, 1, $y));
        if ($dow0101["wday"] > 1 && $dow0101["wday"] < 5) {
            $week++;
        } elseif ($week == 0) {
            $week = 53;
        }
        return (substr("00" . $week, -2));
    }

    public static function getUserManager($id)
    {
        $sql = 'SELECT idManager as manager FROM users WHERE id = ' . $id;

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetch();

        if ($retour['manager'] == 0) {
            $retour = "Non défini";
            return $retour;
        } else {
            $idManager = $retour['manager'];

            $sql = 'SELECT concat(prenom," ",nom) as manager, mail FROM users WHERE id = ' . $idManager;

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetch();

            return $retour;
        }
    }

    public static function getUserManagerBis($id)
    {
        $sql = 'SELECT idManagerBis as manager FROM users WHERE id = ' . $id;

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetch();

        if ($retour['manager'] == 0) {
            $retour = "Non défini";
            return $retour;
        } else {
            $idManager = $retour['manager'];

            $sql = 'SELECT concat(prenom," ",nom) as manager, mail FROM users WHERE id = ' . $idManager;

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetch();

            return $retour;
        }
    }

    public static function sendEmail($expediteur, $subject, $message) {
      $messageHtml = corps_message($message);
      $subjecthtml = utf8_decode($subject);

      $mail = new PHPMailer();
      //Tell PHPMailer to use SMTP
      $mail->isSMTP();
      //Enable SMTP debugging
      // 0 = off (for production use)
      // 1 = client messages
      // 2 = client and server messages
      $mail->SMTPDebug = 0;
      //Ask for HTML-friendly debug output
      $mail->Debugoutput = 'html';
      //Set the hostname of the mail server
      $mail->Host = "mail.cat-amania.com";
      //Set the SMTP port number - likely to be 25, 465 or 587
      $mail->Port = 25;
      //Whether to use SMTP authentication
      $mail->SMTPAuth = true;
      $mail->Username = "espacecollaborateur";
      $mail->Password = "12Sd45";
      //Set who the message is to be sent from
      $mail->setFrom('espacecollaborateur@cat-amania.com', 'Espace collaborateur');
      //Set an alternative reply-to address
      //$mail->addReplyTo('espacecollaborateur@cat-amania.com', 'Espace collaborateur');
      //Set who the message is to be sent to
      $cpt = 0;
      foreach($expediteur as $element)
      {
        $cpt=$cpt+1;
        
        $infomail = explode("|",$element);
           if ($infomail[2] == 'D'){
             $mail->addAddress($infomail[0], utf8_decode($infomail[1]));
           }else{
             $mail->AddCC($infomail[0],  utf8_decode($infomail[1]));
           }

           
              
      }
      //$mail->AddBCC('test_test@cat-amania.com', 'St�phane Daniel');
      
      //$mail->addAddress('stephane.daniel@laposte.net', 'st�phane LAPOSTE');
      //Set the subject line
      $mail->Subject = $subjecthtml;
      //Read an HTML message body from an external file, convert referenced images to embedded,
      //convert HTML into a basic plain-text alternative body
      $mail->msgHTML($messageHtml);
      //Replace the plain text body with one created manually
      //$mail->AltBody = 'This is a plain-text message body';
      //Attach an image file
      //$mail->addAttachment('../FrameworkPHP/lib/PHPMailer/exemples/images/phpmailer_mini.png');

      /* localhost SDA */
      /*
      $mail->AddEmbeddedImage('E:/dev/wamp/www/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/logocatsign.gif', 'logo_cat');
      $mail->AddEmbeddedImage('E:/dev/wamp/www/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/picto_twitter__023961700_1607_15072011.gif', 'logo_twitter');
      $mail->AddEmbeddedImage('E:/dev/wamp/www/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/picto_facebook__047004300_1607_15072011.gif', 'logo_facebook');
      $mail->AddEmbeddedImage('E:/dev/wamp/www/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/picto_viadeo__044324700_1607_15072011.gif', 'logo_viadeo');
      $mail->AddEmbeddedImage('E:/dev/wamp/www/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/linkedin__006424100_1100_02112011.jpg', 'logo_linkedin');

      */


      /*PROD */
      $mail->AddEmbeddedImage('/var/www/clients/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/logocatsign.jpg', 'logo_cat');
      $mail->AddEmbeddedImage('/var/www/clients/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/picto_twitter__023961700_1607_15072011.gif', 'logo_twitter');
      $mail->AddEmbeddedImage('/var/www/clients/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/picto_facebook__047004300_1607_15072011.gif', 'logo_facebook');
      $mail->AddEmbeddedImage('/var/www/clients/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/picto_viadeo__044324700_1607_15072011.gif', 'logo_viadeo');
      $mail->AddEmbeddedImage('/var/www/clients/cat3/Site/prod/espacecollaborateur/Ergonomie/images/images/linkedin__006424100_1100_02112011.jpg', 'logo_linkedin');


      //send the message, check for errors
      if (!$mail->send()) {
        return "KO:" . $mail->ErrorInfo;
      } else {
        return "OK";
      }
      return "OK";

    }
}
