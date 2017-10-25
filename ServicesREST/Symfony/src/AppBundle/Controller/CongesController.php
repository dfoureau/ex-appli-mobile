<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Debug\Exception\ContextErrorException;


class CongesController extends Controller
{

	/**
	 * Retourne le dernier solde congés et le dernier solde RTT de l'utilisateur en paramère
	 * 
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 *
	 * @Route("/conges/solde/{userId}", name="soldeconges")
	 * @Method("GET")
	 */
	public function getDemandeCongesByUserId(Request $request, $userId)
	{
		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		$tUserId = (int) $userId;

		if (is_int($tUserId)) {
			$sql = 'SELECT 
						users.id, 
						concat(RIGHT(concat("0", soldesconges.mois), 2), soldesconges.annee) as datesolde, 
						soldesconges.cp, 
						soldesconges.rtt 
					FROM 
						users,
						soldesconges 
					WHERE users.numMat = soldesconges.nummat
					AND users.id = "'.$tUserId.'" 
					ORDER BY concat(annee, mois) DESC limit 1';

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$stmt->execute();
			$retour = $stmt->fetchAll();

			if (count($retour) != 0) {
				return new JsonResponse($retour, Response::HTTP_OK);
			} else {
				$message = array('message' => 'Utilisateur non trouvé : ' . $tUserId);
				return new JsonResponse($message, Response::HTTP_NOT_FOUND);
			}
		} else {
			$message = array('message' => 'Format paramètres incorrect');
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
		}
	}

	/**
	 * Créer une nouvelle demande de congés
	 *
	 * @param Request 	$request 		Requete en entrée
	 *
	 * @Route("/conges", name="creerconges")
	 * @Method("POST")
	 */
	public function createDemandeCongesAction(Request $request)
	{
		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		$data = json_decode(file_get_contents('php://input'), true);

		try {
			$retour = $this->createDemandeConges($data);
		} catch (ContextErrorException $e) {
			return new JsonResponse("Problème de paramètres", Response::HTTP_BAD_REQUEST);
		}

		return new JsonResponse($retour['message'], $retour['code']);
	}
	
	/**
	 *
	 *
	 */
	public function createDemandeConges($data)
	{
		// Exemple de jason 
		// {
		// 	"userId": 124124251,
		// 	"etat": "Brouillon",
		// 	"dateEtat": "2017-10-23T12:00:19.871Z",
		// 	"lignesDemandes": [
		// 		{
		// 			"numLigne": 1,
		// 			"dateDebut": "2017-10-12T12:00:19.872Z",
		// 			"dateFin": "2017-10-12T12:00:19.872Z",
		// 			"nbJours": 1,
		// 			"typeabs" : 1
		// 		},
		// 		{
		// 			"numLigne": 2,
		// 			"dateDebut": "2017-10-13T12:00:19.872Z",
		// 			"dateFin": "2017-10-23T12:00:19.872Z",
		// 			"nbJours": 10,
		// 			"typeabs" : 1
		// 		}
		// 	]
		// }

		// Récupère l'userId à partir du $data
		$userId = $data['userId'];
// Ou on le recupere à partir du token

		// Récupere le numéro de la demande à partir de la table
		$sql = "SELECT MAX(numdemande) as num from demandesconges where idUser = '$userId'";
		$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
		$stmt->execute();

		$retour= $stmt->fetchAll();
		// S'il n'existe pas de ligne c'est qu'il n'y a jamais eu de demande de congés, donc on la met à 1
		if (count($retour) == 0) {
			$numDemande = '1';
		} else {
			// S'il existe une ligne, on récupère et on incrémente d'1
			foreach($retour as $key => $value) {
				$numDemande = $value['num'] + 1 ;
			}
// Ou de la fonction
// $numDemande = Utils::getMaxNumDemande($id);

			switch ($data['etat']){
				case "Brouillon" :
					$etat = 0;
					break;
				case "En attente validation" :
					$etat = 1;
					break;
					// Etats validés ou A modifier interdits, autres états inconnus
				default :
					$retour=array('code' => Response::HTTP_BAD_REQUEST, 'message' => 'Etat invalide');
					return $retour;
					break;
			}

			$dateEtat = $data['dateEtat'];
			$lignes = $data['lignesDemandes'];

			$sql = 'INSERT INTO demandesconges (numDemande, dateDemande, idUser, numLigne, dateDu, dateAu, idTypeAbs, nbJour, etat, validateur, dateactionetat) VALUES ';

			$i = 0;
			foreach ($lignes as $key => $row) {
				$numLigne = $row['numLigne'];
				$dateDebut = $row['dateDebut'];
				$dateFin = $row['dateFin'];
				$nbJours = $row['nbJours'];
				$typeAbs = $row['typeabs'];

				if ($i > 0) {
					$sql .=',';
				}

				$sql .= "('$numDemande', '$dateEtat', '$userId', '$numLigne', '$dateDebut', '$dateFin', '$typeAbs', '$nbJours', '$etat', '$userId', null)"; 
				$i++;
			}
			$sql .= ';';

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$stmt->execute();

			$retour = array('message' => "OK", 'code' => Response::HTTP_OK);
			return $retour;
		}
	}

