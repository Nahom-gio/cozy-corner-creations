import heroImage from "@/assets/hero-living-room.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      <img
        src={heroImage}
        alt="Luxurious modern living room with terracotta sofa and warm lighting"
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight max-w-2xl">
          Curated for
          <br />
          <em className="italic font-normal">modern living</em>
        </h1>
        <p className="mt-4 font-body text-muted-foreground text-lg max-w-md">
          Timeless furniture crafted with intention. Each piece tells a story.
        </p>
        <a
          href="#products"
          className="inline-block mt-6 px-8 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
        >
          Shop Collection
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
