import React from "react";
import { Link} from 'react-router-dom'

export default function Home() {
  const products = [
    {
      id: 1,
      name: "Bolo de Chocolate",
      price: "R$ 29,90",
      image: "https://static.itdg.com.br/images/360-240/61c127a88eec66645f333602f87c8043/292644-original.jpg"
    },
    {
      id: 2,
      name: "Cupcake de Morango",
      price: "R$ 9,50",
      image: "https://s2-g1.glbimg.com/wsJ8upH9cOGqf2hDpjpFxnpoN9w=/0x0:1182x816/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/4/b/YZBBd0TGGBAcFb4lSpqA/img-20190804-wa0001.jpg"
    },
    {
      id: 3,
      name: "Cookies Artesanais",
      price: "R$ 12,90",
      image: "https://cdn.awsli.com.br/600x1000/1339/1339101/produto/87323142/f1eb893faa.jpg"
    },
    {
      id: 4,
      name: "Torta de Limão",
      price: "R$ 24,90",
      image: "https://recipesblob.oetker.com.br/assets/d044a4ef3cfe45998593f500c00942ef/964x526/torta-de-limo.webp"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        Produtos em Destaque 🍰
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-32 h-32 object-cover rounded-md mb-4"
            />

            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-600">{p.price}</p>
            <Link to="/products" className="mt-4 px-3 py-1 bg-pink-500 text-white text-sm rounded hover:bg-pink-600">Ver Mais</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
