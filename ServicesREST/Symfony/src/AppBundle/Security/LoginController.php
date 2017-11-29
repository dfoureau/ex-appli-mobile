<?php

namespace AppBundle\Security;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
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

        $sql='SELECT id,login,idAgence,mail,pass_crypt, nom, prenom, dateEntree
               FROM users 
               where archive !="O" AND login="'.$login.'" AND pass_crypt = "'.$passMd5.'"';

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

        $list= $stmt->fetchAll();
        if(empty($list)){
            $message=array('message'=>'Login et/ou mdp incorrect');
            return new JsonResponse($message, Response::HTTP_BAD_REQUEST);
        }

        $user=$list[0];

        $this->ajouterDerniereConnexion($user['id']);

        //On définit les valeurs dans le token
        $time= time() + 3600;
        $data=array(
            'id' => $user['id'],
            'idAgence'=>$user['idAgence'],
            'exp' => $time // 1 hour expiration
        );

        //Génération du token
        $token = $this->get('lexik_jwt_authentication.encoder')
                      ->encode($data);

        //Tableau retourné
        $retour=array('id'=>$user['id'],
                      'idAgence'=>$user['idAgence'],
                      'token'=>$token);

        //$retour = array("token"=>$token);
        return new JsonResponse($retour,Response::HTTP_OK);
    }

    public function checkAuthentification($controller)
    {
        //file_put_contents('log.txt', date("Y-m-d H:i:s") ." : " . "pas e pb" ."\r\n", FILE_APPEND);
        //On récupère la liste des headers
        $id = '';
        $idAgence = '';
        
        $headers = apache_request_headers();
        
        /*foreach ($headers as $header => $value) {

        file_put_contents('log.txt', date("Y-m-d H:i:s") ." : " . $header.":".$value."\r\n", FILE_APPEND);
        }*/

        //On détermine si le token existe
        if (!array_key_exists("authorization", $headers) &&  !array_key_exists("Authorization", $headers)) {
            // Erreur token non conforme
            //file_put_contents('log.txt', date("Y-m-d H:i:s") ." : " . "pb auth" ."\r\n", FILE_APPEND);
            return array('erreur' => 'Token non présent', 'connexion' => 1);
        }
        
        //on se retrouve avec un Bearer mlqdmqsldmqsljdqsmjl, il ne faut récupérer que le token
        
        if (array_key_exists("authorization", $headers)) {
            $tab = explode(" ", $headers['authorization']);
        }
        
        if (array_key_exists("Authorization", $headers)) {
            $tab = explode(" ", $headers['Authorization']);
        }
        
        $token = $tab[1];
        
        $list = $controller->get('lexik_jwt_authentication.encoder')
                           ->decode($token);

        if ($list===false) {
            // Erreur decodage du token
            // Le token peut être expiré
            //file_put_contents('log.txt', date("Y-m-d H:i:s") ." : " . "pb to" ."\r\n", FILE_APPEND);
            return array('erreur'=>'Token non valide ou expire', 'connexion'=>1);
        }
        if (!array_key_exists("id", $list) && !array_key_exists("idAgence", $list)) {
            // Erreur token non conforme
            //file_put_contents('log.txt', date("Y-m-d H:i:s") ." : " . "pb tok" ."\r\n", FILE_APPEND);
            return array('erreur' => 'Token: liste des variables non conformes', 'connexion' => 1);
        }
        $id = $list['id'];
        $idAgence = $list['idAgence'];
        
        //file_put_contents('log.txt', date("Y-m-d H:i:s") ." : " . $id.":".$idAgence."\r\n", FILE_APPEND);
        return array('id'=>$id, 'idAgence'=>$idAgence);
    }

    private function ajouterDerniereConnexion($userID)
    {
        $sql='UPDATE users SET
        derniereConnexion = Now()
        where id = ' . $userID;

        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();
    }
}
?>