	/**
	 * Mettre à jour une demande de congés
	 * 
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 * @param int 		$numRequest 	Numéro de la demande de congés
	 *
	 * @Route("/conges/{userId}/{numRequest}", name="majconges")
	 * @Method("PUT")
	 */
	public function putDemandeCongesAction(Request $request, $userId, $numRequest)
	{

		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		// Appel la fonction deleteCongés
		$retourdelete=$this->deleteDemandeConges($userId,$numRequest);  
		if ($retourdelete['code'] != Response::HTTP_OK){
			return new JsonResponse($retourdelete['message'], $retourdelete['code']);
		}

		// Appel la fonction postCongés
		$retourpost = $this->createDemandeCongesAction($request);  
		return $retourpost;

		if ($retourpost['code'] != Response::HTTP_OK){
			return new JsonResponse($retourpost['message'], $retourpost['code']);
		}
	}
	

	/**
	 * Supprimer une demande de congés
	 * 
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 * @param int 		$numRequest 	Numéro de la demande de congés
	 *
	 * @Route("/conges/supprimer/{userId}/{numRequest}", name="deleteconges")
	 * @Method("DELETE")
	 */
	public function deleteDemandeCongesAction(request $delete, $userId, $numRequest)
	{
		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		$retourdelete=$this->deleteDemandeConges($userId,$numRequest);  
		return new JsonResponse($retourdelete['message'], $retourdelete['code']);
	}

	/**
	 *
	 *
	 */
	public function deleteDemandeConges($userId, $numRequest)
	{
		// Vérifie si la ligne existe
		$sql = "SELECT 
					numdemande 
				FROM 
					demandesconges 
				WHERE idUser = '$userId' 
				AND numDemande = '$numRequest'";

		$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
		$stmt->execute();

		$list= $stmt->fetchAll();

		// La ligne existe, alors on la supprime
		if (count($list) != 0) {
			$sql = "DELETE 
					FROM 
						demandesconges 
					WHERE idUser = '$userId'
					AND numDemande = '$numRequest'";

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$retour=$stmt->execute();

			$message = array('message' => 'Demande congés supprimée');
			return  array('message' => $message, 'code' => Response::HTTP_OK);
		
		} else { // La ligne n'existe pas, on le signale et on ne la supprime pas

			$message = array('message' => 'Delete KO');
			return  array('message' => $message, 'code' => Response::HTTP_BAD_REQUEST);

		}
	}

