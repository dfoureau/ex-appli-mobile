<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class DefaultController extends Controller
{

    /**
    *@Route("/appli-mobile/example", name="homepage")
    */
    public function indexAction()
    {
        //$data = json_decode(file_get_contents('php://input'), true);
    	//$idAgence= $data['idAgence'];

        return $this->render('default/index.html.twig');
    }



}
