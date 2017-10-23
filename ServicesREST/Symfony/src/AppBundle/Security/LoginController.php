<?php
/**
 * Created by PhpStorm.
 * User: r.landry
 * Date: 18/10/2017
 * Time: 11:25
 */

namespace AppBundle\Security;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication;
use Lexik\Bundle\JWTAuthenticationBundle\Services;

class LoginController extends Controller
{


    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/login", name="connexion")
     * @Method("POST")
     */
    public function ConnexionAction(Request $request)
    {
        //On récupère les identifiants
        $login= $request->request->get('login');
        $password= $request->request->get('password');
        //On parse le mdp
        $passMd5= md5($password);


        $sql='SELECT id,login,mail,pass_crypt, nom, prenom, dateEntree
               FROM users 
               where archive !="O" AND login="'.$login.'" AND pass_crypt = "'.$passMd5.'"';

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

        $list= $stmt->fetchAll();
        if(count($list)==0){
            $message=array('message'=>'Login et/ou mdp incorrect', 'login'=>$login,'$password'=>$password);
            return new JsonResponse($message,400);
        }

        $user=$list[0];

        //On définit les valeurs dans le token
        $time= time() + 3600;
        $data=array(
            'id' => $user['id'],
            'exp' => $time // 1 hour expiration
        );

        //Génération du token
        $token = $this->get('lexik_jwt_authentication.encoder')
                      ->encode($data);

        //Tableau retourné
        $retour=array('id'=>$user['id'],
                      'token'=>$token);


        return new JsonResponse($retour);

    }

    public function checkAuthentification($controller){
        //On récupère la liste des headers
        $headers = apache_request_headers();
        //On détermine si le token existe
        if (!array_key_exists("Authorization", $headers)) {
            //TODO erreur token non conforme
            return array('erreur' => 'Token non présent', 'connexion' => 1);
        }

        $tab=explode (' ',$headers['Authorization']);

       if(!(count($tab)>1)){
           //TODO message erreur
           return array('erreur' => 'Token erreur', 'connexion' => 1);
       }

        //On récupère le token
        $token=$tab[1];

        $list = $controller->get('lexik_jwt_authentication.encoder')
                           ->decode($token);

        if($list===false){
            //TODO erreur decodage du token
            // Le token peut être expiré
            return array('erreur'=>'Token non conforme', 'connexion'=>1);
        }
        if (!array_key_exists("id", $list)) {
            //TODO erreur token non conforme
            return array('erreur' => 'Token: liste des variables non conformes', 'connexion' => 1);
        }
        $id = $list['id'];
        return array('id'=>$id);
    }

}