<?php

namespace AppBundle\Controller;

use AppBundle\Security\LoginController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AppliController extends Controller
{
    /**
     * @Route("/app/version", name="appversion")
     * @Method({"GET"})
     */
    public function appVersion(Request $request)
    {
        $log        = new LoginController();
        $retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth, Response::HTTP_FORBIDDEN);
        }

        $retour = array('appversion' => '1.0.0 Beta 2');
        return new JsonResponse($retour, Response::HTTP_OK);
    }
}
