"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import message from "@/data/messages.json";

export default function Home() {
  return (
    <>
      <main className="flex flex-col flex-grow justify-between items-center px-4 md:px-24 py-12">
        <section className="text-center md-8 md:mb-12">
          <h1 className="text-6xl md:text-5xl font-bold">Unravel Mysteries</h1>
          <p className="mt-2 text-xl font-normal">
            Discover hidden messages and unravel mysteries with our platform.
          </p>
        </section>
        <div>
          <Carousel className="w-full" plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent>
              {message.map(({ title, content, received }, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="rounded-3xl">
                      <CardHeader className="font-semibold text-xl">
                        {title}
                      </CardHeader>
                      <CardContent className="flex  items-center justify-center p-6">
                        <span className="text-lg font-medium">{content}</span>
                      </CardContent>
                      <CardFooter>{received}</CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <footer className="text-center py-4">
          <p className="text-gray-600">
            © 2023-24 Mystery Messages. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
