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

			$tYearReq = $tMonth == 12 ? $tYear + 1 : $tYear;
			$tMonthReq = $tMonth == 12 ? 1 : $tMonth + 1;

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
						(dateDu < '" . $tYear . "-" . $tMonth . "-01' AND dateAu >= '" . $tYearReq . "-" . $tMonthReq . "-01')
					)
				AND idUser = " . $tUserId . "
				AND demandesconges.idTypeAbs = typesabsences.idTypeAbs
				ORDER BY dateDu ASC";

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$stmt->execute();
			$conge = $stmt->fetchAll();

			// Calcul le nombre de jour dans un mois
			$mois = mktime(0, 0, 0, $tMonth, 1, $tYear);
			$nbJourMois = intval(date("t", $mois));

			$arrRes = array();

			// Pas de congés pour cette période, envoie un tableau vide
			if (count($conge) == 0) {
				
				// Tableau des jours du mois
				for ($i = 1; $i <= $nbJourMois; $i++) {
					$arrDay = array(
						"jour" 	=> $i,
						"code" 	=> "1.0",
						"etat" 	=> ""
					);
					array_push($arrRes, $arrDay);
				}

			} else {
				// Tableau des jours du mois
				for ($i = 1; $i <= $nbJourMois; $i++) {
					$arrDay = array();

					// Date en cours de traitement
					$processedDate = new \DateTime($tYear . "-" . $tMonth . "-" . $i);

					$dateDu = $dateAu = array();
					// Les congés trouvés pour le mois $month
					foreach ($conge as $keyC => $valueC) {

						// Creation de dates à partir des info de la requete
						if (!array_key_exists($keyC, $dateDu) && empty($dateDu[$keyC])) {
							$dateDu[$keyC] = new \DateTime(explode(" ", $valueC["dateDu"])[0]);
						}
						if (!array_key_exists($keyC, $dateAu) && empty($dateAu[$keyC])) {
							$dateAu[$keyC] = new \DateTime(explode(" ", $valueC["dateAu"])[0]);
						}

						if (empty($arrDay) && $processedDate >= $dateDu[$keyC] && $processedDate <= $dateAu[$keyC]) {
							$arrDay = array(
								"jour" 	=> $i,
								"code" 	=> $valueC["code"],
								"etat" 	=> $valueC["etat"]
							);
						} elseif (!empty($arrDay) && $processedDate >= $dateDu && $processedDate <= $dateAu) {
							$arrDay["code"] = $arrDay["code"] . "+" . $valueC["code"];
						}
					}

					if (empty($arrDay)) {
						$arrDay = array(
							"jour" 	=> $i,
							"code" 	=> "1.0",
							"etat" 	=> ""
						);
					}

					array_push($arrRes, $arrDay);
				}
			}

			if (count($arrRes) != 0) {
				return new JsonResponse($arrRes, Response::HTTP_OK);
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
