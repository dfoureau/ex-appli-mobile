<?php

namespace AppBundle\Controller;

use AppBundle\Security\LoginController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class NewsController extends Controller
{
    /**
     * @Route("/news/{nombre}", name="news")
     * @Method({"GET"})
     */
    public function news(Request $request, $nombre)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        // Test valeur en entrée
        if (UtilsController::isPositifInt($nombre)) {
            $tNombre = (int) $nombre;

            // Le service pourra retourner 25 news au max
            if ($tNombre > 25) {
                $tNombre = 25;
            }

            //Désormais l'idAgence est fourni lors de la vérification du token, donc on le récupère
            $idAgence = $retourAuth['idAgence'];

            $chemin_photo = '/espacecollaborateur/upload/news/photo/';
            $chemin_pdf   = '/espacecollaborateur/upload/news/doc/';

            $sql = 'SELECT
                        news_id,news_titre,
                        news_contenu,
                        news_date,
                        CONCAT("' . $chemin_photo . '",
                        newstable.news_photo) AS news_photo,
                        CONCAT("' . $chemin_pdf . '", newstable.news_file) AS news_file
                    FROM
                        newstable
                    WHERE news_publier = 1  and (news_entite = 0 OR news_entite = ' . $idAgence . ')
                    ORDER BY news_date DESC Limit ' . $tNombre;

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetchAll();

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
