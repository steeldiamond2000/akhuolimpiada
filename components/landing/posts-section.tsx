import Image from "next/image"

// Sample eco posts data
const ecoPosts = [
  {
    id: 1,
    title: "Al-Khwarizmi Universitetida ekologik tadbirlar",
    description: "Universitetimiz talabalari tomonidan amalga oshirilayotgan ekologik tadbirlar haqida",
    image: "/universitet.jpg",
    category: "Ekologik tadbirlar",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Daraxt ekish aksiyasi",
    description: "Talabalar bilan birgalikda universitet hududida daraxt ekish aksiyasi o'tkazildi",
    image: "/universitet.jpg",
    category: "Aksiya",
    date: "2024-01-10"
  },
  {
    id: 3,
    title: "Ekologik seminar",
    description: "Atrof-muhitni muhofaza qilish bo'yicha seminar tashkil etildi",
    image: "/universitet.jpg",
    category: "Seminar",
    date: "2024-01-05"
  }
]

export function PostsSection() {
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-[#e8f4fc] to-white">
      <div className="container mx-auto px-4">
        {ecoPosts.map((post) => (
          <div 
            key={post.id} 
            className="mb-8 last:mb-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Content */}
              <div className="order-2 lg:order-1">
                <div className="border-l-4 border-[#0077C8] pl-4 sm:pl-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0077C8] leading-tight mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {post.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    ({post.category})
                  </p>
                </div>
              </div>
              
              {/* Image */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md lg:max-w-lg">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg border-4 border-white">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Decorative shadow */}
                  <div className="absolute -bottom-3 -right-3 w-full h-full bg-[#0077C8]/10 rounded-lg -z-10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
