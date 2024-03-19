import Image from "next/image";

import koop from "./assets/koop.png";
import store from "./assets/stores.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-sky-500">
      <Image src={koop} alt="koop" />
      <div className="text-3xl text-white">Bienvenue chez KOOP</div>
      <div>
        Connectez-vous avec style : La nouvelle façon tendance de mettre en
        relation les fournisseurs de produits et services avec leurs clients.
      </div>
      <div>
        <Image src={store} width={180} height={120} alt="Google Play" />
      </div>
    </main>
  );
}