	/**
	 * Retourne toutes les demandes de congés de l'utilisateur en paramètre pour l'année en paramètre
	 * 
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 * @param int 		$year 			Année demandée
	 *
	 * @Route("/conges/{userId}/{year}", name="congesparannee")
	 * @Method("GET")
	 */
	public function getFindDemandesByUserAndYear(Request $request, $userId, $year)
	{
		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		$tUserId = (int) $userId;
		$tYear = (int) $year;

		if (is_int($tUserId) && is_int($tYear)) {

			$sql = "SELECT
						numDemande,
						dateDu, 
						dateAu,
						SUM(nbJour) as nbJour,
						etat,
						concat(users.prenom,' ', users.nom) as valid,
						dateactionetat
					FROM 
						demandesconges,
						users
					WHERE users.id = demandesconges.validateur
					AND EXTRACT(YEAR from dateDu) <= " . $tYear . "
					AND EXTRACT(YEAR from dateAu) >= " . $tYear . "
					AND idUser=" . $tUserId . " 
					GROUP BY numDemande, EXTRACT(MONTH from dateDu), EXTRACT(YEAR from dateDu)
					ORDER BY dateDu DESC";

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$stmt->execute();
			$retour = $stmt->fetchAll();
			
			if (count($retour) != 0) {
				return new JsonResponse($retour, Response::HTTP_OK);
			} else {
				$message = array('message' => 'Utilisateur non trouvé : ' . $tUserId);
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
	 * @param Request 	$request 		Requete en entrée
	 *
	 * @Route("/conges/typesabsences", name="typeabsconges")
	 * @Method("GET")
	 */
	public function getTypesAbsences(Request $request)
	{
		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

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
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 * @param int 		$year 			Année demandée
	 * @param int 		$month 			Mois demandé
	 *
	 * @Route("/conges/{userId}/{year}/{month}", name="congesdumois")
	 * @Method("GET")
	 */
	public function getInfosCongesDuMois(Request $request, $userId, $year, $month)
	{
		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		$tUserId = (int) $userId;
		$tYear = (int) $year;
		$tMonth = (int) $month;

		if (is_int($tUserId) && is_int($tYear) && is_int($tMonth)) {
// Output : liste des jours du mois ayant une absence
// numéro du jour
// type absence
// etat

// Ne prendre en compte que les états validés ou en attente validation
// Si le jour est travaillé, renseigner : 1.0
// Sinon, renseigner le type AB, CP...	

// TODO : Finir la requete	

			$sql = "
				SELECT 
					numDemande,
					dateDu, 
					dateAu,
					idTypeAbs,
					nbJour,
					etat
				FROM demandesconges
				WHERE (demandesconges.etat = 1 OR demandesconges.etat = 2)
				AND (
						(EXTRACT(YEAR from dateDu) = " . $tYear . " AND EXTRACT(MONTH from dateDu) = " . $tMonth . ")
						OR 
						(EXTRACT(YEAR from dateAu) >= " . $tYear . " AND EXTRACT(MONTH from dateAu) = " . $tMonth . ")
					)
				AND idUser = " . $tUserId . "
				ORDER BY dateDu ASC";

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$stmt->execute();
			$retour = $conge = $stmt->fetchAll();

// Si retour n'est pas vide

			$sql = "
				SELECT *
				FROM
				(
					SELECT 
						DATE(D1.dte1) AS c1
					FROM (
						SELECT '" . $tYear . "-" . $tMonth . "-01' AS dte1 UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 1 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 2 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 3 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 4 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 5 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 6 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 7 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 8 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 9 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 10 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 11 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 12 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 13 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 14 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 15 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 16 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 17 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 18 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 19 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 20 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 21 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 22 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 23 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 24 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 25 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 26 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 27 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 28 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 29 DAY) UNION ALL
						SELECT DATE_ADD('2017-08-01', INTERVAL 30 DAY) 
					) AS D1
				) AS mois
				LEFT OUTER JOIN
				(
					SELECT 
						c2,
						DC.idTypeAbs,
						DC.etat
					FROM
					(
						SELECT DATE(D2.dte2) AS c2
						FROM (
							SELECT '" . $tYear . "-" . $tMonth . "-01' AS dte2 UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 1 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 2 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 3 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 4 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 5 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 6 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 7 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 8 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 9 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 10 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 11 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 12 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 13 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 14 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 15 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 16 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 17 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 18 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 19 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 20 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 21 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 22 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 23 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 24 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 25 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 26 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 27 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 28 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 29 DAY) UNION ALL
							SELECT DATE_ADD('2017-08-01', INTERVAL 30 DAY) 
						) AS D2
					) AS mois2,
					demandesconges AS DC
				WHERE c2 BETWEEN ";

            $or = false;
            foreach ($conge as $key => $value) {
				if ($or) {
					$sql .= " OR c2 BETWEEN ";
				}

				$sql .= "'" . $value["dateDu"] . "' AND '" . $value["dateAu"] . "'";

				if (!$or) {
					$or = true;
				}
			}

			$sql .= "
				) as liste 
				ON mois.c1 = liste.c2";

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$stmt->execute();
			$retour = $stmt->fetchAll();
			
			if (count($retour) != 0) {
				return new JsonResponse($retour, Response::HTTP_OK);
			} else {
				$message = array('message' => 'Informations non trouvées : ' . $tUserId);
				return new JsonResponse($message, Response::HTTP_NOT_FOUND);
			}
		} else {
			$message = array('message' => 'Format paramètres incorrect');
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
		}
	}
}
