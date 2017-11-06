<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Debug\Exception\ContextErrorException;
use AppBundle\Controller\UtilsController;
use AppBundle\Security\LoginController;


class CongesController extends Controller
{

	/**
	 * Retourne le dernier solde congés et le dernier solde RTT de l'utilisateur en paramère
	 * 
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 *
	 * @return JsonResponse
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

		// Test valeur en entrée
		if (UtilsController::isPositifInt($userId)) {

			$tUserId = (int) $userId;

			$sql = 'SELECT 
						users.id, 
						concat(RIGHT(concat("0", soldesconges.mois), 2), soldesconges.annee) AS datesolde, 
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

			$message = array('message' => 'Format paramètres incorrect :' . $userId);
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
		}
	}

	/**
	 * Créer une nouvelle demande de congés
	 *
	 * @param Request 	$request 		Requete en entrée
	 *
	 * @return JsonResponse
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
	 * Execute les requetes de creation après vérifiction des parametres
	 *
	 * @param array 	$data 			Informations nécessaires à la création
	 *
	 * @return array
	 */
	public function createDemandeConges($data)
	{
		// Test valeurs en entrée
		if (is_int($data['userId'])) {
			// Récupère l'userId à partir du $data
			$userId = $data['userId'];
// Ou on le recupere à partir du token
		} else {
			$retour = array('code' => Response::HTTP_BAD_REQUEST, 'message' => 'Données en entrée invalides 1');
			return $retour;
		}

		// Récupere le numéro de la demande à partir de la table
		$sql = "SELECT 
					MAX(numdemande) AS num 
				FROM 
					demandesconges 
				WHERE idUser = " . $userId;

		$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
		$stmt->execute();

		$retour = $stmt->fetchAll();
		
		if (count($retour) == 0) { // Il n'existe pas de ligne; il n'y a jamais eu de demande de congés, donc on la met à 1

			$numDemande = '1';

		} else { // S'il existe une ligne, on récupère et on incrémente d'1
		
			foreach($retour as $key => $value) {
				$numDemande = $value['num'] + 1 ;
			}
// Ou de la fonction
// $numDemande = UtilsController::getMaxNumDemande($userId);

			switch ($data['etat']){
				case "Brouillon" :
					$etat = 0;
					break;
				case "En attente validation" :
					$etat = 1;
					break;
					// Etats validés ou A modifier interdits, autres états inconnus
				default :
					$retour = array('code' => Response::HTTP_BAD_REQUEST, 'message' => 'Etat invalide : ' . $data['etat']);
					return $retour;
					break;
			}

			// Test valeurs en entrée
			if (is_array($data['lignesDemandes']) && UtilsController::isValidDate($data['dateEtat'])) {
				$lignes = $data['lignesDemandes'];
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
					&& is_int($row['numLigne']) && is_int($row['nbJours']) && is_int($row['typeabs'])) {
					$numLigne = $row['numLigne'];
					$dateDebut = $row['dateDebut'];
					$dateFin = $row['dateFin'];
					$nbJours = $row['nbJours'];
					$typeAbs = $row['typeabs'];

				} else {
					$retour = array('code' => Response::HTTP_BAD_REQUEST, 'message' => 'Données en entrée invalides 3');
					return $retour;
				}

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
	 * @return JsonResponse
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

		// Test les valeurs en entrée
		if (UtilsController::isPositifInt($userId) && UtilsController::isPositifInt($numRequest)) {

			// Appel la fonction deleteCongés
			$retourdelete=$this->deleteDemandeConges((int)$userId, (int)$numRequest);  
			if ($retourdelete['code'] != Response::HTTP_OK){
				return new JsonResponse($retourdelete['message'], $retourdelete['code']);
			}

			// Appel la fonction postCongés
			$retourpost = $this->createDemandeCongesAction($request);  
			return $retourpost;

			if ($retourpost['code'] != Response::HTTP_OK){
				return new JsonResponse($retourpost['message'], $retourpost['code']);
			}
		} else {

			$message = array('message' => 'Format paramètres incorrect');
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);

		}
	}
	

