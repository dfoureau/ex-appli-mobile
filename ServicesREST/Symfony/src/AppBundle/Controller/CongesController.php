<?php

namespace AppBundle\Controller;

use AppBundle\Controller\StatsController;
use AppBundle\Controller\UtilsController;
use AppBundle\Security\LoginController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Debug\Exception\ContextErrorException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use \DateTime;
use \Swift_Image;

class CongesController extends Controller
{

    /**
     * Retourne le dernier solde congés et le dernier solde RTT de l'utilisateur en paramère
     *
     * @param Request     $request         Requete en entrée
     * @param int         $userId         Identifiant de l'utilisateur
     *
     * @return JsonResponse
     *
     * @Route("/conges/solde/{userId}", name="soldeconges")
     * @Method("GET")
     */
    public function getDemandeCongesByUserId(Request $request, $userId)
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

        if ($userId != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/getDemandeCongesByUserId", time());

        // Test valeur en entrée
        if (UtilsController::isPositifInt($userId)) {
            $tUserId = (int) $userId;

            $sql = "SELECT
            users.id,
            concat(RIGHT(concat('0', soldesconges.mois), 2),'/', soldesconges.annee) AS datesolde,
            soldesconges.cp,
            soldesconges.rtt
          FROM
            users,
            soldesconges
          WHERE users.numMat = soldesconges.nummat
          AND users.id = " . $tUserId . "
          ORDER BY annee DESC, mois DESC limit 1";

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetch();

            if (count($retour) != 0) {
                return new JsonResponse($retour, Response::HTTP_OK);
            } else {
                $message = array('message' => 'Utilisateur non trouvé : ' . $tUserId);
                return new JsonResponse($message, Response::HTTP_NOT_FOUND);
            }
        } else {
            $message = array('message' => 'Format paramètres incorrect :' . $userId);
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Créer une nouvelle demande de congés
     *
     * @param Request     $request         Requete en entrée
     *
     * @return JsonResponse
     *
     * @Route("/conges", name="creerconges")
     * @Method("POST")
     */
    public function createDemandeCongesAction(Request $request)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        $idUserToken = $retourAuth['id'];

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/createDemandeCongesAction", time());

        try {
            $content = $request->getContent();
            $data    = json_decode($content, true);
            $retour  = $this->createDemandeConges($data, $idUserToken);
        } catch (Exception $e) {
            $message = array('message' => "Problème de paramètres " . $e);
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        $message = array('message' => $retour['message']);
        return new JsonResponse($message, $retour['code']);
    }

    /**
     * Vérifie qu'une demande de congés est valide.
     * On vérifie toutes les périodes au sein d'une demande de congés.
     * On vérifie ensuite que la demande de congés ne déborde pas sur une demande déjà existante
     * @var [type]
     */
    public function verifDemandeConges($periodes, $idUser)
    {
        $datesFormat    = 'Y-m-d H:i:s';
        $periodesLength = count($periodes);
        $isValid        = true;
        $errMessage     = "";
        $index          = 0;

        // Vérification des périodes à l'intérieur de la demande

        // On vérifie les dates de l'index 0
        $periode1 = $periodes[0];
        // Test de la validité de la période:
        $debut1 = DateTime::createFromFormat($datesFormat, $periode1['dateDebut']);
        $fin1   = DateTime::createFromFormat($datesFormat, $periode1['dateFin']);

        if (!$debut1 || !$fin1) {
            $isValid    = false;
            $errMessage = "Ligne " . $periode1["numLigne"] . " : Les dates saisies sont invalides";
        }
        // On vérifie que le début est bien avant la fin
        elseif ($debut1 >= $fin1) {
            $isValid    = false;
            $errMessage = "Ligne " . $periode1["numLigne"] . " : La date de début doit être antérieure à la date de fin";
        }

        // On parcourt toutes les lignes de la demande.
        // On vérifie les points suivants :
        // - Les périodes sont classées par dates de début ET de fin croissants
        //      => Sinon, on est dans un cas d'inclusion de périodes
        // - Il n'y a pas de chevauchements entre les périodes de la demande
        // - Il n'y a pas de trous au niveau des périodes de la demande
        while ($isValid && $index < $periodesLength - 1) {
            // On ne teste pas la période1. Le test a été effectué au cours de l'itération précédente
            $periode1 = $periodes[$index];
            $debut1   = DateTime::createFromFormat($datesFormat, $periode1['dateDebut']);
            $fin1     = DateTime::createFromFormat($datesFormat, $periode1['dateFin']);

            $periode2 = $periodes[$index + 1];
            $debut2   = DateTime::createFromFormat($datesFormat, $periode2['dateDebut']);
            $fin2     = DateTime::createFromFormat($datesFormat, $periode2['dateFin']);

            // Test de la validité de la période2
            if (!$debut2 || !$fin2) {
                $isValid    = false;
                $errMessage = "Ligne " . $periode1["numLigne"] + 1 . " : Les dates saisies sont invalides";
            } elseif ($debut2 >= $fin2) {
                $isValid    = false;
                $errMessage = "Ligne " . $periode1["numLigne"] + 1 . " : La date de début doit être antérieure à la date de fin";
            }
            // On vérifie que le tri est valide
            elseif ($debut1 >= $debut2 || $fin1 >= $fin2) {
                $isValid    = false;
                $errMessage = "Le tableau des périodes n'est pas trié ou contient des inclusions";
            }
            // Risque de chevauchement. On vérifie que les jours entre début2 et fin1 ne sont pas des jours ouvrés
            elseif ($debut2 < $fin1) {
                $iterationDate = clone $debut2;

                while ($isValid && $iterationDate <= $fin1) {
                    $dayOfWeek = $iterationDate->format('w');
                    $year      = $iterationDate->format('Y');
                    $month     = $iterationDate->format('m');
                    $day       = $iterationDate->format('d');

                    if ($dayOfWeek > 0 && $dayOfWeek < 6 && !UtilsController::estJourFerie($day, $month, $year)) {
                        $isValid    = false;
                        $errMessage = "Le tableau des périodes contient des chevauchements";
                    }

                    $iterationDate->modify('+1 days');
                }
            }
            // Risque de trou. On vérifie si les jours entre fin1 et début 2 sont des jours ouvrés.
            // On vérifie au préalable l'intervalle entre din1 et début2, pour ignorer le cas normal
            // où fin 1 correspont à 23:59:59 et début 2 à 00:00:00 le lendemain
            elseif ($debut2 > $fin1 && ($debut2->getTimestamp() - $fin1->gettimestamp() > 60)) {
                $iterationDate = clone $fin1;
                $iterationDate->modify('+1 seconds'); // On ajoute 1s pour les dates de fin à 23:59:59

                while ($isValid && $iterationDate < $debut2) {
                    $dayOfWeek = $iterationDate->format('w');
                    $year      = $iterationDate->format('Y');
                    $month     = $iterationDate->format('m');
                    $day       = $iterationDate->format('d');
                    if ($dayOfWeek > 0 && $dayOfWeek < 6 && !UtilsController::estJourFerie($day, $month, $year)) {
                        $isValid    = false;
                        $errMessage = "Le tableau des périodes contient des trous";
                    }

                    $iterationDate->modify('+12 hours');
                }
            }
            $index++;
        }

        // Vérification de la demande de congés par rapport aux autres demandes.
        // On cherche si la période intersecte d'autres demandes de congés validées ou en attente de validation
        if ($isValid) {
            $dateMin = $periodes[0]['dateDebut'];
            $dateMax = $periodes[count($periodes) - 1]['dateFin'];

            $sql = "SELECT numDemande, dateDu, dateAu FROM demandesconges "
                . "WHERE idUser = ${idUser} "
                . "AND etat IN (1, 2) "
                . "AND ("
                . "( dateDu <= '${dateMin}' AND '${dateMin}' < dateAu ) "
                . "OR "
                . "( '${dateMin}' <= dateDu AND dateDu < '${dateMax}' ) "
                . " )";

            $query = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $query->execute();

            $retour = $query->fetchAll();
            if (!empty($retour)) {
                $isValid    = false;
                $errMessage = "La demande de congés est en conflit avec des demandes déjà existantes";
            }
        }

        return array(
            'isValid'    => $isValid,
            'errMessage' => $errMessage,
        );
    }

    /**
     * Calcule la durée ouvrée d'une période de demande de congés
     * On itère par demi-journées pour effectuer ce calcul
     * @param  [type] $periode [description]
     * @return [type]          [description]
     */
    protected function calculerDureePeriode($periode)
    {
        $debut  = $periode['dateDebut'];
        $fin    = $periode['dateFin'];
        $format = 'Y-m-d H:i:s';

        $dateDebut = DateTime::createFromFormat($format, $periode['dateDebut']);
        $dateFin   = DAtetime::createFromFormat($format, $periode['dateFin']);

        $iterationDate = clone $dateDebut;

        $duree = 0;
        while ($iterationDate < $dateFin) {
            $dayOfWeek = $iterationDate->format('w');
            $year      = $iterationDate->format('Y');
            $month     = $iterationDate->format('m');
            $day       = $iterationDate->format('d');

            if ($dayOfWeek > 0 && $dayOfWeek < 6 && !UtilsController::estJourFerie($day, $month, $year)) {
                $duree += 0.5;
            }

            $iterationDate->modify("+12 hours");
        }

        return $duree;
    }

    /**
     * Execute les requetes de creation après vérifiction des parametres
     *
     * @param array     $data             Informations nécessaires à la création
     *
     * @return array
     */
    public function createDemandeConges($data, $idUserToken)
    {
        $idUser      = $data['idUser'];
        $etatDemande = $data['etat'];

        // Récupere le numéro de la demande à partir de la table
        $sql = "SELECT MAX(numdemande) AS num FROM demandesconges WHERE idUser = " . $idUser;

        if (isset($data['lignesDemandes'])) {
            $res = $this->verifDemandeConges($data['lignesDemandes'], $idUser);

            $isValid    = $res['isValid'];
            $errMessage = $res['errMessage'];

            if (!$isValid) {
                return array(
                    'message' => $errMessage,
                    'code'    => Response::HTTP_FORBIDDEN,
                );
            }

            // Calcule la durée en jours ouvrés de chaque période de la demandes de congés
            foreach ($data['lignesDemandes'] as $index => $periode) {
                $data['lignesDemandes'][$index]['nbJours'] = $this->calculerDureePeriode($periode);
            }

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();

            $retour = $stmt->fetchAll();

            if (count($retour) == 0) {
                // Il n'existe pas de ligne; il n'y a jamais eu de demande de congés, donc on la met à 1
                $numDemande = '1';
            } else {
                // S'il existe une ligne, on récupère et on incrémente d'1
                foreach ($retour as $key => $value) {
                    $numDemande = $value['num'] + 1;
                }
                // Ou de la fonction
                // $numDemande = UtilsController::getMaxNumDemande($userId);

                $etat = $data['etat'];

                // Test valeurs en entrée
                if (is_array($data['lignesDemandes']) && UtilsController::isValidDate($data['dateEtat'])) {
                    $lignes   = $data['lignesDemandes'];
                    $dateEtat = $data['dateEtat'];
                } else {
                    $retour = array('code' => Response::HTTP_BAD_REQUEST, 'message' => 'Données en entrée invalides 2');
                    return $retour;
                }

                $sql = 'INSERT INTO demandesconges (numDemande, dateDemande, idUser, numLigne, dateDu, dateAu, idTypeAbs, nbJour, etat, validateur, dateactionetat) VALUES ';

                $i = 0;

                foreach ($lignes as $key => $row) {

                    // Test valeurs en entrée
                    if (UtilsController::isValidDate($row['dateDebut']) && UtilsController::isValidDate($row['dateFin'])
                        && is_int($row['numLigne']) && is_numeric($row['nbJours']) && is_int($row['typeabs'])) {
                        $numLigne  = $row['numLigne'];
                        $dateDebut = $row['dateDebut'];
                        $dateFin   = $row['dateFin'];
                        $nbJours   = $row['nbJours'];
                        $typeAbs   = $row['typeabs'];
                    } else {
                        $retour = array('code' => Response::HTTP_BAD_REQUEST, 'message' => 'Données en entrée invalides 3');
                        return $retour;
                    }

                    if ($i > 0) {
                        $sql .= ',';
                    }

                    $sql .= "('$numDemande', '$dateEtat', '$idUser', '$numLigne', '$dateDebut', '$dateFin', '$typeAbs', '$nbJours', '$etat', '$idUser', null)";
                    $i++;
                }
                $sql .= ';';

                $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                $stmt->execute();

                $retour = array('message' => "Création réussie", 'code' => Response::HTTP_OK);

                // Envoi mail manager
                if ($etatDemande == 1) {
                    // Envoi mail seulement si la demande est pour validation
                    $this->envoiEmailManager($data);
                }
                return $retour;
            }
        }
    }

    /**
     * Mettre à jour une demande de congés
     *
     * @param Request     $request         Requete en entrée
     * @param int         $userId         Identifiant de l'utilisateur
     * @param int         $numRequest     Numéro de la demande de congés
     *
     * @return JsonResponse
     *
     * @Route("/conges/{userId}/{numRequest}", name="majconges")
     * @Method("PUT")
     */
    public function putDemandeCongesAction(Request $request, $userId, $numRequest)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        // On récupère l'iDuser du Token afin de l'utiliser et vérifier la cohérence de l'appel dans la requête sql
        $idUserToken = $retourAuth['id'];

        if ($userId != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/putDemandeCongesAction", time());

        // Test les valeurs en entrée
        if (UtilsController::isPositifInt($userId) && UtilsController::isPositifInt($numRequest)) {
            try {
                // Vérifie si la ligne existe
                $sql = "SELECT
                  numdemande
                FROM
                  demandesconges
                WHERE idUser = '$userId'
                AND numDemande = '$numRequest' and etat in ('0','1','3')";

                $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                $stmt->execute();

                $list = $stmt->fetchAll();

                // La ligne existe
                if (count($list) != 0) {
                    // Sauvegarde de l'ancienne demande
                    $sql = "CREATE TEMPORARY TABLE IF NOT EXISTS demandescongesTMP AS (
                        SELECT
                          *
                        FROM
                          demandesconges
                        WHERE idUser = '$userId'
                        AND numDemande = '$numRequest' and etat in ('0','1','3')
                    )";

                    $stmtTmp = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                    $stmtTmp->execute();

                    // Suppression de l'ancienne demande
                    $sql = "DELETE
                      FROM
                        demandesconges
                      WHERE idUser = '$userId'
                      AND numDemande = '$numRequest'";

                    $stmtSupp = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                    $stmtSupp->execute();

                    // Ajout de la nouvelle demande
                    try {
                        $content    = $request->getContent();
                        $data       = json_decode($content, true);
                        $retourpost = $this->createDemandeConges($data, $idUserToken);

                        if ($retourpost['code'] != Response::HTTP_OK) {
                            // Si erreur dans ajout, alors ré-ajout de l'ancienne demande
                            $sql = "INSERT INTO demandesconges
                                SELECT
                                  *
                                FROM
                                  demandescongesTMP
                                WHERE idUser = '$userId'
                                AND numDemande = '$numRequest' and etat in ('0','1','3')";

                            $stmtUpd = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                            $stmtUpd->execute();

                            // Puis on drop la table temporaire
                            $sql      = "DROP TABLE demandescongesTMP";
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
                        $sql = "INSERT INTO demandesconges
                            SELECT
                              *
                            FROM
                              demandescongesTMP
                            WHERE idUser = '$userId'
                            AND numDemande = '$numRequest' and etat in ('0','1','3')";

                        $stmtUpd = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
                        $stmtUpd->execute();

                        // Puis on drop la table temporaire
                        $sql      = "DROP TABLE demandescongesTMP";
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
        } else {
            $message = array('message' => 'Format paramètres incorrect');
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Supprimer une demande de congés
     *
     * @param Request     $request         Requete en entrée
     * @param int         $userId         Identifiant de l'utilisateur
     * @param int         $numRequest     Numéro de la demande de congés
     *
     * @return JsonResponse
     *
     * @Route("/conges/supprimer/{userId}/{numRequest}", name="deleteconges")
     * @Method("DELETE")
     */
    public function deleteDemandeCongesAction(Request $request, $userId, $numRequest)
    {
        //Vérification token
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        // On récupère l'iDuser du Token afin de l'utiliser et vérifier la cohérence de l'appel dans la requête sql
        $idUserToken = $retourAuth['id'];

        if ($userId != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/deleteDemandeCongesAction", time());

        // Test les valeurs en entrée
        if (UtilsController::isPositifInt($userId) && UtilsController::isPositifInt($numRequest)) {
            $retourdelete = $this->deleteDemandeConges((int) $userId, (int) $numRequest);
            return new JsonResponse($retourdelete['message'], $retourdelete['code']);
        } else {
            $message = array('message' => 'Format paramètres incorrect');
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Execute les requetes de suppressions après vérifiction de l'existance de la demande de congé
     *
     * @param int         $userId         Identifiant de l'utilisateur
     * @param int         $numRequest     Numéro de la demande de congés
     *
     * @return array
     */
    public function deleteDemandeConges($userId, $numRequest)
    {
        // Vérifie si la ligne existe
        $sql = "SELECT
          numdemande
        FROM
          demandesconges
        WHERE idUser = '$userId'
        AND numDemande = '$numRequest' and etat in ('0','1','3')";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

        $list = $stmt->fetchAll();

        // La ligne existe, alors on la supprime
        if (count($list) != 0) {
            $sql = "DELETE
          FROM
            demandesconges
          WHERE idUser = '$userId'
          AND numDemande = '$numRequest'";

            $stmt   = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $retour = $stmt->execute();

            $message = array('message' => 'Demande congés supprimée');
            return array('message' => $message, 'code' => Response::HTTP_OK);
        } else {
            // La ligne n'existe pas, on le signale et on ne la supprime pas

            $message = array('message' => 'Delete KO');
            return array('message' => $message, 'code' => Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Retourne toutes les demandes de congés de l'utilisateur et de l'année en paramètre
     *
     * @param Request     $request         Requete en entrée
     * @param int         $userId         Identifiant de l'utilisateur
     * @param int         $year             Année demandée
     *
     * @return JsonResponse
     *
     * @Route("/conges/{userId}/{year}", name="congesparannee")
     * @Method("GET")
     */
    public function getFindDemandesByUserAndYear(Request $request, $userId, $year)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        // On récupère l'iDuser du Token afin de l'utiliser et vérifier la cohérence de l'appel dans la requête sql
        $idUserToken = $retourAuth['id'];

        if ($userId != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/getFindDemandesByUserAndYear", time());

        // Test les valeurs en entrée
        if (UtilsController::isPositifInt($userId) && ctype_digit($year) && (int) $year > 1995 && (int) $year < 2050) {
            $tUserId = (int) $userId;
            $tYear   = (int) $year;

            $sql = "SELECT
            numDemande,
            min(DATE_FORMAT(dateDu, '%d/%m/%Y')) AS dateDuMin,
            max(DATE_FORMAT(dateAu, '%d/%m/%Y')) AS dateAuMax,
            SUM(nbJour) AS nbJour,
            demandesconges.etat,
                        demandesconges.validateur,
                        demandesconges.dateDemande,
                        demandesconges.dateactionetat,
            concat(users.prenom,' ', users.nom) AS valid,
            CASE
             when etat='3' then 'A modifier'
            when etat='2' then 'Validé'
            when etat='1' then 'En attente validation'
            when etat='0' then 'Brouillon'
            else 'Autre' end AS libelleEtat
          FROM
            demandesconges
                    LEFT JOIN users ON demandesconges.validateur = users.id
          WHERE idUser = " . $tUserId . "
          AND EXTRACT(YEAR from dateDu) <= " . $tYear . "
          AND EXTRACT(YEAR from dateAu) >= " . $tYear . "
          GROUP BY numDemande
          ORDER BY dateDu DESC";

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetchAll();

            if (count($retour) != 0) {
                return new JsonResponse($retour, Response::HTTP_OK);
            } else {
                $message = array('message' => 'Utilisateur non trouve : ' . $tUserId);
                return new JsonResponse($message, Response::HTTP_NOT_FOUND);
            }
        } else {
            $message = array('message' => 'Format paramètres incorrect');
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Retourne toutes les périodes de congés de l'utilisateur et du numéro de demande en paramètre
     *
     * @param Request     $request         Requete en entrée
     * @param int         $userId         Identifiant de l'utilisateur
     * @param int         $numDemande     Numéro de la demande de congé
     *
     * @return JsonResponse
     *
     * @Route("/conges/periodes/{userId}/{numDemande}", name="periodes")
     * @Method("GET")
     */
    public function getFindPeriodesByUserAndNumDemande(Request $request, $userId, $numDemande)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        // On récupère l'iDuser du Token afin de l'utiliser et vérifier la cohérence de l'appel dans la requête sql
        $idUserToken = $retourAuth['id'];

        if ($userId != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/getFindPeriodesByUserAndNumDemande", time());

        // Test les valeurs en entrée
        if (UtilsController::isPositifInt($userId) && UtilsController::isPositifInt($numDemande)) {
            $tUserId     = (int) $userId;
            $tNumDemande = (int) $numDemande;

            $sql = "SELECT
            numLigne,
            DATE_FORMAT(dateDu, '%d/%m/%Y') AS dateDuFormated,
            DATE_FORMAT(dateAu, '%d/%m/%Y') AS dateAuFormated,
            dateDu,
            dateAu,
            nbJour,
            etat,
            demandesconges.idTypeAbs AS typeabs,
            typesabsences.code AS codeTypeAbs,
            typesabsences.libelle AS libelleTypeAbs,
            CASE
             when etat='3' then 'A modifier'
            when etat='2' then 'Validé'
            when etat='1' then 'En attente validation'
            when etat='0' then 'Brouillon'
            else 'Autre' end AS libelleEtat
          FROM
            demandesconges
          LEFT JOIN typesabsences ON demandesconges.idTypeAbs = typesabsences.idTypeAbs
          WHERE idUser = " . $tUserId . "
          AND numDemande = " . $tNumDemande . "
          ORDER BY dateDu";

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetchAll();

            if (count($retour) != 0) {
                return new JsonResponse($retour, Response::HTTP_OK);
            } else {
                $message = array('message' => 'Période non trouvée : ' . $tUserId);
                return new JsonResponse($message, Response::HTTP_NOT_FOUND);
            }
        } else {
            $message = array('message' => 'Format paramètres incorrect');
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Retourne les types absences congés
     *
     * @param Request     $request         Requete en entrée
     *
     * @return JsonResponse
     *
     * @Route("/conges/typesabsences", name="typeabsconges")
     * @Method("GET")
     */
    public function getTypesAbsences(Request $request)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/getTypesAbsences", time());

        $sql = "SELECT DISTINCT
          idTypeAbs,
          code,
          libelle
        FROM
          typesabsences
        ";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetchAll();

        return new JsonResponse($retour, Response::HTTP_OK);
    }

    /**
     * Retourne les congés du mois pour l'utilisateur donné en paramètre
     *
     * @param Request     $request         Requete en entrée
     * @param int         $userId         Identifiant de l'utilisateur
     * @param int         $year             Année demandée
     * @param int         $month             Mois demandé
     *
     * @return JsonResponse
     *
     * @Route("/conges/{userId}/{year}/{month}", name="congesdumois")
     * @Method("GET")
     */
    public function getInfosCongesDuMois(Request $request, $userId, $year, $month)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_BAD_REQUEST);
        }

        // On récupère l'iDuser du Token afin de l'utiliser et vérifier la cohérence de l'appel dans la requête sql
        $idUserToken = $retourAuth['id'];

        if ($userId != $idUserToken) {
            $message = array('message' => "Incohérence token/ID");
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        StatsController::ajouterStats($retourAuth['id'], "CongesController" . "/getInfosCongesDuMois", time());

        // Test les valeurs en entrée
        if (UtilsController::isPositifInt($userId) && ctype_digit($year) && ctype_digit($month)
            && (int) $month >= 1 && (int) $month <= 12 && (int) $year > 1995 && (int) $year < 2050) {
            $tUserId = (int) $userId;
            $tYear   = (int) $year;
            $tMonth  = (int) $month;

            // Calcul du mois et de l'année suivant le mois en parametre
            $tYearSuiv  = $tMonth == 12 ? $tYear + 1 : $tYear;
            $tMonthSuiv = $tMonth == 12 ? 1 : $tMonth + 1;

            // Pour le AND : La date de debut du congé est égale au mois et a l'année recherchée
            //         ou bien La date de fin du congé est égale au mois et a l'année recherchée
            //         ou bien l'année recherchée est comprise entre les intervalles de début et fin de congé:
            //             Prise de plus d'un mois de congé
            $sql = "
        SELECT
          numDemande,
          dateDu,
          dateAu,
          demandesconges.idTypeAbs,
          nbJour,
          etat,
          code
        FROM
          demandesconges,
          typesabsences
        WHERE (demandesconges.etat = 1 OR demandesconges.etat = 2)
        AND (
            (EXTRACT(YEAR from dateDu) = " . $tYear . " AND EXTRACT(MONTH from dateDu) = " . $tMonth . ")
            OR
            (EXTRACT(YEAR from dateAu) = " . $tYear . " AND EXTRACT(MONTH from dateAu) = " . $tMonth . ")
            OR
            (dateDu < '" . $tYear . "-" . $tMonth . "-01' AND dateAu >= '" . $tYearSuiv . "-" . $tMonthSuiv . "-01')
          )
        AND idUser = " . $tUserId . "
        AND demandesconges.idTypeAbs = typesabsences.idTypeAbs
        ORDER BY dateDu ASC";

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $conge = $stmt->fetchAll();

            // Calcul le nombre de jour dans un mois
            $mois       = mktime(0, 0, 0, $tMonth, 1, $tYear);
            $nbJourMois = intval(date("t", $mois));

            $arrRes = array();

            // Pas de congés pour cette période
            if (count($conge) == 0) {
                $message = array('message' => "Aucunes informations trouvées pour l'utilisateur: " . $tUserId);
                return new JsonResponse($message, Response::HTTP_NOT_FOUND);
            } else {
                $dateDu = $dateAu = $timeDu = $timeAu = array();
                $midi   = new \DateTime('12:00:00');

                // Tableau des jours du mois
                for ($i = 1; $i <= $nbJourMois; $i++) {
                    $arrDay = array();

                    // Date en cours de traitement
                    $processedDate  = new \DateTime($tYear . "-" . $tMonth . "-" . $i);
                    $hasDemiJournee = false;

                    // Les congés trouvés pour le mois $month
                    foreach ($conge as $keyC => $valueC) {

                        // Il y a une virgule donc une demi-journée
                        if (explode('.', $valueC["nbJour"])) {
                            $hasDemiJournee = true;
                        }

                        // Creation de dates à partir des infos de la requete
                        if (!array_key_exists($keyC, $dateDu) && empty($dateDu[$keyC])) {
                            $dateTmpDu     = explode(" ", $valueC["dateDu"]);
                            $dateDu[$keyC] = new \DateTime($dateTmpDu[0]);
                            $timeDu[$keyC] = new \DateTime($dateTmpDu[1]);
                        }
                        if (!array_key_exists($keyC, $dateAu) && empty($dateAu[$keyC])) {
                            $dateTmpAu     = explode(" ", $valueC["dateAu"]);
                            $dateAu[$keyC] = new \DateTime($dateTmpAu[0]);
                            $timeAu[$keyC] = new \DateTime($dateTmpAu[1]);
                        }

                        // La date n'est ni un jour férié ni un weekend
                        if (!UtilsController::estJourWE($i, $tMonth, $tYear) && !UtilsController::estJourFerie($i, $tMonth, $tYear)) {

                            // La date est comprise dans l'intervalle du congé en cours de traitement
                            if (empty($arrDay) && $processedDate >= $dateDu[$keyC] && $processedDate <= $dateAu[$keyC]) {
                                $code2Carac = substr($valueC["code"], 0, 2);

                                // Deux caractères sauf pour CMA/CPA
                                $valueCodeCarac = $code2Carac;
                                if ($valueC["code"] == "CMA" || $valueC["code"] == "CMA") {
                                    $valueCodeCarac = $valueC["code"];
                                }
                                $arrDay     = array(
                                    "jour" => $i,
                                    "code" => $valueCodeCarac,
                                    "etat" => $valueC["etat"],
                                );

                                // La date est égale à une des bornes de l'intervalle de congé et c'est une demi-journée
                                if ($hasDemiJournee && (($processedDate == $dateDu[$keyC] && $timeDu[$keyC] == $midi)
                                    || ($processedDate == $dateAu[$keyC] && $timeAu[$keyC] == $midi))) {
                                    $arrDay["code"] = "0,5+" . $code2Carac;
                                }

                                // 2 intervalles ont des infos le meme jour: 2 demi-journées
                            } elseif (!empty($arrDay) && $processedDate >= $dateDu[$keyC] && $processedDate <= $dateAu[$keyC]) {
                                $code2Carac = substr($valueC["code"], 0, 2);

                                // Dans l'id de la table valeurjourouvre RT est toujours en premier; pour faire correspondre le code a l'id de cette table:
                                if (strtolower($code2Carac) == 'rt') {
                                    // Les 2 derniers caracteres de la valeur deja presente ajouté aux autres infos
                                    // Ex: 0,5RT+0,5CP
                                    $arrDay["code"] = "0,5" . $code2Carac . "+0,5" . substr($arrDay["code"], -2);
                                } else {
                                    $arrDay["code"] = "0,5" . substr($arrDay["code"], -2) . "+0,5" . $code2Carac;
                                }
                            }
                            // La date est un jour férié ou un weekend
                        } else {
                            $arrDay = array(
                                "jour" => $i,
                                "code" => "0,0",
                                "etat" => "",
                            );
                        }
                    }

                    // Pas de congés a cette date
                    if (empty($arrDay)) {
                        $arrDay = array(
                            "jour" => $i,
                            "code" => "1,0",
                            "etat" => "",
                        );
                    }

                    array_push($arrRes, $arrDay);
                }
            }

            if (count($arrRes) != 0) {
                return new JsonResponse($arrRes, Response::HTTP_OK);
            }
        } else {
            $message = array('message' => 'Format paramètres incorrect');
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * Envoi un mail de notification au manager quand la demande de congé
     * est envoyé pour validation
     *
     * @param array       $data           Informations de la demande de congé
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
            $message .= "Demande de cong&eacute;s du collaborateur : " . $nomcollabo . "<br /><br />";

            foreach ($data['lignesDemandes'] as $ligne) {
                $dateDebut = $ligne['dateDebut'];
                $dateFin   = $ligne['dateFin'];
                $typeabs   = $ligne['typeabs'];
                $nbJours   = $ligne['nbJours'];

                $message .= "<br />Du : " . $dateDebut . "<br />Au : " . $dateFin . "<br /> Nombre de jours : " . $nbJours . "<br /> Type d'absences : " . $this->getTypesAbsencesByID($typeabs) . "<br />";
            }

            $message .= "<br />En attente de validation par " . $managerData['manager'] . ".";
            $message = mb_convert_encoding($message, 'UTF-8', 'UTF-8');

            $subject = "APPLI - Demande de congés de " . $nomcollabo . " pour la période du " . $dateDebut . " au " . $dateFin . " (État: " . utf8_encode($this->getDescriptionByEtat($etat)) . ")";

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
     * Retourne la descrition de l'état de la demande de congé
     *
     * @param int       $etat           état de la demande
     *
     */
    private function getDescriptionByEtat($etat)
    {
        switch ($etat) {
            case 0:
                return "Brouillon";
            case 1:
                return "En attente de validation";
            case 2:
                return "Validé";
            case 3:
                return "À modifier";
            default:
                return "Non défini";
        }
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

        $imgPath = "/var/www/clients/cat3/Site/prod/espacecollaborateur/rest/api/v1/app/Resources/images/";

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

    /**
     * Retourne le libellé du type d'absence dont le code est donné en paramètre
     *
     * @param int       $typeabsID           code du type d'absence
     *
     */
    private function getTypesAbsencesByID($typeabsID)
    {
        $sql = "SELECT DISTINCT
            typesabsences.code AS codeTypeAbs,
            typesabsences.libelle AS libelleTypeAbs
        FROM
          typesabsences
        LEFT JOIN demandesconges ON typesabsences.idTypeAbs = demandesconges.idTypeAbs
        WHERE typesabsences.idTypeAbs = " . $typeabsID . ";
        ";

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
        $retour = $stmt->fetchAll();

        return $retour[0]['libelleTypeAbs'];
    }
}
