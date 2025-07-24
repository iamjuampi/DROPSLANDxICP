import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Banknote, Share2, Star, Users, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DonateForm from "@/components/donate-form"

// Import the artists data from the artist-profile component
const artists = [
  {
    id: "iamjuampi",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Tech-House",
    description: "DJ, producer, and founder of the record label Best Drops Ever.",
    supporters: 1850,
    blgReceived: 1850,
    featured: true,
    tokenName: "JUAMPI",
    tokenPrice: 0.45,
    posts: [
      {
        content:
          "Just released my new EP 'Techno Dimensions'. Available now on all platforms! #TechnoDimensions #NewRelease",
        time: "2 hours ago",
        likes: 87,
        comments: 14,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Preparing my set for this weekend at Club Underground. It's going to be an epic night of techno and house. Who's coming? 🎧",
        time: "1 day ago",
        likes: 65,
        comments: 23,
      },
      {
        content:
          "Happy to announce I'll be playing at the Electronic Dreams festival next month. See you there! #ElectronicDreams #Festival",
        time: "3 days ago",
        likes: 112,
        comments: 31,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Working on new sounds for my upcoming release. I'm experimenting with analog synthesizers and 90s samples.",
        time: "1 week ago",
        likes: 94,
        comments: 17,
      },
    ],
  },
  {
    id: "banger",
    name: "banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "DNB y Tech-House",
    description: "Productor de house con influencias de disco y funk. Conocido por sus ritmos enérgicos.",
    supporters: 2100,
    blgReceived: 2100,
    featured: true,
    tokenName: "BANGER",
    tokenPrice: 0.42,
    posts: [
      {
        content: "New track dropping next week! Can't wait to share this one with you all.",
        time: "1 day ago",
        likes: 45,
        comments: 8,
      },
    ],
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Tech-House",
    description: "Artista italiano de techno melódico con un estilo único y atmosférico.",
    supporters: 1750,
    blgReceived: 1750,
    featured: true,
    tokenName: "NICOLA",
    tokenPrice: 0.38,
    posts: [
      {
        content: "Working on new melodic techno tracks. The energy is incredible!",
        time: "3 days ago",
        likes: 67,
        comments: 12,
      },
    ],
  },
  {
    id: "axs",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Riddim",
    description: "Productor de techno industrial con influencias de EBM y post-punk.",
    supporters: 1680,
    blgReceived: 1680,
    featured: true,
    tokenName: "AXS",
    tokenPrice: 0.35,
    posts: [
      {
        content: "New riddim track in the works. This one is going to be heavy!",
        time: "2 days ago",
        likes: 89,
        comments: 15,
      },
    ],
  },
]

export default function CreatorPage({ params }: { params: { id: string } }) {
  // Find the artist by ID
  const creator = artists.find(artist => artist.id === params.id)

  // If artist not found, show an error message
  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artist not found</h1>
          <p className="text-muted-foreground mb-4">The artist you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-48 md:h-64 lg:h-80 w-full">
        <Image
          src={creator.coverImage || "/placeholder.svg?height=300&width=1200"}
          alt={`${creator.name}'s cover image`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <Button asChild variant="outline" size="sm" className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="container px-4 md:px-6">
        <div className="relative -mt-20 mb-6 flex flex-col items-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-3xl font-bold">{creator.name}</h1>
          <p className="text-muted-foreground">{creator.handle}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">{creator.genre}</Badge>
            {creator.featured && (
              <Badge variant="secondary">
                <Star className="mr-1 h-3 w-3" /> Featured Artist
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center">
              <Banknote className="mr-1 h-4 w-4 text-primary" />
              <span>{creator.blgReceived.toLocaleString()} $DROPS received</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{creator.supporters.toLocaleString()} supporters</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button size="lg" className="gap-2">
              <Banknote className="h-4 w-4" />
              Buy {creator.tokenName}
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 py-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{creator.description}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="posts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Recent Posts</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-4 space-y-4">
                {creator.posts.map((post, index) => (
                  <Card key={index}>
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={creator.avatar} alt={creator.name} />
                          <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{creator.name}</p>
                          <p className="text-sm text-muted-foreground">{post.time}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm mb-3">{post.content}</p>
                      {post.image && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <Image
                            src={post.image}
                            alt="Post image"
                            width={400}
                            height={200}
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="rewards" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Basic Support</CardTitle>
                        <div className="flex items-center text-primary font-bold">
                          <Banknote className="mr-1 h-4 w-4" />
                          5 $DROPS
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Access to exclusive posts</li>
                        <li>Early access to new tracks</li>
                      </ul>
                      <Button className="mt-4 w-full">Select</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Premium Support</CardTitle>
                        <div className="flex items-center text-primary font-bold">
                          <Banknote className="mr-1 h-4 w-4" />
                          20 $DROPS
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>All basic rewards</li>
                        <li>Exclusive track downloads</li>
                        <li>Name in credits</li>
                      </ul>
                      <Button className="mt-4 w-full">Select</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <DonateForm creatorId={creator.id} creatorName={creator.name} />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return [
    { id: 'iamjuampi' },
    { id: 'banger' },
    { id: 'nicolamarti' },
    { id: 'axs' },
  ];
}

