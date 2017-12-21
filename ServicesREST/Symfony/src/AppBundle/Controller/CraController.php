<?php

namespace AppBundle\Controller;

use AppBundle\Security\LoginController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use \Swift_Image;

class CraController extends Controller
{
    /**
     *@Route("/CRA/RA/{idRA}", name="getCra")
     *@Method("GET")
     */
    public function getCra(Request $request, $idRA)
    {
        //Vérification token
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        // On récupère l'iDuser du Token afin de l'utiliser et vérifier la cohérence de l'appel dans la requête sql
        $idUserToken = $retourAuth['id'];

        // Requête SQL pour sélectionner les relevés activités en fonction de l'idRA
        $sql = 'SELECT r.idRA,r.mois,r.annee, r.etat, e.libelle, r.nbJourTravailles, r.nbJourAbs, r.client, r.responsable, r.projet,r.commentaires, r.valeursSaisies FROM relevesactivites r INNER JOIN etatra e ON r.etat = e.id WHERE idRA = "' . $idRA . '" and idUser = "' . $idUserToken . '";';

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetchAll();

        if (empty($retour)) {
            $message = array('message' => "Pas de correspondance CRA");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        for ($i = 0; $i < count($retour); $i++) {

            $row = $retour[$i];

            $idRA             = $row['idRA'];
            $mois             = $row['mois'];
            $annee            = $row['annee'];
            $libelle          = $row['libelle'];
            $etat             = $row['etat'];
            $NbJOuvres        = strval(UtilsController::nbJoursOuvresParMois($mois, $annee));
            $nbJourTravailles = $row['nbJourTravailles'];
            $nbJourAbs        = $row['nbJourAbs'];
            $client           = $row['client'];
            $responsable      = $row['responsable'];
            $projet           = $row['projet'];
            $commentaires     = $row['commentaires'];
            $valeursSaisies   = $row['valeursSaisies'];

        }
        $tab = array('idRA' => $idRA, 'mois' => $mois, 'annee' => $annee, 'libelle' => $libelle, 'etat' => $etat, 'NbJOuvres' => $NbJOuvres, 'nbJourTravailles' => $nbJourTravailles, 'nbJourAbs' => $nbJourAbs, 'client' => $client, 'responsable' => $responsable, 'projet' => $projet, 'commentaires' => $commentaires, 'valeursSaisies' => $valeursSaisies);

        //on formate le mois pour qu'il soit plus pratique
        $moisf = substr(("0" . $mois), -2, 2);

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////// Algorithme pour transformer la chaine de caractères de la BDD en période de CRA //////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //$valeursSaisies = $retour[0]["valeursSaisies"];
        $tableauFinal = array();

        //Création d'un tableau à partir de le chaine récupérée en base
        $tabValeursSaisies = explode(";", $valeursSaisies);

        $premierJourDuMois = UtilsController::joursem($annee, $mois, 1);
        //La fonction renvoie 0 si le premier jour est un dimanche
        if ($premierJourDuMois == 0) {
            $premierJourDuMois = 7;
        }

        //L'index commence à 0
        //$indexPremierJourDuMois = $premierJourDuMois - 1;
        $dernierJourDuMois = UtilsController::dernierJourMois($mois, $annee);
        //La fonction renvoie 0 si le premier jour est un dimanche
        if ($dernierJourDuMois == 0) {
            $dernierJourDuMois = 7;
        }

        //on élague le tableau tabValeursSaisies, on enlève les jours du mois précédent qui viennent encombrer le tableau inutilement
        // on fait une boucle qui consiste à enlever n fois le premier element du tableau jusqu'à arriver au premier jour du mois, avec n = premier jour du mois
        for ($i = 0; $i < $premierJourDuMois - 1; $i++) {
            unset($tabValeursSaisies[0]);
            //on remet les index dans le tableau proprement
            $tabValeursSaisies = array_values($tabValeursSaisies);
        }

        //de ce fait notre tableau commence bien au premier jour du mois, il ne reste plus qu'à faire la boucle sur le nombre de jours du mois = $dernierJourDuMois
        for ($j = 0; $j < $dernierJourDuMois; $j++) {

            $jour = $j + 1;
            //on formate le jour afin qu'il soit plus joli
            $jourf = substr("0" . ($j + 1), -2, 2);

            $date = $jourf . "/" . $moisf . "/" . $annee;

            $tabNewPeriod              = array();
            $tabNewPeriod["date"]      = $date;
            $tabNewPeriod["activité"] = $tabValeursSaisies[$j];

            array_push($tableauFinal, $tabNewPeriod);
        }

        $tab["valeursSaisies"] = $tableauFinal;
        return new JsonResponse($tab, Response::HTTP_OK);
    }

    /**
     *@Route("/CRA/{id}/{annee}", name="getListCraByCollaborateur")
     *@Method("GET")
     */
    public function getListCraByCollaborateur(Request $request, $id, $annee)
    {
        //Vérification token
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        // On récupère l'iDuser du Token afin de l'utiliser et vérifier la cohérence de l'appel dans la requête sql
        $idUserToken = $retourAuth['id'];

        //On compare l'idUserToken et l'id fourni en paramètre

        if ($id != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        //Test si le paramètre année est valorisé, si non on le valorise par l'année en cours

        $sql = "SELECT r.idUser as idUser, r.idRA as Id, r.mois,r.annee as annee, r.client, e.libelle, r.etat as status FROM relevesactivites r INNER JOIN etatra e ON r.etat = e.id WHERE r.idUser = '$id' AND r.annee = '$annee'  ORDER BY r.mois asc;";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        //$retour= $stmt->fetchAll();

        $retour = $stmt->fetchAll();

        if (empty($retour)) {
            $message = array('message' => "Aucun CRA trouvé");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        $listeMois = array(1 => "Janvier", 2 => "Février", 3 => "Mars", 4 => "Avril", 5 => "Mai", 6 => "Juin", 7 => "Juillet", 8 => "Août", 9 => "Septembre", 10 => "Octobre", 11 => "Novembre", 12 => "Décembre");

        //$liste=array();
        for ($i = 0; $i < count($retour); $i++) {

            $row   = $retour[$i];
            $mois  = $row['mois'];
            $annee = $row['annee'];

            $libellemois = $listeMois[$row['mois']];

            // pour simplifier le front, on envoie un champ date qui est la concatenation du mois formaté et de l'année
            $retour[$i]['date'] = $libellemois . " " . $annee;

        }
        return new JsonResponse($retour, Response::HTTP_OK);
    }

    public function getMoreThanOne($mois, $idUser)
    {

        $sql = "select count(idRA) as nb from relevesactivites where mois = '$mois' and idUser = '$idUser'";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetch();

        if ($retour['nb'] == 1) {
            $retour = false;
            return $retour;
        } else {
            $retour = true;
            return $retour;
        }
    }

    public function getHideDate($id, $mois, $idUser)
    {

        $sql  = "select count(idRA) as nb from relevesactivites where mois = '$mois' and idUser = '$idUser'";
        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetch();

        if ($retour['nb'] == 1) {
            $retour = false;
            return $retour;
        } else {

            $sql  = "select min(idRA) as idRA  from relevesactivites where mois = '$mois' and idUser = '$idUser'";
            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetch();

            if ($retour['idRA'] != $id) {
                $retour = true;
                return $retour;
            } else {
                $retour = false;
                return $retour;
            }
        }
    }

    public function deleteCra($idRA, $idUserToken)
    {
        // Vérifie si la ligne existe
        $sql = "SELECT
          idRA
        FROM
          relevesactivites
        WHERE idUser = '$idUserToken'
        AND idRA = '$idRA' and etat in ('1','2','4')";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

        $list = $stmt->fetchAll();

        // La ligne existe
        if (count($list) != 0) {
            $sql = 'DELETE FROM relevesactivites WHERE etat in ("1","2","4") and idRA = ' . $idRA . ' and idUser = ' . $idUserToken . ';';

            $stmtSupp = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmtSupp->execute();

            $retour = $stmtSupp->rowCount();

            if (empty($retour)) {
                //if($retour == 0){
                $message = array('message' => "Erreur dans la suppression");
                return array('message' => $message, 'code' => Response::HTTP_BAD_REQUEST);
            } else {
                $message = array('message' => "Suppression reussie");
                return array('message' => $message, 'code' => Response::HTTP_OK);
            }
        } else {
            // La ligne n'existe pas, on le signale et on ne la supprime pas
            $message = array('message' => 'Mise à jour échouée. La demande n\'existe pas');
            return array('message' => $message, 'code' => Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     *@Route("/CRA/RA/{idRA}", name="deleteCra")
     *@Method("DELETE")
     */
    public function deleteCraAction(Request $request, $idRA)
    {
        //Vérification token
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        $idUserToken = $retourAuth['id'];

        $retourDelete = $this->deleteCra($idRA, $idUserToken);
        return new JsonResponse($retourDelete["message"], $retourDelete["code"]);
    }

    public function addCra($data, $idUserToken)
    {
        $idUser = $data['idUser'];
        if ($idUser != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return array('message' => $message, 'code' => Response::HTTP_BAD_REQUEST);
        }

        $mois             = $data['mois'];
        $annee            = $data['annee'];
        $etat             = $data['etat'];
        $nbJourTravailles = $data['nbJourTravailles'];
        $nbJourAbs        = $data['nbJourAbs'];
        $client           = addslashes($data['client']);
        $responsable      = addslashes($data['responsable']);
        $projet           = addslashes($data['projet']);
        $commentaires     = addslashes($data['commentaires']);
        $tableauCRA       = $data['valeursSaisies'];

        /*switch ($libelle){
        case "Brouillon" :
        $etat = 1;
        break;
        case "En attente validation" :
        $etat = 2;
        break;
        //Etats validés ou A modifier interdits, autres états inconnus
        default :
        $retour=array('message'=>'Etat invalide','code'=>Response::HTTP_BAD_REQUEST);
        return $retour;
        break;
        }*/
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////// Algorithme pour transformer les périodes des CRA en chaine de caractères pour la BDD /////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $ChaineCRAFinal    = "";
        $premierJourDuMois = UtilsController::joursem($annee, $mois, 1);
        //La fonction renvoie 0 si le premier jour est un dimanche
        if ($premierJourDuMois == 0) {
            $premierJourDuMois = 7;
        }
        $dernierJourDuMois = UtilsController::joursem($annee, $mois, UtilsController::dernierJourMois($mois, $annee));
        //La fonction renvoie 0 si le premier jour est un dimanche
        if ($dernierJourDuMois == 0) {
            $dernierJourDuMois = 7;
        }

        // Création des imputations 0.0 avant le début du mois
        $ChaineCRAFinal .= str_repeat("0.0;", $premierJourDuMois - 1);

        foreach ($tableauCRA as $index => $tab) {
            //Ajout des imputations pour chaque période
            $ChaineCRAFinal .= $tab["activité"] . ";";
        }

        $ChaineCRAFinal .= str_repeat("0.0;", 7 - $dernierJourDuMois);
        $ChaineCRAFinal = substr($ChaineCRAFinal, 0, -1);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Remplacement des "," par des "." pour l'insertion SQL
        $nbJourAbs        = str_replace(',', '.', $nbJourAbs);
        $nbJourTravailles = str_replace(',', '.', $nbJourTravailles);

        $sql = "INSERT INTO relevesactivites (idUser, mois, annee, responsable, client, projet, etat, commentaires, nbJourAbs, nbJourTravailles, valeursSaisies) VALUES ({$idUser},{$mois},{$annee},'{$responsable}','{$client}','{$projet}',{$etat},'{$commentaires}',{$nbJourAbs},{$nbJourTravailles},'{$ChaineCRAFinal}');";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->rowCount();

        if (empty($retour)) {
            $message = array('message' => "Erreur dans la création");
            return array('message' => $message, 'code' => '400');
        } else {
            // Envoi mail manager
            if ($etat == 2) {
                // Envoi mail seulement si la demande est pour validation
                $this->envoiEmailManager($data);
            }

            $message = array('message' => "Création réussie");
            return array('message' => $message, 'code' => '200');
        }
    }

    /**
     *@Route("/CRA/RA", name="addCra")
     *@Method("POST")
     */
    public function addCraAction(Request $request)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        $idUserToken = $retourAuth['id'];

        try {
            $content   = $request->getContent();
            $data      = json_decode($content, true);
            $retourAdd = $this->addCra($data, $idUserToken);
        } catch (Exception $e) {
            $message = array('message' => "Problème de paramètres");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
        return new JsonResponse($retourAdd["message"], $retourAdd["code"]);
    }

    /**
     *@Route("/CRA/RA/{idRA}", name="updateCra")
     *@Method("PUT")
     */
    public function updateCra(Request $request, $idRA)
    {
        //Vérification token
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        $idUserToken = $retourAuth['id'];

        try {
            // Vérifie si la ligne existe
            $sql = "SELECT
              idRA
            FROM
              relevesactivites
            WHERE idUser = '$idUserToken'
            AND idRA = '$idRA' and etat in ('1','2','4')";

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();

            $list = $stmt->fetchAll();

            // La ligne existe
            if (count($list) != 0) {
                // Sauvegarde de l'ancienne demande
                $sql = "CREATE TEMPORARY TABLE IF NOT EXISTS relevesactivitesTMP AS (
                    SELECT
                      *
                    FROM
                      relevesactivites
                    WHERE idUser = '$idUserToken'
                    AND idRA = '$idRA' and etat in ('1','2','4')
                )";

                $stmtTmp = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                $stmtTmp->execute();

                // Suppression de l'ancienne demande
                $sql = "DELETE
                  FROM
                    relevesactivites
                  WHERE idUser = '$idUserToken'
                  AND idRA = '$idRA'
                  AND etat in ('1', '2', '3')";

                $stmtSupp = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                $stmtSupp->execute();

                // Ajout de la nouvelle demande
                try {
                    $content    = $request->getContent();
                    $data       = json_decode($content, true);
                    $retourpost = $this->addCra($data, $idUserToken);

                    if ($retourpost['code'] != Response::HTTP_OK) {
                        // Si erreur dans ajout, alors ré-ajout de l'ancienne demande
                        $sql = "INSERT INTO relevesactivites
                                SELECT
                                  *
                                FROM
                                  relevesactivitesTMP
                                WHERE idUser = '$idUserToken'
                                AND idRA = '$idRA' and etat in ('1','2','4')";

                        $stmtUpd = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                        $stmtUpd->execute();

                        // Puis on drop la table temporaire
                        $sql      = "DROP TABLE relevesactivitesTMP";
                        $stmtDrop = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                        $stmtDrop->execute();

                        // Retour message erreur
                        return new JsonResponse("Modification échouée " . $retourpost['message'], $retourpost['code']);
                    }

                    //Si tout est ok on envoie un code HTTP 200
                    if ($retourpost["code"] == Response::HTTP_OK) {
                        $message = array('message' => "Modification réussie");
                        return new JsonResponse($message, Response::HTTP_OK);
                    }
                } catch (Exception $e) {
                    // Si erreur dans ajout, alors ré-ajout de l'ancienne demande
                    $sql = "INSERT INTO relevesactivites
                            SELECT
                              *
                            FROM
                              relevesactivitesTMP
                            WHERE idUser = '$idUserToken'
                            AND idRA = '$idRA' and etat in ('1','2','4')";

                    $stmtUpd = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                    $stmtUpd->execute();

                    // Puis on drop la table temporaire
                    $sql      = "DROP TABLE relevesactivitesTMP";
                    $stmtDrop = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                    $stmtDrop->execute();

                    // Retour message erreur
                    return new JsonResponse("Modification échouée " . $e, Response::HTTP_BAD_REQUEST);
                }
            } else {
                // La ligne n'existe pas, on le signale et on ne la supprime pas
                $message = array('message' => 'Mise à jour échouée. La demande n\'existe pas');
                return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
            }
        } catch (Exception $e) {
            // La ligne n'existe pas, on le signale et on ne la supprime pas
            $message = array('message' => 'Mise à jour échouée');
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Retourne les types activités CRA
     *
     * @param Request     $request         Requete en entrée
     *
     * @return JsonResponse
     *
     * @Route("/CRA/typesactivites", name="typesactivites")
     * @Method("GET")
     */
    public function getTypesActivites(Request $request)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        //On définit un tableau de correspondances entre codes et libellés
        $tablabel = array('CP' => "Congé Payé", 'RT' => "RTT", 'AM' => "Arrêt maladie", 'FO' => "Formation", 'AB' => "Absence diverse", '0,5+CP' => "0,5 + Congé Payé", '0,5+RT' => "0,5 + RTT", '0,5+AM' => "0,5 + Arrêt maladie", '0,5+FO' => "0,5 + Formation", '0,5+AB' => "0,5 + Absence diverse", 'CS' => "Congé sans solde", '0,5+CS' => "0,5 + Congé sans solde", 'IC' => "Intercontrat", '0,5RT+0,5CP' => "0,5 RTT+ 0,5 Congé Payé", '0,5RT+0,5IC' => "0,5 RTT+ 0,5 Intercontrat", 'CPA' => "Congé de paternité", 'CMA' => "Congé de maternité", '1,0' => "Jour travaillé", '0,5' => "Demie journée");

        //On va rechercher les codes disponibles dans la table valeurjourouvre
        $sql = "SELECT DISTINCT id,valeur FROM valeurjourouvre";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetchAll();

        //On va mettre le résultat dans un tableau afin de pouvoir associer les libellés aux codes
        $tabjo = array();
        for ($i = 0; $i < count($retour); $i++) {

            $row    = $retour[$i];
            $type   = $row['id'];
            $valeur = $row['valeur'];

            if (in_array($type, array_keys($tablabel))) {
                $label = $tablabel[$type];
            } else {
                $label = 'non défini';
            }

            $tabjo[] = array('code' => $type, 'label' => $label, 'valeur' => $valeur);
        }
        // Et on rajoute les codes et labels n'existant pas dans la table valeurjourouvre
        $tabjo[] = array('code' => '0.0', 'label' => 'Jour non travaillé', 'valeur' => '0.0');
        $tabjo[] = array('code' => '1.0', 'label' => 'Jour travaillé', 'valeur' => '1.0');

        //On va ensuite rechercher les codes disponibles dans la table valeurjourouvrewe
        $sql2 = "SELECT DISTINCT id,valeur FROM valeurjourouvrewe";

        $stmt2 = $this->getDoctrine()->getManager()->getConnection()->prepare($sql2);
        $stmt2->execute();
        $retour2 = $stmt2->fetchAll();

        //On va mettre le résultat dans un tableau afin de pouvoir associer les libellés aux codes
        $tabwe = array();
        for ($i = 0; $i < count($retour2); $i++) {

            $row    = $retour2[$i];
            $type   = $row['id'];
            $valeur = $row['valeur'];

            if (in_array($type, array_keys($tablabel))) {
                $label = $tablabel[$type];
            } else {
                $label = 'non défini';
            }

            $tabwe[] = array('code' => $type, 'label' => $label, 'valeur' => $valeur);
        }
        // Et on rajoute les codes et labels n'existant pas dans la table valeurjourouvrewe
        $tabwe[] = array('code' => '0.0', 'label' => 'Jour non travaillé', 'valeur' => '0.0');

        //Et on crée un tableau qui contient les deux tableaux précédents
        $tab = array('jourouvre' => $tabjo, 'jourwe' => $tabwe);
        return new JsonResponse($tab, Response::HTTP_OK);
    }

    /**
     * @Route("/joursferies/{year}", name="joursferies")
     * @Method("GET")
     */
    public function getJourFerie(Request $request, $year)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        $premierAn     = "01/01";
        $lundiDePaques = UtilsController::lundiDePaques($year);
        $premierMai    = "01/05";
        $huitMai       = "08/05";
        $ascension     = UtilsController::ascension($year);
        $pentecote     = UtilsController::pentecote($year);
        $feteNationale = "14/07";
        $assomption    = "15/08";
        $toussaint     = "01/11";
        $armistice     = "11/11";
        $noel          = "25/12";
        $tabjf         = array('premierAn' => $premierAn, 'lundiDePaques' => $lundiDePaques, 'premierMai' => $premierMai, 'huitMai' => $huitMai, 'ascension' => $ascension, 'pentecote' => $pentecote, 'feteNationale' => $feteNationale, 'assomption' => $assomption, 'toussaint' => $toussaint, 'armistice' => $armistice, 'noel' => $noel);

        return new JsonResponse($tabjf, Response::HTTP_OK);
    }

    /**
     * Envoi un mail de notification au manager quand le CRA
     * est envoyé pour validation
     *
     * @param array       $data           Informations sur le CRA
     *
     */
    private function envoiEmailManager($data)
    {
        $id   = $data['idUser'];
        $etat = $data['etat'];

        $sql = 'select users.id as id,users.nom as nom,users.prenom,profils.libelle as profil,entitesjuridiques.nomEntite as entite,
        users.mail as mail, societeagence.nomSocieteAgence as agence from users, profils, entitesjuridiques,societeagence
            where users.id = "' . $id . '"
            and users.idprofil = profils.idProfil
            and users.idEntiteJuridique = entitesjuridiques.idEntite
            and users.idagence = societeagence.idSocieteAgence';

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetchAll();

        $managerData    = $this->getUserManager($id);
        $managerBisData = $this->getUserManagerBis($id);

        if (count($retour) == 0) {
            // Pas d'envoi de mail car utilisateur non trouvé
            return;
        } else {
            // Envoi du mail
            $message    = "";
            $subject    = "";
            $nomcollabo = $retour[0]['prenom'] . ' ' . $retour[0]['nom'];

            $nbJoursOuvres = strval(UtilsController::nbJoursOuvresParMois($data['mois'], $data['annee']));

            $message .= '
            <style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;border-color:#999;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#444;background-color:#F7FDFA;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#999;color:#fff;background-color:#26ADE4;}
.tg .tg-f3oy{font-size:12px;background-color:#ffffff;vertical-align:top;color:#444}
.tg .tg-kohf{font-size:12px;background-color:#d2e4fc;color:#444444}
.tg .tg-nwzb{background-color:#ffffff;font-size:12px;vertical-align:top}
.tg .tg-utag{font-size:12px;background-color:#d2e4fc;vertical-align:top}
.tg .tg-oskr{background-color:#ffffff;vertical-align:top}
</style>
<table class="tg">
<colgroup>
<col>
<col>
<col>
<col>
</colgroup>
  <tr>
    <th class="tg-kohf">Nom complet<br></th>
    <th class="tg-f3oy" colspan="3">' . $nomcollabo . '</th>
  </tr>
  <tr>
    <td class="tg-utag">Mois<br></td>
    <td class="tg-nwzb">' . $this->donneMois($data['mois']) . ' ' . $data['annee'] . '</td>
    <td class="tg-utag">Nombre de jours ouvrés<br></td>
    <td class="tg-oskr">' . $nbJoursOuvres . '</td>
  </tr>
  <tr>
    <td class="tg-utag">Nombres de jours travaillés<br></td>
    <td class="tg-nwzb">' . str_replace('.', ',', $data['nbJourTravailles']) . '</td>
    <td class="tg-utag">Nombre de jours d\'absence<br></td>
    <td class="tg-oskr">' . str_replace('.', ',', $data['nbJourAbs']) . '</td>
  </tr>
  <tr>
    <td class="tg-utag" colspan="4">Informations complémentaires<br></td>
  </tr>
  <tr>
    <td class="tg-f3oy" colspan="4">' . stripslashes($data['commentaires']) . '</td>
  </tr>
  <tr>
    <td class="tg-utag">Client</td>
    <td class="tg-nwzb">' . stripslashes($data['client']) . '</td>
    <td class="tg-utag">Responsable</td>
    <td class="tg-oskr">' . stripslashes($data['responsable']) . '</td>
  </tr>
  <tr>
    <td class="tg-utag">Projet</td>
    <td class="tg-nwzb">' . stripslashes($data['projet']) . '</td>
    <td class="tg-utag">État</td>
    <td class="tg-oskr">' . $this->getDescriptionByEtat($etat) . '</td>
  </tr>
</table>';

            $message = utf8_decode($message);

            $subject = "APPLI - Relevé Activité " . strtoupper($this->donneMois($data['mois'])) . " " . $data['annee'] . " pour " . $nomcollabo . " (Etat: " . utf8_encode($this->getDescriptionByEtat($etat)) . ")";

            // Envoi mail au managers
            $mailtab = array();

            // Mail du collaborateur
            if (filter_var($retour[0]['mail'], FILTER_VALIDATE_EMAIL)) {
                $mailtab[] = $retour[0]['mail'];
            }

            // Mail du manager
            if (filter_var($managerData['mail'], FILTER_VALIDATE_EMAIL)) {
                $mailtab[] = $managerData['mail'];
            }

            // Mail du 2e manager
            if (filter_var($managerBisData['mail'], FILTER_VALIDATE_EMAIL)) {
                $mailtab[] = $managerBisData['mail'];
            }

            $this->sendEmail($mailtab, $subject, $message);
        }
    }

    /**
     * Retourne le nom du mois selon son numéro
     *
     * @param int       $mois           numéro du mois
     *
     */
    public function donneMois($mois)
    {
        $liste_mois = array("Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre");
        return $liste_mois[$mois - 1];
    }

    /**
     * Retourne le libellé de l'état du CRA
     *
     * @param int       $etat           état de la demande
     *
     */
    private function getDescriptionByEtat($etat)
    {
        $sql = "SELECT DISTINCT
            id,
            libelle
        FROM
          etatra
        WHERE id = " . $etat . ";
        ";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetchAll();

        return $retour[0]['libelle'];
    }

    /**
     * Retourne le manager du collaborateur en paramètre
     *
     * @param int       $id           id du collaborateur
     *
     */
    private function getUserManager($id)
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

    /**
     * Retourne le 2ème manager du collaborateur en paramètre
     *
     * @param int       $id           id du collaborateur
     *
     */
    private function getUserManagerBis($id)
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

    /**
     * Envoi un mail aux expéditeurs avec un sujet et un contenu
     * Le mail est encapsulé dans un template aux couleurs de
     * l'espace collaborateur et Cat-amania
     *
     * @param array       $expediteur         Liste des mails des récepteurs
     * @param string      $subject            Sujet du mail
     * @param string      $messageEmail       Contenu du mail
     *
     */
    private function sendEmail($expediteur, $subject, $messageEmail)
    {
        $data    = array();
        $message = new \Swift_Message($subject);

        $imgPath = "/var/www/clients/platine/rest8/app/Resources/images/";

        $data['logocatsign']   = $message->embed(Swift_Image::fromPath($imgPath . 'logocatsign.jpg'));
        $data['logo_facebook'] = $message->embed(Swift_Image::fromPath($imgPath . 'logo_facebook.gif'));
        $data['logo_twitter']  = $message->embed(Swift_Image::fromPath($imgPath . 'logo_twitter.gif'));
        $data['logo_viadeo']   = $message->embed(Swift_Image::fromPath($imgPath . 'logo_viadeo.gif'));
        $data['logo_linkedin'] = $message->embed(Swift_Image::fromPath($imgPath . 'logo_linkedin.jpg'));
        $data['message']       = $messageEmail;

        $message->setFrom('espacecollaborateur@cat-amania.com')
            ->setTo($expediteur)
            ->setBody(
                $this->renderView(
                    'Emails/template-catamania.html.twig',
                    $data
                ),
                'text/html'
            );

        $this->get('mailer')->send($message);
    }
}
