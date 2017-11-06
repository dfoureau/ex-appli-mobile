<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use AppBundle\Security\LoginController;

class NewsController extends Controller
{
	/**
	 * @Route("/news/{nombre}", name="news")
	 * @Method({"GET"})
	 */
	public function news(Request $request, $nombre)
	{
		// $log = new LoginController();
		// $retourAuth = $log->checkAuthentification($this);
		// if (array_key_exists("erreur", $retourAuth)) {
		// 	return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
		// }

		// Test valeur en entrée
		if (UtilsController::isPositifInt($nombre)) {

			$tNombre = (int) $nombre;

// Récupérer l'id de l'utilisateur dans le token
// $idUser = $retourAuth['id'];
// Pour les tests on prend un id fixe
$idUser = 124123958;

//TODO mettre les paramètres dans un fichier de config
			$chemin_photo = '/espacecollaborateur/upload/news/photo/';
			$chemin_pdf = '/espacecollaborateur/upload/news/doc/';

			$sql = 'SELECT 
						news_id,news_titre,
						news_contenu, 
						news_date, 
						CONCAT("' . $chemin_photo . '", 
						newstable.news_photo) AS news_photo, 
						CONCAT("' . $chemin_pdf . '", newstable.news_file) AS news_file 
					FROM 
						newstable INNER JOIN users ON 
							(
								news_entite = users.idEntiteJuridique 
								OR 
								news_entite = 0
							) 
					WHERE news_publier = 1 
					AND users.id = ' . $idUser . ' 
					ORDER BY news_date DESC Limit ' . $tNombre;

			$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
			$stmt->execute();
			$retour= $stmt->fetchAll();

			if (count($retour) == 0) {
				$message = array('message' => 'Aucune news trouvée ');
				return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
			} else {
				return new JsonResponse($retour, Response::HTTP_OK);
			}
		} else {
			$message = array('message' => 'Paramètre nombre incorrect');
			return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
		}
	}
}
