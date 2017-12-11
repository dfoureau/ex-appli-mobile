<?php

namespace AppBundle\Controller;

use AppBundle\Security\LoginController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AnnuaireController extends Controller
{
    /**
     * @Route("/annuaire/{idAgence}", name="annuaire")
     * @Method({"GET"})
     */
    public function annuaire(Request $request, $idAgence)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        // Test valeur en entrée
        if (UtilsController::isPositifInt($idAgence)) {
            $tIdAgence = (int) $idAgence;

            $sql = '
                SELECT
                    id,
                    nom,
                    prenom
                FROM
                    users
                WHERE idAgence = "' . $tIdAgence . '"
                AND archive != "O"
                ORDER BY nom ASC, prenom ASC';

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetchAll();

            if (count($retour) == 0) {
                $message = array('message' => 'Agence non trouvée ' . $tIdAgence);
                return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
            } else {
                return new JsonResponse($retour, Response::HTTP_OK);
            }
        } else {
            $message = array('message' => 'Paramètre idAgence incorrect: ' . $idAgence);
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/annuaire/user/{userId}", name="infos_collab")
     * @Method({"GET"})
     */
    public function infos_collab(Request $request, $userId)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        // Test valeur en entrée
        if (UtilsController::isPositifInt($userId)) {
            $tUserId = (int) $userId;

            $sql = 'SELECT
                        id,
                        nom,
                        prenom,
                        entitesjuridiques.nomEntite,
                        users.idprofil,
                        profils.libelle,
                        users.tel as tel,
                        telmobile,
                        telclient,
                        mail,
                        mailclient,
                        mailPerso,
                        societeagence.nomSocieteAgence as agence
                    FROM
                        users,
                        societeagence,
                        entitesjuridiques,
                        profils
                    WHERE idAgence = idSocieteAgence
                    AND users.identitejuridique = entitesjuridiques.idEntite
                    AND users.idprofil = profils.idprofil
                    AND users.archive != "O"
                    AND users.idagence = societeagence.idSocieteAgence
                    AND id = ' . $tUserId;

            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();
            $retour = $stmt->fetchAll();

            if (count($retour) == 0) {
                $message = array('message' => 'Utilisateur non trouvé ' . $tUserId);
                return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
            } else {
                return new JsonResponse($retour, Response::HTTP_OK);
            }
        } else {
            $message = array('message' => 'Format paramètres incorrect :' . $userId);
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }
    }
}
