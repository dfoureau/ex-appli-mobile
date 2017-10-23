<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

class NewsController extends Controller
{


    /**
	* @Route("/news/{nombre}", name="news")
	* @Method({"GET"})
     */
    public function news(Request $request, $nombre)
    {
  
      if((int)($nombre)<=0){
           $message=array('message'=>'Paramètre nombre incorrect');
            return new JsonResponse($message,400);
       }


    	//TODO récupéerer l'id de l'utilisateur dans le token
    	$idUser = 124123958;

    	//TODO mettre les paramètres dans un fichier de config
    	$chemin_photo = '/espacecollaborateur/upload/news/photo/';
    	$chemin_pdf = '/espacecollaborateur/upload/news/doc/';

        $sql='SELECT news_id,news_titre,news_contenu, news_date, CONCAT("'.$chemin_photo.'", newstable.news_photo) AS news_photo, CONCAT("'.$chemin_pdf.'", newstable.news_file) AS news_file FROM newstable inner join users on (news_entite=users.idEntiteJuridique or news_entite=0) where news_publier=1 and users.id = '.$idUser.' order by news_date DESC Limit '.$nombre;

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

       $retour= $stmt->fetchAll();
       if(count($retour)==0){
           $message=array('message'=>'Aucune news trouvée ');
            return new JsonResponse($message,400);
       }
       else 
       return new JsonResponse($retour);

    }


}
