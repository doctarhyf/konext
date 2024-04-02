import Image from "next/image";

import koop from "../assets/koop.png";
import store from "../assets/stores.png";

export default function Home() {
  const data = [
    {
      title: `Des Trouvailles Uniques :`,
      cont: `Sur KOOP, découvre des trésors rares et uniques que tu ne trouveras nulle part ailleurs! De l&apos;objet vintage au produit de luxe, notre app te connecte avec des vendeurs de confiance.`,
    },
    {
      title: `Connexion Vendeurs-Acheteurs :`,
      cont: `Grâce à KOOP, fais partie d&apos;une communauté où vendeurs et acheteurs se rencontrent. Que tu sois à la recherche de quelque chose de spécial ou que tu veuilles vendre ton propre trésor, KOOP est là pour toi.`,
    },
    {
      title: `Transfert d&apos;Argent Facile :`,
      cont: `Avec KOOP, envoyer de l&apos;argent est aussi simple qu&apos;un clic. Transfère de l&apos;argent directement depuis ta carte SIM mobile en toute sécurité. Achète et vends en toute confiance, sans tracas.`,
    },
    {
      title: `Suivi GPS pour Véhicules :`,
      cont: `Toujours savoir où se trouve ton bolide? KOOP t&apos;offre le suivi GPS pour tes véhicules. Que ce soit pour des livraisons ou simplement pour garder un œil sur tes biens, KOOP te facilite la vie.`,
    },
    {
      title: `Partage de Liens et Gains :`,
      cont: `Sur KOOP, le partage peut rapporter gros! Partage des liens avec tes amis et ta famille et gagne des récompenses. Plus tu partages, plus tu gagnes. C&apos;est simple, non?`,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col justify-between p-4 bg-sky-500">
      <Image src={koop} alt="koop" width={30} height={30} />
      <div className="text-3xl text-white">Bienvenue chez KOOP</div>
      <h1>Conditions Générales de KOOP</h1>
      <p>Bonjour KOOPer,</p>
      <p className="mb-4">
        Bienvenue sur KOOP, l'application qui te met en lien avec des trésors
        cachés et des opportunités de folie! Avant de plonger dans l'aventure,
        prends une minute pour lire nos Conditions Générales d'Utilisation (les
        CGU"). Elles s'assurent une expérience sûre et amusante sur notre app.
      </p>

      {data.map((dt, i) => (
        <>
          <h2>
            {i + 1}. {dt.title}
          </h2>

          <p className=" mb-4 ">{dt.cont}</p>
        </>
      ))}

      <p>
        En utilisant KOOP, tu acceptes nos CGU. Nous te rappelons qu'il est
        strictement interdit de publier tout contenu pornographique ou illégal
        sur notre plateforme. Nous nous réservons le droit de supprimer tout
        contenu en violation de cette règle et de prendre des mesures
        appropriées, y compris la résiliation de ton compte.
      </p>
      <p>Alors, prêt à découvrir le monde de KOOP? Let's KOOP it up!</p>
      <p className=" text-sm  italic ">
        Remarque : Ces CGU sont là pour assurer une expérience incroyable pour
        tous les KOOPers. En cas de questions, n'hésite pas à nous contacter.
        Amuse-toi bien!
      </p>

      <div>
        <Image src={store} width={180} height={120} alt="Google Play" />
      </div>
    </main>
  );
}
