<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Security\LoginController;

class UtilisateurController extends Controller
{
    /**
     * @Route("/utilisateur/{id}", name="utilisateur")
       @Method("GET")
     */
    public function GetinfoCollab(Request $request, $id)
    {
       

   $log=new LoginController(); /* AppBundle\Security\LoginController */
       
       /*$retourAuth = $log->checkAuthentification($this);
        if (array_key_exists("erreur", $retourAuth)) {
            return new JsonResponse($retourAuth,403);
          }*/
		

        $sql = 'SELECT users.id,users.nom,users.prenom,entitesjuridiques.nomEntite as entite,profils.libelle as profil,societeagence.nomSocieteAgence as agence, 
                CASE 
                WHEN users.idmanager = "0" THEN "Adel Zeboss"
                ELSE (select concat(u2.prenom," ",u2.nom) from users u2 where users.idmanager = u2.id)
                END AS manager, users.dateEntree 
                FROM users, societeagence, profils, entitesjuridiques, users users2
                where users.idmanager = users2.id
                and users.id = "'.$id.'"
                and societeagence.idsocieteagence = users.idagence 
                and users.idprofil = profils.idprofil
                and users.idEntiteJuridique = entitesjuridiques.idEntite';

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

       $retour= $stmt->fetchAll();

       if(count($retour)==0){
           $message=array('message'=>'Introuvable');
            return new JsonResponse($message,400);
       }
       else
       { 
       return new JsonResponse($retour,200);
       }  
    }
    
}
 