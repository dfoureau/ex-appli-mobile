<?php

namespace AppBundle\Controller;

use AppBundle\Controller\UtilsController;
use AppBundle\Security\LoginController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UtilisateurController extends Controller
{
    /**
     * @Route("/utilisateur/{id}", name="utilisateur")
     * @Method({"GET"})
     */
    public function utilisateur(Request $request, $id)
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

        if (UtilsController::isPositifInt($id)) {
            $id = (int) $id;

            $sql = 'select users.id as id,users.nom as nom,users.prenom,profils.libelle as profil,entitesjuridiques.nomEntite as entite,societeagence.nomSocieteAgence as agence from users, profils, entitesjuridiques,societeagence
            where users.id = "' . $id . '"
            and users.idprofil = profils.idProfil
            and users.idEntiteJuridique = entitesjuridiques.idEntite
            and users.idagence = societeagence.idSocieteAgence';

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetchAll();

            $manager = UtilsController::getUserManager($id)['manager'];
            //$nom=$retour['nom'];

            $retour[0]['responsable'] = $manager;

            //$retour=array('id'=>$id, 'nom' => $nom, 'responsable'=>$manager);

            if (count($retour) == 0) {
                $message = array('message' => 'Utilisateur non trouvé ' . $id);
                return new JsonResponse($message, 400);
            } else {
                return new JsonResponse($retour);
            }
        } else {
            $message = array('message' => 'Paramètre id incorrect: ' . $id);
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }
}