	/**
	 * Supprimer une demande de congés
	 * 
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 * @param int 		$numRequest 	Numéro de la demande de congés
	 *
	 * @return JsonResponse
	 *
	 * @Route("/conges/supprimer/{userId}/{numRequest}", name="deleteconges")
	 * @Method("DELETE")
	 */
	public function deleteDemandeCongesAction(Request $request, $userId, $numRequest)
	{
		// $log=new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		// Test les valeurs en entrée
		if (UtilsController::isPositifInt($userId) && UtilsController::isPositifInt($numRequest)) {

			$retourdelete=$this->deleteDemandeConges((int)$userId, (int)$numRequest);  
			return new JsonResponse($retourdelete['message'], $retourdelete['code']);

		} else {

			$message = array('message' => 'Format paramètres incorrect');
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);

		}
	}

	/**
	 * Execute les requetes de suppressions après vérifiction de l'existance de la demande de congé
	 *
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 * @param int 		$numRequest 	Numéro de la demande de congés
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
			$retour = $stmt->execute();

			$message = array('message' => 'Demande congés supprimée');
			return array('message' => $message, 'code' => Response::HTTP_OK);
		
		} else { // La ligne n'existe pas, on le signale et on ne la supprime pas

			$message = array('message' => 'Delete KO');
			return array('message' => $message, 'code' => Response::HTTP_BAD_REQUEST);

		}
	}

	/**
	 * Retourne toutes les demandes de congés de l'utilisateur en paramètre pour l'année en paramètre
	 * 
	 * @param Request 	$request 		Requete en entrée
	 * @param int 		$userId 		Identifiant de l'utilisateur
	 * @param int 		$year 			Année demandée
	 *
	 * @return JsonResponse
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

		// Test les valeurs en entrée
		if (UtilsController::isPositifInt($userId) && ctype_digit($year) && (int)$year > 1995 && (int)$year < 2050) {
			$tUserId = (int) $userId;
			$tYear = (int) $year;

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
	 * @return JsonResponse
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
	 * @return JsonResponse
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

		// Test les valeurs en entrée
		if (UtilsController::isPositifInt($userId) && ctype_digit($year) && ctype_digit($month)
			&& (int)$month >= 1 && (int)$month <= 12 && (int)$year > 1995 && (int)$year < 2050) {

			$tUserId = (int) $userId;
			$tYear = (int) $year;
			$tMonth = (int) $month;

			// Calcul du mois et de l'année suivant le mois en parametre
			$tYearSuiv = $tMonth == 12 ? $tYear + 1 : $tYear;
			$tMonthSuiv = $tMonth == 12 ? 1 : $tMonth + 1;

			// Pour le AND : La date de debut du congé est égale au mois et a l'année recherchée
			// 		ou bien La date de fin du congé est égale au mois et a l'année recherchée
			// 		ou bien l'année recherchée est comprise entre les intervalles de début et fin de congé:
			// 			Prise de plus d'un mois de congé
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
			$mois = mktime(0, 0, 0, $tMonth, 1, $tYear);
			$nbJourMois = intval(date("t", $mois));

			$arrRes = array();

			// Pas de congés pour cette période
			if (count($conge) == 0) {
				
				$message = array('message' => "Aucunes informations trouvées pour l'utilisateur: " . $tUserId);
				return new JsonResponse($message, Response::HTTP_NOT_FOUND);

			} else {

				$dateDu = $dateAu = $timeDu = $timeAu = array();
				$midi = new \DateTime('12:00:00');

				// Tableau des jours du mois
				for ($i = 1; $i <= $nbJourMois; $i++) {
					$arrDay = array();

					// Date en cours de traitement
					$processedDate = new \DateTime($tYear . "-" . $tMonth . "-" . $i);
					$hasDemiJournee = false;

					// Les congés trouvés pour le mois $month
					foreach ($conge as $keyC => $valueC) {

						// Il y a une virgule donc une demi-journée
						if (explode('.', $valueC["nbJour"])) {
						  $hasDemiJournee = true;
						}

						// Creation de dates à partir des infos de la requete
						if (!array_key_exists($keyC, $dateDu) && empty($dateDu[$keyC])) {
							$dateTmpDu = explode(" ", $valueC["dateDu"]);
							$dateDu[$keyC] = new \DateTime($dateTmpDu[0]);
							$timeDu[$keyC] = new \DateTime($dateTmpDu[1]);
						}
						if (!array_key_exists($keyC, $dateAu) && empty($dateAu[$keyC])) {
							$dateTmpAu = explode(" ", $valueC["dateAu"]);
							$dateAu[$keyC] = new \DateTime($dateTmpAu[0]);
							$timeAu[$keyC] = new \DateTime($dateTmpAu[1]);
						}

						// La date n'est ni un jour férié ni un weekend
						if (!UtilsController::estJourWE($i, $tMonth, $tYear) && !UtilsController::estJourFerie($i, $tMonth, $tYear)) {

							// La date est comprise dans l'intervalle du congé en cours de traitement
							if (empty($arrDay) && $processedDate >= $dateDu[$keyC] && $processedDate <= $dateAu[$keyC]) {

								$code2Carac = substr($valueC["code"], 0, 2);
								$arrDay = array(
									"jour" 	=> $i,
									"code" 	=> $code2Carac,
									"etat" 	=> $valueC["etat"]
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
								"jour" 	=> $i,
								"code" 	=> "0,0",
								"etat" 	=> ""
							);
						}
					}

					// Pas de congés a cette date
					if (empty($arrDay)) {
						$arrDay = array(
							"jour" 	=> $i,
							"code" 	=> "1,0",
							"etat" 	=> ""
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
}
