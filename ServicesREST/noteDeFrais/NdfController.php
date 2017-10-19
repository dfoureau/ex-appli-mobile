<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class NdfController extends Controller
{


	/**
	* @Route("/ndf/{annee}/{idUser}", name="ndfByUser")
  * @Method({"GET"})
     */
    public function ndfByUser(Request $request, $annee, $idUser)
    {

       if((int)($idUser)<=0){
           $message=array('message'=>'Paramètre idUser incorrect');
            return new JsonResponse($message,400);
       }
        
      $sql='SELECT idUser,  mois, annee, COALESCE(ROUND(SUM(nbkms)*MIN(notedefrais.indemKM),2),0) + COALESCE(SUM(peages),0) + COALESCE(SUM(notedefrais.forfait),0) + COALESCE(SUM(sncf),0) + COALESCE(SUM(pourcentage),0) + COALESCE(SUM(hotel),0) + COALESCE(SUM(repas),0) + COALESCE(SUM(invit),0) + COALESCE(SUM(essence),0) + COALESCE(SUM(parking),0) + COALESCE(SUM(taxi),0) + COALESCE(SUM(divers),0) AS montantTotal, CASE etat WHEN 0 THEN "Brouillon" WHEN 1 THEN "En attente validation" WHEN 2 THEN "Validé" ELSE "Autre" END as etat, dateactionetat, CONCAT(valid.prenom," ", valid.nom) as valideur FROM notedefrais  left join users as valid on notedefrais.validateur = valid.id WHERE idUser = "'.$idUser.'" and annee = '.$annee.' GROUP BY idUser, mois, annee,etat, dateactionetat;';

    	$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
       	$retour= $stmt->fetchAll();
       	if(count($retour)==0){
         	$message=array('message'=>'Aucune note de frais trouvée');
            return new JsonResponse($message,400);
       	}
       else 
       	return new JsonResponse($retour);

    }



}
